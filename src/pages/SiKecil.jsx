import { useState } from "react";
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
  X,
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
    STATE GRAFIK WHO
  ======================================================= */

  const [indikatorGrafik, setIndikatorGrafik] = useState("tbu");

  /* =======================================================
    STATE MODAL PENGUKURAN
  ======================================================= */

  const [showModalPengukuran, setShowModalPengukuran] =
    useState(false);

  const [tanggalPengukuran, setTanggalPengukuran] =
    useState("2026-10-06");

  const [beratBadan, setBeratBadan] = useState("9.8");

  const [tinggiBadan, setTinggiBadan] = useState("76.5");

  /* =======================================================
    DATA SEBELUMNYA
  ======================================================= */

  const [dataSebelumnya] = useState({
    berat: "9.5",
    tinggi: "75.8",
  });

  /* =======================================================
    DATA DINAMIS
  ======================================================= */

  const umurBulan = hitungUmurBulan(dataAnak.tanggalLahir);

  const tanggalLahirFormatted = formatTanggalIndonesia(
    dataAnak.tanggalLahir
  );

  /* =======================================================
    SIMPAN DATA PENGUKURAN
  ======================================================= */

  const handleSimpanPengukuran = () => {
    setShowModalPengukuran(false);
  };

  /* =======================================================
    DATA GRAFIK BERDASARKAN INDIKATOR
  ======================================================= */

  const grafikTB = {
    judul: "Tinggi Badan menurut Umur (TB/U)",
    status: "Stunting",
    zScore: "-2.43 SD",
    keterangan: "Pantau tiap bulan",
    dataLabel: "Data Anes",
    medianLabel: "Median WHO",
    ambangLabel: "Ambang Stunting",
  };

  const grafikBB = {
    judul: "Berat Badan menurut Umur (BB/U)",
    status: "Berat Badan Kurang",
    zScore: "-1.85 SD",
    keterangan: "Pantau berat badan secara berkala.",
    dataLabel: "Data Anes",
    medianLabel: "Median WHO",
    ambangLabel: "Ambang",
  };

  const grafikAktif =
    indikatorGrafik === "tbu" ? grafikTB : grafikBB;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f9f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">

        <div className="mx-auto flex min-h-[64px] w-full max-w-[1250px] items-center justify-between gap-3 px-4 sm:min-h-[68px] sm:px-5 lg:px-6">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#202833] transition hover:bg-slate-100 sm:h-10 sm:w-10"
              aria-label="Kembali"
            >
              <ArrowLeft size={22} />
            </button>

            <div className="min-w-0">

              <h1 className="truncate font-playfair text-lg font-bold text-[#23652d] sm:text-xl">
                Si Kecil
              </h1>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">

            {/* NOTIFIKASI */}

            <button
              type="button"
              onClick={() => navigate("/notifikasi")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 sm:h-10 sm:w-10"
              aria-label="Notifikasi"
            >
              <Bell size={20} />

              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                2
              </span>
            </button>

            {/* PROFIL */}

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

      <main className="mx-auto w-full max-w-[1250px] px-4 pb-8 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">

        {/* =================================================
            DATA ANAK
        ================================================= */}

        <section className="rounded-[18px] border border-slate-100 bg-white px-4 py-3.5 shadow-sm sm:rounded-[20px] sm:px-5 sm:py-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* AVATAR */}

            <div className="relative mx-auto sm:mx-0">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f6e9] text-[#176b26] sm:h-16 sm:w-16">

                <UserCircle
                  size={36}
                  strokeWidth={1.8}
                  className="sm:hidden"
                />

                <UserCircle
                  size={42}
                  strokeWidth={1.8}
                  className="hidden sm:block"
                />

              </div>

              <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#176b26] text-white ring-2 ring-white">

                <CheckCircle2 size={12} />

              </span>

            </div>

            {/* INFO */}

            <div className="min-w-0 flex-1 text-center sm:text-left">

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">

                <h2 className="text-lg font-extrabold sm:text-xl">
                  {dataAnak.nama}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-[#dcf7e3] px-2.5 py-1 text-[11px] font-bold text-[#248044]">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#20a64a]" />

                  Aktif

                </span>

              </div>

              {/* UMUR */}

              <p className="mt-0.5 text-[13px] text-slate-500">

                {umurBulan} Bulan ({dataAnak.jenisKelamin})

              </p>

              {/* INFO CHIPS */}

              <div className="mt-1.5 flex flex-wrap justify-center gap-2 sm:justify-start">

                {/* TANGGAL LAHIR */}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">

                  <CalendarDays size={13} />

                  {tanggalLahirFormatted}

                </span>

                {/* GOLONGAN DARAH */}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">

                  <Droplets size={13} />

                  Gol. {dataAnak.golonganDarah}

                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            BB / TB
        ================================================= */}

        <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* BB */}

          <div className="rounded-[16px] border border-slate-100 bg-white p-3.5 shadow-sm sm:p-4">

            <div className="flex items-center gap-2.5 text-slate-500">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">

                <Weight size={17} />

              </div>

              <span className="text-[13px] font-medium">
                Berat (BB)
              </span>

            </div>

            <p className="mt-1.5 text-[21px] font-extrabold sm:text-[24px]">
              {beratBadan} kg
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                indikatorGrafik === "bbu"
                  ? "bg-[#fff1bf] text-[#b57c00]"
                  : "bg-[#dcf7e3] text-[#248044]"
              }`}
            >
              {indikatorGrafik === "bbu"
                ? "Perlu Dipantau"
                : "Normal"}
            </span>

          </div>

          {/* TB */}

          <div className="rounded-[16px] border border-slate-100 bg-white p-3.5 shadow-sm sm:p-4">

            <div className="flex items-center gap-2.5 text-slate-500">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">

                <Ruler size={17} />

              </div>

              <span className="text-[13px] font-medium">
                Tinggi (TB)
              </span>

            </div>

            <p className="mt-1.5 text-[21px] font-extrabold sm:text-[24px]">
              {tinggiBadan} cm
            </p>

            <span className="mt-1 inline-block rounded-full bg-[#ffe1e1] px-2.5 py-1 text-[11px] font-bold text-[#b83232]">
              Stunting
            </span>

          </div>

        </section>

        {/* =================================================
            GRAFIK WHO
        ================================================= */}

        <section className="mt-3 rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">

          {/* HEADER */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <h2 className="text-[15px] font-extrabold sm:text-base">
                Grafik Standar WHO
              </h2>

              <p className="mt-1 text-[13px] text-slate-500">
                {grafikAktif.judul}
              </p>

            </div>

            {/* TOGGLE */}

            <div className="flex self-start rounded-full bg-slate-100 p-1">

              {/* TB/U */}

              <button
                type="button"
                onClick={() => setIndikatorGrafik("tbu")}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                  indikatorGrafik === "tbu"
                    ? "bg-[#176b26] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                TB/U
              </button>

              {/* BB/U */}

              <button
                type="button"
                onClick={() => setIndikatorGrafik("bbu")}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                  indikatorGrafik === "bbu"
                    ? "bg-[#176b26] text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                BB/U
              </button>

            </div>

          </div>

          {/* =================================================
              WARNING
          ================================================= */}

          <div
            className={`mt-3 flex items-start gap-2.5 rounded-xl border p-2.5 ${
              indikatorGrafik === "bbu"
                ? "border-amber-200 bg-amber-50"
                : "border-red-200 bg-red-50"
            }`}
          >

            <AlertTriangle
              size={18}
              className={`mt-0.5 shrink-0 ${
                indikatorGrafik === "bbu"
                  ? "text-amber-500"
                  : "text-red-500"
              }`}
            />

            <div>

              <p
                className={`text-[13px] font-bold ${
                  indikatorGrafik === "bbu"
                    ? "text-amber-700"
                    : "text-red-700"
                }`}
              >
                {indikatorGrafik === "bbu"
                  ? "Status Berat Badan"
                  : "Stunting"}
              </p>

              <p className="text-xs text-slate-500">
                Z-score: {grafikAktif.zScore}
                {" • "}
                {grafikAktif.keterangan}
              </p>

            </div>

          </div>

          {/* =================================================
              CHART
          ================================================= */}

          <div className="mt-4 overflow-x-auto overflow-y-hidden">

            <div className="w-full min-w-[620px]">

              {indikatorGrafik === "tbu" ? (

                /* =================================================
                   GRAFIK TB/U
                ================================================= */

                <svg
                  viewBox="0 0 900 320"
                  className="h-auto w-full"
                  preserveAspectRatio="none"
                >

                  {[55, 105, 155, 205, 255, 305].map((y) => (
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
                      y1="40"
                      x2={x}
                      y2="305"
                      stroke="#cbd5e1"
                      strokeDasharray="8 8"
                      strokeWidth="1.5"
                    />
                  ))}

                  <text x="10" y="60" fontSize="11" fill="#9ca3af">
                    98
                  </text>

                  <text x="10" y="110" fontSize="11" fill="#9ca3af">
                    90
                  </text>

                  <text x="10" y="160" fontSize="11" fill="#9ca3af">
                    84
                  </text>

                  <text x="10" y="210" fontSize="11" fill="#9ca3af">
                    78
                  </text>

                  <text x="10" y="260" fontSize="11" fill="#9ca3af">
                    72
                  </text>

                  <text x="10" y="308" fontSize="11" fill="#9ca3af">
                    66
                  </text>

                  <path
                    d="M65 275 C180 215 260 180 360 145 C470 107 600 95 700 70 C760 60 810 43 860 25"
                    fill="none"
                    stroke="#f0a000"
                    strokeWidth="4"
                  />

                  <path
                    d="M65 310 C180 255 260 220 360 190 C470 160 600 145 700 125 C770 113 820 93 860 80"
                    fill="none"
                    stroke="#d63c3c"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                  />

                  <circle
                    cx="120"
                    cy="260"
                    r="9"
                    fill="#176b26"
                  />

                  <text
                    x="60"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    6 bln
                  </text>

                  <text
                    x="110"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    12 bln
                  </text>

                  <text
                    x="265"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    18 bln
                  </text>

                  <text
                    x="425"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    24 bln
                  </text>

                  <text
                    x="585"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    30 bln
                  </text>

                  <text
                    x="745"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    36 bln
                  </text>

                </svg>

              ) : (

                /* =================================================
                   GRAFIK BB/U
                ================================================= */

                <svg
                  viewBox="0 0 900 320"
                  className="h-auto w-full"
                  preserveAspectRatio="none"
                >

                  {[55, 105, 155, 205, 255, 305].map((y) => (
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
                      y1="40"
                      x2={x}
                      y2="305"
                      stroke="#cbd5e1"
                      strokeDasharray="8 8"
                      strokeWidth="1.5"
                    />
                  ))}

                  <text
                    x="15"
                    y="60"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    100
                  </text>

                  <text
                    x="15"
                    y="110"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    90
                  </text>

                  <text
                    x="15"
                    y="160"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    80
                  </text>

                  <text
                    x="15"
                    y="210"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    70
                  </text>

                  <text
                    x="15"
                    y="260"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    60
                  </text>

                  <text
                    x="15"
                    y="308"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    50
                  </text>

                  {/* MEDIAN WHO */}

                  <path
                    d="M65 270 C150 250 210 225 280 205 C370 178 450 150 540 120 C640 90 750 65 860 42"
                    fill="none"
                    stroke="#176b26"
                    strokeWidth="4"
                  />

                  {/* AMBANG */}

                  <path
                    d="M65 300 C150 285 220 265 300 245 C390 220 480 195 570 165 C670 135 760 110 860 90"
                    fill="none"
                    stroke="#d63c3c"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                  />

                  {/* DATA ANAK */}

                  <circle
                    cx="120"
                    cy="265"
                    r="9"
                    fill="#176b26"
                  />

                  <text
                    x="60"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    6 bln
                  </text>

                  <text
                    x="110"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    12 bln
                  </text>

                  <text
                    x="265"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    18 bln
                  </text>

                  <text
                    x="425"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    24 bln
                  </text>

                  <text
                    x="585"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    30 bln
                  </text>

                  <text
                    x="745"
                    y="315"
                    fontSize="11"
                    fill="#9ca3af"
                  >
                    36 bln
                  </text>

                </svg>

              )}

            </div>

          </div>

          {/* =================================================
              LEGEND
          ================================================= */}

          <div className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 sm:text-xs">

            <span className="flex items-center gap-1.5">

              <span className="h-2.5 w-2.5 rounded-full bg-[#176b26]" />

              {grafikAktif.dataLabel}

            </span>

            <span className="flex items-center gap-1.5">

              <span
                className={`h-0.5 w-5 ${
                  indikatorGrafik === "bbu"
                    ? "bg-[#176b26]"
                    : "bg-[#f0a000]"
                }`}
              />

              {grafikAktif.medianLabel}

            </span>

            <span className="flex items-center gap-1.5">

              <span className="h-0.5 w-5 border-t-2 border-dashed border-red-500" />

              {grafikAktif.ambangLabel}

            </span>

          </div>

        </section>

        {/* =================================================
            PEDOMAN MPASI
        ================================================= */}

        <section className="mt-3 rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff4c7] text-[#d69600]">

                <BookOpen size={20} />

              </div>

              <div>

                <h2 className="text-[15px] font-extrabold sm:text-base">
                  Pedoman Gizi MPASI
                </h2>

                <p className="text-xs text-slate-500">
                  Standar Kemenkes RI untuk Usia {umurBulan} Bulan
                </p>

              </div>

            </div>

            <span className="self-start rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700">
              2 Porsi/Hari
            </span>

          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-slate-600">

            Prioritas Percepatan Tinggi: Berikan minimal 2 porsi
            protein hewani setiap hari untuk mengejar ketertinggalan
            pertumbuhan & kepadatan tulang.

          </p>

        </section>

        {/* =================================================
            REKOMENDASI MAKANAN
        ================================================= */}

        <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <FoodCard
            icon={<Egg size={20} />}
            title="Telur Ayam"
            subtitle="Kolin & DHA"
            bg="bg-[#fff2b8]"
          />

          <FoodCard
            icon={<Fish size={20} />}
            title="Ikan Kembung"
            subtitle="Omega-3 & Kalium"
            bg="bg-[#dbeeff]"
          />

          <FoodCard
            icon={<Beef size={20} />}
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
          onClick={() => setShowModalPengukuran(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#176b26] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-sm transition hover:bg-[#12591f]"
        >

          <Pencil size={17} />

          Perbarui Data Pengukuran (Catat BB/TB)

        </button>

      </main>

      {/* =====================================================
          MODAL PERBARUI DATA PENGUKURAN
      ===================================================== */}

      {showModalPengukuran && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModalPengukuran(false);
            }
          }}
        >

          {/* =================================================
              MODAL CARD
          ================================================= */}

          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] bg-white shadow-2xl sm:max-w-[500px] sm:rounded-[22px]">

            {/* HEADER MODAL */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">

              <h2 className="text-base font-extrabold text-[#202833] sm:text-lg">
                Perbarui Data Pengukuran
              </h2>

              <button
                type="button"
                onClick={() => setShowModalPengukuran(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup"
              >
                <X size={19} />
              </button>

            </div>

            {/* ISI MODAL */}

            <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">

              {/* DATA ANAK */}

              <div className="mb-4">

                <p className="text-[15px] font-extrabold text-[#202833]">
                  Rayyan Pratara
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  18 Bulan
                </p>

              </div>

              {/* TANGGAL PENGUKURAN */}

              <div className="mb-4">

                <label
                  htmlFor="tanggalPengukuran"
                  className="mb-1.5 block text-[12px] font-bold text-slate-700"
                >
                  Tanggal Pengukuran
                </label>

                <div className="relative">

                  <input
                    id="tanggalPengukuran"
                    type="date"
                    value={tanggalPengukuran}
                    onChange={(e) =>
                      setTanggalPengukuran(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-10 text-[13px] font-medium text-slate-700 outline-none transition focus:border-[#176b26] focus:ring-2 focus:ring-[#176b26]/10"
                  />

                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

              </div>

              {/* BERAT BADAN */}

              <div className="mb-4">

                <label
                  htmlFor="beratBadan"
                  className="mb-1.5 block text-[12px] font-bold text-slate-700"
                >
                  Berat Badan
                </label>

                <div className="relative">

                  <input
                    id="beratBadan"
                    type="number"
                    step="0.1"
                    min="0"
                    value={beratBadan}
                    onChange={(e) =>
                      setBeratBadan(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-12 text-[14px] font-semibold text-slate-700 outline-none transition focus:border-[#176b26] focus:ring-2 focus:ring-[#176b26]/10"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    kg
                  </span>

                </div>

              </div>

              {/* TINGGI BADAN */}

              <div className="mb-5">

                <label
                  htmlFor="tinggiBadan"
                  className="mb-1.5 block text-[12px] font-bold text-slate-700"
                >
                  Tinggi Badan
                </label>

                <div className="relative">

                  <input
                    id="tinggiBadan"
                    type="number"
                    step="0.1"
                    min="0"
                    value={tinggiBadan}
                    onChange={(e) =>
                      setTinggiBadan(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-12 text-[14px] font-semibold text-slate-700 outline-none transition focus:border-[#176b26] focus:ring-2 focus:ring-[#176b26]/10"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    cm
                  </span>

                </div>

              </div>

              {/* GARIS */}

              <div className="border-t border-slate-200 pt-4">

                {/* DATA SEBELUMNYA */}

                <p className="text-[12px] font-bold text-slate-600">
                  Data sebelumnya
                </p>

                <div className="mt-2 flex items-center gap-6">

                  <div>

                    <p className="text-[11px] text-slate-400">
                      BB
                    </p>

                    <p className="mt-0.5 text-[13px] font-bold text-slate-700">
                      {dataSebelumnya.berat} kg
                    </p>

                  </div>

                  <div>

                    <p className="text-[11px] text-slate-400">
                      TB
                    </p>

                    <p className="mt-0.5 text-[13px] font-bold text-slate-700">
                      {dataSebelumnya.tinggi} cm
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTON SIMPAN */}

              <button
                type="button"
                onClick={handleSimpanPengukuran}
                className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[#176b26] px-4 text-[13px] font-extrabold text-white transition hover:bg-[#12591f] active:scale-[0.99]"
              >
                Simpan Pengukuran
              </button>

            </div>

          </div>

        </div>
      )}

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
    <article className="rounded-[16px] border border-slate-100 bg-white p-3 text-center shadow-sm">

      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg ${bg} text-[#263238]`}
      >
        {icon}
      </div>

      <h3 className="mt-2 text-[13px] font-bold sm:text-sm">
        {title}
      </h3>

      <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
        {subtitle}
      </p>

    </article>
  );
}

export default SiKecil;