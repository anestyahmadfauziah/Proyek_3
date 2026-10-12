import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PROJECT_ROOT = process.cwd();
const ENV_PATH = path.join(PROJECT_ROOT, ".env.local");
const IMAGE_DIRECTORY = path.join(
  PROJECT_ROOT,
  "public",
  "image",
  "ingredients"
);
const MIN_DIMENSION = 300;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php";
const OPENVERSE_API = "https://api.openverse.org/v1/images";
const SUPPORTED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const ACCEPTED_OPENVERSE_LICENSES = new Set(["cc0", "by", "by-sa", "pdm"]);
const REQUEST_HEADERS = {
  "User-Agent": "PanganBijakIngredientImageDownloader/1.0 (local development)",
  Accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
};

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        return [key, value];
      })
  );
}

function getSupabaseDomain(supabaseUrl) {
  try {
    return new URL(supabaseUrl).host;
  } catch {
    return "<invalid URL>";
  }
}

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function getPngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString("hex", 0, 8) !== "89504e470d0a1a0a") {
    return null;
  }

  return {
    type: "png",
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function getJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      continue;
    }

    const length = buffer.readUInt16BE(offset);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame && offset + 7 < buffer.length) {
      return {
        type: "jpg",
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }

    if (length < 2) return null;
    offset += length;
  }

  return null;
}

function getWebpDimensions(buffer) {
  if (
    buffer.length < 30 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return null;
  }

  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      type: "webp",
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunk === "VP8 ") {
    if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) {
      return null;
    }
    return {
      type: "webp",
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === "VP8L") {
    if (buffer[20] !== 0x2f) return null;
    const bits = buffer.readUInt32LE(21);
    return {
      type: "webp",
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

function getImageMetadata(buffer) {
  return getPngDimensions(buffer) || getJpegDimensions(buffer) || getWebpDimensions(buffer);
}

async function isValidImage(filePath) {
  try {
    const fileStats = await stat(filePath);
    if (fileStats.size <= 0) return false;

    const file = await readFile(filePath);
    const metadata = getImageMetadata(file);
    return Boolean(
      metadata &&
        metadata.width >= MIN_DIMENSION &&
        metadata.height >= MIN_DIMENSION
    );
  } catch {
    return false;
  }
}

function extensionFromMime(mime) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

function getTargetFile(ingredient) {
  const existingPath = ingredient.image_path?.trim();
  if (existingPath) {
    const file = path.basename(existingPath.replaceAll("\\", "/"));
    const extension = file.split(".").pop()?.toLowerCase();
    if (file && SUPPORTED_EXTENSIONS.has(extension)) {
      return file;
    }
  }

  const safeName = slugify(ingredient.name);
  if (!safeName) return null;
  return `${ingredient.id}-${safeName}.jpg`;
}

function buildCandidate(result) {
  const extension = extensionFromMime(result.mime_type || result.mime);
  return {
    title: result.title || "",
    url: result.url,
    extension,
    width: result.width || 0,
    height: result.height || 0,
    license: result.license,
  };
}

function rankCandidates(candidates, name, preferredExtension) {
  const normalizedName = name.toLocaleLowerCase("id-ID");
  return candidates
    .filter(
      (candidate) =>
        candidate.url &&
        candidate.extension === preferredExtension &&
        candidate.width >= MIN_DIMENSION &&
        candidate.height >= MIN_DIMENSION
    )
    .sort((first, second) => {
      const firstExact = first.title.toLocaleLowerCase("id-ID").includes(normalizedName);
      const secondExact = second.title.toLocaleLowerCase("id-ID").includes(normalizedName);
      return Number(secondExact) - Number(firstExact);
    });
}

async function searchWikimedia(name, preferredExtension) {
  const parameters = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "20",
    gsrsearch: `${name} food ingredient filetype:bitmap`,
    prop: "imageinfo",
    iiprop: "url|mime|size",
  });
  const response = await fetch(`${WIKIMEDIA_API}?${parameters}`, { headers: REQUEST_HEADERS });
  if (!response.ok) throw new Error(`Wikimedia search returned HTTP ${response.status}`);

  const payload = await response.json();
  const candidates = Object.values(payload.query?.pages || {}).map((page) =>
    buildCandidate({
      title: page.title,
      ...page.imageinfo?.[0],
    })
  );

  return rankCandidates(candidates, name, preferredExtension)[0] || null;
}

