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

/* =========================================================
   DATA ANAK
========================================================= */

const dataAnak = {
  nama: "Anes",
  tanggalLahir: "2025-09-22",
  jenisKelamin: "Laki-laki",
  golonganDarah: "O+",
};


/* =========================================================
   FUNGSI FORMAT TANGGAL
========================================================= */

function formatTanggalIndonesia(tanggal) {
  const date = new Date(`${tanggal}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}


/* =========================================================
   HITUNG UMUR DALAM BULAN
========================================================= */

function hitungUmurBulan(tanggalLahir) {
  const lahir = new Date(`${tanggalLahir}T00:00:00`);
  const sekarang = new Date();

  let umurBulan =
    (sekarang.getFullYear() - lahir.getFullYear()) * 12 +
    (sekarang.getMonth() - lahir.getMonth());

  // Kalau tanggal hari ini belum mencapai tanggal lahir
  // pada bulan berjalan, kurangi 1 bulan.
  if (sekarang.getDate() < lahir.getDate()) {
    umurBulan--;
  }

  return Math.max(0, umurBulan);
}


/* =========================================================
   KOMPONEN SI KECIL
========================================================= */

function SiKecil() {
  const navigate = useNavigate();

  /* =======================================================
     DATA DINAMIS
  ======================================================= */

  const umurBulan = hitungUmurBulan(dataAnak.tanggalLahir);

  const tanggalLahirFormatted = formatTanggalIndonesia(
    dataAnak.tanggalLahir
  );


  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f9f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">

        <div className="mx-auto flex min-h-[68px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-[76px] lg:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#202833] transition hover:bg-slate-100 sm:h-10 sm:w-10"
              aria-label="Kembali"
            >
              <ArrowLeft size={23} />
            </button>

            <div className="min-w-0">

              {/* JUDUL HALAMAN: 18–20px */}

              <h1 className="truncate font-playfair text-lg font-bold text-[#23652d] sm:text-xl">
                Si Kecil
              </h1>

            </div>

          </div>


          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">

            <button
              type="button"
              onClick={() => navigate("/notifikasi")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 sm:h-10 sm:w-10"
              aria-label="Notifikasi"
            >
              <Bell size={20} />

              {/* CAPTION: 10px */}

              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                2
              </span>

            </button>


            <button
              type="button"
              onClick={() => navigate("/profil")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f5e9] text-[#176324] transition hover:bg-[#d8eddc] sm:h-10 sm:w-10"
              aria-label="Profil"
            >
              <UserCircle size={22} />
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-8 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-6">

        {/* =================================================
            DATA ANAK
        ================================================= */}

        <section className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[22px] sm:p-5 lg:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            {/* Avatar */}

            <div className="relative mx-auto sm:mx-0">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f6e9] text-[#176b26] sm:h-20 sm:w-20">

                <UserCircle
                  size={40}
                  strokeWidth={1.8}
                  className="sm:hidden"
                />

                <UserCircle
                  size={48}
                  strokeWidth={1.8}
                  className="hidden sm:block"
                />

              </div>

              <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#176b26] text-white ring-2 ring-white">
                <CheckCircle2 size={13} />
              </span>

            </div>


            {/* Info */}

            <div className="min-w-0 flex-1 text-center sm:text-left">

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">

                {/* JUDUL NAMA: 18–20px */}

                <h2 className="text-lg font-extrabold sm:text-xl">
                  {dataAnak.nama}
                </h2>


                {/* CAPTION: 11px */}

                <span className="inline-flex items-center gap-1 rounded-full bg-[#dcf7e3] px-2.5 py-1 text-[11px] font-bold text-[#248044]">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#20a64a]" />

                  Aktif

                </span>

              </div>


              {/* UMUR OTOMATIS */}

              <p className="mt-1 text-[13px] text-slate-500">

                {umurBulan} Bulan ({dataAnak.jenisKelamin})

              </p>


              {/* Info chips */}

              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">

                {/* TANGGAL LAHIR */}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">

                  <CalendarDays size={14} />

                  {tanggalLahirFormatted}

                </span>


                {/* GOLONGAN DARAH */}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">

                  <Droplets size={14} />

                  Gol. {dataAnak.golonganDarah}

                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            BB / TB
        ================================================= */}

        <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* BB */}

          <div className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center gap-2.5 text-slate-500">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                <Weight size={18} />
              </div>

              {/* JUDUL CARD: 13px */}

              <span className="text-[13px] font-medium">
                Berat (BB)
              </span>

            </div>


            {/* ANGKA UTAMA: 22–26px */}

            <p className="mt-2 text-[22px] font-extrabold sm:text-[26px]">
              5.0 kg
            </p>


            {/* CAPTION: 11px */}

            <span className="mt-1.5 inline-block rounded-full bg-[#dcf7e3] px-2.5 py-1 text-[11px] font-bold text-[#248044]">
              Normal
            </span>

          </div>


          {/* TB */}

          <div className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-center gap-2.5 text-slate-500">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                <Ruler size={18} />
              </div>

              {/* JUDUL CARD: 13px */}

              <span className="text-[13px] font-medium">
                Tinggi (TB)
              </span>

            </div>


            {/* ANGKA UTAMA: 22–26px */}

            <p className="mt-2 text-[22px] font-extrabold sm:text-[26px]">
              70.0 cm
            </p>


            {/* CAPTION: 11px */}

            <span className="mt-1.5 inline-block rounded-full bg-[#ffe1e1] px-2.5 py-1 text-[11px] font-bold text-[#b83232]">
              Stunting
            </span>

          </div>

        </section>


        {/* =================================================
            GRAFIK WHO
        ================================================= */}

        <section className="mt-4 rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-6">

          {/* Header */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div>

              {/* JUDUL SECTION: 15–16px */}

              <h2 className="text-[15px] font-extrabold sm:text-base">
                Grafik Standar WHO
              </h2>


              {/* ISI: 13px */}

              <p className="mt-1 text-[13px] text-slate-500">
                Tinggi Badan menurut Umur (TB/U)
              </p>

            </div>


            {/* Toggle */}

            <div className="flex rounded-full bg-slate-100 p-1">

              {/* BUTTON: 11px */}

              <button
                type="button"
                className="rounded-full bg-[#176b26] px-3 py-1.5 text-[11px] font-bold text-white"
              >
                TB/U
              </button>

              <button
                type="button"
                className="rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-600"
              >
                BB/U
              </button>

            </div>

          </div>


          {/* Warning */}

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">

            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div>

              {/* JUDUL CARD: 13px */}

              <p className="text-[13px] font-bold text-red-700">
                Stunting
              </p>


              {/* ISI CARD: 12px */}

              <p className="text-xs text-slate-500">
                Z-score: -2.43 SD • Pantau tiap bulan
              </p>

            </div>

          </div>


          {/* Chart */}

          <div className="mt-5 overflow-hidden">

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

                <text x="10" y="65" fontSize="11" fill="#9ca3af">
                  98
                </text>

                <text x="10" y="115" fontSize="11" fill="#9ca3af">
                  90
                </text>

                <text x="10" y="165" fontSize="11" fill="#9ca3af">
                  84
                </text>

                <text x="10" y="215" fontSize="11" fill="#9ca3af">
                  78
                </text>

                <text x="10" y="265" fontSize="11" fill="#9ca3af">
                  72
                </text>

                <text x="10" y="315" fontSize="11" fill="#9ca3af">
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

                <text x="60" y="345" fontSize="11" fill="#9ca3af">
                  6 bln
                </text>

                <text x="110" y="345" fontSize="11" fill="#9ca3af">
                  12 bln
                </text>

                <text x="265" y="345" fontSize="11" fill="#9ca3af">
                  18 bln
                </text>

                <text x="425" y="345" fontSize="11" fill="#9ca3af">
                  24 bln
                </text>

                <text x="585" y="345" fontSize="11" fill="#9ca3af">
                  30 bln
                </text>

                <text x="745" y="345" fontSize="11" fill="#9ca3af">
                  36 bln
                </text>

              </svg>

            </div>

          </div>


          {/* Legend */}

          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 sm:text-xs">

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#176b26]" />
              Garis ahmad
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f0a000]" />
              Median WHO
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-red-500" />
              Ambang Stunting
            </span>

          </div>

        </section>


        {/* =================================================
            PEDOMAN MPASI
        ================================================= */}

        <section className="mt-4 rounded-[20px] border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff4c7] text-[#d69600]">
                <BookOpen size={21} />
              </div>

              <div>

                {/* JUDUL SECTION: 15–16px */}

                <h2 className="text-[15px] font-extrabold sm:text-base">
                  Pedoman Gizi MPASI
                </h2>


                {/* ISI: 12px */}

                <p className="text-xs text-slate-500">
                  Standar Kemenkes RI untuk Usia {umurBulan} Bulan
                </p>

              </div>

            </div>


            {/* CAPTION: 11px */}

            <span className="self-start rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700">
              2 Porsi/Hari
            </span>

          </div>


          {/* ISI CARD: 13px */}

          <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
            Prioritas Percepatan Tinggi: Berikan minimal 2 porsi
            protein hewani setiap hari untuk mengejar ketertinggalan
            pertumbuhan & kepadatan tulang.
          </p>

        </section>


        {/* =================================================
            REKOMENDASI MAKANAN
        ================================================= */}

        <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* Telur */}

          <FoodCard
            icon={<Egg size={22} />}
            title="Telur Ayam"
            subtitle="Kolin & DHA"
            bg="bg-[#fff2b8]"
          />


          {/* Ikan */}

          <FoodCard
            icon={<Fish size={22} />}
            title="Ikan Kembung"
            subtitle="Omega-3 & Kalium"
            bg="bg-[#dbeeff]"
          />


          {/* Daging */}

          <FoodCard
            icon={<Beef size={22} />}
            title="Daging Sapi"
            subtitle="Zat Besi Heme"
            bg="bg-[#ffe0e0]"
          />

        </section>


        {/* =================================================
            UPDATE BUTTON
        ================================================= */}

        {/* BUTTON: 12–13px */}

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#176b26] px-4 py-3 text-[13px] font-extrabold text-white shadow-sm transition hover:bg-[#12591f]"
        >
          <Pencil size={18} />

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
    <article className="rounded-[18px] border border-slate-100 bg-white p-4 text-center shadow-sm">

      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${bg} text-[#263238]`}
      >
        {icon}
      </div>


      {/* JUDUL CARD: 13–14px */}

      <h3 className="mt-2 text-[13px] font-bold sm:text-sm">
        {title}
      </h3>


      {/* ISI CARD: 11–12px */}

      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
        {subtitle}
      </p>

    </article>
  );
}

export default SiKecil;