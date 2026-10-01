import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  UserCircle,
  CalendarDays,
  Droplets,
  Weight,
  Ruler,
  AlertTriangle,
  BookOpen,
  Egg,
  Fish,
  Beef,
  Pencil,
  CheckCircle2,
} from "lucide-react";

function SiKecil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f9f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">

        <div className="mx-auto flex min-h-[72px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-[82px] lg:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#202833] transition hover:bg-slate-100 sm:h-11 sm:w-11"
              aria-label="Kembali"
            >
              <ArrowLeft size={28} />
            </button>

            <div className="min-w-0">

              <h1 className="truncate font-playfair text-xl font-bold text-[#23652d] sm:text-2xl lg:text-3xl">
                Si Kecil
              </h1>


            </div>

          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">

            <button
              type="button"
              onClick={() => navigate("/notifikasi")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 sm:h-11 sm:w-11"
              aria-label="Notifikasi"
            >
              <Bell size={22} />

              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                2
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profil")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5e9] text-[#176324] transition hover:bg-[#d8eddc] sm:h-11 sm:w-11"
              aria-label="Profil"
            >
              <UserCircle size={24} />
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">

        {/* =================================================
            DATA ANAK
        ================================================= */}

        <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-7 lg:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}

            <div className="relative mx-auto sm:mx-0">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f6e9] text-[#176b26] sm:h-24 sm:w-24">

                <UserCircle
                  size={48}
                  strokeWidth={1.8}
                  className="sm:hidden"
                />

                <UserCircle
                  size={58}
                  strokeWidth={1.8}
                  className="hidden sm:block"
                />

              </div>

              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#176b26] text-white ring-2 ring-white">
                <CheckCircle2 size={16} />
              </span>

            </div>


            {/* Info */}

            <div className="min-w-0 flex-1 text-center sm:text-left">

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">

                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  ahmad
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#dcf7e3] px-3 py-1 text-xs font-bold text-[#248044] sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#20a64a]" />
                  Aktif
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                12 Bulan (Laki-laki)
              </p>


              {/* Info chips */}

              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:text-sm">
                  <CalendarDays size={16} />
                  22 Sep 2025
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:text-sm">
                  <Droplets size={16} />
                  Gol. O+
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            BB / TB
        ================================================= */}

        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* BB */}

          <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-3 text-slate-500">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <Weight size={20} />
              </div>

              <span className="text-sm font-medium sm:text-base">
                Berat (BB)
              </span>

            </div>

            <p className="mt-3 text-2xl font-extrabold sm:text-3xl">
              5.0 kg
            </p>

            <span className="mt-2 inline-block rounded-full bg-[#dcf7e3] px-3 py-1 text-xs font-bold text-[#248044] sm:text-sm">
              Normal
            </span>

          </div>


          {/* TB */}

          <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-center gap-3 text-slate-500">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <Ruler size={20} />
              </div>

              <span className="text-sm font-medium sm:text-base">
                Tinggi (TB)
              </span>

            </div>

            <p className="mt-3 text-2xl font-extrabold sm:text-3xl">
              70.0 cm
            </p>

            <span className="mt-2 inline-block rounded-full bg-[#ffe1e1] px-3 py-1 text-xs font-bold text-[#b83232] sm:text-sm">
              Stunting
            </span>

          </div>

        </section>


        {/* =================================================
            GRAFIK WHO
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">

          {/* Header */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <h2 className="text-xl font-extrabold sm:text-2xl">
                Grafik Standar WHO
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Tinggi Badan menurut Umur (TB/U)
              </p>

            </div>


            {/* Toggle */}

            <div className="flex rounded-full bg-slate-100 p-1">

              <button
                type="button"
                className="rounded-full bg-[#176b26] px-4 py-2 text-xs font-bold text-white sm:text-sm"
              >
                TB/U
              </button>

              <button
                type="button"
                className="rounded-full px-4 py-2 text-xs font-bold text-slate-600 sm:text-sm"
              >
                BB/U
              </button>

            </div>

          </div>


          {/* Warning */}

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

            <AlertTriangle
              size={21}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div>

              <p className="font-bold text-red-700">
                Stunting
              </p>

              <p className="text-sm text-slate-500">
                Z-score: -2.43 SD • Pantau tiap bulan
              </p>

            </div>

          </div>


          {/* Chart */}

          <div className="mt-6 overflow-hidden">

            <div className="w-full min-w-[620px]">

              <svg
                viewBox="0 0 900 360"
                className="h-auto w-full"
                preserveAspectRatio="none"
              >

                {/* Grid */}

                {[60, 110, 160, 210, 260, 310].map((y) => (
                  <line
                    key={y}
                    x1="65"
                    y1={y}
                    x2="860"
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {[120, 280, 440, 600, 760].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="45"
                    x2={x}
                    y2="315"
                    stroke="#cbd5e1"
                    strokeDasharray="8 8"
                    strokeWidth="1.5"
                  />
                ))}


                {/* Label Y */}

                <text x="10" y="65" fontSize="14" fill="#9ca3af">
                  98
                </text>

                <text x="10" y="115" fontSize="14" fill="#9ca3af">
                  90
                </text>

                <text x="10" y="165" fontSize="14" fill="#9ca3af">
                  84
                </text>

                <text x="10" y="215" fontSize="14" fill="#9ca3af">
                  78
                </text>

                <text x="10" y="265" fontSize="14" fill="#9ca3af">
                  72
                </text>

                <text x="10" y="315" fontSize="14" fill="#9ca3af">
                  66
                </text>


                {/* Median WHO */}

                <path
                  d="M65 285 C180 220 260 185 360 150 C470 112 600 100 700 75 C760 65 810 48 860 30"
                  fill="none"
                  stroke="#f0a000"
                  strokeWidth="4"
                />


                {/* Ambang */}

                <path
                  d="M65 320 C180 265 260 225 360 195 C470 165 600 150 700 130 C770 118 820 98 860 85"
                  fill="none"
                  stroke="#d63c3c"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                />


                {/* Data anak */}

                <circle
                  cx="120"
                  cy="270"
                  r="9"
                  fill="#176b26"
                />


                {/* X labels */}

                <text x="60" y="345" fontSize="13" fill="#9ca3af">
                  6 bln
                </text>

                <text x="110" y="345" fontSize="13" fill="#9ca3af">
                  12 bln
                </text>

                <text x="265" y="345" fontSize="13" fill="#9ca3af">
                  18 bln
                </text>

                <text x="425" y="345" fontSize="13" fill="#9ca3af">
                  24 bln
                </text>

                <text x="585" y="345" fontSize="13" fill="#9ca3af">
                  30 bln
                </text>

                <text x="745" y="345" fontSize="13" fill="#9ca3af">
                  36 bln
                </text>

              </svg>

            </div>

          </div>


          {/* Legend */}

          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:text-sm">

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#176b26]" />
              Garis ahmad
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#f0a000]" />
              Median WHO
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-red-500" />
              Ambang Stunting
            </span>

          </div>

        </section>


        {/* =================================================
            PEDOMAN MPASI
        ================================================= */}

        <section className="mt-5 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff4c7] text-[#d69600]">
                <BookOpen size={24} />
              </div>

              <div>

                <h2 className="text-lg font-extrabold sm:text-xl">
                  Pedoman Gizi MPASI
                </h2>

                <p className="text-sm text-slate-500 sm:text-base">
                  Standar Kemenkes RI untuk Usia 12 Bulan
                </p>

              </div>

            </div>

            <span className="self-start rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 sm:text-sm">
              2 Porsi/Hari
            </span>

          </div>


          <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
            Prioritas Percepatan Tinggi: Berikan minimal 2 porsi
            protein hewani setiap hari untuk mengejar ketertinggalan
            pertumbuhan & kepadatan tulang.
          </p>

        </section>


        {/* =================================================
            REKOMENDASI MAKANAN
        ================================================= */}

        <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Telur */}

          <FoodCard
            icon={<Egg size={25} />}
            title="Telur Ayam"
            subtitle="Kolin & DHA"
            bg="bg-[#fff2b8]"
          />

          {/* Ikan */}

          <FoodCard
            icon={<Fish size={25} />}
            title="Ikan Kembung"
            subtitle="Omega-3 & Kalium"
            bg="bg-[#dbeeff]"
          />

          {/* Daging */}

          <FoodCard
            icon={<Beef size={25} />}
            title="Daging Sapi"
            subtitle="Zat Besi Heme"
            bg="bg-[#ffe0e0]"
          />

        </section>


        {/* =================================================
            UPDATE BUTTON
        ================================================= */}

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#176b26] px-5 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#12591f] sm:text-base lg:text-lg"
        >
          <Pencil size={20} />
          Perbarui Data Pengukuran (Catat BB/TB)
        </button>

      </main>

    </div>
  );
}


/* =========================================================
   FOOD CARD
========================================================= */

function FoodCard({
  icon,
  title,
  subtitle,
  bg,
}) {
  return (
    <article className="rounded-[22px] border border-slate-100 bg-white p-5 text-center shadow-sm">

      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${bg} text-[#263238]`}
      >
        {icon}
      </div>

      <h3 className="mt-3 font-bold sm:text-lg">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400 sm:text-base">
        {subtitle}
      </p>

    </article>
  );
}

export default SiKecil;