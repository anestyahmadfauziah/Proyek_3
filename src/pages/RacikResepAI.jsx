import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Utensils,
  Users,
  X,
  Lightbulb,
  Heart,
  Bookmark,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

const KATEGORI = [
  "Semua",
  "Protein",
  "Sayuran",
  "Buah",
  "Karbohidrat",
  "Lainnya",
];

const TARGET_RESEP = [
  {
    value: "ibu_hamil",
    label: "Ibu Hamil",
    description: "Menu dengan perhatian pada kebutuhan gizi selama kehamilan",
    icon: Heart,
  },
  {
    value: "ibu_menyusui",
    label: "Ibu Menyusui",
    description: "Menu bergizi untuk mendukung kebutuhan ibu menyusui",
    icon: Heart,
  },
  {
    value: "balita",
    label: "Balita",
    description: "Menu sesuai usia dan tahap perkembangan anak",
    icon: Users,
  },
  {
    value: "bebas",
    label: "Bebas",
    description: "Resep keluarga sesuai bahan yang tersedia",
    icon: ChefHat,
  },
];

const ICON_BAHAN = {
  telur: "🥚",
  ayam: "🍗",
  ikan: "🐟",
  tuna: "🐟",
  patin: "🐟",
  tempe: "🫘",
  tahu: "🧈",
  kangkung: "🥬",
  bayam: "🥬",
  wortel: "🥕",
  brokoli: "🥦",
  nasi: "🍚",
  beras: "🌾",
  kentang: "🥔",
  pisang: "🍌",
  apel: "🍎",
  susu: "🥛",
};

function getIconBahan(nama = "") {
  const namaKecil = String(nama).toLowerCase();
  const cocok = Object.keys(ICON_BAHAN).find((kata) =>
    namaKecil.includes(kata)
  );

  return cocok ? ICON_BAHAN[cocok] : "🥗";
}

function normalisasiKategori(kategori = "") {
  const value = String(kategori).toLowerCase();

  if (value.includes("protein") || value.includes("hewani")) {
    return "Protein";
  }

  if (value.includes("sayur")) return "Sayuran";
  if (value.includes("buah")) return "Buah";

  if (
    value.includes("karbo") ||
    value.includes("umbi") ||
    value.includes("serealia")
  ) {
    return "Karbohidrat";
  }

  return "Lainnya";
}

function formatAngka(value) {
  const number = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(Number.isFinite(number) ? number : 0);
}

