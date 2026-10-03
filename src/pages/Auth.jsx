import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
} from "lucide-react";

import logoDapurCerdas from "../assets/logo-dapur-cerdas.png";

/* =========================================================
   GOOGLE LOGO
========================================================= */

function GoogleLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* BLUE */}
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z"
      />

      {/* GREEN */}
      <path
        fill="#34A853"
        d="M12 21.78c2.63 0 4.83-.87 6.44-2.36l-3.14-2.44c-.87.58-1.98.92-3.3.92-2.54 0-4.7-1.72-5.47-4.04H3.28v2.52A9.73 9.73 0 0 0 12 21.78Z"
      />

      {/* YELLOW */}
      <path
        fill="#FBBC05"
        d="M6.53 13.86A5.85 5.85 0 0 1 6.22 12c0-.64.11-1.26.31-1.86V7.62H3.28A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.38l3.25-2.52Z"
      />

      {/* RED */}
      <path
        fill="#EA4335"
        d="M12 6.1c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.82 3.2 14.62 2.22 12 2.22a9.73 9.73 0 0 0-8.72 5.4l3.25 2.52C7.3 7.82 9.46 6.1 12 6.1Z"
      />
    </svg>
  );
}

/* =========================================================
   AUTH
========================================================= */

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     MODE LOGIN / REGISTER
  ======================================================= */

  const [mode, setMode] = useState(
    location.pathname === "/register" ? "register" : "login"
  );

  /* =======================================================
     LOGIN STATE
  ======================================================= */

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [ingatSaya, setIngatSaya] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  /* =======================================================
     REGISTER STATE
  ======================================================= */

  const [registerForm, setRegisterForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =======================================================
     GANTI MODE
  ======================================================= */

  const changeMode = (newMode) => {
    setMode(newMode);

    if (newMode === "login") {
      navigate("/login");
    } else {
      navigate("/register");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     LOGIN INPUT
  ======================================================= */

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     REGISTER INPUT
  ======================================================= */

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     LOGIN EMAIL + PASSWORD
  ======================================================= */

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      alert("Email dan kata sandi wajib diisi.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      console.error("Login Error:", error);
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  /* =======================================================
     REGISTER EMAIL + PASSWORD
  ======================================================= */

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      !registerForm.nama ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.konfirmasiPassword
    ) {
      alert("Mohon lengkapi semua data terlebih dahulu.");
      return;
    }

    if (registerForm.password.length < 8) {
      alert("Kata sandi minimal 8 karakter.");
      return;
    }

    if (
      registerForm.password !==
      registerForm.konfirmasiPassword
    ) {
      alert("Konfirmasi kata sandi tidak sama.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,

      options: {
        data: {
          nama: registerForm.nama,
        },
      },
    });

    if (error) {
      console.error("Register Error:", error);
      alert(error.message);
      return;
    }

    if (data.user) {
      alert(
        "Pendaftaran berhasil. Silakan cek email untuk verifikasi akun."
      );

      navigate("/login");
    }
  };

  /* =======================================================
     GOOGLE LOGIN
  ======================================================= */

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Google Login Error:", error);
      alert(error.message);
    }
  };

  /* =======================================================
     GOOGLE REGISTER
  ======================================================= */

  const handleGoogleRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Google Register Error:", error);
      alert(error.message);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f3faf4]
        font-poppins
        text-[#26313b]
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#dceedd]
            opacity-70
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -right-20
            h-72
            w-72
            rounded-full
            bg-[#f8e8c8]
            opacity-50
            blur-3xl
          "
        />
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          sm:py-10
        "
      >
        <div className="w-full max-w-[500px]">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="mb-6 flex justify-center sm:mb-7">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                group
                flex
                items-center
                gap-2.5
              "
            >
              <img
                src={logoDapurCerdas}
                alt="Dapur Cerdas"
                className="
                  h-10
                  w-10
                  object-contain
                  transition
                  duration-200
                  group-hover:scale-105
                  sm:h-11
                  sm:w-11
                "
              />

              <span
                className="
                  font-playfair
                  text-xl
                  font-bold
                  text-[#23652d]
                  sm:text-[22px]
                "
              >
                Dapur Cerdas
              </span>
            </button>
          </div>

          {/* =================================================
              CARD
          ================================================= */}

          <div
            className="
              rounded-[24px]
              bg-white
              px-5
              py-7
              shadow-[0_15px_50px_rgba(35,101,45,0.08)]
              sm:rounded-[28px]
              sm:px-9
              sm:py-8
            "
          >

            {/* =================================================
                LOGIN
            ================================================= */}

            {mode === "login" && (
              <>
                {/* HEADING */}

                <div className="mb-6 text-center">
                  <h1
                    className="
                      text-[24px]
                      font-bold
                      tracking-tight
                      text-[#23652d]
                      sm:text-[27px]
                    "
                  >
                    Selamat Datang, Bunda!
                  </h1>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-[390px]
                      text-[13px]
                      leading-relaxed
                      text-[#7c8b7c]
                      sm:text-sm
                    "
                  >
                    Masuk untuk mengelola nutrisi dan kebutuhan
                    Si Kecil dengan lebih mudah.
                  </p>
                </div>

                {/* LOGIN FORM */}

                <form
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="login-email"
                      className="
                        mb-1.5
                        block
                        text-[13px]
                        font-semibold
                        text-[#34414c]
                        sm:text-sm
                      "
                    >
                      Email Aktif
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        strokeWidth={1.8}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                        "
                      />

                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="bunda@email.com"
                        autoComplete="email"
                        className="
                          h-[52px]
                          w-full
                          rounded-[14px]
                          border
                          border-transparent
                          bg-[#eaf4eb]
                          pl-11
                          pr-4
                          text-[14px]
                          text-[#26313b]
                          outline-none
                          transition
                          placeholder:text-[#89979d]
                          focus:border-[#23652d]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#23652d]/10
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label
                      htmlFor="login-password"
                      className="
                        mb-1.5
                        block
                        text-[13px]
                        font-semibold
                        text-[#34414c]
                        sm:text-sm
                      "
                    >
                      Kata Sandi
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        strokeWidth={1.8}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                        "
                      />

                      <input
                        id="login-password"
                        name="password"
                        type={
                          showLoginPassword
                            ? "text"
                            : "password"
                        }
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        placeholder="Masukkan kata sandi"
                        autoComplete="current-password"
                        className="
                          h-[52px]
                          w-full
                          rounded-[14px]
                          border
                          border-transparent
                          bg-[#eaf4eb]
                          pl-11
                          pr-12
                          text-[14px]
                          text-[#26313b]
                          outline-none
                          transition
                          placeholder:text-[#89979d]
                          focus:border-[#23652d]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#23652d]/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowLoginPassword(
                            (prev) => !prev
                          )
                        }
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                          transition
                          hover:text-[#23652d]
                        "
                        aria-label={
                          showLoginPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER + FORGOT */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      pt-0.5
                    "
                  >
                    <label
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        text-[12px]
                        text-[#69777d]
                        sm:text-[13px]
                      "
                    >
                      <input
                        type="checkbox"
                        checked={ingatSaya}
                        onChange={(e) =>
                          setIngatSaya(e.target.checked)
                        }
                        className="
                          h-3.5
                          w-3.5
                          accent-[#23652d]
                        "
                      />

                      Ingat saya
                    </label>

                    <button
                      type="button"
                      className="
                        text-[12px]
                        font-semibold
                        text-[#23652d]
                        transition
                        hover:underline
                        sm:text-[13px]
                      "
                    >
                      Lupa kata sandi?
                    </button>
                  </div>

                  {/* LOGIN BUTTON */}

                  <button
                    type="submit"
                    className="
                      mt-2
                      flex
                      h-[50px]
                      w-full
                      items-center
                      justify-center
                      rounded-[14px]
                      bg-[#23652d]
                      text-[14px]
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[#1d5626]
                      active:scale-[0.99]
                    "
                  >
                    Masuk
                  </button>
                </form>

                {/* DIVIDER */}

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#e6ebe6]" />

                  <span className="text-[11px] text-[#9aa49d]">
                    atau
                  </span>

                  <div className="h-px flex-1 bg-[#e6ebe6]" />
                </div>

                {/* GOOGLE LOGIN */}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="
                    flex
                    h-[48px]
                    w-full
                    items-center
                    justify-center
                    gap-2.5
                    rounded-[14px]
                    border
                    border-[#dfe6df]
                    bg-white
                    text-[13px]
                    font-semibold
                    text-[#46535a]
                    transition
                    hover:bg-[#f7faf7]
                    hover:border-[#cfdacf]
                    active:scale-[0.99]
                  "
                >
                  <GoogleLogo />

                  <span>
                    Lanjutkan dengan Google
                  </span>
                </button>

                {/* REGISTER LINK */}

                <div className="mt-6 text-center">
                  <p
                    className="
                      text-[12px]
                      text-[#7c8782]
                      sm:text-[13px]
                    "
                  >
                    Belum punya akun?{" "}

                    <button
                      type="button"
                      onClick={() => changeMode("register")}
                      className="
                        font-semibold
                        text-[#23652d]
                        hover:underline
                      "
                    >
                      Daftar sekarang
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* =================================================
                REGISTER
            ================================================= */}

            {mode === "register" && (
              <>
                {/* BACK */}

                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className="
                    mb-5
                    flex
                    items-center
                    gap-1.5
                    text-[12px]
                    font-medium
                    text-[#77837d]
                    transition
                    hover:text-[#23652d]
                  "
                >
                  <ArrowLeft size={16} />

                  Kembali ke Login
                </button>

                {/* HEADING */}

                <div className="mb-6 text-center">
                  <h1
                    className="
                      text-[24px]
                      font-bold
                      tracking-tight
                      text-[#23652d]
                      sm:text-[27px]
                    "
                  >
                    Daftar Akun Bunda
                  </h1>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-[400px]
                      text-[13px]
                      leading-relaxed
                      text-[#7c8b7c]
                      sm:text-sm
                    "
                  >
                    Mulai perjalanan cerdas memenuhi kebutuhan
                    nutrisi Si Kecil.
                  </p>
                </div>

                {/* REGISTER FORM */}

                <form
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4"
                >

                  {/* NAMA */}

                  <div>
                    <label
                      htmlFor="register-nama"
                      className="
                        mb-1.5
                        block
                        text-[13px]
                        font-semibold
                        text-[#34414c]
                        sm:text-sm
                      "
                    >
                      Nama Lengkap Bunda
                    </label>

                    <div className="relative">
                      <UserRound
                        size={18}
                        strokeWidth={1.8}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                        "
                      />

                      <input
                        id="register-nama"
                        name="nama"
                        type="text"
                        value={registerForm.nama}
                        onChange={handleRegisterChange}
                        placeholder="cth. Sarah Nurhaliza"
                        autoComplete="name"
                        className="
                          h-[52px]
                          w-full
                          rounded-[14px]
                          border
                          border-transparent
                          bg-[#eaf4eb]
                          pl-11
                          pr-4
                          text-[14px]
                          text-[#26313b]
                          outline-none
                          transition
                          placeholder:text-[#89979d]
                          focus:border-[#23652d]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#23652d]/10
                        "
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="register-email"
                      className="
                        mb-1.5
                        block
                        text-[13px]
                        font-semibold
                        text-[#34414c]
                        sm:text-sm
                      "
                    >
                      Email Aktif
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        strokeWidth={1.8}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                        "
                      />

                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="bunda@email.com"
                        autoComplete="email"
                        className="
                          h-[52px]
                          w-full
                          rounded-[14px]
                          border
                          border-transparent
                          bg-[#eaf4eb]
                          pl-11
                          pr-4
                          text-[14px]
                          text-[#26313b]
                          outline-none
                          transition
                          placeholder:text-[#89979d]
                          focus:border-[#23652d]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#23652d]/10
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label
                      htmlFor="register-password"
                      className="
                        mb-1.5
                        block
                        text-[13px]
                        font-semibold
                        text-[#34414c]
                        sm:text-sm
                      "
                    >
                      Buat Kata Sandi
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        strokeWidth={1.8}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                        "
                      />

                      <input
                        id="register-password"
                        name="password"
                        type={
                          showRegisterPassword
                            ? "text"
                            : "password"
                        }
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        className="
                          h-[52px]
                          w-full
                          rounded-[14px]
                          border
                          border-transparent
                          bg-[#eaf4eb]
                          pl-11
                          pr-12
                          text-[14px]
                          text-[#26313b]
                          outline-none
                          transition
                          placeholder:text-[#89979d]
                          focus:border-[#23652d]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#23652d]/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword(
                            (prev) => !prev
                          )
                        }
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                          transition
                          hover:text-[#23652d]
                        "
                        aria-label={
                          showRegisterPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                        }
                      >
                        {showRegisterPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <div
                      className="
                        mt-1.5
                        flex
                        items-center
                        gap-1.5
                        text-[11px]
                        text-[#8a948d]
                      "
                    >
                      <Check size={13} />

                      Gunakan minimal 8 karakter
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="
                        mb-1.5
                        block
                        text-[13px]
                        font-semibold
                        text-[#34414c]
                        sm:text-sm
                      "
                    >
                      Konfirmasi Kata Sandi
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        strokeWidth={1.8}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                        "
                      />

                      <input
                        id="register-confirm-password"
                        name="konfirmasiPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          registerForm.konfirmasiPassword
                        }
                        onChange={handleRegisterChange}
                        placeholder="Ulangi kata sandi"
                        autoComplete="new-password"
                        className="
                          h-[52px]
                          w-full
                          rounded-[14px]
                          border
                          border-transparent
                          bg-[#eaf4eb]
                          pl-11
                          pr-12
                          text-[14px]
                          text-[#26313b]
                          outline-none
                          transition
                          placeholder:text-[#89979d]
                          focus:border-[#23652d]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#23652d]/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7c8b91]
                          transition
                          hover:text-[#23652d]
                        "
                        aria-label={
                          showConfirmPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* REGISTER BUTTON */}

                  <button
                    type="submit"
                    className="
                      mt-2
                      flex
                      h-[50px]
                      w-full
                      items-center
                      justify-center
                      rounded-[14px]
                      bg-[#23652d]
                      text-[14px]
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[#1d5626]
                      active:scale-[0.99]
                    "
                  >
                    Daftar Sekarang
                  </button>
                </form>

                {/* DIVIDER */}

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#e6ebe6]" />

                  <span className="text-[11px] text-[#9aa49d]">
                    atau
                  </span>

                  <div className="h-px flex-1 bg-[#e6ebe6]" />
                </div>

                {/* GOOGLE REGISTER */}

                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  className="
                    flex
                    h-[48px]
                    w-full
                    items-center
                    justify-center
                    gap-2.5
                    rounded-[14px]
                    border
                    border-[#dfe6df]
                    bg-white
                    text-[13px]
                    font-semibold
                    text-[#46535a]
                    transition
                    hover:bg-[#f7faf7]
                    hover:border-[#cfdacf]
                    active:scale-[0.99]
                  "
                >
                  <GoogleLogo />

                  <span>
                    Daftar dengan Google
                  </span>
                </button>

                {/* LOGIN LINK */}

                <div className="mt-6 text-center">
                  <p
                    className="
                      text-[12px]
                      text-[#7c8782]
                      sm:text-[13px]
                    "
                  >
                    Sudah punya akun?{" "}

                    <button
                      type="button"
                      onClick={() => changeMode("login")}
                      className="
                        font-semibold
                        text-[#23652d]
                        hover:underline
                      "
                    >
                      Masuk sekarang
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <p
            className="
              mt-5
              text-center
              text-[10px]
              text-[#9aa49d]
              sm:text-[11px]
            "
          >
            © 2026 Dapur Cerdas · Teman Bunda untuk Si Kecil
          </p>
        </div>
      </main>
    </div>
  );
}

export default Auth;