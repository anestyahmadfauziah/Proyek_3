import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import {
  Bell,
  UserCircle,
  AlertTriangle,
  ChevronRight,
  Refrigerator,
  Plus,
  Sparkles,
  Home,
  Package,
  TrendingUp,
  Baby,
  Lightbulb,
  ChefHat,
  Clock,
  ArrowRight,
  Bookmark,
} from "lucide-react";

import logoDapurCerdas from "../assets/logo-dapur-cerdas.png";

/* =========================================================
   MENU NAVIGASI
========================================================= */

const menu = [
  { label: "Beranda", icon: Home, path: "/" },
  { label: "Stok Kulkas", icon: Package, path: "/stok" },
  { label: "Nutrisi", icon: TrendingUp, path: "/nutrisi" },
  { label: "Si Kecil", icon: Baby, path: "/si-kecil" },
];

/* =========================================================
   HELPER GAMBAR
========================================================= */

function getImageUrl(imagePath) {
  if (!imagePath) {
    return "https://placehold.co/200x200?text=No+Image";
  }

  const cleanPath = imagePath.trim().replace(/\\/g, "/");

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("/image/")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("image/")) {
    return `/${cleanPath}`;
  }

  if (cleanPath.startsWith("ingredients/")) {
    return `/image/${cleanPath}`;
  }

  if (!cleanPath.includes("/") && /\.(jpg|jpeg|png|webp)$/i.test(cleanPath)) {
    return `/image/ingredients/${cleanPath}`;
  }

  return `/${cleanPath.replace(/^\/+/, "")}`;
}

/* =========================================================
   FORMAT JUMLAH
========================================================= */

function formatJumlah(jumlah, satuan) {
  const angka = Number(jumlah);

  if (Number.isNaN(angka)) {
    return `${jumlah} ${satuan || ""}`.trim();
  }

  const jumlahFormatted = Number.isInteger(angka)
    ? angka
    : angka.toLocaleString("id-ID", {
        maximumFractionDigits: 2,
      });

  return `${jumlahFormatted} ${satuan || ""}`.trim();
}

