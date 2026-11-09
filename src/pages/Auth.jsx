import { useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
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
     LUPA PASSWORD STATE
  ======================================================= */

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  /* =======================================================
     CLOUDFLARE TURNSTILE CAPTCHA
  ======================================================= */

  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  /* =======================================================
     GANTI MODE
  ======================================================= */

  const changeMode = (newMode) => {
    setMode(newMode);
    setCaptchaToken("");
    captchaRef.current?.reset();

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

    if (!captchaToken) {
      alert("Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
      options: {
        captchaToken,
      },
    });

    // Token Turnstile hanya boleh digunakan sekali.
    captchaRef.current?.reset();
    setCaptchaToken("");

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

  if (!captchaToken) {
    alert("Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,

      options: {
        data: {
          nama: registerForm.nama,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
        captchaToken,
      },
    });

    // Token Turnstile hanya boleh digunakan sekali.
    captchaRef.current?.reset();
    setCaptchaToken("");

    if (error) {
      console.error("Register Error:", error);
      alert(error.message);
      return;
    }

    if (data.user) {
      // Jika sesi langsung tersedia
      if (data.session) {
        navigate("/dashboard");
        return;
      }

      // Jika harus konfirmasi email
      alert(
        "Pendaftaran berhasil! Silakan cek Gmail kamu dan klik link konfirmasi. Setelah email dikonfirmasi, kamu akan langsung diarahkan ke Dashboard Dapur Cerdas tanpa perlu login kembali."
      );
    }
  } catch (error) {
    console.error("Register Error:", error);
    alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
  }
};

  
  /* =======================================================
     LUPA PASSWORD - KIRIM OTP KE EMAIL
  ======================================================= */

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const email = forgotEmail.trim().toLowerCase();

    if (!email) {
      alert("Masukkan email yang terdaftar terlebih dahulu.");
      return;
    }

    setAuthLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setAuthLoading(false);

    if (error) {
      console.error("Forgot Password Error:", error);
      alert(error.message);
      return;
    }

    // Supabase mengirim OTP apabila template Reset Password memakai {{ .Token }}.
    setForgotEmail(email);
    setOtp("");
    setMode("verifyOtp");
    alert(
      "Jika email terdaftar, kode OTP akan dikirim. Silakan periksa kotak masuk atau folder spam Gmail."
    );
  };

  /* =========================================================
   CEK JENIS AKUN
========================================================= */

const isGoogleOnlyAccount = (user) => {
  const providers = user?.app_metadata?.providers || [];

  return (
    providers.includes("google") &&
    !providers.includes("email")
  );
};

 /* =========================================================
   LUPA PASSWORD - VERIFIKASI OTP
========================================================= */

const handleVerifyOtpSubmit = async (e) => {
  e.preventDefault();

  if (!forgotEmail || !/^\d{6}$/.test(otp.trim())) {
    alert("Masukkan kode OTP 6 digit yang dikirim ke email.");
    return;
  }

  setAuthLoading(true);

  const { data, error } = await supabase.auth.verifyOtp({
    email: forgotEmail,
    token: otp.trim(),
    type: "recovery",
  });

  setAuthLoading(false);

  if (error) {
    console.error("Verify OTP Error:", error);

    alert(
      "Kode OTP tidak valid atau sudah kedaluwarsa. Silakan coba lagi."
    );

    return;
  }

  // CEK JENIS AKUN
  if (isGoogleOnlyAccount(data.user)) {
    await supabase.auth.signOut();

    setOtp("");
    setMode("login");
    navigate("/login");

    alert(
      "Akun ini terdaftar menggunakan Google. Kata sandi tidak dapat diubah melalui fitur ini. Silakan masuk menggunakan akun Google."
    );

    return;
  }

  // Jika akun menggunakan email dan password
  setNewPassword("");
  setConfirmNewPassword("");
  setMode("resetPassword");
};

  /* =========================================================
   LUPA PASSWORD - SIMPAN PASSWORD BARU
========================================================= */

