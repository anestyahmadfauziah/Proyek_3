import { useNavigate, useLocation } from "react-router-dom";

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
   DATA BAHAN
========================================================= */

const bahan = [
  {
    nama: "Ikan Patin",
    jumlah: "3000 gram",
    tanggal: "30/9",
    image:
      "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=200&q=80",
    status: "Aman",
  },
  {
    nama: "Kangkung",
    jumlah: "1000 gram",
    tanggal: "30/9",
    image:
      "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&w=200&q=80",
    status: "Aman",
  },
  {
    nama: "Ikan Tuna",
    jumlah: "1000 gram",
    tanggal: "25/9",
    image:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=200&q=80",
    status: "Perlu diolah",
  },
  {
    nama: "Telur Ayam",
    jumlah: "50 butir",
    tanggal: "24/9",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=200&q=80",
    status: "Perlu diolah",
  },
];

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
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     NAVIGASI MENU
  ======================================================= */

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  /* =======================================================
     CEK MENU AKTIF
  ======================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f9f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">

          <div className="flex min-h-[64px] items-center justify-between gap-3 lg:min-h-[70px]">

            {/* =================================================
                LOGO
            ================================================= */}

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

            {/* =================================================
                NAVIGASI DESKTOP / IPAD
            ================================================= */}

            <nav className="hidden items-center gap-1 md:flex lg:gap-1.5">

              {menu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMenuClick(item)}
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
                      strokeWidth={active ? 2.5 : 2}
                    />

                    <span>{item.label}</span>
                  </button>
                );
              })}

            </nav>

            {/* =================================================
                BAGIAN KANAN
            ================================================= */}

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">

              {/* NOTIFIKASI */}

              <button
                type="button"
                onClick={() => navigate("/notifikasi")}
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
                  2
                </span>
              </button>

              {/* MASUK */}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  hidden
                  rounded-lg
                  border
                  border-[#23652d]
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#23652d]
                  transition
                  hover:bg-[#e8f5e9]
                  sm:block
                  lg:px-3
                  lg:py-2
                  lg:text-sm
                "
              >
                Masuk
              </button>

              {/* DAFTAR */}

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  hidden
                  rounded-lg
                  bg-[#23652d]
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#1b5424]
                  sm:block
                  lg:px-3
                  lg:py-2
                  lg:text-sm
                "
              >
                Daftar
              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => navigate("/profil")}
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

          {/* Decorative circle */}

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
              gap-4
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div className="min-w-0">

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
                Halo, Bunda Test!
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  leading-relaxed
                  text-white/90
                  sm:text-sm
                  lg:text-base
                "
              >
                Mari penuhi gizi harian{" "}
                <strong>husen (4 tahun)</strong> hari ini.
              </p>

            </div>

            <div
              className="
                self-start
                rounded-full
                bg-white/15
                px-3
                py-1.5
                text-[11px]
                font-semibold
                backdrop-blur-sm
                sm:text-xs
                lg:self-end
              "
            >
              Sabtu, 26 Sep
            </div>

          </div>

          {/* Statistik */}

          <div
            className="
              relative
              z-10
              mt-5
              grid
              grid-cols-1
              gap-2.5
              sm:grid-cols-3
            "
          >

            {/* Total */}

            <div className="rounded-xl bg-white/15 p-3.5 sm:p-4">
              <p className="text-2xl font-bold sm:text-3xl">
                4
              </p>

              <p className="mt-0.5 text-xs font-medium text-white/85">
                Total Bahan
              </p>
            </div>

            {/* Aman */}

            <div className="rounded-xl bg-white p-3.5 text-[#23652d] sm:p-4">
              <p className="text-2xl font-bold sm:text-3xl">
                2
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-600">
                Aman
              </p>
            </div>

            {/* Perlu diolah */}

            <div className="rounded-xl bg-[#a3bd62]/80 p-3.5 sm:p-4">
              <p className="text-2xl font-bold text-[#f8d35b] sm:text-3xl">
                2
              </p>

              <p className="mt-0.5 text-xs font-medium text-white">
                Perlu Diolah
              </p>
            </div>

          </div>
        </section>

        {/* ===================================================
            WARNING
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
                  Peringatan Kulkas
                </h3>

                <p className="mt-0.5 text-xs font-semibold text-red-500 sm:text-sm">
                  ● 2 Bahan Perlu Diolah Segera!
                </p>

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
                sm:text-sm
              "
            >
              Lihat Selengkapnya
              <ChevronRight size={16} />
            </button>

          </div>

          {/* Warning items */}

          <div className="mt-4 space-y-3">

            {/* Telur */}

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                <img
                  src={bahan[3].image}
                  alt="Telur Ayam"
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-lg
                    object-cover
                    sm:h-11
                    sm:w-11
                  "
                />

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold">
                    Telur Ayam
                  </p>

                  <p className="text-xs text-red-500">
                    Kedaluwarsa
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
                  text-[11px]
                  font-medium
                  sm:px-3
                  sm:text-xs
                "
              >
                50 butir
              </span>

            </div>

            {/* Tuna */}

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                <img
                  src={bahan[2].image}
                  alt="Ikan Tuna"
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-lg
                    object-cover
                    sm:h-11
                    sm:w-11
                  "
                />

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold">
                    Ikan Tuna
                  </p>

                  <p className="text-xs text-red-500">
                    Kedaluwarsa
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
                  text-[11px]
                  font-medium
                  sm:px-3
                  sm:text-xs
                "
              >
                1000 gram
              </span>

            </div>

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
                lg:text-base
              "
            >
              AI otomatis menyesuaikan stok kulkas dengan target
              nutrisi harian husen.
            </p>

            <button
              type="button"
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
            STOCK
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
              onClick={() => navigate("/stok")}
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
                sm:text-sm
              "
            >
              <Plus size={16} />
              Tambah Bahan
            </button>

          </div>

          {/* Grid bahan */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {bahan.map((item) => (

              <article
                key={item.nama}
                className={`
                  rounded-[18px]
                  border
                  bg-white
                  p-4
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                  ${
                    item.status === "Perlu diolah"
                      ? "border-red-200"
                      : "border-slate-100"
                  }
                `}
              >

                <img
                  src={item.image}
                  alt={item.nama}
                  className="h-12 w-12 rounded-lg object-cover"
                />

                <h3 className="mt-3 text-sm font-bold sm:text-base">
                  {item.nama}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {item.jumlah} • {item.tanggal}
                </p>

                <span
                  className={`
                    mt-2
                    inline-block
                    rounded-full
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    ${
                      item.status === "Perlu diolah"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {item.status}
                </span>

              </article>

            ))}

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
              sm:text-sm
            "
          >
            Lihat Semua 4 Bahan
            <ChevronRight size={16} />
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

            <h3 className="text-sm font-semibold sm:text-base">
              Tips Hari Ini
            </h3>

            <p
              className="
                mt-0.5
                text-xs
                leading-relaxed
                text-[#765e43]
                sm:text-sm
              "
            >
              Untuk husen, pastikan 1 sumber protein hewani di tiap
              makan utama.
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
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleMenuClick(item)}
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
                  strokeWidth={active ? 2.5 : 2}
                />

                <span className="truncate">
                  {item.label}
                </span>

              </button>
            );
          })}

          {/* AI BUTTON */}

          <button
            type="button"
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

export default Dashboard;