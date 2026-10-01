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
} from "lucide-react";

function Nutrisi() {
  const navigate = useNavigate();

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

          <button
            type="button"
            className="
              rounded-[14px]
              bg-[#176b26]
              px-3
              py-2.5
              text-xs
              font-bold
              text-white
              sm:text-sm
            "
          >
            Harian
          </button>

          <button
            type="button"
            className="
              rounded-[14px]
              bg-white
              px-3
              py-2.5
              text-xs
              font-bold
              text-[#286432]
              transition
              hover:bg-slate-50
              sm:text-sm
            "
          >
            Mingguan
          </button>

          <button
            type="button"
            className="
              rounded-[14px]
              bg-white
              px-3
              py-2.5
              text-xs
              font-bold
              text-[#286432]
              transition
              hover:bg-slate-50
              sm:text-sm
            "
          >
            Tren Bulanan
          </button>

        </div>


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

                {/* BACKGROUND */}

                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  fill="none"
                  stroke="#e6f4e8"
                  strokeWidth="14"
                />

                {/* PROGRESS */}

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

export default Nutrisi;