const handleUpdatePasswordSubmit = async (e) => {
  e.preventDefault();

  if (newPassword.length < 8) {
    alert("Kata sandi baru minimal 8 karakter.");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert("Konfirmasi kata sandi baru tidak sama.");
    return;
  }

  setAuthLoading(true);

  // Ambil informasi pengguna yang sedang terverifikasi
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    setAuthLoading(false);

    alert("Sesi verifikasi tidak ditemukan. Silakan ulangi proses lupa kata sandi.");

    return;
  }

  // CEK JENIS AKUN
  if (isGoogleOnlyAccount(userData.user)) {
    await supabase.auth.signOut();

    setAuthLoading(false);
    setMode("login");
    navigate("/login");

    alert(
      "Akun Google tidak dapat mengubah kata sandi melalui fitur ini."
    );

    return;
  }

  // UPDATE PASSWORD
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    setAuthLoading(false);

    console.error("Update Password Error:", error);

    alert(error.message);

    return;
  }

  // Keluar setelah password berhasil diubah
  await supabase.auth.signOut();

  setAuthLoading(false);

  setLoginForm({
    email: forgotEmail,
    password: "",
  });

  setForgotEmail("");
  setOtp("");
  setNewPassword("");
  setConfirmNewPassword("");

  setMode("login");
  navigate("/login");

  alert(
    "Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru."
  );
};

  /* =======================================================
     GOOGLE LOGIN
  ======================================================= */

  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",

    options: {
      redirectTo: `${window.location.origin}/dashboard`,

      queryParams: {
        prompt: "select_account",
      },
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

      queryParams: {
        prompt: "select_account",
      },
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
                    Selamat Datang!
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
                    Masuk untuk mengelola kebutuhan nutrisi dan makanan dengan lebih mudah.
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
                      onClick={() => {
                        setForgotEmail(loginForm.email);
                        setMode("forgot");
                      }}
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

                  {/* CLOUDFLARE TURNSTILE CAPTCHA */}

                  <div className="flex justify-center pt-1">
                    {turnstileSiteKey ? (
                      <Turnstile
                        ref={captchaRef}
                        siteKey={turnstileSiteKey}
                        onSuccess={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken("")}
                        onError={() => setCaptchaToken("")}
                      />
                    ) : (
                      <p className="text-xs text-red-600">
                        Konfigurasi CAPTCHA belum tersedia.
                      </p>
                    )}
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
                    Yuk, Buat Akun!
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
                    Kelola kebutuhan sehari-hari dengan lebih cerdas
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
                      Nama Lengkap
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

                  {/* CLOUDFLARE TURNSTILE CAPTCHA */}

                  <div className="flex justify-center pt-1">
                    {turnstileSiteKey ? (
                      <Turnstile
                        ref={captchaRef}
                        siteKey={turnstileSiteKey}
                        onSuccess={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken("")}
                        onError={() => setCaptchaToken("")}
                      />
                    ) : (
                      <p className="text-xs text-red-600">
                        Konfigurasi CAPTCHA belum tersedia.
                      </p>
                    )}
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

            {/* =================================================
                FORGOT PASSWORD - EMAIL
            ================================================= */}

            {mode === "forgot" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4eb] text-[#23652d]">
                    <Mail size={25} />
                  </div>
                  <h1 className="text-[24px] font-bold tracking-tight text-[#23652d] sm:text-[27px]">
                    Lupa Kata Sandi?
                  </h1>
                  <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-relaxed text-[#7c8b7c] sm:text-sm">
                    Masukkan email yang terdaftar. Kami akan mengirimkan kode OTP untuk mengatur ulang kata sandi.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="mb-1.5 block text-[13px] font-semibold text-[#34414c] sm:text-sm">
                      Email Aktif
                    </label>
                    <div className="relative">
                      <Mail size={18} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8b91]" />
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="nama@email.com"
                        autoComplete="email"
                        required
                        className="h-[52px] w-full rounded-[14px] border border-transparent bg-[#eaf4eb] pl-11 pr-4 text-[14px] text-[#26313b] outline-none transition placeholder:text-[#89979d] focus:border-[#23652d] focus:bg-white focus:ring-2 focus:ring-[#23652d]/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="mt-2 flex h-[50px] w-full items-center justify-center rounded-[14px] bg-[#23652d] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d5626] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? "Mengirim kode..." : "Kirim Kode OTP"}
                  </button>
                </form>

                <button type="button" onClick={backToLogin} className="mt-6 flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-[#23652d] hover:underline">
                  <ArrowLeft size={16} />
                  Kembali ke halaman masuk
                </button>
              </>
            )}

            {/* =================================================
                FORGOT PASSWORD - VERIFY OTP
            ================================================= */}

            {mode === "verifyOtp" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4eb] text-[#23652d]">
                    <LockKeyhole size={25} />
                  </div>
                  <h1 className="text-[24px] font-bold tracking-tight text-[#23652d] sm:text-[27px]">
                    Verifikasi OTP
                  </h1>
                  <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-relaxed text-[#7c8b7c] sm:text-sm">
                    Masukkan kode 6 digit yang dikirim ke <strong>{forgotEmail}</strong>.
                  </p>
                </div>

                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="recovery-otp" className="mb-1.5 block text-[13px] font-semibold text-[#34414c] sm:text-sm">
                      Kode OTP
                    </label>
                    <input
                      id="recovery-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Masukkan 6 digit kode"
                      required
                      className="h-[52px] w-full rounded-[14px] border border-transparent bg-[#eaf4eb] px-4 text-center text-[20px] font-semibold tracking-[0.35em] text-[#26313b] outline-none transition placeholder:text-[13px] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#89979d] focus:border-[#23652d] focus:bg-white focus:ring-2 focus:ring-[#23652d]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading || otp.length !== 6}
                    className="mt-2 flex h-[50px] w-full items-center justify-center rounded-[14px] bg-[#23652d] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d5626] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? "Memverifikasi..." : "Verifikasi Kode"}
                  </button>
                </form>

                <button type="button" onClick={() => setMode("forgot")} className="mt-4 w-full text-center text-[12px] font-semibold text-[#23652d] hover:underline">
                  Kirim ulang OTP / Ganti email
                </button>
                <button type="button" onClick={backToLogin} className="mt-3 flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-[#23652d] hover:underline">
                  <ArrowLeft size={16} />
                  Kembali ke halaman masuk
                </button>
              </>
            )}

            {/* =================================================
                FORGOT PASSWORD - NEW PASSWORD
            ================================================= */}

            {mode === "resetPassword" && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4eb] text-[#23652d]">
                    <LockKeyhole size={25} />
                  </div>
                  <h1 className="text-[24px] font-bold tracking-tight text-[#23652d] sm:text-[27px]">
                    Buat Kata Sandi Baru
                  </h1>
                  <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-relaxed text-[#7c8b7c] sm:text-sm">
                    Buat kata sandi baru yang kuat dan mudah kamu ingat.
                  </p>
                </div>

                <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="new-password" className="mb-1.5 block text-[13px] font-semibold text-[#34414c] sm:text-sm">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8b91]" />
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        required
                        className="h-[52px] w-full rounded-[14px] border border-transparent bg-[#eaf4eb] pl-11 pr-12 text-[14px] text-[#26313b] outline-none transition placeholder:text-[#89979d] focus:border-[#23652d] focus:bg-white focus:ring-2 focus:ring-[#23652d]/10"
                      />
                      <button type="button" onClick={() => setShowNewPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c8b91] hover:text-[#23652d]" aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-new-password" className="mb-1.5 block text-[13px] font-semibold text-[#34414c] sm:text-sm">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8b91]" />
                      <input
                        id="confirm-new-password"
                        type={showConfirmNewPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Ulangi kata sandi baru"
                        autoComplete="new-password"
                        required
                        className="h-[52px] w-full rounded-[14px] border border-transparent bg-[#eaf4eb] pl-11 pr-12 text-[14px] text-[#26313b] outline-none transition placeholder:text-[#89979d] focus:border-[#23652d] focus:bg-white focus:ring-2 focus:ring-[#23652d]/10"
                      />
                      <button type="button" onClick={() => setShowConfirmNewPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c8b91] hover:text-[#23652d]" aria-label={showConfirmNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                        {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-[11px] text-[#8a948d]">
                    <Check size={13} />
                    Gunakan minimal 8 karakter
                  </p>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="mt-2 flex h-[50px] w-full items-center justify-center rounded-[14px] bg-[#23652d] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#1d5626] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                  </button>
                </form>
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
            © 2026 Dapur Cerdas · Bijak Mengolah, Sehat Bertumbuh
          </p>
        </div>
      </main>
    </div>
  );
}

export default Auth;