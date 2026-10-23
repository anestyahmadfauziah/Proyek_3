import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Trash2, Loader2 } from "lucide-react";

import { supabase } from "../lib/supabaseClient";

/* =========================================================
   KATEGORI FILTER
========================================================= */

const kategoriFilter = [
  "Semua",
  "Buah",
  "Bumbu",
  "Dairy",
  "Karbohidrat",
  "Protein",
  "Sayur",
];

/* =========================================================
   FALLBACK GAMBAR
========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";

/* =========================================================
   HELPER GAMBAR

   Gambar lokal ada di public/image/ingredients/
   URL browser: /image/ingredients/13-buncis.jpg
   Helper ini fleksibel terhadap format image_path di database.
========================================================= */

function getImageUrl(imagePath) {
  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  let path = String(imagePath).trim();

  if (!path) {
    return FALLBACK_IMAGE;
  }

  // Normalisasi slash
  path = path.replace(/\\/g, "/");

  // Sudah URL lengkap
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Hapus prefix ./
  path = path.replace(/^\.\/+/, "");

  // Hapus slash awal
  path = path.replace(/^\/+/, "");

  // Buang "public/" karena tidak ikut di URL browser
  if (path.startsWith("public/")) {
    path = path.substring("public/".length);
  }

  // KASUS 1: image/ingredients/13-buncis.jpg
  if (path.startsWith("image/ingredients/")) {
    return `/${path}`;
  }

  // KASUS 2: ingredients/13-buncis.jpg
  if (path.startsWith("ingredients/")) {
    return `/image/${path}`;
  }

  // KASUS 4: hanya nama file
  if (!path.includes("/")) {
    return `/image/ingredients/${path}`;
  }

  // KASUS 5: folder ingredients dengan format berbeda
  const ingredientsIndex = path.indexOf("ingredients/");

  if (ingredientsIndex !== -1) {
    const namaFile = path.substring(
      ingredientsIndex + "ingredients/".length
    );

    if (namaFile) {
      return `/image/ingredients/${namaFile}`;
    }
  }

  // KASUS 6: path public lainnya
  return `/${path}`;
}

/* =========================================================
   FORMAT TANGGAL
========================================================= */

function formatTanggal(tanggal) {
  if (!tanggal) {
    return "-";
  }

  const bagian = tanggal.split("-");

  if (bagian.length !== 3) {
    return tanggal;
  }

  const [tahun, bulan, hari] = bagian;

  return `${hari}/${bulan}/${tahun}`;
}

/* =========================================================
   STATUS STOK
========================================================= */

function tentukanStatus(tanggalKadaluarsa) {
  if (!tanggalKadaluarsa) {
    return {
      status: "Aman",
      type: "aman",
    };
  }

  const sekarang = new Date();

  const hariIni = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth(),
    sekarang.getDate()
  );

  const bagian = tanggalKadaluarsa.split("-");

  if (bagian.length !== 3) {
    return {
      status: "Aman",
      type: "aman",
    };
  }

  const [tahun, bulan, hari] = bagian;

  const tanggalExpired = new Date(
    Number(tahun),
    Number(bulan) - 1,
    Number(hari)
  );

  const selisihMs = tanggalExpired.getTime() - hariIni.getTime();

  const selisihHari = Math.ceil(selisihMs / (1000 * 60 * 60 * 24));

  // Sudah kedaluwarsa
  if (selisihHari < 0) {
    return {
      status: "Kedaluwarsa",
      type: "prioritas",
    };
  }

  // Kedaluwarsa maksimal 3 hari lagi
  if (selisihHari <= 3) {
    return {
      status: "Perlu diolah",
      type: "prioritas",
    };
  }

  // Masih aman
  return {
    status: "Aman",
    type: "aman",
  };
}

/* =========================================================
   FORMAT JUMLAH
========================================================= */

