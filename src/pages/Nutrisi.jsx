import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  UserCircle,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Apple,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

/* =========================================================
   DATA MINGGUAN
========================================================= */

const dataMingguan = {
  periode: "30 Sep - 6 Okt 2026",
  rataRata: 84,

  harian: [
    { hari: "Sen", nilai: 78 },
    { hari: "Sel", nilai: 91 },
    { hari: "Rab", nilai: 86 },
    { hari: "Kam", nilai: 82 },
    { hari: "Jum", nilai: 88 },
    { hari: "Sab", nilai: 79 },
    { hari: "Min", nilai: 84 },
  ],

  nutrisi: [
    {
      nama: "Kalori",
      nilai: "1.020 kcal",
      persen: 91,
      icon: Flame,
      iconBg: "bg-[#fff0df]",
      iconColor: "text-[#e88b00]",
    },
    {
      nama: "Protein",
      nilai: "38.5 g",
      persen: 86,
      icon: Beef,
      iconBg: "bg-[#ffe1e1]",
      iconColor: "text-[#bd3838]",
    },
    {
      nama: "Lemak",
      nilai: "32.1 g",
      persen: 78,
      icon: Droplets,
      iconBg: "bg-[#dceeff]",
      iconColor: "text-[#3b78ae]",
    },
  ],

  ringkasan: [
    {
      nama: "Kalori",
      persen: 91,
    },
    {
      nama: "Protein",
      persen: 86,
    },
    {
      nama: "Karbohidrat",
      persen: 89,
    },
    {
      nama: "Lemak",
      persen: 78,
    },
    {
      nama: "Serat",
      persen: 82,
    },
  ],
};

/* =========================================================
   DATA TREN BULANAN
========================================================= */

const dataTrenBulanan = {
  bulan: "Oktober 2026",

  minggu: [
    {
      nama: "M1",
      nilai: 78,
    },
    {
      nama: "M2",
      nilai: 84,
    },
    {
      nama: "M3",
      nilai: 89,
    },
    {
      nama: "M4",
      nilai: 91,
    },
    {
      nama: "M5",
      nilai: 94,
    },
  ],

  perbandingan: [
    {
      nama: "Kalori",
      data: [78, 84, 89, 91],
    },
    {
      nama: "Protein",
      data: [72, 79, 83, 86],
    },
    {
      nama: "Karbo",
      data: [81, 85, 87, 89],
    },
    {
      nama: "Lemak",
      data: [70, 74, 76, 78],
    },
    {
      nama: "Serat",
      data: [75, 77, 80, 82],
    },
  ],
};


/* =========================================================
   NUTRISI
========================================================= */