async function searchOpenverse(name, preferredExtension) {
  const parameters = new URLSearchParams({
    q: name,
    page_size: "20",
    license_type: "commercial",
  });
  const response = await fetch(`${OPENVERSE_API}?${parameters}`, { headers: REQUEST_HEADERS });
  if (!response.ok) throw new Error(`Openverse search returned HTTP ${response.status}`);

  const payload = await response.json();
  const candidates = (payload.results || [])
    .filter((result) => ACCEPTED_OPENVERSE_LICENSES.has(result.license))
    .map(buildCandidate);

  return rankCandidates(candidates, name, preferredExtension)[0] || null;
}

async function findImageCandidate(name, preferredExtension) {
  try {
    const candidate = await searchWikimedia(name, preferredExtension);
    if (candidate) return candidate;
  } catch (error) {
    console.warn(`Wikimedia lookup failed for ${name}: ${error.message}`);
  }

  try {
    return await searchOpenverse(name, preferredExtension);
  } catch (error) {
    console.warn(`Openverse lookup failed for ${name}: ${error.message}`);
    return null;
  }
}

async function downloadImage(candidate, targetPath) {
  const response = await fetch(candidate.url, { headers: REQUEST_HEADERS });
  if (!response.ok) throw new Error(`Image download returned HTTP ${response.status}`);

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_FILE_SIZE) throw new Error("Image exceeds 15 MB limit");

  const file = Buffer.from(await response.arrayBuffer());
  if (!file.length || file.length > MAX_FILE_SIZE) {
    throw new Error("Downloaded image is empty or exceeds 15 MB limit");
  }

  const metadata = getImageMetadata(file);
  if (!metadata || metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
    throw new Error("Downloaded file is not a valid image at least 300x300 px");
  }

  const temporaryPath = `${targetPath}.download`;
  await writeFile(temporaryPath, file);
  await rename(temporaryPath, targetPath);
}

async function responseError(response, operation) {
  const body = await response.text();
  let details = body;

  try {
    const payload = JSON.parse(body);
    details = [
      payload.message && `message=${payload.message}`,
      payload.details && `details=${payload.details}`,
      payload.hint && `hint=${payload.hint}`,
      payload.code && `code=${payload.code}`,
    ]
      .filter(Boolean)
      .join("; ");
  } catch {
    // Keep the original response body when it is not JSON.
  }

  return new Error(`${operation} failed: HTTP ${response.status}${details ? `; ${details}` : ""}`);
}

function supabaseHeaders(serviceRoleKey, extraHeaders = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extraHeaders,
  };
}

async function updateImagePath(supabaseUrl, serviceRoleKey, id, imagePath) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/ingredients_master?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: supabaseHeaders(serviceRoleKey, {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      }),
      body: JSON.stringify({ image_path: imagePath }),
    }
  );

  if (!response.ok) throw await responseError(response, "Supabase image_path update");
}