function formatJumlah(jumlah, satuan) {
  if (jumlah === null || jumlah === undefined) {
    return `0 ${satuan || ""}`.trim();
  }

  const angka = Number(jumlah);

  if (Number.isNaN(angka)) {
    return `${jumlah} ${satuan || ""}`.trim();
  }

  const jumlahTampil = Number.isInteger(angka)
    ? angka
    : angka.toLocaleString("id-ID", {
        maximumFractionDigits: 2,
      });

  return `${jumlahTampil} ${satuan || ""}`.trim();
}

/* =========================================================
   STOK
========================================================= */

function Stok() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("Semua");

  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [menghapusKedaluwarsa, setMenghapusKedaluwarsa] = useState(false);

  /* =======================================================
     AMBIL DATA STOK
  ======================================================= */

  useEffect(() => {
    const ambilStok = async () => {
      try {
        setLoading(true);
        setError("");

        /* ---------------- CEK USER ---------------- */

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setStock([]);
          setError("Silakan login terlebih dahulu.");
          return;
        }

        /* ---------------- AMBIL DATA STOK ---------------- */

        const { data: stokData, error: stokError } = await supabase
          .from("stok")
          .select(
            `
                id,
                user_id,
                bahan_pangan_id,
                jumlah,
                satuan,
                tanggal_masuk,
                tanggal_kadaluarsa,
                created_at
              `
          )
          .eq("user_id", user.id)
          .order("tanggal_kadaluarsa", {
            ascending: true,
            nullsFirst: false,
          });

        if (stokError) {
          console.error("Supabase GET STOK ERROR:", stokError);

          throw stokError;
        }

        /* ---------------- BELUM ADA STOK ---------------- */

        if (!stokData || stokData.length === 0) {
          setStock([]);
          return;
        }

        /* ---------------- AMBIL ID BAHAN ---------------- */

        const bahanIds = [
          ...new Set(
            stokData.map((item) => item.bahan_pangan_id).filter(Boolean)
          ),
        ];

        /* ---------------- AMBIL MASTER BAHAN ---------------- */

        let bahanData = [];

        if (bahanIds.length > 0) {
          const { data, error: bahanError } = await supabase
            .from("ingredients_master")
            .select(
              `
                  id,
                  name,
                  category_id,
                  image_path
                `
            )
            .in("id", bahanIds);

          if (bahanError) {
            console.error("Supabase GET INGREDIENTS ERROR:", bahanError);

            throw bahanError;
          }

          bahanData = data || [];
        }

        /* ---------------- LOG CEK IMAGE_PATH ---------------- */

        console.log(
          "IMAGE PATH DARI DATABASE:",
          bahanData.map((item) => ({
            id: item.id,
            name: item.name,
            image_path: item.image_path,
            image_url: getImageUrl(item.image_path),
          }))
        );

        /* ---------------- AMBIL KATEGORI ---------------- */

        const categoryIds = [
          ...new Set(bahanData.map((item) => item.category_id).filter(Boolean)),
        ];

        let kategoriData = [];

        if (categoryIds.length > 0) {
          const { data, error: kategoriError } = await supabase
            .from("ingredient_categories")
            .select(
              `
                  id,
                  name
                `
            )
            .in("id", categoryIds);

          if (kategoriError) {
            console.error("Supabase GET CATEGORY ERROR:", kategoriError);

            throw kategoriError;
          }

          kategoriData = data || [];
        }

        /* ---------------- MAP BAHAN ---------------- */

        const bahanMap = new Map();

        bahanData.forEach((bahan) => {
          bahanMap.set(bahan.id, bahan);
        });

        /* ---------------- MAP KATEGORI ---------------- */

        const kategoriMap = new Map();

        kategoriData.forEach((kategori) => {
          kategoriMap.set(kategori.id, kategori.name);
        });

        /* ---------------- GABUNGKAN DATA ---------------- */

        const dataStok = stokData.map((item) => {
          const bahan = bahanMap.get(item.bahan_pangan_id);

          const namaKategori = bahan?.category_id
            ? kategoriMap.get(bahan.category_id)
            : null;

          const statusInfo = tentukanStatus(item.tanggal_kadaluarsa);

          const imageUrl = getImageUrl(bahan?.image_path);

          return {
            id: item.id,

            nama: bahan?.name || `Bahan #${item.bahan_pangan_id}`,

            jumlah: formatJumlah(item.jumlah, item.satuan),

            kategori: namaKategori || "Lainnya",

            tanggal: formatTanggal(item.tanggal_kadaluarsa),

            tanggalBeli: formatTanggal(item.tanggal_masuk),

            harga: "",

            status: statusInfo.status,

            type: statusInfo.type,

            image: imageUrl,

            imagePath: bahan?.image_path || null,
          };
        });

        console.log("DATA STOK FINAL:", dataStok);

        setStock(dataStok);
      } catch (err) {
        console.error("Gagal mengambil data stok:", err);

        setError(err?.message || "Gagal mengambil data stok.");

        setStock([]);
      } finally {
        setLoading(false);
      }
    };

    ambilStok();
  }, []);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredStock = useMemo(() => {
    return stock.filter((item) => {
      const cocokSearch = item.nama
        .toLowerCase()
        .includes(search.toLowerCase());

      const cocokKategori =
        activeCategory === "Semua" || item.kategori === activeCategory;

      return cocokSearch && cocokKategori;
    });
  }, [stock, search, activeCategory]);

  /* =======================================================
     PRIORITAS
  ======================================================= */

  const prioritas = filteredStock.filter((item) => item.type === "prioritas");

  /* =======================================================
     AMAN
  ======================================================= */

  const aman = filteredStock.filter((item) => item.type === "aman");

  /* =======================================================
     DELETE
  ======================================================= */

  const hapusBahan = async (id) => {
    const bahan = stock.find((item) => item.id === id);

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus ${bahan?.nama || "bahan ini"}?`
    );

    if (!yakin) {
      return;
    }

    try {
      setError("");

      /* ---------------- CEK USER ---------------- */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError("Silakan login terlebih dahulu.");
        return;
      }

      /* ---------------- DELETE DATABASE ---------------- */

      const { error: deleteError } = await supabase
        .from("stok")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Supabase DELETE ERROR:", deleteError);

        throw deleteError;
      }

      /* ---------------- UPDATE UI ---------------- */

      setStock((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus stok:", err);

      setError(err?.message || "Gagal menghapus bahan.");
    }
  };

  /* =======================================================
     DELETE SEMUA YANG KEDALUWARSA
  ======================================================= */

  const kedaluwarsaIds = stock
    .filter((item) => item.status === "Kedaluwarsa")
    .map((item) => item.id);

  const hapusSemuaKedaluwarsa = async () => {
    if (kedaluwarsaIds.length === 0 || menghapusKedaluwarsa) {
      return;
    }

    const yakin = window.confirm(
      `Hapus ${kedaluwarsaIds.length} bahan yang sudah kedaluwarsa? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!yakin) {
      return;
    }

    try {
      setMenghapusKedaluwarsa(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError("Silakan login terlebih dahulu.");
        return;
      }

      const { error: deleteError } = await supabase
        .from("stok")
        .delete()
        .in("id", kedaluwarsaIds)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Supabase DELETE KEDALUWARSA ERROR:", deleteError);

        throw deleteError;
      }

      setStock((prev) => prev.filter((item) => item.status !== "Kedaluwarsa"));
    } catch (err) {
      console.error("Gagal menghapus bahan kedaluwarsa:", err);

      setError(err?.message || "Gagal menghapus bahan kedaluwarsa.");
    } finally {
      setMenghapusKedaluwarsa(false);
    }
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#e6f4e8] via-[#f3f9f3] to-[#f8fbf8] font-jakarta text-[#202833]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 shadow-[0_4px_20px_rgba(35,101,45,0.06)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-5 lg:px-7">
          <div className="flex min-h-[64px] items-center gap-3 sm:min-h-[68px]">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e1ece3] bg-white text-[#23652d] shadow-sm transition hover:-translate-x-0.5 hover:bg-[#f1f8f2] hover:shadow-md active:scale-95"
              aria-label="Kembali"
            >
              <ArrowLeft size={20} strokeWidth={2.2} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-extrabold tracking-tight text-[#1c3a22] sm:text-lg">
                Stok Bahan
              </h1>
              <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                {loading ? "Memuat..." : `${stock.length} bahan tersimpan`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-5 sm:px-5 sm:pt-6 lg:px-7">
        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c7a35]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari bahan..."
            className="h-12 w-full rounded-2xl border border-[#dbe8dd] bg-white pl-11 pr-4 text-sm font-medium text-[#202833] shadow-[0_4px_14px_rgba(35,101,45,0.06)] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#2c7a35] focus:shadow-[0_6px_20px_rgba(35,101,45,0.12)] focus:ring-4 focus:ring-[#2c7a35]/10 sm:h-[52px]"
          />
        </div>

        {/* ===================================================
            CATEGORY FILTER
        =================================================== */}

        <div className="mt-4 flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {kategoriFilter.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveCategory(item)}
              className={`
                  shrink-0
                  rounded-full
                  border
                  px-4
                  py-2
                  text-[11px]
                  font-bold
                  transition
                  active:scale-95
                  sm:text-xs
                  ${
                    activeCategory === item
                      ? "border-transparent bg-gradient-to-r from-[#23652d] to-[#35934a] text-white shadow-[0_6px_14px_rgba(35,101,45,0.3)]"
                      : "border-[#dbe8dd] bg-white text-slate-600 hover:border-[#b9d6be] hover:bg-[#f1f8f2] hover:text-[#23652d]"
                  }
                `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 shadow-sm sm:text-sm">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* ===================================================
            CONTENT
        =================================================== */}

        {loading ? (
          <div className="mt-6 flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-3xl border border-white bg-white/70 text-sm font-medium text-slate-500 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f3e5]">
              <Loader2 size={26} className="animate-spin text-[#23652d]" />
            </div>

            <span>Memuat stok kamu...</span>
          </div>
        ) : (
          <>
            {/* ===============================================
                PRIORITAS
            =============================================== */}

            <section className="mt-6">
              <SectionTitle
                title="Prioritas Olah (Mendekati Expired)"
                count={prioritas.length}
                tone="warn"
              />

              {kedaluwarsaIds.length > 0 && (
                <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-red-100 bg-gradient-to-r from-[#fff5f5] to-[#fff9f0] p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                      <Trash2 size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-extrabold tracking-tight text-[#7a1f1f]">
                        {kedaluwarsaIds.length} bahan sudah kedaluwarsa
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-red-400 sm:text-xs">
                        Bersihkan sekaligus agar stokmu tetap rapi.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={hapusSemuaKedaluwarsa}
                    disabled={menghapusKedaluwarsa}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e5484d] to-[#f06a5a] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-900/20 transition hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  >
                    {menghapusKedaluwarsa ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    {menghapusKedaluwarsa
                      ? "Menghapus..."
                      : "Hapus semua yang kedaluwarsa"}
                  </button>
                </div>
              )}

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {prioritas.length > 0 ? (
                  prioritas.map((item) => (
                    <StockCard
                      key={item.id}
                      item={item}
                      onDelete={hapusBahan}
                    />
                  ))
                ) : (
                  <div className="md:col-span-2">
                    <EmptyState text="Tidak ada bahan yang perlu segera diolah." />
                  </div>
                )}
              </div>
            </section>

            {/* ===============================================
                AMAN
            =============================================== */}

            <section className="mt-8">
              <SectionTitle
                title="Bahan Aman & Segar"
                count={aman.length}
                tone="ok"
              />

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {aman.length > 0 ? (
                  aman.map((item) => (
                    <StockCard
                      key={item.id}
                      item={item}
                      onDelete={hapusBahan}
                    />
                  ))
                ) : (
                  <div className="md:col-span-2">
                    <EmptyState text="Belum ada bahan yang aman." />
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ title, count, tone = "ok" }) {
  const isWarn = tone === "warn";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`h-6 w-1.5 shrink-0 rounded-full ${
            isWarn
              ? "bg-gradient-to-b from-[#f5a524] to-[#e5484d]"
              : "bg-gradient-to-b from-[#35934a] to-[#23652d]"
          }`}
        />

        <h2 className="truncate text-sm font-extrabold tracking-tight text-[#1c3a22] sm:text-base">
          {title}
        </h2>
      </div>

      <span
        className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-extrabold ${
          isWarn
            ? "bg-[#fff1d6] text-[#a46a00]"
            : "bg-[#dff2e1] text-[#23652d]"
        }`}
      >
        {count}
      </span>
    </div>
  );
}

/* =========================================================
   STOCK CARD
========================================================= */

function StockCard({ item, onDelete }) {
  const isExpired = item.status === "Kedaluwarsa";

  const isNeedProcess = item.status === "Perlu diolah";

  const accent = isExpired
    ? "bg-[#e5484d]"
    : isNeedProcess
    ? "bg-[#f5a524]"
    : "bg-[#35934a]";

  return (
    <article className="group relative flex min-h-[100px] w-full min-w-0 items-center gap-3.5 overflow-hidden rounded-3xl border border-[#e4eee6] bg-white p-3.5 pl-5 shadow-[0_4px_14px_rgba(32,40,51,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#cfe3d2] hover:shadow-[0_12px_28px_rgba(35,101,45,0.13)] sm:min-h-[108px] sm:p-4 sm:pl-5">
      {/* AKSEN STATUS */}

      <span
        className={`absolute inset-y-0 left-0 w-1.5 ${accent}`}
        aria-hidden="true"
      />

      {/* =================================================
          GAMBAR
      ================================================= */}

      <div className="relative shrink-0">
        <img
          src={item.image}
          alt={item.nama}
          className="h-[68px] w-[68px] rounded-2xl object-cover shadow-md ring-2 ring-white transition duration-300 group-hover:scale-105 sm:h-[76px] sm:w-[76px]"
          onError={(e) => {
            console.error(
              "Gambar gagal dimuat:",
              item.nama,
              item.imagePath,
              item.image
            );

            /*
             * Kalau gambar gagal, gunakan fallback.
             */
            e.currentTarget.onerror = null;

            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* =================================================
          INFO
      ================================================= */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-extrabold tracking-tight text-[#1c2a21] sm:text-base">
            {item.nama}
          </h3>
        </div>

        <p className="mt-1 truncate text-[11px] font-medium text-slate-500 sm:text-xs">
          <span className="font-bold text-[#23652d]">{item.jumlah}</span>

          <span className="mx-1.5 text-slate-300">•</span>

          <span>Exp {item.tanggal}</span>
        </p>

        <span
          className={`
            mt-2
            inline-flex
            items-center
            gap-1.5
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-bold
            ${
              isExpired
                ? "bg-[#fff0f0] text-[#c43b3b]"
                : isNeedProcess
                ? "bg-[#fff7df] text-[#a46a00]"
                : "bg-[#edf8ef] text-[#27733a]"
            }
          `}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isExpired
                ? "bg-[#e5484d]"
                : isNeedProcess
                ? "bg-[#f5a524]"
                : "bg-[#35934a]"
            }`}
          />
          {item.status}
        </span>
      </div>

      {/* =================================================
          DELETE
      ================================================= */}

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90"
        aria-label={`Hapus ${item.nama}`}
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#cfe3d2] bg-white/70 p-7 text-center text-xs font-medium text-slate-500 sm:text-sm">
      {text}
    </div>
  );
}

export default Stok;