function Nutrisi() {
  const navigate = useNavigate();

  /* =======================================================
     TAB AKTIF
  ======================================================= */

  const [tabAktif, setTabAktif] = useState("Harian");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eaf8ec] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#d9eadb] bg-[#eaf8ec]/95 backdrop-blur-md">

        <div
          className="
            mx-auto
            flex
            min-h-[60px]
            w-full
            max-w-[1500px]
            items-center
            justify-between
            gap-3
            px-4
            sm:min-h-[64px]
            sm:px-6
            lg:px-8
          "
        >

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-2">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[#202833]
                transition
                hover:bg-white/70
                active:scale-95
                sm:h-10
                sm:w-10
              "
              aria-label="Kembali"
            >
              <ArrowLeft size={21} strokeWidth={2} />
            </button>

            <h1
              className="
                truncate
                font-playfair
                text-xl
                font-bold
                text-[#23652d]
                sm:text-2xl
              "
            >
              Nutrisi
            </h1>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-1 sm:gap-2">

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
                hover:bg-white/70
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
                bg-white
                text-[#176324]
                transition
                hover:bg-[#e0f1e3]
                sm:h-10
                sm:w-10
              "
              aria-label="Profil"
            >
              <UserCircle size={21} />
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          pb-10
          pt-4
          sm:px-6
          sm:pt-5
          lg:px-8
          lg:pt-6
        "
      >

        {/* =================================================
            HERO NUTRISI
        ================================================= */}

        <section
          className="
            rounded-[20px]
            bg-gradient-to-br
            from-[#1f742b]
            to-[#2d8b37]
            p-4
            text-white
            shadow-sm
            sm:rounded-[22px]
            sm:p-5
            lg:p-6
          "
        >

          <h2
            className="
              text-lg
              font-extrabold
              leading-tight
              sm:text-xl
              lg:text-2xl
            "
          >
            Analisis Nutrisi Harian
          </h2>


          {/* PROFILE ANAK */}

          <div className="mt-4 flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white/20
                text-sm
                font-bold
              "
            >
              R
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-extrabold sm:text-base">
                Rayyan Pratara (18 Bulan)
              </p>

            </div>

          </div>


          {/* TARGET */}

          <div
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-3
              py-1.5
              text-xs
              font-bold
              text-[#286432]
              sm:text-sm
            "
          >

            <Flame
              size={16}
              className="text-[#f5a400]"
            />

            Target 1.100 kkal

          </div>


          <p className="mt-3 text-xs text-white/80 sm:text-sm">
            Hari Ini, 24 Okt
          </p>

        </section>


        {/* =================================================
            TABS
        ================================================= */}

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">

          {/* HARIAN */}

          <button
            type="button"
            onClick={() => setTabAktif("Harian")}
            className={`
              rounded-[14px]
              px-3
              py-2.5
              text-xs
              font-bold
              transition
              sm:text-sm
              ${
                tabAktif === "Harian"
                  ? "bg-[#176b26] text-white shadow-sm"
                  : "bg-white text-[#286432] hover:bg-slate-50"
              }
            `}
          >
            Harian
          </button>


          {/* MINGGUAN */}

          <button
            type="button"
            onClick={() => setTabAktif("Mingguan")}
            className={`
              rounded-[14px]
              px-3
              py-2.5
              text-xs
              font-bold
              transition
              sm:text-sm
              ${
                tabAktif === "Mingguan"
                  ? "bg-[#176b26] text-white shadow-sm"
                  : "bg-white text-[#286432] hover:bg-slate-50"
              }
            `}
          >
            Mingguan
          </button>


          {/* TREN BULANAN */}

          <button
            type="button"
            onClick={() => setTabAktif("Tren Bulanan")}
            className={`
              rounded-[14px]
              px-3
              py-2.5
              text-xs
              font-bold
              transition
              sm:text-sm
              ${
                tabAktif === "Tren Bulanan"
                  ? "bg-[#176b26] text-white shadow-sm"
                  : "bg-white text-[#286432] hover:bg-slate-50"
              }
            `}
          >
            Tren Bulanan
          </button>

        </div>


        {/* =================================================
            ISI HARIAN
            STRUKTUR LAMA TETAP
        ================================================= */}

        {tabAktif === "Harian" && (
          <>

            {/* =================================================
                CAPAIAN GIZI
            ================================================= */}

            <section
              className="
                mt-4
                rounded-[20px]
                bg-white
                p-4
                text-center
                shadow-sm
                sm:p-5
                lg:p-6
              "
            >

              <div className="mx-auto max-w-3xl">

                <p
                  className="
                    text-[11px]
                    font-extrabold
                    tracking-[0.16em]
                    text-slate-500
                    sm:text-xs
                  "
                >
                  CAPAIAN GIZI HARI INI
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Sesuai Standar WHO
                </p>


                {/* PROGRESS CIRCLE */}

                <div
                  className="
                    relative
                    mx-auto
                    mt-5
                    h-44
                    w-44
                    sm:h-52
                    sm:w-52
                    lg:h-56
                    lg:w-56
                  "
                >

                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full -rotate-90"
                  >

                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      fill="none"
                      stroke="#e6f4e8"
                      strokeWidth="14"
                    />

                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      fill="none"
                      stroke="#2e8438"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="515"
                      strokeDashoffset="62"
                    />

                  </svg>


                  {/* CENTER */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >

                    <span
                      className="
                        text-3xl
                        font-extrabold
                        text-[#176b26]
                        sm:text-4xl
                      "
                    >
                      88%
                    </span>

                    <span
                      className="
                        mt-1
                        rounded-full
                        bg-[#e6f4e8]
                        px-3
                        py-1
                        text-[9px]
                        font-extrabold
                        tracking-wider
                        text-[#286432]
                        sm:text-[10px]
                      "
                    >
                      GIZI OPTIMAL
                    </span>

                  </div>

                </div>


                <p
                  className="
                    mt-4
                    text-xs
                    leading-relaxed
                    text-slate-500
                    sm:text-sm
                  "
                >
                  Tingkat Kecukupan Gizi:{" "}

                  <strong className="text-[#176b26]">
                    Sangat Baik
                  </strong>{" "}

                  (Cegah Stunting)
                </p>

              </div>

            </section>


            {/* =================================================
                MAKRONUTRISI
            ================================================= */}

            <section className="mt-6">

              <div className="mb-3 flex items-center gap-2">

                <span className="h-6 w-1 rounded-full bg-[#176b26]" />

                <h2
                  className="
                    text-base
                    font-extrabold
                    text-[#245c2c]
                    sm:text-lg
                  "
                >
                  Makronutrisi Harian
                </h2>

              </div>


              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >

                <NutritionCard
                  icon={<Beef size={19} />}
                  title="Protein"
                  value="42 g"
                  target="Target 35 g"
                  percentage="120%"
                  iconBg="bg-[#ffe1e1]"
                  iconColor="text-[#bd3838]"
                />

                <NutritionCard
                  icon={<Wheat size={19} />}
                  title="Karbohidrat"
                  value="130 g"
                  target="Target 150 g"
                  percentage="87%"
                  iconBg="bg-[#fff1bf]"
                  iconColor="text-[#c18a00]"
                />

                <NutritionCard
                  icon={<Droplets size={19} />}
                  title="Lemak"
                  value="31 g"
                  target="Target 40 g"
                  percentage="78%"
                  iconBg="bg-[#dceeff]"
                  iconColor="text-[#3b78ae]"
                />

                <NutritionCard
                  icon={<Apple size={19} />}
                  title="Serat"
                  value="12 g"
                  target="Target 15 g"
                  percentage="80%"
                  iconBg="bg-[#dcf7e3]"
                  iconColor="text-[#2d813a]"
                />

              </div>

            </section>


            {/* =================================================
                RINGKASAN
            ================================================= */}

            <section
              className="
                mt-5
                rounded-[18px]
                border
                border-[#d7ead9]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#e1f8e5]
                    text-[#238039]
                  "
                >
                  <TrendingUp size={20} />
                </div>

                <div className="min-w-0">

                  <h3 className="text-sm font-extrabold sm:text-base">
                    Ringkasan Nutrisi
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-relaxed
                      text-slate-500
                      sm:text-sm
                    "
                  >
                    Pantau kecukupan nutrisi harian untuk membantu
                    menjaga pola makan Si Kecil tetap seimbang.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}


        {/* =================================================
            ISI MINGGUAN
        ================================================= */}

        {tabAktif === "Mingguan" && (
          <NutrisiMingguan />
        )}


        {/* =================================================
            ISI TREN BULANAN
        ================================================= */}

        {tabAktif === "Tren Bulanan" && (
          <NutrisiTrenBulanan />
        )}

      </main>

    </div>
  );
}


/* =========================================================
   NUTRITION CARD
========================================================= */

function NutritionCard({
  icon,
  title,
  value,
  target,
  percentage,
  iconBg,
  iconColor,
}) {
  return (
    <article
      className="
        rounded-[16px]
        border
        border-slate-100
        bg-white
        p-4
        shadow-sm
      "
    >

      <div className="flex items-center justify-between">

        <div
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            ${iconBg}
            ${iconColor}
          `}
        >
          {icon}
        </div>

        <span className="text-xs font-extrabold text-[#176b26]">
          {percentage}
        </span>

      </div>


      <h3 className="mt-3 text-sm font-bold text-slate-600">
        {title}
      </h3>


      <p className="mt-1 text-xl font-extrabold text-[#202833]">
        {value}
      </p>


      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
        {target}
      </p>

    </article>
  );
}


/* =========================================================
   KOMPONEN MINGGUAN
========================================================= */

function NutrisiMingguan() {
  return (
    <div className="space-y-4 sm:space-y-5">

      {/* =================================================
          CAPAIAN GIZI MINGGUAN
      ================================================= */}

      <section
        className="
          mt-4
          rounded-[20px]
          border
          border-[#d7ead9]
          bg-white
          p-4
          text-center
          shadow-sm
          sm:p-5
          lg:p-6
        "
      >

        <h2
          className="
            font-playfair
            text-base
            font-bold
            text-[#24642e]
            sm:text-lg
          "
        >
          CAPAIAN GIZI MINGGUAN
        </h2>

        <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
          {dataMingguan.periode}
        </p>


        {/* RATA-RATA */}

        <div className="mt-5">

          <p className="text-xs font-medium text-slate-500">
            Rata-rata kecukupan gizi
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#24642e] sm:text-4xl">
            {dataMingguan.rataRata}%
          </p>

        </div>


        {/* DATA HARIAN */}

        <div className="mx-auto mt-6 max-w-2xl">

          <div className="grid grid-cols-7 gap-1 sm:gap-3">

            {dataMingguan.harian.map((item) => {

              const tinggi = Math.max(
                10,
                (item.nilai / 100) * 48
              );

              return (
                <div
                  key={item.hari}
                  className="flex flex-col items-center"
                >

                  <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                    {item.hari}
                  </span>

                  <span className="mt-1 text-xs font-bold text-[#24642e] sm:text-sm">
                    {item.nilai}
                  </span>

                  <div className="mt-2 flex h-12 items-end">

                    <div
                      className="
                        w-3
                        rounded-t-md
                        bg-[#53b875]
                        sm:w-4
                      "
                      style={{
                        height: `${tinggi}px`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =================================================
          KARTU NUTRISI
      ================================================= */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

        {dataMingguan.nutrisi.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.nama}
              className="
                rounded-[18px]
                border
                border-[#d7ead9]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >

              <div className="flex items-center justify-between">

                <div
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    ${item.iconBg}
                    ${item.iconColor}
                  `}
                >
                  <Icon size={18} />
                </div>

                <span className="text-xs font-extrabold text-[#176b26]">
                  {item.persen}%
                </span>

              </div>

              <p className="mt-3 text-xs font-bold text-slate-500 sm:text-sm">
                {item.nama}
              </p>

              <p className="mt-1 text-xl font-extrabold text-[#202833]">
                {item.nilai}
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf3ee]">

                <div
                  className="h-full rounded-full bg-[#29934b]"
                  style={{
                    width: `${item.persen}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>


      {/* =================================================
          RINGKASAN MINGGUAN
      ================================================= */}

      <section
        className="
          rounded-[20px]
          border
          border-[#d7ead9]
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >

        <h2 className="text-sm font-extrabold text-[#202833] sm:text-base">
          Ringkasan Mingguan
        </h2>

        <div className="mt-4 space-y-3">

          {dataMingguan.ringkasan.map((item) => (

            <div key={item.nama}>

              <div className="flex items-center gap-3">

                <span className="w-[90px] shrink-0 text-xs font-medium text-slate-600 sm:w-[105px] sm:text-sm">
                  {item.nama}
                </span>

                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#edf2ee]">

                  <div
                    className="h-full rounded-full bg-[#29934b]"
                    style={{
                      width: `${item.persen}%`,
                    }}
                  />

                </div>

                <span className="w-8 shrink-0 text-right text-xs font-bold text-[#24642e]">
                  {item.persen}%
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =================================================
          INSIGHT MINGGUAN
      ================================================= */}

      <section
        className="
          flex
          items-start
          gap-3
          rounded-[18px]
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
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#f5a400]
            text-white
          "
        >
          <Lightbulb size={18} />
        </div>

        <div>

          <h3 className="text-sm font-bold text-[#4d4333]">
            Asupan minggu ini cukup baik.
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-[#765e43]">
            Protein masih perlu ditingkatkan agar kecukupan
            gizi harian lebih optimal.
          </p>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   KOMPONEN TREN BULANAN
========================================================= */

function NutrisiTrenBulanan() {

  /*
    Titik grafik dibuat berdasarkan nilai.
    Ini hanya visualisasi dari data mingguan.
  */

  const titikGrafik = dataTrenBulanan.minggu
    .map((item, index) => {

      const x =
        dataTrenBulanan.minggu.length === 1
          ? 50
          : (index /
              (dataTrenBulanan.minggu.length - 1)) *
            100;

      const y =
        100 -
        ((item.nilai - 70) / 30) *
          100;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* =================================================
          TREND GIZI BULANAN
      ================================================= */}

      <section
        className="
          mt-4
          rounded-[20px]
          border
          border-[#d7ead9]
          bg-white
          p-4
          shadow-sm
          sm:p-5
          lg:p-6
        "
      >

        <div className="text-center">

          <h2
            className="
              font-playfair
              text-base
              font-bold
              text-[#24642e]
              sm:text-lg
            "
          >
            TREN GIZI BULANAN
          </h2>

          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            {dataTrenBulanan.bulan}
          </p>

        </div>


        {/* GRAPH */}

        <div className="mt-6">

          <div className="relative h-[200px] sm:h-[230px]">

            {/* LABEL 100 */}

            <span className="absolute left-0 top-0 text-[9px] text-slate-400 sm:text-[10px]">
              100%
            </span>

            {/* LABEL 90 */}

            <span className="absolute left-0 top-[25%] text-[9px] text-slate-400 sm:text-[10px]">
              90%
            </span>

            {/* LABEL 80 */}

            <span className="absolute left-0 top-[50%] text-[9px] text-slate-400 sm:text-[10px]">
              80%
            </span>

            {/* LABEL 70 */}

            <span className="absolute left-0 top-[75%] text-[9px] text-slate-400 sm:text-[10px]">
              70%
            </span>


            {/* GRID */}

            <div
              className="
                absolute
                bottom-6
                left-9
                right-0
                top-0
                flex
                flex-col
                justify-between
              "
            >

              <div className="border-t border-dashed border-slate-200" />
              <div className="border-t border-dashed border-slate-200" />
              <div className="border-t border-dashed border-slate-200" />
              <div className="border-t border-dashed border-slate-200" />

            </div>


            {/* SVG GRAPH */}

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="
                absolute
                bottom-6
                left-9
                right-0
                h-[calc(100%-24px)]
                w-[calc(100%-36px)]
                overflow-visible
              "
            >

              <polyline
                points={titikGrafik}
                fill="none"
                stroke="#29934b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

            </svg>


            {/* TITIK */}

            <div
              className="
                absolute
                bottom-6
                left-9
                right-0
                top-0
              "
            >

              {dataTrenBulanan.minggu.map(
                (item, index) => {

                  const left =
                    dataTrenBulanan.minggu.length === 1
                      ? 50
                      : (index /
                          (dataTrenBulanan.minggu.length - 1)) *
                        100;

                  const bottom =
                    ((item.nilai - 70) / 30) *
                    100;

                  return (
                    <div
                      key={item.nama}
                      className="
                        absolute
                        flex
                        -translate-x-1/2
                        -translate-y-1/2
                        flex-col
                        items-center
                      "
                      style={{
                        left: `${left}%`,
                        bottom: `${bottom}%`,
                      }}
                    >

                      <span
                        className="
                          h-3
                          w-3
                          rounded-full
                          border-2
                          border-white
                          bg-[#29934b]
                          shadow-sm
                          sm:h-3.5
                          sm:w-3.5
                        "
                      />

                    </div>
                  );
                }
              )}

            </div>


            {/* LABEL MINGGU */}

            <div
              className="
                absolute
                bottom-0
                left-9
                right-0
                flex
                justify-between
              "
            >

              {dataTrenBulanan.minggu.map((item) => (

                <span
                  key={item.nama}
                  className="
                    text-[10px]
                    font-semibold
                    text-slate-500
                    sm:text-xs
                  "
                >
                  {item.nama}
                </span>

              ))}

            </div>

          </div>

        </div>


        {/* LEGEND */}

        <div className="mt-7 flex items-center justify-center gap-2">

          <span className="h-2.5 w-2.5 rounded-full bg-[#29934b]" />

          <span className="text-xs font-medium text-slate-500">
            Rata-rata kecukupan gizi
          </span>

        </div>

      </section>


      {/* =================================================
          PERBANDINGAN NUTRISI
      ================================================= */}

      <section
        className="
          overflow-hidden
          rounded-[20px]
          border
          border-[#d7ead9]
          bg-white
          shadow-sm
        "
      >

        <div className="p-4 sm:p-5">

          <h2 className="text-sm font-extrabold text-[#202833] sm:text-base">
            Perbandingan Nutrisi
          </h2>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[470px] border-collapse">

            <thead>

              <tr className="border-y border-[#edf1ee] bg-[#f8fbf8]">

                <th
                  className="
                    px-4
                    py-3
                    text-left
                    text-[11px]
                    font-bold
                    text-slate-500
                    sm:text-xs
                  "
                >
                  Nutrisi
                </th>

                <th className="px-3 py-3 text-center text-[11px] font-bold text-slate-500 sm:text-xs">
                  M1
                </th>

                <th className="px-3 py-3 text-center text-[11px] font-bold text-slate-500 sm:text-xs">
                  M2
                </th>

                <th className="px-3 py-3 text-center text-[11px] font-bold text-slate-500 sm:text-xs">
                  M3
                </th>

                <th className="px-3 py-3 text-center text-[11px] font-bold text-slate-500 sm:text-xs">
                  M4
                </th>

              </tr>

            </thead>


            <tbody>

              {dataTrenBulanan.perbandingan.map(
                (item) => (

                  <tr
                    key={item.nama}
                    className="
                      border-b
                      border-[#edf1ee]
                      last:border-b-0
                    "
                  >

                    <td
                      className="
                        px-4
                        py-3
                        text-xs
                        font-semibold
                        text-[#202833]
                        sm:text-sm
                      "
                    >
                      {item.nama}
                    </td>

                    {item.data.map((nilai, index) => (

                      <td
                        key={`${item.nama}-${index}`}
                        className="
                          px-3
                          py-3
                          text-center
                          text-xs
                          font-semibold
                          text-[#24642e]
                          sm:text-sm
                        "
                      >
                        {nilai}%
                      </td>

                    ))}

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =================================================
          KESIMPULAN BULAN INI
      ================================================= */}

      <section
        className="
          rounded-[20px]
          border
          border-[#d7ead9]
          bg-[#f5fbf6]
          p-4
          sm:p-5
        "
      >

        <h2 className="text-sm font-extrabold text-[#24642e] sm:text-base">
          Kesimpulan Bulan Ini
        </h2>


        <div className="mt-3 space-y-2.5">

          <InsightRow
            icon="↑"
            text="Kecukupan gizi meningkat 13%"
          />

          <InsightRow
            icon="✓"
            text="Kalori sudah mendekati target"
          />

          <InsightRow
            icon="!"
            text="Protein masih perlu diperhatikan"
            warning
          />

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   INSIGHT ROW
========================================================= */

function InsightRow({
  icon,
  text,
  warning = false,
}) {
  return (
    <div className="flex items-center gap-2.5">

      <span
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          text-xs
          font-bold
          ${
            warning
              ? "bg-[#fff0cf] text-[#d68a00]"
              : "bg-[#dff5e5] text-[#29934b]"
          }
        `}
      >
        {icon}
      </span>

      <p className="text-xs font-medium text-slate-600 sm:text-sm">
        {text}
      </p>

    </div>
  );
}

export default Nutrisi;