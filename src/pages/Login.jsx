import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  BadgeCheck,
} from "lucide-react";

import HeaderLogo from "../components/HeaderLogo";
import InputForm from "../components/InputForm";
import TombolUtama from "../components/TombolUtama";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ingatSaya, setIngatSaya] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
      ingatSaya,
    });

    // Untuk sementara hanya UI.
    // Nanti bisa dihubungkan ke backend.
  };

  return (
    <main className="min-h-screen bg-[#F2F9F2] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:py-7">

      <div className="mx-auto w-full max-w-[760px]">

        {/* HEADER */}
        <HeaderLogo />

        {/* WELCOME */}
        <section className="mt-9 text-center sm:mt-10 md:mt-12">

          {/* Avatar */}
          <div className="mx-auto flex h-[125px] w-[125px] items-center justify-center rounded-full border-[5px] border-white bg-[#B6DDBA] shadow-[0_5px_20px_rgba(55,90,60,0.12)] sm:h-[135px] sm:w-[135px]">
            <UserRound
              size={64}
              strokeWidth={1.7}
              className="text-[#176B2C]"
            />
          </div>

          <h1 className="mt-6 text-[23px] font-bold leading-tight text-[#176B2C] sm:text-2xl md:text-[25px]">
            Selamat Datang Kembali, Bunda!
          </h1>

          <p className="mx-auto mt-2 max-w-[570px] text-[16px] leading-7 text-[#68747D] sm:text-lg md:text-xl">
            Masuk untuk memantau asupan gizi buah hati
            <br className="hidden sm:block" />
            dan stok kulkas hari ini.
          </p>

        </section>

        {/* FORM CARD */}
        <section className="mt-8 rounded-[28px] bg-white p-5 shadow-[0_8px_30px_rgba(40,70,45,0.07)] sm:mt-9 sm:rounded-[30px] sm:p-7 md:p-8">

          {/* Garis atas */}
          <div className="mb-8 h-[6px] w-full rounded-full bg-[#E5F3E7]">
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* EMAIL */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-base font-bold text-[#38414A] sm:text-lg">
                  Email
                </label>

                <span className="flex items-center gap-1 text-sm text-[#4B8055] sm:text-base">
                  <BadgeCheck
                    size={19}
                    fill="#3B8047"
                    className="text-white"
                  />
                  Resmi Terdaftar
                </span>
              </div>

              <InputForm
                label=""
                placeholder="Masukan Email"
                type="email"
                icon={<Mail size={24} strokeWidth={1.8} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <InputForm
              label="Kata Sandi"
              placeholder="Minimal 8 karakter"
              type="password"
              icon={<LockKeyhole size={24} strokeWidth={1.8} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              onTogglePassword={() =>
                setShowPassword((prev) => !prev)
              }
            />

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between gap-3">

              <label className="flex cursor-pointer items-center gap-2 text-base text-[#3E464E] sm:text-lg">
                <input
                  type="checkbox"
                  checked={ingatSaya}
                  onChange={(e) =>
                    setIngatSaya(e.target.checked)
                  }
                  className="h-6 w-6 cursor-pointer accent-[#176B2C]"
                />

                <span>Ingat Saya</span>
              </label>

              <button
                type="button"
                className="text-sm font-bold text-[#176B2C] hover:underline sm:text-base"
              >
                Lupa Kata Sandi?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <TombolUtama variant="primary">
              Masuk ke Dapur Cerdas
            </TombolUtama>

          </form>

        </section>

        {/* REGISTER */}
        <div className="pb-5 pt-8 text-center sm:pt-9">

          <p className="text-base text-[#424B53] sm:text-lg">
            Belum punya akun Bunda?{" "}

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-[#176B2C] hover:underline"
            >
              Daftar Sekarang
            </button>
          </p>

        </div>

      </div>
    </main>
  );
}

export default Login;