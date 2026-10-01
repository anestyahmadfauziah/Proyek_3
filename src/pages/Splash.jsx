import { useNavigate } from "react-router-dom";
import {
  Refrigerator,
  Shield,
  ArrowRight,
  UserRoundPlus,
  HeartPulse,
} from "lucide-react";

import KartuFitur from "../components/KartuFitur";
import TombolUtama from "../components/TombolUtama";

import logoDapurCerdas from "../assets/logo-dapur-cerdas.png";

function Splash() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F2F9F2] px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-[760px]">

        {/* LOGO */}
        <div className="flex justify-center">
          <img
            src={logoDapurCerdas}
            alt="Logo Dapur Cerdas"
            className="h-[125px] w-[125px] object-contain sm:h-[140px] sm:w-[140px] md:h-[150px] md:w-[150px]"
          />
        </div>

        {/* JUDUL */}
        <section className="mt-6 text-center sm:mt-7">
          <h1 className="text-[34px] font-extrabold leading-tight tracking-tight text-[#176B2C] sm:text-4xl md:text-[42px]">
            Dapur Cerdas
          </h1>

          <p className="mt-2 text-base font-semibold leading-relaxed text-[#7F8D43] sm:text-lg md:text-xl">
            Solusi Masak Cerdas, Cegah Stunting, &amp; Gizi Terjaga
          </p>

          <p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-7 text-[#68747D] sm:text-base md:text-lg">
            Dampingi tumbuh kembang buah hati dengan sajian rumahan
            bernutrisi tinggi berbasis kearifan pangan lokal.
          </p>
        </section>

        {/* FITUR */}
        <section className="mt-8 space-y-4 sm:mt-9 sm:space-y-5">

          <KartuFitur
            icon={<Refrigerator size={29} strokeWidth={1.8} />}
            judul="Resep AI Berbasis Kulkas"
            badge="Cerdas"
            deskripsi="Kelola stok bahan segar tanpa mubazir; otomatis diracik jadi menu MPASI bergizi."
          />

          <KartuFitur
            icon={<Shield size={29} strokeWidth={1.8} />}
            judul="Menu Anti-Stunting Teruji"
            badge="Kemenkes"
            deskripsi="Komposisi protein hewani kaya zat besi yang tervalidasi pedoman gizi nasional."
          />

        </section>

        {/* BUTTON */}
<section className="mt-7 space-y-3 sm:mt-8 sm:space-y-4">

  {/* LOGIN */}
  <TombolUtama
    variant="primary"
    icon={<ArrowRight size={26} strokeWidth={2.2} />}
    onClick={() => navigate("/login")}
  >
    Masuk ke Akun
  </TombolUtama>

  {/* REGISTER */}
  <TombolUtama
    variant="secondary"
    icon={<UserRoundPlus size={22} strokeWidth={2} />}
    onClick={() => navigate("/register")}
  >
    Daftar Akun Baru Bunda
  </TombolUtama>

</section>

      
        {/* FOOTER */}
        <footer className="pb-4 pt-9 text-center sm:pt-10">
          <div className="flex justify-center">
            <HeartPulse
              size={25}
              strokeWidth={1.8}
              className="text-[#7A8288]"
            />
          </div>

          <p className="mt-2 text-xs font-semibold tracking-wide text-[#7A8288] sm:text-sm">
            JARINGAN KESEHATAN TERPADU
          </p>
        </footer>

      </div>
    </main>
  );
}

export default Splash;