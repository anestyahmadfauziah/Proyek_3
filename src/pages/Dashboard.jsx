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
} from "lucide-react";

import logoDapurCerdas from "../assets/logo-dapur-cerdas.png";

/* =========================================================
   MENU NAVIGASI
========================================================= */

const menu = [
  {
    label: "Beranda",
    icon: Home,
    path: "/",
  },
  {
    label: "Stok Kulkas",
    icon: Package,
    path: "/stok",
  },
  {
    label: "Nutrisi",
    icon: TrendingUp,
    path: "/nutrisi",
  },
  {
    label: "Si Kecil",
    icon: Baby,
    path: "/si-kecil",
  },
];

/* =========================================================
   HELPER GAMBAR
========================================================= */

function getImageUrl(imagePath) {
  if (!imagePath) {
    return "https://placehold.co/200x200?text=No+Image";
  }

  const cleanPath = imagePath
    .trim()
    .replace(/\\/g, "/");

  /*
   * Jika database menyimpan URL lengkap
   */
  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://")
  ) {
    return cleanPath;
  }

  /*
   * Jika sudah berupa:
   * /image/ingredients/13-buncis.jpg
   */
  if (cleanPath.startsWith("/image/")) {
    return cleanPath;
  }

  /*
   * Jika database menyimpan:
   * image/ingredients/13-buncis.jpg
   */
  if (cleanPath.startsWith("image/")) {
    return `/${cleanPath}`;
  }

  /*
   * Jika database menyimpan:
   * ingredients/13-buncis.jpg
   *
   * File fisik:
   * public/image/ingredients/13-buncis.jpg
   *
   * Maka URL:
   * /image/ingredients/13-buncis.jpg
   */
  if (cleanPath.startsWith("ingredients/")) {
    return `/image/${cleanPath}`;
  }

  /*
   * Jika database hanya menyimpan nama file:
   * 13-buncis.jpg
   */
  if (
    !cleanPath.includes("/") &&
    /\.(jpg|jpeg|png|webp)$/i.test(cleanPath)
  ) {
    return `/image/ingredients/${cleanPath}`;
  }

  /*
   * Fallback
   */
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
  if (!tanggal) {
    return "-";
  }

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
  if (!tanggalKadaluarsa) {
    return null;
  }

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const tanggalExp = new Date(
    `${tanggalKadaluarsa}T00:00:00`
  );

  if (Number.isNaN(tanggalExp.getTime())) {
    return null;
  }

  return Math.ceil(
    (tanggalExp.getTime() - hariIni.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   TENTUKAN STATUS BAHAN
========================================================= */

function tentukanStatus(tanggalKadaluarsa) {
  const selisihHari = hitungSelisihHari(
    tanggalKadaluarsa
  );

  if (selisihHari === null) {
    return "Aman";
  }

  /*
   * Sudah kedaluwarsa
   */
  if (selisihHari < 0) {
    return "Kedaluwarsa";
  }

  /*
   * Kedaluwarsa hari ini sampai 3 hari ke depan
   */
  if (selisihHari <= 3) {
    return "Perlu diolah";
  }

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
    const selisihHari = hitungSelisihHari(
      item.tanggalKadaluarsa
    );

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
  const [loadingSession, setLoadingSession] =
    useState(true);

  const [bahan, setBahan] = useState([]);
  const [loadingBahan, setLoadingBahan] =
    useState(true);
  const [errorBahan, setErrorBahan] = useState("");

  /* =======================================================
     SESSION
  ======================================================= */

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("SESSION USER:", session?.user);

        console.log(
          "USER METADATA:",
          session?.user?.user_metadata
        );

        setSession(session);
      } catch (error) {
        console.error(
          "Gagal mengambil session:",
          error
        );
      } finally {
        setLoadingSession(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     AMBIL DATA STOK DARI DATABASE
  ======================================================= */

  useEffect(() => {
    const ambilDataBahan = async () => {
      try {
        setLoadingBahan(true);
        setErrorBahan("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        /*
         * Belum login
         */
        if (!user) {
          setBahan([]);
          return;
        }

        /* =================================================
           AMBIL STOK USER
        ================================================= */

        const {
          data: stokData,
          error: stokError,
        } = await supabase
          .from("stok")
          .select(
            `
              id,
              user_id,
              bahan_pangan_id,
              jumlah,
              satuan,
              tanggal_masuk,
              tanggal_kadaluarsa
            `
          )
          .eq("user_id", user.id)
          .order("tanggal_kadaluarsa", {
            ascending: true,
          });

        if (stokError) {
          throw stokError;
        }

        /*
         * Belum ada stok
         */
        if (!stokData || stokData.length === 0) {
          setBahan([]);
          return;
        }

        /* =================================================
           AMBIL ID BAHAN
        ================================================= */

        const bahanIds = [
          ...new Set(
            stokData
              .map(
                (item) => item.bahan_pangan_id
              )
              .filter(Boolean)
          ),
        ];

        let ingredientsData = [];

        /* =================================================
           AMBIL DATA MASTER BAHAN
        ================================================= */

        if (bahanIds.length > 0) {
          const {
            data,
            error: ingredientsError,
          } = await supabase
            .from("ingredients_master")
            .select(
              `
                id,
                name,
                image_path
              `
            )
            .in("id", bahanIds);

          if (ingredientsError) {
            throw ingredientsError;
          }

          ingredientsData = data || [];
        }

        /* =================================================
           GABUNGKAN STOK + MASTER BAHAN
        ================================================= */

        const hasil = stokData.map((stok) => {
          const bahanMaster =
            ingredientsData.find(
              (item) =>
                item.id ===
                stok.bahan_pangan_id
            );

          const imageUrl = getImageUrl(
            bahanMaster?.image_path
          );

          console.log(
            "GAMBAR:",
            bahanMaster?.name,
            "image_path:",
            bahanMaster?.image_path,
            "URL:",
            imageUrl
          );

          return {
            id: stok.id,

            nama:
              bahanMaster?.name ||
              "Bahan Tidak Diketahui",

            jumlah: formatJumlah(
              stok.jumlah,
              stok.satuan
            ),

            tanggal: formatTanggal(
              stok.tanggal_kadaluarsa
            ),

            image: imageUrl,

            status: tentukanStatus(
              stok.tanggal_kadaluarsa
            ),

            tanggalKadaluarsa:
              stok.tanggal_kadaluarsa,

            tanggalMasuk:
              stok.tanggal_masuk,
          };
        });

        setBahan(hasil);
      } catch (error) {
        console.error(
          "Gagal mengambil data bahan:",
          error
        );

        setErrorBahan(
          error?.message ||
            "Gagal mengambil data stok."
        );

        setBahan([]);
      } finally {
        setLoadingBahan(false);
      }
    };

    /*
     * Hanya ambil data setelah status session
     * sudah selesai diperiksa.
     */
    if (!loadingSession) {
      ambilDataBahan();
    }
  }, [session, loadingSession]);

  /* =======================================================
     TANGGAL HARI INI
  ======================================================= */

  const tanggalHariIni =
    new Intl.DateTimeFormat("id-ID", {
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

  /* =======================================================
     MENU AKTIF
  ======================================================= */

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

  const jumlahAman = bahan.filter(
    (item) => item.status === "Aman"
  ).length;

  const jumlahPerluDiolah = bahan.filter(
    (item) => item.status === "Perlu diolah"
  ).length;

  const jumlahKedaluwarsa = bahan.filter(
    (item) => item.status === "Kedaluwarsa"
  ).length;

  /*
   * Bahan yang perlu diperhatikan di Dashboard.
   *
   * Dashboard fokus pada KONDISI STOK SAAT INI.
   */
  const bahanPrioritas = bahan
    .filter(
      (item) =>
        item.status === "Perlu diolah" ||
        item.status === "Kedaluwarsa"
    )
    .slice(0, 3);

  /* =======================================================
     NAMA USER
  ======================================================= */

  const namaUser =
    session?.user?.user_metadata?.nama ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.user_metadata?.name ||
    "Pengguna";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f9f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">

        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">

          <div className="flex min-h-[62px] items-center justify-between gap-2 sm:min-h-[66px] lg:min-h-[70px]">

            {/* LOGO */}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex shrink-0 items-center gap-2 sm:gap-2.5"
            >
              <img
                src={logoDapurCerdas}
                alt="Dapur Cerdas"
                className="h-8 w-8 object-contain sm:h-9 sm:w-9"
              />

              <div className="hidden leading-none sm:block">
                <h1 className="font-playfair text-base font-bold text-[#23652d] sm:text-lg">
                  Dapur Cerdas
                </h1>

                <p className="mt-1 text-[10px] text-slate-400 sm:text-[11px]">
                  Asisten Dapur Cerdas
                </p>
              </div>
            </button>

            {/* NAVIGASI DESKTOP */}

            <nav className="hidden items-center gap-1 md:flex lg:gap-1.5">

              {menu.map((item) => {
                const Icon = item.icon;
                const active = isActive(
                  item.path
                );

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      handleMenuClick(item)
                    }
                    className={`
                      flex
                      items-center
                      gap-1.5
                      rounded-lg
                      px-2.5
                      py-2
                      text-xs
                      font-semibold
                      transition
                      lg:px-3
                      lg:text-sm
                      ${
                        active
                          ? "bg-[#e8f7eb] text-[#176b26]"
                          : "text-slate-500 hover:bg-slate-50 hover:text-[#176b26]"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={
                        active ? 2.5 : 2
                      }
                    />

                    <span>{item.label}</span>
                  </button>
                );
              })}

            </nav>

            {/* BAGIAN KANAN */}

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">

              {/* =================================================
                  NOTIFIKASI
              ================================================= */}

              <button
                type="button"
                onClick={() =>
                  navigate("/notifikasi")
                }
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-slate-600
                  transition
                  hover:bg-slate-100
                  sm:h-10
                  sm:w-10
                "
                aria-label="Notifikasi"
              >
                <Bell size={19} />

                {jumlahPerluDiolah +
                  jumlahKedaluwarsa >
                  0 && (
                  <span
                    className="
                      absolute
                      right-0
                      top-0
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500
                      px-1
                      text-[9px]
                      font-bold
                      text-white
                    "
                  >
                    {jumlahPerluDiolah +
                      jumlahKedaluwarsa}
                  </span>
                )}
              </button>

              {/* =================================================
                  LOGIN / REGISTER / PROFILE
              ================================================= */}

              {!session ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login")
                    }
                    className="
                      rounded-lg
                      bg-[#23652d]
                      px-2.5
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#1b5424]
                      sm:px-3
                      sm:py-2
                      sm:text-xs
                      lg:text-sm
                    "
                  >
                    Masuk
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/register")
                    }
                    className="
                      rounded-lg
                      border
                      border-[#23652d]
                      px-2.5
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-[#23652d]
                      transition
                      hover:bg-[#e8f7eb]
                      sm:px-3
                      sm:py-2
                      sm:text-xs
                      lg:text-sm
                    "
                  >
                    Daftar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    navigate("/profil")
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e8f5e9]
                    text-[#176324]
                    transition
                    hover:bg-[#d8eddc]
                    sm:h-10
                    sm:w-10
                  "
                  aria-label="Profil"
                >
                  <UserCircle size={21} />
                </button>
              )}

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          pb-24
          pt-4
          sm:px-5
          sm:pt-5
          md:pb-24
          lg:px-7
          lg:pb-8
          lg:pt-6
        "
      >

        {/* ===================================================
            HERO
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[20px]
            bg-[#23752e]
            px-5
            py-5
            text-white
            shadow-sm
            sm:rounded-[22px]
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-7
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-48
              w-48
              rounded-full
              bg-white/5
              sm:h-60
              sm:w-60
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-stretch
            "
          >

            <div
              className="
                flex
                min-w-0
                flex-1
                flex-col
                justify-center
                lg:max-w-[43%]
              "
            >

              <h2
                className="
                  font-playfair
                  text-xl
                  font-bold
                  leading-tight
                  sm:text-2xl
                  lg:text-3xl
                "
              >
                Halo, {namaUser}! 👋
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  leading-relaxed
                  text-white/90
                  sm:text-sm
                "
              >
                Yuk, pilih bahan pangan bergizi
                untuk mendukung tumbuh kembang.
              </p>

              <div
                className="
                  mt-3
                  self-start
                  rounded-full
                  bg-white/15
                  px-3
                  py-1.5
                  text-[10px]
                  font-semibold
                  backdrop-blur-sm
                  sm:text-[11px]
                "
              >
                {tanggalHariIni}
              </div>

            </div>

            {/* STATISTIK KONDISI STOK */}

            <div
              className="
                grid
                flex-1
                grid-cols-1
                gap-2.5
                sm:grid-cols-3
                lg:max-w-[57%]
              "
            >

              {/* TOTAL */}

              <div
                className="
                  rounded-xl
                  bg-white/15
                  p-3.5
                  sm:p-4
                "
              >
                <p className="text-2xl font-bold sm:text-3xl">
                  {loadingBahan ? "..." : totalBahan}
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-white/85 sm:text-xs">
                  Total Bahan
                </p>
              </div>

              {/* AMAN */}

              <div
                className="
                  rounded-xl
                  bg-white
                  p-3.5
                  text-[#23652d]
                  sm:p-4
                "
              >
                <p className="text-2xl font-bold sm:text-3xl">
                  {loadingBahan ? "..." : jumlahAman}
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-slate-600 sm:text-xs">
                  Aman
                </p>
              </div>

              {/* PERLU DIOLAH */}

              <div
                className="
                  rounded-xl
                  bg-[#a3bd62]/80
                  p-3.5
                  sm:p-4
                "
              >
                <p className="text-2xl font-bold text-[#f8d35b] sm:text-3xl">
                  {loadingBahan
                    ? "..."
                    : jumlahPerluDiolah +
                      jumlahKedaluwarsa}
                </p>

                <p className="mt-0.5 text-[11px] font-medium text-white sm:text-xs">
                  Perlu Diperhatikan
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            KONDISI STOK SAAT INI
        =================================================== */}

        <section
          className="
            mt-4
            rounded-[18px]
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            sm:mt-5
            sm:rounded-[20px]
            sm:p-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >

            <div className="flex min-w-0 items-start gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#fff4cc]
                  text-[#e9a400]
                "
              >
                <AlertTriangle size={19} />
              </div>

              <div className="min-w-0">

                <h3 className="text-sm font-bold sm:text-base">
                  Kondisi Stok Saat Ini
                </h3>

                {jumlahKedaluwarsa > 0 ? (
                  <p className="mt-0.5 text-xs font-semibold text-red-500">
                    ● {jumlahKedaluwarsa} bahan sudah
                    kedaluwarsa
                  </p>
                ) : jumlahPerluDiolah > 0 ? (
                  <p className="mt-0.5 text-xs font-semibold text-orange-500">
                    ● {jumlahPerluDiolah} bahan perlu
                    diolah segera
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs font-semibold text-green-600">
                    ● Semua bahan dalam kondisi aman
                  </p>
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/stok")}
              className="
                flex
                items-center
                gap-1
                self-start
                text-xs
                font-bold
                text-[#29934b]
              "
            >
              Lihat Stok
              <ChevronRight size={15} />
            </button>

          </div>

          {/* BAHAN YANG PERLU DIPERHATIKAN */}

          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {loadingBahan ? (
              <p className="col-span-full text-xs text-slate-400">
                Memuat data bahan...
              </p>
            ) : errorBahan ? (
              <p className="col-span-full text-xs text-red-500">
                {errorBahan}
              </p>
            ) : bahanPrioritas.length === 0 ? (
              <div className="col-span-full rounded-xl bg-[#f7faf7] px-4 py-4 text-center">
                <p className="text-xs font-medium text-green-600">
                  Semua bahan dalam kondisi baik.
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Tidak ada bahan yang perlu diolah
                  segera.
                </p>
              </div>
            ) : (
              bahanPrioritas.map((item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    bg-[#fafafa]
                    px-2.5
                    py-2
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2.5
                      sm:gap-3
                    "
                  >

                    <img
                      src={item.image}
                      alt={item.nama}
                      className="
                        h-10
                        w-10
                        shrink-0
                        rounded-lg
                        object-cover
                        sm:h-11
                        sm:w-11
                      "
                      onError={(event) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          "https://placehold.co/200x200?text=No+Image";
                      }}
                    />

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold">
                        {item.nama}
                      </p>

                      <p
                        className={`text-xs ${
                          item.status ===
                          "Kedaluwarsa"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      >
                        {getStatusLabel(item)}
                      </p>

                    </div>

                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-lg
                      border
                      border-slate-200
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-medium
                      sm:px-3
                      sm:text-[11px]
                    "
                  >
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

        <section
          className="
            relative
            mt-4
            overflow-hidden
            rounded-[20px]
            bg-gradient-to-r
            from-[#fff19b]
            to-[#b9f3c8]
            p-5
            sm:mt-5
            sm:rounded-[22px]
            sm:p-6
            lg:p-7
          "
        >

          <div className="relative z-10 max-w-2xl">

            <p
              className="
                font-playfair
                text-xl
                font-bold
                leading-tight
                text-[#202833]
                sm:text-2xl
                lg:text-3xl
              "
            >
              Racik Resep
              <br />
              dengan AI
            </p>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-relaxed
                text-slate-700
                sm:text-sm
              "
            >
              AI otomatis menyesuaikan stok kulkas
              dengan bahan yang tersedia.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/racik-resep")
              }
              className="
                mt-4
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-[#f79500]
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[#e88700]
                active:scale-95
                sm:text-sm
              "
            >
              <Sparkles size={16} />
              Buat Resep AI
            </button>

          </div>

          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -top-8
              text-[90px]
              text-white/50
              sm:text-[130px]
            "
          >
            ♨
          </div>

        </section>

        {/* ===================================================
            RINGKASAN STOK
        =================================================== */}

        <section className="mt-6 sm:mt-7">

          <div
            className="
              mb-4
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div className="flex min-w-0 items-center gap-2.5">

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#e1f8e5]
                  text-[#238039]
                "
              >
                <Refrigerator size={19} />
              </div>

              <h2 className="truncate text-base font-bold sm:text-lg">
                Ringkasan Bahan Kulkas
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/tambah-bahan")
              }
              className="
                flex
                items-center
                justify-center
                gap-1.5
                rounded-full
                bg-[#1d6b27]
                px-4
                py-2
                text-xs
                font-bold
                text-white
                transition
                hover:bg-[#155a1f]
                active:scale-95
                sm:text-sm
              "
            >
              <Plus size={16} />
              Tambah Bahan
            </button>

          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              lg:max-w-[1120px]
            "
          >

            {loadingBahan ? (
              <p className="col-span-full text-xs text-slate-400">
                Memuat bahan kulkas...
              </p>
            ) : bahan.length === 0 ? (
              <p className="col-span-full text-xs text-slate-400">
                Belum ada bahan di stok kulkas.
              </p>
            ) : (
              bahan.map((item) => (
                <BahanCard
                  key={item.id}
                  item={item}
                />
              ))
            )}

          </div>

          <button
            type="button"
            onClick={() => navigate("/stok")}
            className="
              mt-4
              flex
              w-full
              items-center
              justify-end
              gap-1
              text-xs
              font-bold
              text-[#29934b]
            "
          >
            Lihat Semua {bahan.length} Bahan
            <ChevronRight size={15} />
          </button>

        </section>

        {/* ===================================================
            TIPS
        =================================================== */}

        <section
          className="
            mt-5
            flex
            items-start
            gap-3
            rounded-[20px]
            border
            border-[#f1db72]
            bg-[#fffbea]
            p-4
            sm:p-5
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[#f5a400]
              text-white
            "
          >
            <Lightbulb size={20} />
          </div>

          <div className="min-w-0">

            <h3 className="text-sm font-semibold">
              Tips Hari Ini
            </h3>

            <p
              className="
                mt-0.5
                text-xs
                leading-relaxed
                text-[#765e43]
              "
            >
              Pastikan bahan pangan yang mendekati
              kedaluwarsa digunakan terlebih dahulu.
            </p>

          </div>

        </section>

      </main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-slate-100
          bg-white/95
          px-2
          pb-[max(8px,env(safe-area-inset-bottom))]
          pt-2
          shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
          backdrop-blur-md
          md:hidden
        "
      >

        <div className="mx-auto flex max-w-xl items-end justify-around">

          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(
              item.path
            );

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleMenuClick(item)
                }
                className={`
                  flex
                  min-w-0
                  flex-1
                  flex-col
                  items-center
                  gap-0.5
                  py-1
                  text-[9px]
                  font-semibold
                  transition
                  sm:text-[10px]
                  ${
                    active
                      ? "text-[#216b2c]"
                      : "text-slate-400"
                  }
                `}
              >

                <Icon
                  size={20}
                  strokeWidth={
                    active ? 2.5 : 2
                  }
                />

                <span className="truncate">
                  {item.label}
                </span>

              </button>
            );
          })}

          {/* TOMBOL AI */}

          <button
            type="button"
            onClick={() =>
              navigate("/racik-resep")
            }
            className="
              absolute
              -top-6
              left-1/2
              flex
              h-14
              w-14
              -translate-x-1/2
              items-center
              justify-center
              rounded-full
              bg-[#f79500]
              text-white
              shadow-lg
              transition
              hover:scale-105
              active:scale-95
            "
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
  return (
    <article
      className="
        flex
        min-h-[175px]
        flex-col
        rounded-[16px]
        border
        border-[#e4eee6]
        bg-white
        p-3
        shadow-[0_2px_8px_rgba(32,40,51,0.05)]
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        sm:min-h-[180px]
        sm:p-3.5
      "
    >

      <h3
        className="
          truncate
          text-sm
          font-bold
          leading-tight
          text-[#202833]
          sm:text-base
        "
      >
        {item.nama}
      </h3>

      <div className="mt-2.5">

        <img
          src={item.image}
          alt={item.nama}
          className="
            h-12
            w-12
            rounded-xl
            object-cover
            sm:h-14
            sm:w-14
          "
          onError={(event) => {
            event.currentTarget.onerror = null;

            event.currentTarget.src =
              "https://placehold.co/200x200?text=No+Image";
          }}
        />

      </div>

      <p
        className="
          mt-2.5
          text-xs
          text-slate-500
          sm:text-sm
        "
      >
        {item.jumlah}

        <span className="mx-1">
          •
        </span>

        {item.tanggal}
      </p>

      <p
        className={`
          mt-auto
          pt-2.5
          text-[11px]
          font-semibold
          sm:text-xs
          ${
            item.status === "Kedaluwarsa"
              ? "text-red-500"
              : item.status === "Perlu diolah"
              ? "text-orange-500"
              : "text-green-600"
          }
        `}
      >
        {item.status}
      </p>

    </article>
  );
}

export default Dashboard;