async function getIngredients(supabaseUrl, serviceRoleKey) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/ingredients_master?select=id,name,image_path&order=id.asc`,
    { headers: supabaseHeaders(serviceRoleKey) }
  );

  if (!response.ok) throw await responseError(response, "Supabase ingredients_master query");
  return response.json();
}

function printReport(results) {
  console.log("\n| ID | Nama Bahan | File | image_path | Status |");
  console.log("|---:|---|---|---|---|");
  for (const result of results) {
    console.log(`| ${result.id} | ${result.name} | ${result.file || "-"} | ${result.imagePath || "-"} | ${result.status} |`);
  }
}

async function main() {
  const fileEnv = parseEnv(await readFile(ENV_PATH, "utf8"));
  const supabaseUrl = process.env.VITE_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;

  console.log(`Supabase URL: ${getSupabaseDomain(supabaseUrl)}`);
  console.log(`Using service role key: ${serviceRoleKey ? "YES" : "NO"}`);
  console.log("Query table: public.ingredients_master");

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is missing from .env.local");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing. Add it only to local .env.local or provide it as a local environment variable, then rerun this script. The publishable key is intentionally not used because ingredients_master SELECT requires the authenticated role."
    );
  }

  await mkdir(IMAGE_DIRECTORY, { recursive: true });
  const ingredients = await getIngredients(supabaseUrl, serviceRoleKey);

  if (!ingredients.length) {
    console.log("Query succeeded, but public.ingredients_master returned 0 rows.");
    return;
  }

  console.log(`Found ${ingredients.length} ingredient(s).`);
  const results = [];

  for (const ingredient of ingredients) {
    const file = getTargetFile(ingredient);
    if (!file) {
      results.push({
        id: ingredient.id,
        name: ingredient.name,
        file: "",
        imagePath: ingredient.image_path || "",
        status: "FAILED - nama bahan tidak dapat dijadikan nama file",
      });
      continue;
    }

    const targetPath = path.join(IMAGE_DIRECTORY, file);
    const imagePath = ingredient.image_path?.trim() || `ingredients/${file}`;

    if (await isValidImage(targetPath)) {
      results.push({
        id: ingredient.id,
        name: ingredient.name,
        file,
        imagePath,
        status: "OK - file yang sudah ada valid",
      });
      console.log(`[${ingredient.id}] ${ingredient.name}: existing file is valid.`);
      continue;
    }

    try {
      const extension = file.split(".").pop().toLowerCase();
      console.log(`[${ingredient.id}] Searching Wikimedia Commons/Openverse: ${ingredient.name}`);
      const candidate = await findImageCandidate(ingredient.name, extension);
      if (!candidate) {
        results.push({
          id: ingredient.id,
          name: ingredient.name,
          file,
          imagePath,
          status: "FAILED - gambar belum ditemukan",
        });
        console.log(`[${ingredient.id}] No suitable image found.`);
        continue;
      }

      await rm(targetPath, { force: true });
      await downloadImage(candidate, targetPath);

      if (!(await isValidImage(targetPath))) {
        throw new Error("Verification failed after download");
      }

      if (!ingredient.image_path?.trim()) {
        await updateImagePath(supabaseUrl, serviceRoleKey, ingredient.id, imagePath);
      }

      results.push({
        id: ingredient.id,
        name: ingredient.name,
        file,
        imagePath,
        status: "OK",
      });
      console.log(`[${ingredient.id}] Saved ${file}.`);
    } catch (error) {
      results.push({
        id: ingredient.id,
        name: ingredient.name,
        file,
        imagePath,
        status: `FAILED - ${error.message}`,
      });
      console.error(`[${ingredient.id}] ${ingredient.name}: ${error.message}`);
    }
  }

  const successful = results.filter((result) => result.status.startsWith("OK")).length;
  const failed = results.length - successful;
  const missingFiles = [];

  for (const result of results.filter((item) => item.status.startsWith("OK"))) {
    const filePath = path.join(IMAGE_DIRECTORY, result.file);
    const fileStats = await stat(filePath).catch(() => null);
    if (!fileStats || fileStats.size <= 0) missingFiles.push(result);
  }

  printReport(results);
  console.log(`\nTotal bahan: ${ingredients.length}`);
  console.log(`Gambar berhasil: ${successful}`);
  console.log(`Gambar gagal: ${failed}`);
  console.log(`Verifikasi file fisik gagal: ${missingFiles.length}`);

  if (failed || missingFiles.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exitCode = 1;
});