/* =========================================================
   FORMAT TANGGAL
========================================================= */

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const date = new Date(`${tanggal}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return tanggal;
  }

  return `${date.getDate()}/${date.getMonth() + 1}`;
}

/* =========================================================
   HITUNG SELISIH HARI
========================================================= */

function hitungSelisihHari(tanggalKadaluarsa) {
  if (!tanggalKadaluarsa) return null;

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const tanggalExp = new Date(`${tanggalKadaluarsa}T00:00:00`);

  if (Number.isNaN(tanggalExp.getTime())) {
    return null;
  }

  return Math.ceil(
    (tanggalExp.getTime() - hariIni.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   TENTUKAN STATUS BAHAN
========================================================= */

function tentukanStatus(tanggalKadaluarsa) {
  const selisihHari = hitungSelisihHari(tanggalKadaluarsa);

  if (selisihHari === null) return "Aman";
  if (selisihHari < 0) return "Kedaluwarsa";
  if (selisihHari <= 3) return "Perlu diolah";

  return "Aman";
}

/* =========================================================
   LABEL STATUS
========================================================= */

function getStatusLabel(item) {
  if (item.status === "Kedaluwarsa") {
    return "Kedaluwarsa";
  }

  if (item.status === "Perlu diolah") {
    const selisihHari = hitungSelisihHari(item.tanggalKadaluarsa);

    if (selisihHari === 0) {
      return "Kedaluwarsa hari ini";
    }

    if (selisihHari === 1) {
      return "Kedaluwarsa besok";
    }

    if (selisihHari !== null && selisihHari > 1) {
      return `Kedaluwarsa ${selisihHari} hari lagi`;
    }

    return "Segera diolah";
  }

  return "Aman";
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [bahan, setBahan] = useState([]);
  const [loadingBahan, setLoadingBahan] = useState(true);
  const [errorBahan, setErrorBahan] = useState("");

  /* =======================================================
     STATE RESEP TERSIMPAN
  ======================================================= */

  const [resepTersimpan, setResepTersimpan] = useState([]);
  const [loadingResep, setLoadingResep] = useState(true);
  const [errorResep, setErrorResep] = useState("");

  /* =======================================================
     SESSION SUPABASE
  ======================================================= */

  useEffect(() => {
    let aktif = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (aktif) {
          setSession(session);
        }
      } catch (error) {
        console.error("Gagal mengambil session:", error);
      } finally {
        if (aktif) {
          setLoadingSession(false);
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sessionBaru) => {
      if (aktif) {
        setSession(sessionBaru);
        setLoadingSession(false);
      }
    });

    return () => {
      aktif = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     AMBIL DATA STOK DARI DATABASE
  ======================================================= */

  useEffect(() => {
    let aktif = true;

    const ambilDataBahan = async () => {
      try {
        setLoadingBahan(true);
        setErrorBahan("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (aktif) setBahan([]);
          return;
        }

        const { data: stokData, error: stokError } = await supabase
          .from("stok")
          .select(`
            id,
            user_id,
            bahan_pangan_id,
            jumlah,
            satuan,
            tanggal_masuk,
            tanggal_kadaluarsa
          `)
          .eq("user_id", user.id)
          .order("tanggal_kadaluarsa", {
            ascending: true,
          });

        if (stokError) throw stokError;

        if (!stokData || stokData.length === 0) {
          if (aktif) setBahan([]);
          return;
        }

        const bahanIds = [
          ...new Set(
            stokData.map((item) => item.bahan_pangan_id).filter(Boolean)
          ),
        ];

        let ingredientsData = [];

        if (bahanIds.length > 0) {
          const { data, error: ingredientsError } = await supabase
            .from("ingredients_master")
            .select("id, name, image_path")
            .in("id", bahanIds);

          if (ingredientsError) throw ingredientsError;

          ingredientsData = data || [];
        }

        const hasil = stokData.map((stok) => {
          const bahanMaster = ingredientsData.find(
            (item) => item.id === stok.bahan_pangan_id
          );

          return {
            id: stok.id,
            nama: bahanMaster?.name || "Bahan Tidak Diketahui",
            jumlah: formatJumlah(stok.jumlah, stok.satuan),
            tanggal: formatTanggal(stok.tanggal_kadaluarsa),
            image: getImageUrl(bahanMaster?.image_path),
            status: tentukanStatus(stok.tanggal_kadaluarsa),
            tanggalKadaluarsa: stok.tanggal_kadaluarsa,
            tanggalMasuk: stok.tanggal_masuk,
          };
        });

        if (aktif) setBahan(hasil);
      } catch (error) {
        console.error("Gagal mengambil data bahan:", error);

        if (aktif) {
          setErrorBahan(error?.message || "Gagal mengambil data stok.");
          setBahan([]);
        }
      } finally {
        if (aktif) setLoadingBahan(false);
      }
    };

    if (!loadingSession) {
      ambilDataBahan();
    }

    return () => {
      aktif = false;
    };
  }, [session, loadingSession]);

  /* =======================================================
     AMBIL RESEP TERSIMPAN MILIK USER LOGIN
  ======================================================= */

  useEffect(() => {
    let aktif = true;

    const ambilResepTersimpan = async () => {
      try {
        setLoadingResep(true);
        setErrorResep("");

        if (!session?.user?.id) {
          if (aktif) setResepTersimpan([]);
          return;
        }

        const { data, error } = await supabase
          .from("resep_tersimpan")
          .select(`
            id,
            user_id,
            nama_resep,
            deskripsi,
            waktu_memasak,
            porsi,
            bahan,
            langkah,
            nutrisi,
            tag,
            tips,
            created_at
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        if (aktif) {
          setResepTersimpan(data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil resep tersimpan:", error);

        if (aktif) {
          setErrorResep(error?.message || "Gagal memuat resep tersimpan.");
        }
      } finally {
        if (aktif) setLoadingResep(false);
      }
    };

    if (!loadingSession) {
      ambilResepTersimpan();
    }

    return () => {
      aktif = false;
    };
  }, [session, loadingSession]);

  /* =======================================================
     TANGGAL HARI INI
  ======================================================= */

  const tanggalHariIni = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());

  /* =======================================================
     NAVIGASI MENU
  ======================================================= */

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /* =======================================================
     STATISTIK STOK
  ======================================================= */

  const totalBahan = bahan.length;

  const jumlahAman = bahan.filter((item) => item.status === "Aman").length;

  const jumlahPerluDiolah = bahan.filter(
    (item) => item.status === "Perlu diolah"
  ).length;

  const jumlahKedaluwarsa = bahan.filter(
    (item) => item.status === "Kedaluwarsa"
  ).length;

  const bahanPrioritas = bahan
    .filter(
      (item) => item.status === "Perlu diolah" || item.status === "Kedaluwarsa"
    )
    .slice(0, 3);

  /* =======================================================
     NAMA USER
  ======================================================= */

  const namaUser =
    session?.user?.user_metadata?.nama ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.user_metadata?.name ||
    session?.user?.email?.split("@")[0] ||
    "Pengguna";

  /* =======================================================
     BUKA DETAIL RESEP
  ======================================================= */

  const bukaDetailResep = (resep) => {
    navigate("/racik-resep/tersimpan", {
      state: { resep },
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#e6f4e8] via-[#f3f9f3] to-[#f8fbf8] font-jakarta text-[#202833]">
      {/* DEKORASI LATAR */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-40 h-80 w-80 rounded-full bg-green-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-[55%] h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-[0_4px_20px_rgba(35,101,45,0.06)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[64px] items-center justify-between gap-2 sm:min-h-[68px] lg:min-h-[72px]">
            {/* LOGO */}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex shrink-0 items-center gap-2.5 transition active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-green-100 bg-white shadow-sm">
                <img
                  src={logoDapurCerdas}
                  alt="Dapur Cerdas"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div className="hidden text-left leading-none sm:block">
                <h1 className="text-base font-extrabold tracking-tight text-[#1c4a24] sm:text-lg">
                  Dapur Cerdas
                </h1>
                <p className="mt-1 text-[10px] font-medium text-slate-400 sm:text-[11px]">
                  Asisten Dapur Cerdas
                </p>
              </div>
            </button>

            {/* NAVIGASI DESKTOP */}

            <nav className="hidden items-center gap-1 rounded-2xl border border-green-100/80 bg-white/70 p-1 shadow-sm md:flex">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition lg:px-4 lg:text-sm ${
                      active
                        ? "bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] text-white shadow-md shadow-green-900/20"
                        : "text-slate-500 hover:bg-green-50 hover:text-[#176b26]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* BAGIAN KANAN */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate("/notifikasi")}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-green-100 bg-white text-slate-600 shadow-sm transition hover:bg-green-50 hover:text-[#176b26] active:scale-95"
                aria-label="Notifikasi"
              >
                <Bell size={19} />

                {jumlahPerluDiolah + jumlahKedaluwarsa > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1 text-[9px] font-extrabold text-white shadow-md ring-2 ring-white">
                    {jumlahPerluDiolah + jumlahKedaluwarsa}
                  </span>
                )}
              </button>

              {!session ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-3 py-2 text-[11px] font-bold text-white shadow-md shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-95 sm:px-4 sm:text-xs lg:text-sm"
                  >
                    Masuk
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="rounded-xl border border-[#23652d]/40 bg-white px-3 py-2 text-[11px] font-bold text-[#23652d] transition hover:bg-[#e8f7eb] active:scale-95 sm:px-4 sm:text-xs lg:text-sm"
                  >
                    Daftar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/profil")}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#d3ecd8] text-[#176324] shadow-sm ring-2 ring-white transition hover:shadow-md active:scale-95"
                  aria-label="Profil"
                >
                  <UserCircle size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="relative mx-auto w-full max-w-[1500px] px-4 pb-28 pt-5 sm:px-5 sm:pt-6 md:pb-28 lg:px-7 lg:pb-10 lg:pt-7">
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#12471f] via-[#1b6b2d] to-[#2f9e4f] px-5 py-6 text-white shadow-[0_20px_50px_rgba(18,71,31,0.35)] sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          {/* dekorasi */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-sm" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-300/20 blur-2xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
          />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10">
            <div className="flex min-w-0 flex-1 flex-col justify-center lg:max-w-[43%]">
              <div className="mb-3 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold backdrop-blur-md sm:text-[11px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9df0ae]" />
                {tanggalHariIni}
              </div>

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Halo, {namaUser}! 👋
              </h2>

              <p className="mt-3 max-w-md text-xs leading-relaxed text-white/85 sm:text-sm">
                Yuk, pilih bahan pangan bergizi untuk mendukung tumbuh kembang.
              </p>
            </div>

            {/* STATISTIK KONDISI STOK */}

            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-[57%]">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15 sm:p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Package size={18} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {loadingBahan ? "..." : totalBahan}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/80 sm:text-xs">
                  Total Bahan
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 text-[#23652d] shadow-xl shadow-black/10 transition hover:-translate-y-0.5 sm:p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e3f6e8]">
                  <Refrigerator size={18} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {loadingBahan ? "..." : jumlahAman}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500 sm:text-xs">
                  Aman
                </p>
              </div>

              <div className="rounded-2xl border border-[#f8d35b]/40 bg-gradient-to-br from-[#f8d35b]/25 to-[#f79500]/20 p-4 backdrop-blur-md transition hover:from-[#f8d35b]/30 sm:p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8d35b]/25 text-[#f8d35b]">
                  <AlertTriangle size={18} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#ffe27a] sm:text-4xl">
                  {loadingBahan ? "..." : jumlahPerluDiolah + jumlahKedaluwarsa}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/90 sm:text-xs">
                  Perlu Diperhatikan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            KONDISI STOK SAAT INI
        =================================================== */}

        <section className="mt-5 rounded-3xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(35,101,45,0.08)] sm:mt-6 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff4cc] to-[#ffe49a] text-[#c98500] shadow-sm">
                <AlertTriangle size={20} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold tracking-tight sm:text-base">
                  Kondisi Stok Saat Ini
                </h3>

                {jumlahKedaluwarsa > 0 ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {jumlahKedaluwarsa} bahan sudah kedaluwarsa
                  </p>
                ) : jumlahPerluDiolah > 0 ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {jumlahPerluDiolah} bahan perlu diolah segera
                  </p>
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Semua bahan dalam kondisi aman
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/stok")}
              className="group flex items-center gap-1 self-start rounded-full bg-[#e8f7eb] px-3.5 py-2 text-xs font-bold text-[#1f7a35] transition hover:bg-[#d6f0db]"
            >
              Lihat Stok
              <ChevronRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loadingBahan ? (
              <p className="col-span-full text-xs text-slate-400">
                Memuat data bahan...
              </p>
            ) : errorBahan ? (
              <p className="col-span-full text-xs text-red-500">{errorBahan}</p>
            ) : bahanPrioritas.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-green-200 bg-[#f7faf7] px-4 py-5 text-center">
                <p className="text-xs font-bold text-green-600">
                  Semua bahan dalam kondisi baik.
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Tidak ada bahan yang perlu diolah segera.
                </p>
              </div>
            ) : (
              bahanPrioritas.map((item) => (
                <div
                  key={item.id}
                  className={`relative flex min-w-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border bg-white py-2.5 pl-4 pr-3 shadow-[0_4px_14px_rgba(32,40,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-md ${
                    item.status === "Kedaluwarsa"
                      ? "border-red-100"
                      : "border-orange-100"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1.5 ${
                      item.status === "Kedaluwarsa"
                        ? "bg-red-500"
                        : "bg-orange-400"
                    }`}
                  />

                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.nama}
                      className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm ring-2 ring-white sm:h-12 sm:w-12"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/200x200?text=No+Image";
                      }}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.nama}</p>
                      <p
                        className={`text-xs font-medium ${
                          item.status === "Kedaluwarsa"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      >
                        {getStatusLabel(item)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600 sm:text-[11px]">
                    {item.jumlah}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===================================================
            AI RECIPE
        =================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f3d1c] via-[#17582a] to-[#1f7a3a] p-6 shadow-[0_20px_44px_rgba(15,61,28,0.3)] sm:mt-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 rounded-full bg-[#f8d35b]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#f8d35b]/40 bg-[#f8d35b]/15 px-3 py-1.5 text-[10px] font-bold text-[#ffe27a] sm:text-[11px]">
            </div>

            <p className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Racik Resep
              <br />
              <span className="bg-gradient-to-r from-[#ffe27a] to-[#9df0ae] bg-clip-text text-transparent">
                dengan AI
              </span>
            </p>

            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">
              AI otomatis menyesuaikan stok kulkas dengan bahan yang tersedia.
            </p>

            <button
              type="button"
              onClick={() => navigate("/racik-resep")}
              className="group mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#f79500] to-[#ffb020] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 sm:text-sm"
            >
              <Sparkles size={16} />
              Buat Resep AI
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="pointer-events-none absolute -right-4 -top-6 text-[110px] text-white/10 sm:text-[160px]">
            ♨
          </div>
        </section>

        {/* ===================================================
            RESEP TERSIMPAN
        =================================================== */}

        <section className="mt-5 rounded-3xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(35,101,45,0.08)] sm:mt-6 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f6b2b] to-[#2f9e4f] text-white shadow-md shadow-green-900/20">
                <Bookmark size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-extrabold tracking-tight text-[#202833] sm:text-base">
                  Resep Tersimpan
                </h2>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                  Koleksi resep favoritmu
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/racik-resep/tersimpan")}
              className="group flex shrink-0 items-center gap-1 rounded-full bg-[#e8f7eb] px-3.5 py-2 text-xs font-bold text-[#1f7a35] transition hover:bg-[#d6f0db] sm:text-sm"
            >
              Lihat Semua
              <ChevronRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {!session ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-[#f7faf7] p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <ChefHat size={28} />
              </div>

              <p className="text-sm font-bold text-[#202833]">
                Masuk untuk menyimpan resep
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Simpan resep favorit dan temukan kembali kapan saja.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-4 rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-95"
              >
                Masuk
              </button>
            </div>
          ) : loadingResep ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3 rounded-2xl border border-slate-100 p-3.5"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                    <div className="h-2.5 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorResep ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-600">
                Resep belum dapat dimuat
              </p>
              <p className="mt-1 break-words text-xs text-red-500">
                {errorResep}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
              >
                Coba Lagi
              </button>
            </div>
          ) : resepTersimpan.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-[#f7faf7] p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f6e8] text-[#23652d]">
                <ChefHat size={26} />
              </div>

              <p className="text-sm font-bold text-[#202833]">
                Belum ada resep tersimpan
              </p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                Buat resep menggunakan AI, lalu simpan resep favoritmu agar
                muncul di sini.
              </p>

              <button
                type="button"
                onClick={() => navigate("/racik-resep")}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles size={15} />
                Buat Resep AI
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resepTersimpan.map((resep) => (
                <button
                  key={resep.id}
                  type="button"
                  onClick={() => bukaDetailResep(resep)}
                  className="group flex w-full items-center gap-3.5 rounded-2xl border border-[#e4eee6] bg-white p-3.5 text-left shadow-[0_4px_14px_rgba(32,40,51,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#bfe3c6] hover:shadow-[0_12px_28px_rgba(35,101,45,0.12)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff4dd] to-[#ffe4a8] text-[#c87800] shadow-sm transition group-hover:scale-105">
                    <ChefHat size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold tracking-tight text-[#202833]">
                      {resep.nama_resep}
                    </p>

                    {resep.deskripsi && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {resep.deskripsi}
                      </p>
                    )}

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[#23652d]">
                        <Clock size={11} />
                        {resep.waktu_memasak || 15} menit
                      </span>

                      <span className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-500">
                        {resep.porsi || 1} porsi
                      </span>
                    </div>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[#23652d] group-hover:text-white">
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            RINGKASAN STOK
        =================================================== */}

        <section className="mt-7 sm:mt-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9f6df] to-[#b9ecc4] text-[#1f7a35] shadow-sm">
                <Refrigerator size={20} />
              </div>

              <h2 className="truncate text-base font-extrabold tracking-tight sm:text-lg">
                Ringkasan Bahan Kulkas
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tambah-bahan")}
              className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-900/25 transition hover:-translate-y-0.5 active:scale-95 sm:text-sm"
            >
              <Plus size={16} />
              Tambah Bahan
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:max-w-[1120px] lg:grid-cols-5">
            {loadingBahan ? (
              <p className="col-span-full text-xs text-slate-400">
                Memuat bahan kulkas...
              </p>
            ) : errorBahan ? (
              <p className="col-span-full text-xs text-red-500">{errorBahan}</p>
            ) : bahan.length === 0 ? (
              <p className="col-span-full text-xs text-slate-400">
                Belum ada bahan di stok kulkas.
              </p>
            ) : (
              bahan.map((item) => <BahanCard key={item.id} item={item} />)
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/stok")}
            className="group mt-5 flex w-full items-center justify-end gap-1 text-xs font-bold text-[#1f7a35]"
          >
            Lihat Semua {bahan.length} Bahan
            <ChevronRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </button>
        </section>

        {/* ===================================================
            TIPS
        =================================================== */}

        <section className="mt-6 flex items-start gap-3.5 rounded-3xl border border-[#f1db72]/70 bg-gradient-to-br from-[#fffbea] to-[#fff4c9] p-4 shadow-[0_8px_24px_rgba(245,164,0,0.1)] sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5a400] to-[#ffc233] text-white shadow-md shadow-amber-900/20">
            <Lightbulb size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-extrabold tracking-tight">
              Tips Hari Ini
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-[#765e43] sm:text-sm">
              Pastikan bahan pangan yang mendekati kedaluwarsa digunakan
              terlebih dahulu.
            </p>
          </div>
        </section>
      </main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/90 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_28px_rgba(35,101,45,0.12)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-xl items-end justify-around">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleMenuClick(item)}
                className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-bold transition sm:text-[10px] ${
                  active ? "text-[#216b2c]" : "text-slate-400"
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 h-1 w-8 rounded-full bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f]"
                  />
                )}
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* TOMBOL AI */}

          <button
            type="button"
            onClick={() => navigate("/racik-resep")}
            className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#f79500] to-[#ffb020] text-white shadow-[0_10px_24px_rgba(247,149,0,0.5)] ring-4 ring-white transition hover:scale-105 active:scale-95"
            aria-label="Resep AI"
          >
            <Sparkles size={23} />
          </button>
        </div>
      </nav>
    </div>
  );
}

/* =========================================================
   CARD BAHAN
========================================================= */

function BahanCard({ item }) {
  const isExpired = item.status === "Kedaluwarsa";
  const isNeedProcess = item.status === "Perlu diolah";

  return (
    <article className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-3xl border border-[#e4eee6] bg-white p-3.5 shadow-[0_4px_14px_rgba(32,40,51,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#cfe3d2] hover:shadow-[0_12px_28px_rgba(35,101,45,0.13)] sm:min-h-[196px] sm:p-4">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          isExpired
            ? "bg-red-500"
            : isNeedProcess
            ? "bg-orange-400"
            : "bg-[#35934a]"
        }`}
      />

      <h3 className="truncate text-sm font-extrabold leading-tight tracking-tight text-[#202833] sm:text-base">
        {item.nama}
      </h3>

      <div className="mt-3">
        <img
          src={item.image}
          alt={item.nama}
          className="h-14 w-14 rounded-2xl object-cover shadow-md ring-2 ring-white transition duration-300 group-hover:scale-105 sm:h-16 sm:w-16"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://placehold.co/200x200?text=No+Image";
          }}
        />
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
        <span className="font-bold text-[#23652d]">{item.jumlah}</span>
        <span className="mx-1.5 text-slate-300">•</span>
        {item.tanggal}
      </p>

      <p
        className={`mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold sm:text-xs ${
          isExpired
            ? "bg-red-50 text-red-500"
            : isNeedProcess
            ? "bg-orange-50 text-orange-500"
            : "bg-green-50 text-green-600"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isExpired
              ? "bg-red-500"
              : isNeedProcess
              ? "bg-orange-400"
              : "bg-green-500"
          }`}
        />
        {item.status}
      </p>
    </article>
  );
}

export default Dashboard;