// Ambil token dari sesi Supabase yang aktif.
async function getAccessToken() {
  let {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Gagal membaca sesi Supabase: ${error.message}`);
  }

  // Coba perbarui sesi jika access token tidak tersedia.
  if (!session?.access_token) {
    const {
      data: { session: refreshedSession },
      error: refreshError,
    } = await supabase.auth.refreshSession();

    if (refreshError) {
      throw new Error(
        `Sesi login tidak tersedia. Silakan login kembali. ${refreshError.message}`
      );
    }

    session = refreshedSession;
  }

  if (!session?.access_token) {
    throw new Error(
      "Kamu belum login. Silakan login menggunakan Google terlebih dahulu."
    );
  }

  return session.access_token;
}

// Semua permintaan ke endpoint Racik Resep melewati fungsi ini.
async function requestAPI(path, options = {}) {
  const token = await getAccessToken();

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Backend Golang tidak dapat dihubungi di ${API_URL}. Pastikan server berjalan dan VITE_API_URL benar.`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let result;

  try {
    result = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const serverMessage =
      typeof result === "object" && result !== null
        ? result.message || result.error || result.detail
        : result;

    if (response.status === 401) {
      throw new Error(
        `Backend menolak sesi login (401). ${
          serverMessage ||
          "Periksa token Supabase, SUPABASE_URL, dan SUPABASE_ANON_KEY pada backend."
        }`
      );
    }

    if (response.status === 403) {
      throw new Error(
        `Akses ditolak (403). ${serverMessage || "Periksa izin akses akun."}`
      );
    }

    throw new Error(
      serverMessage ||
        `Permintaan ke ${path} gagal dengan status ${response.status}.`
    );
  }

  return result;
}

export default function RacikResepAI() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [bahanData, setBahanData] = useState([]);
  const [bahanTerpilih, setBahanTerpilih] = useState([]);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [pencarian, setPencarian] = useState("");
  const [targetResep, setTargetResep] = useState("balita");
  const [jumlahPorsi, setJumlahPorsi] = useState(2);

  const [resepAI, setResepAI] = useState(null);
  const [langkahAktif, setLangkahAktif] = useState(0);
  const [langkahSelesai, setLangkahSelesai] = useState([]);

  const [memuatBahan, setMemuatBahan] = useState(true);
  const [sedangMeracik, setSedangMeracik] = useState(false);
  const [errorAI, setErrorAI] = useState("");

  // STATE SIMPAN RESEP
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [resepSudahDisimpan, setResepSudahDisimpan] = useState(false);
  const [pesanSimpan, setPesanSimpan] = useState("");
  const [errorSimpan, setErrorSimpan] = useState("");

  const [profilKeluarga, setProfilKeluarga] = useState({
    ibu: null,
    kehamilan: [],
    anak: [],
  });

  const [memuatProfilKeluarga, setMemuatProfilKeluarga] = useState(true);

  const [errorProfilKeluarga, setErrorProfilKeluarga] = useState("");

  const ambilProfilKeluarga = useCallback(async () => {
    setMemuatProfilKeluarga(true);
    setErrorProfilKeluarga("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Silakan login untuk mengambil profil keluarga.");
      }

      const { data: anak, error: anakError } = await supabase
        .from("children_profiles")
        .select("id, user_id, nama, jenis_kelamin, tanggal_lahir, hpht, hpl")
        .eq("user_id", user.id)
        .order("tanggal_lahir", { ascending: false });

      if (anakError) throw anakError;

      const daftarAnak = anak || [];

      // Baris dengan HPHT/HPL dapat digunakan sebagai petunjuk
      // bahwa data kehamilan pernah dicatat.
      const dataKehamilan = daftarAnak.filter((item) => item.hpht || item.hpl);

      setProfilKeluarga({
        ibu: {
          user_id: user.id,
        },
        kehamilan: dataKehamilan,
        anak: daftarAnak,
      });
    } catch (error) {
      console.error("Gagal mengambil profil keluarga:", error);

      setErrorProfilKeluarga(
        error.message || "Gagal mengambil profil ibu dan anak."
      );

      setProfilKeluarga({
        ibu: null,
        kehamilan: [],
        anak: [],
      });
    } finally {
      setMemuatProfilKeluarga(false);
    }
  }, []);

  const ambilBahan = useCallback(async () => {
    setMemuatBahan(true);
    setErrorAI("");

    try {
      const result = await requestAPI("/api/resep/bahan");

      const items = Array.isArray(result)
        ? result
        : Array.isArray(result?.items)
          ? result.items
          : [];

      const mapped = items
        .filter((item) => item && item.id != null)
        .map((item) => ({
          ...item,
          // Wajib menggunakan ID dari tabel stok.
          id: Number(item.id),
          nama: item.nama || "Bahan pangan",
          jumlah: item.jumlah ?? 0,
          satuan: item.satuan || "",
          kategori: normalisasiKategori(item.kategori),
          emoji: getIconBahan(item.nama),
        }))
        .filter((item) => Number.isFinite(item.id));

      setBahanData(mapped);

      setBahanTerpilih((previous) =>
        previous.filter((id) => mapped.some((item) => item.id === id))
      );
    } catch (error) {
      setBahanData([]);
      setErrorAI(error.message || "Gagal mengambil data stok bahan.");
    } finally {
      setMemuatBahan(false);
    }
  }, []);

  useEffect(() => {
    ambilBahan();
  }, [ambilBahan]);

  useEffect(() => {
    ambilProfilKeluarga();
  }, [ambilProfilKeluarga]);

  const bahanFiltered = useMemo(() => {
    return bahanData.filter((item) => {
      const cocokKategori =
        kategoriAktif === "Semua" || item.kategori === kategoriAktif;

      const cocokPencarian = item.nama
        .toLowerCase()
        .includes(pencarian.trim().toLowerCase());

      return cocokKategori && cocokPencarian;
    });
  }, [bahanData, kategoriAktif, pencarian]);

  const bahanTerpilihData = useMemo(
    () => bahanData.filter((item) => bahanTerpilih.includes(item.id)),
    [bahanData, bahanTerpilih]
  );

  function toggleBahan(id) {
    setErrorAI("");

    setBahanTerpilih((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  }

  function pilihSemuaBahan() {
    setErrorAI("");

    setBahanTerpilih((previous) => [
      ...new Set([...previous, ...bahanFiltered.map((item) => item.id)]),
    ]);
  }

  function hapusSemuaPilihan() {
    setBahanTerpilih([]);
    setErrorAI("");
  }

  async function handleBuatResep() {
    if (bahanTerpilih.length === 0) {
      setErrorAI("Pilih setidaknya satu bahan dari stok kulkas.");
      setStep(2);
      return;
    }

    setSedangMeracik(true);
    setErrorAI("");
    setResepAI(null);
    setStep(3);

    try {
      const result = await requestAPI("/api/resep/racik", {
        method: "POST",

        body: JSON.stringify({
          selected_stock_ids: bahanTerpilih,
          target: targetResep,
          servings: jumlahPorsi,

          // Konteks profil dari Supabase untuk backend AI.
          profil_keluarga: {
            ibu: profilKeluarga.ibu,
            kehamilan: profilKeluarga.kehamilan,
            anak: profilKeluarga.anak,
          },
        }),
      });

      const resep = result?.resep || result?.data || result;

      if (
        !resep?.nama_resep ||
        !Array.isArray(resep?.langkah) ||
        !Array.isArray(resep?.bahan)
      ) {
        throw new Error(
          "Format hasil resep belum sesuai. Periksa respons endpoint backend Golang."
        );
      }

      setResepAI(resep);
      setLangkahAktif(0);
      setLangkahSelesai([]);
      setStep(4);
    } catch (error) {
      setErrorAI(error.message || "Gagal membuat resep AI.");
      setStep(2);
    } finally {
      setSedangMeracik(false);
    }
  }

  async function handleSimpanResep() {
    if (!resepAI) {
      setErrorSimpan("Belum ada resep yang bisa disimpan.");
      return;
    }

    if (resepSudahDisimpan || sedangMenyimpan) {
      return;
    }

    setSedangMenyimpan(true);
    setErrorSimpan("");
    setPesanSimpan("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setErrorSimpan("Silakan login terlebih dahulu untuk menyimpan resep.");
        return;
      }

      // Seluruh informasi resep disimpan dalam satu objek.
      const dataResep = {
        nama_resep: resepAI.nama_resep,
        deskripsi:
          resepAI.deskripsi ||
          "Resep yang diracik berdasarkan bahan pilihanmu.",
        waktu_menit: Number(
          resepAI.waktu_menit ?? resepAI.waktu_memasak ?? 15
        ),
        porsi: Number(resepAI.porsi ?? jumlahPorsi),
        bahan: resepAI.bahan ?? [],
        langkah: resepAI.langkah ?? [],
        nutrisi: resepAI.nutrisi ?? {},
        tag: resepAI.tag ?? null,
        tips: resepAI.tips ?? null,
        target: targetResep,
      };

      // Kirim data_resep yang diwajibkan oleh database.
      const { error } = await supabase.from("resep_tersimpan").insert({
        user_id: user.id,
        data_resep: dataResep,
      });

      if (error) throw error;

      setResepSudahDisimpan(true);
      setPesanSimpan("Resep berhasil disimpan ke koleksimu!");
    } catch (error) {
      console.error("Gagal menyimpan resep:", error);

      setErrorSimpan(
        error?.message || "Gagal menyimpan resep. Silakan coba lagi."
      );
    } finally {
      setSedangMenyimpan(false);
    }
  }

  function mulaiMemasak() {
    setLangkahAktif(0);
    setLangkahSelesai([]);
    setStep(5);
  }

  function ulangiRacik() {
    setResepAI(null);
    setLangkahAktif(0);
    setLangkahSelesai([]);
    setErrorAI("");
    setStep(2);
    setResepSudahDisimpan(false);
    setPesanSimpan("");
    setErrorSimpan("");
  }

  function toggleLangkahSelesai(index) {
    setLangkahSelesai((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  }

  const totalLangkah = resepAI?.langkah?.length || 0;
  const persentaseMemasak =
    totalLangkah > 0
      ? Math.round((langkahSelesai.length / totalLangkah) * 100)
      : 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#e6f4e8] via-[#f3f9f3] to-[#f8fbf8] font-jakarta text-gray-800">
      {/* DEKORASI LATAR */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 shadow-[0_4px_20px_rgba(35,101,45,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
            className="flex items-center gap-2 rounded-2xl border border-green-100 bg-white px-3.5 py-2.5 text-sm font-bold text-green-800 shadow-sm transition hover:-translate-x-0.5 hover:bg-green-50 hover:shadow-md active:scale-95"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">
              {step === 1 ? "Kembali" : "Langkah sebelumnya"}
            </span>
          </button>

          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-md shadow-green-900/20">
              <ChefHat size={19} />
            </div>
            <span className="truncate text-sm font-extrabold tracking-tight text-green-950 sm:text-base">
              Racik Resep AI
            </span>
          </div>

          <div className="rounded-full bg-gradient-to-r from-green-700 to-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-md shadow-green-900/20">
            {step}/5
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {step !== 1 && step !== 3 && (
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4, 5].map((number) => (
              <div
                key={number}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  number <= step
                    ? "bg-gradient-to-r from-green-600 to-emerald-400"
                    : "bg-green-100"
                }`}
              />
            ))}
          </div>
        )}

        {errorAI && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <X size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold">Ada kendala</p>
              <p className="mt-1 break-words leading-6">{errorAI}</p>
              <button
                type="button"
                onClick={ambilBahan}
                disabled={memuatBahan}
                className="mt-2 font-bold underline disabled:opacity-50"
              >
                {memuatBahan ? "Memuat ulang..." : "Coba muat ulang stok"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setErrorAI("")}
              aria-label="Tutup pesan"
              className="rounded-lg p-1 transition hover:bg-red-100"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* =====================================================
            STEP 1 : HERO
        ===================================================== */}
        {step === 1 && (
          <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-bold text-green-800 shadow-sm">
                <Sparkles size={16} className="text-emerald-500" />
                Asisten masak pintar
              </div>

              <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
                Stok di kulkas,
                <span className="block bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
                  jadi resep lezat!
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
                Pilih bahan yang tersedia di stok kulkasmu. AI akan membantu
                meracik ide menu, bahan, informasi gizi, dan langkah memasak.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="min-w-[130px] rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-[0_6px_18px_rgba(35,101,45,0.07)]">
                  <p className="text-3xl font-extrabold text-green-800">
                    {memuatBahan ? "…" : bahanData.length}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-gray-500">
                    Bahan tersedia
                  </p>
                </div>
                <div className="min-w-[130px] rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-[0_6px_18px_rgba(35,101,45,0.07)]">
                  <p className="text-3xl font-extrabold text-green-800">
                    {bahanTerpilih.length}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-gray-500">
                    Bahan dipilih
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setErrorAI("");
                  setStep(2);
                }}
                className="group mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 px-7 py-4 font-extrabold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-900/25 active:scale-[0.98] sm:w-auto"
              >
                <Sparkles size={19} />
                Mulai Racik Resep
                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>

            <div className="relative rounded-[2rem] border border-white bg-white/90 p-6 shadow-[0_20px_50px_rgba(35,101,45,0.12)] sm:p-10">
              <div className="mb-6 flex h-28 items-center justify-center rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 text-7xl">
                🥗
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-green-950">
                Dari stok menjadi inspirasi
              </h3>
              <div className="mt-6 space-y-5">
                {[
                  ["Pilih bahan", "Gunakan bahan yang masih tersedia."],
                  ["Tentukan tujuan", "Sesuaikan menu dengan kebutuhan."],
                  ["Dapatkan resep", "Lihat ide resep dan langkah memasaknya."],
                ].map(([title, description], index) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 font-extrabold text-white shadow-md shadow-green-900/20">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-gray-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            STEP 2 : PILIH BAHAN
        ===================================================== */}
        {step === 2 && (
          <section>
            <div className="mb-7">
              <p className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-green-800">
                Langkah 1
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl">
                Pilih bahan dari kulkas
              </h2>
              <p className="mt-2 text-gray-600">
                Bahan diambil dari stok akunmu melalui backend Golang.
              </p>
            </div>

            <div className="mb-6 rounded-3xl border border-white bg-white/90 p-4 shadow-[0_8px_24px_rgba(35,101,45,0.08)] sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700"
                  />
                  <input
                    value={pencarian}
                    onChange={(event) => setPencarian(event.target.value)}
                    placeholder="Cari nama bahan..."
                    className="w-full rounded-2xl border border-green-100 bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={pilihSemuaBahan}
                  disabled={bahanFiltered.length === 0 || memuatBahan}
                  className="rounded-2xl border border-green-200 bg-green-50/60 px-4 py-3 text-sm font-bold text-green-800 transition hover:bg-green-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Pilih semua hasil
                </button>

                <button
                  type="button"
                  onClick={hapusSemuaPilihan}
                  disabled={bahanTerpilih.length === 0}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 disabled:opacity-40"
                >
                  Hapus pilihan
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {KATEGORI.map((kategori) => (
                  <button
                    key={kategori}
                    type="button"
                    onClick={() => setKategoriAktif(kategori)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                      kategoriAktif === kategori
                        ? "bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md shadow-green-900/20"
                        : "border border-green-100 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-800"
                    }`}
                  >
                    {kategori}
                  </button>
                ))}
              </div>
            </div>

            {memuatBahan ? (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl border border-white bg-white/80 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <LoaderCircle
                    className="animate-spin text-green-700"
                    size={28}
                  />
                </div>
                <p className="mt-3 font-bold">Mengambil stok bahan...</p>
                <p className="mt-1 text-sm text-gray-500">
                  Menghubungkan ke backend Golang
                </p>
              </div>
            ) : bahanData.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-300 bg-white/80 p-8 text-center">
                <div className="text-5xl">🧺</div>
                <h3 className="mt-4 text-lg font-extrabold">
                  Stok belum dapat ditampilkan
                </h3>
                <p className="mx-auto mt-2 max-w-md break-words text-sm leading-6 text-gray-500">
                  {errorAI ||
                    "Backend mengembalikan daftar stok kosong. Pastikan stok tersimpan untuk akun Google yang sedang login dan belum kedaluwarsa."}
                </p>
                <button
                  type="button"
                  onClick={ambilBahan}
                  disabled={memuatBahan}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <RefreshCw size={17} />
                  Muat ulang
                </button>
              </div>
            ) : bahanFiltered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-200 bg-white/80 p-8 text-center font-medium text-gray-500">
                Bahan tidak ditemukan. Coba kata kunci atau kategori lain.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bahanFiltered.map((item) => {
                  const selected = bahanTerpilih.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBahan(item.id)}
                      className={`group relative flex items-center gap-4 rounded-3xl border bg-white p-4 text-left transition duration-200 hover:-translate-y-1 ${
                        selected
                          ? "border-green-600 shadow-[0_10px_26px_rgba(35,101,45,0.18)] ring-4 ring-green-100"
                          : "border-[#e4eee6] shadow-[0_4px_14px_rgba(32,40,51,0.05)] hover:border-green-300 hover:shadow-[0_12px_28px_rgba(35,101,45,0.12)]"
                      }`}
                    >
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl transition group-hover:scale-110 ${
                          selected
                            ? "bg-gradient-to-br from-green-100 to-emerald-100"
                            : "bg-green-50"
                        }`}
                      >
                        {item.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-extrabold tracking-tight text-gray-900">
                          {item.nama}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Stok:{" "}
                          <span className="font-bold text-green-800">
                            {formatAngka(item.jumlah)} {item.satuan}
                          </span>
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-800">
                          {item.kategori}
                        </span>
                      </div>

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-900/20"
                            : "border-gray-200 text-transparent"
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-green-950">
                    {bahanTerpilih.length} bahan dipilih
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Pilih bahan dan tujuan resep sebelum mulai meracik.
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                  🧑‍🍳
                </div>
              </div>

              {bahanTerpilihData.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {bahanTerpilihData.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBahan(item.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-sm font-bold text-green-800 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                    >
                      {item.emoji} {item.nama}
                      <X size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)] sm:p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-green-950">
                  Tujuan resep
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih karakter menu yang ingin dibuat.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {TARGET_RESEP.map((target) => {
                    const Icon = target.icon;
                    const selected = targetResep === target.value;

                    return (
                      <button
                        key={target.value}
                        type="button"
                        onClick={() => setTargetResep(target.value)}
                        className={`rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 ${
                          selected
                            ? "border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md ring-4 ring-green-100"
                            : "border-[#e4eee6] bg-white hover:border-green-300 hover:shadow-sm"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-green-700 text-white shadow-md shadow-green-900/20"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <p className="mt-3 font-extrabold">{target.label}</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {target.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* PROFIL KELUARGA */}
                <div className="mt-4 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                      <Users size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-green-950">
                        Profil keluarga dari Si Kecil
                      </h4>

                      {memuatProfilKeluarga ? (
                        <p className="mt-1 text-sm text-gray-600">
                          Memuat data ibu dan anak...
                        </p>
                      ) : errorProfilKeluarga ? (
                        <div>
                          <p className="mt-1 break-words text-sm text-red-700">
                            {errorProfilKeluarga}
                          </p>
                          <button
                            type="button"
                            onClick={ambilProfilKeluarga}
                            className="mt-2 text-sm font-bold text-green-800 underline"
                          >
                            Muat ulang profil
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="mt-1 text-sm text-gray-600">
                            {profilKeluarga.anak.length > 0
                              ? `${profilKeluarga.anak.length} profil anak ditemukan.`
                              : "Belum ada profil anak yang tersimpan."}
                          </p>

                          {profilKeluarga.anak.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {profilKeluarga.anak.map((anak) => (
                                <div
                                  key={anak.id}
                                  className="rounded-xl border border-green-100 bg-white p-3 shadow-sm"
                                >
                                  <p className="font-bold text-gray-800">
                                    {anak.nama || "Nama belum diisi"}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    Tanggal lahir:{" "}
                                    {anak.tanggal_lahir || "Belum tersedia"}
                                  </p>

                                  {(anak.hpht || anak.hpl) && (
                                    <p className="mt-1 text-xs text-gray-500">
                                      {anak.hpht ? `HPHT: ${anak.hpht}` : ""}
                                      {anak.hpht && anak.hpl ? " • " : ""}
                                      {anak.hpl ? `HPL: ${anak.hpl}` : ""}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {targetResep === "balita" &&
                            profilKeluarga.anak.length === 0 && (
                              <p className="mt-2 text-xs font-medium text-amber-800">
                                Tambahkan profil anak melalui halaman Si Kecil
                                agar resep dapat disesuaikan dengan usianya.
                              </p>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)] sm:p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-green-950">
                  Jumlah porsi
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sesuaikan dengan jumlah orang yang akan makan.
                </p>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
                      <Users size={22} />
                    </div>
                    <div>
                      <p className="font-extrabold">Porsi makan</p>
                      <p className="text-xs text-gray-500">1–10 porsi</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setJumlahPorsi((n) => Math.max(1, n - 1))}
                      disabled={jumlahPorsi <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-200 bg-white text-green-800 shadow-sm transition hover:bg-green-100 active:scale-90 disabled:opacity-40"
                      aria-label="Kurangi porsi"
                    >
                      <Minus size={17} />
                    </button>
                    <span className="w-7 text-center text-2xl font-extrabold text-green-950">
                      {jumlahPorsi}
                    </span>
                    <button
                      type="button"
                      onClick={() => setJumlahPorsi((n) => Math.min(10, n + 1))}
                      disabled={jumlahPorsi >= 10}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-200 bg-white text-green-800 shadow-sm transition hover:bg-green-100 active:scale-90 disabled:opacity-40"
                      aria-label="Tambah porsi"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  Pastikan jumlah bahan mencukupi. Kebutuhan aktual dapat
                  berbeda tergantung usia, porsi makan, dan resep.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBuatResep}
                disabled={bahanTerpilih.length === 0 || memuatBahan}
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 px-7 py-4 font-extrabold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Sparkles size={18} />
                Racik Resep dengan AI
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            STEP 3 : LOADING
        ===================================================== */}
        {step === 3 && (
          <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-[0_0_0_12px_rgba(220,252,231,0.6)]">
              <ChefHat size={52} className="text-green-700" />
              <span className="absolute -right-1 -top-1 flex h-11 w-11 animate-pulse items-center justify-center rounded-full bg-white text-emerald-500 shadow-lg">
                <Sparkles size={22} />
              </span>
            </div>

            <div className="mt-8 flex items-center gap-2 text-green-700">
              <LoaderCircle size={20} className="animate-spin" />
              <span className="font-extrabold">AI sedang meracik resep</span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-green-950">
              Menyiapkan menu terbaik...
            </h2>
            <p className="mt-3 max-w-md leading-7 text-gray-500">
              AI sedang memproses bahan pilihanmu melalui backend. Waktu proses
              bergantung pada respons layanan AI.
            </p>

            <div className="mt-8 w-full max-w-sm space-y-3 text-left">
              {[
                "Membaca bahan yang dipilih",
                "Menyusun kombinasi resep",
                "Menyiapkan langkah memasak",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-3.5 text-sm font-medium text-gray-600 shadow-sm"
                >
                  <LoaderCircle
                    size={17}
                    className="animate-spin text-green-600"
                  />
                  {item}
                </div>
              ))}
            </div>

            {sedangMeracik && (
              <p className="mt-5 text-xs text-gray-400">
                Jangan tutup halaman selama permintaan diproses.
              </p>
            )}
          </section>
        )}

        {/* =====================================================
            STEP 4 : HASIL RESEP
        ===================================================== */}
        {step === 4 && resepAI && (
          <section>
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3.5 py-2 text-sm font-extrabold text-green-800">
                  <CheckCircle2 size={16} />
                  Resep berhasil dibuat
                </div>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl lg:text-5xl">
                  {resepAI.nama_resep}
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                  {resepAI.deskripsi ||
                    "Resep yang diracik berdasarkan bahan pilihanmu."}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={ulangiRacik}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white px-4 py-3 font-bold text-green-800 shadow-sm transition hover:bg-green-50 active:scale-95"
                >
                  <RefreshCw size={17} />
                  Racik lagi
                </button>

                <button
                  type="button"
                  onClick={handleSimpanResep}
                  disabled={sedangMenyimpan || resepSudahDisimpan}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                    resepSudahDisimpan
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-lg shadow-green-900/20 hover:-translate-y-0.5"
                  }`}
                >
                  {sedangMenyimpan ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : resepSudahDisimpan ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Bookmark size={17} />
                  )}

                  {sedangMenyimpan
                    ? "Menyimpan..."
                    : resepSudahDisimpan
                      ? "Resep Tersimpan"
                      : "Simpan Resep"}
                </button>
              </div>
            </div>

            {pesanSimpan && (
              <div
                role="status"
                className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm"
              >
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={18} />
                  {pesanSimpan}
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mt-2 font-bold underline"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            )}

            {errorSimpan && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
              >
                <p className="font-bold">Resep belum berhasil disimpan</p>
                <p className="mt-1 break-words">{errorSimpan}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCard
                icon={<Clock size={21} />}
                label="Waktu memasak"
                value={`${formatAngka(resepAI.waktu_menit)} menit`}
              />
              <InfoCard
                icon={<Users size={21} />}
                label="Jumlah porsi"
                value={`${formatAngka(resepAI.porsi ?? jumlahPorsi)} porsi`}
              />
              <InfoCard
                icon={<Flame size={21} />}
                label="Kalori total resep"
                value={`${formatAngka(resepAI.nutrisi?.kalori)} kkal`}
              />
            </div>

            {resepAI.tag && (
              <div className="mt-5 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-800">
                {resepAI.tag}
              </div>
            )}

            <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)] sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-md shadow-green-900/20">
                    <Utensils size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-green-950">
                      Bahan resep
                    </h3>
                    <p className="text-sm text-gray-500">
                      Bahan dan takaran yang disarankan AI
                    </p>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-green-50">
                  {(resepAI.bahan || []).map((bahan, index) => (
                    <div
                      key={`${bahan.nama}-${index}`}
                      className="flex items-start gap-3 py-3.5"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-extrabold text-green-800">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{bahan.nama}</p>
                        {bahan.dari_stok === true && (
                          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                            <Check size={11} strokeWidth={3} />
                            Tersedia di stok
                          </p>
                        )}
                      </div>
                      <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-right text-sm font-bold text-gray-600">
                        {bahan.jumlah}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)] sm:p-7">
                <h3 className="text-xl font-extrabold tracking-tight text-green-950">
                  Perkiraan informasi gizi
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Perkiraan untuk satu resep secara keseluruhan, bukan per
                  porsi. Nilai sebenarnya dapat berbeda dari bahan dan cara
                  pengolahan.
                </p>

                <div className="mt-5 space-y-4">
                  {[
                    ["Protein", resepAI.nutrisi?.protein, "g"],
                    ["Lemak", resepAI.nutrisi?.lemak, "g"],
                    ["Karbohidrat", resepAI.nutrisi?.karbohidrat, "g"],
                    ["Serat", resepAI.nutrisi?.serat, "g"],
                  ].map(([label, value, unit]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="font-semibold text-gray-700">
                          {label}
                        </span>
                        <span className="font-extrabold text-green-800">
                          {formatAngka(value)} {unit}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-green-50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-700"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, Number(value) || 0)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {resepAI.tips && (
                  <div className="mt-6 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
                    <div className="flex items-center gap-2 font-extrabold text-amber-900">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-amber-500 shadow-sm">
                        <Lightbulb size={17} />
                      </div>
                      Tips dari AI
                    </div>
                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      {resepAI.tips}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)] sm:p-7">
              <h3 className="text-xl font-extrabold tracking-tight text-green-950">
                Gambaran langkah memasak
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(resepAI.langkah || []).map((langkah, index) => (
                  <div
                    key={`${index}-${langkah}`}
                    className="flex items-start gap-3 rounded-2xl border border-green-50 bg-gradient-to-br from-white to-green-50/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-700 to-emerald-500 font-extrabold text-white shadow-md shadow-green-900/20">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-gray-700">{langkah}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3.5 font-bold text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-95"
              >
                Kembali ke bahan
              </button>
              <button
                type="button"
                onClick={mulaiMemasak}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 px-7 py-3.5 font-extrabold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Mulai Memasak
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            STEP 5 : MODE MEMASAK
        ===================================================== */}
        {step === 5 && resepAI && (
          <section className="mx-auto max-w-3xl">
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3.5 py-2 text-sm font-extrabold text-green-800">
                <ChefHat size={16} />
                Mode memasak
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl">
                {resepAI.nama_resep}
              </h2>
              <p className="mt-2 text-gray-500">
                Tandai langkah yang sudah selesai agar proses memasak lebih
                mudah diikuti.
              </p>
            </div>

            <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_12px_32px_rgba(35,101,45,0.1)] sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="font-extrabold text-green-950">Progres memasak</p>
                <p className="rounded-full bg-green-50 px-3 py-1 text-sm font-extrabold text-green-700">
                  {langkahSelesai.length}/{totalLangkah} langkah
                </p>
              </div>

              <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-green-50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-500"
                  style={{ width: `${persentaseMemasak}%` }}
                />
              </div>

              <div className="mt-6 space-y-3">
                {(resepAI.langkah || []).map((langkah, index) => {
                  const selesai = langkahSelesai.includes(index);

                  return (
                    <button
                      key={`${index}-${langkah}`}
                      type="button"
                      onClick={() => {
                        setLangkahAktif(index);
                        toggleLangkahSelesai(index);
                      }}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition duration-200 active:scale-[0.99] ${
                        selesai
                          ? "border-green-200 bg-green-50"
                          : langkahAktif === index
                            ? "border-green-400 bg-white shadow-md ring-4 ring-green-50"
                            : "border-[#e4eee6] bg-white hover:border-green-300 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold transition ${
                          selesai
                            ? "bg-green-700 text-white shadow-md shadow-green-900/20"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selesai ? <Check size={18} strokeWidth={3} /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-xs font-extrabold uppercase tracking-wider ${
                            selesai ? "text-green-700" : "text-gray-400"
                          }`}
                        >
                          Langkah {index + 1}
                        </p>
                        <p
                          className={`mt-1 leading-7 ${
                            selesai
                              ? "text-gray-500 line-through"
                              : "text-gray-800"
                          }`}
                        >
                          {langkah}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {persentaseMemasak === 100 && totalLangkah > 0 && (
                <div className="mt-6 rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                    <CheckCircle2 size={36} className="text-green-700" />
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold text-green-950">
                    Resep selesai dimasak!
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Selamat menikmati hidanganmu bersama keluarga.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3.5 font-bold text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-95"
              >
                Kembali ke resep
              </button>
              <button
                type="button"
                onClick={ulangiRacik}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 px-7 py-3.5 font-extrabold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <RefreshCw size={17} />
                Buat resep lain
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_8px_24px_rgba(35,101,45,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(35,101,45,0.14)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-md shadow-green-900/20">
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-extrabold tracking-tight text-green-950">
        {value}
      </p>
    </div>
  );
}
