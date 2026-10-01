import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasiPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.konfirmasiPassword) {
      alert("Konfirmasi kata sandi tidak sama.");
      return;
    }

    // Untuk sementara setelah daftar langsung ke dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f3faf4] text-[#26313b]">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] px-5 py-6 sm:px-8 md:px-10 lg:px-12">

        {/* Header */}
        <header className="mb-8 text-center sm:mb-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-poppins text-xl font-bold text-[#23652d] sm:text-2xl"
          >
            Dapur Cerdas
          </button>
        </header>

        {/* Content */}
        <main className="mx-auto w-full max-w-[760px]">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mb-5 flex items-center gap-2 font-poppins text-sm font-medium text-slate-500 transition hover:text-[#23652d]"
          >
            <ArrowLeft size={18} />
            Kembali ke Login
          </button>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-poppins text-3xl font-bold tracking-tight text-[#23652d] sm:text-4xl md:text-[42px]">
              Daftar Akun Bunda
            </h1>

            <p className="mt-3 max-w-xl font-poppins text-base leading-relaxed text-[#819044] sm:text-lg">
              Mulai langkah cerdas penuhi nutrisi terbaik untuk
              tumbuh kembang optimal Si Kecil.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nama */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="nama"
                  className="font-poppins text-base font-semibold text-[#35414c] sm:text-lg"
                >
                  Nama Lengkap Bunda
                </label>

                <span className="font-poppins text-sm text-slate-500">
                  Wajib diisi
                </span>
              </div>

              <div className="flex h-[60px] items-center rounded-2xl bg-[#e8f5e9] px-4 transition focus-within:ring-2 focus-within:ring-[#2a7133]/30 sm:h-[68px] sm:px-5">
                <User
                  size={24}
                  strokeWidth={1.8}
                  className="mr-4 shrink-0 text-slate-500"
                />

                <input
                  id="nama"
                  name="nama"
                  type="text"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="cth. Sarah Nurhaliza"
                  required
                  className="min-w-0 flex-1 bg-transparent font-poppins text-base text-slate-700 outline-none placeholder:text-slate-500 sm:text-lg"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-poppins text-base font-semibold text-[#35414c] sm:text-lg"
              >
                Email Aktif
              </label>

              <div className="flex h-[60px] items-center rounded-2xl bg-[#e8f5e9] px-4 transition focus-within:ring-2 focus-within:ring-[#2a7133]/30 sm:h-[68px] sm:px-5">
                <Mail
                  size={24}
                  strokeWidth={1.8}
                  className="mr-4 shrink-0 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="bunda@email.com"
                  required
                  className="min-w-0 flex-1 bg-transparent font-poppins text-base text-slate-700 outline-none placeholder:text-slate-500 sm:text-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-poppins text-base font-semibold text-[#35414c] sm:text-lg"
              >
                Buat Kata Sandi
              </label>

              <div className="flex h-[60px] items-center rounded-2xl bg-[#e8f5e9] px-4 transition focus-within:ring-2 focus-within:ring-[#2a7133]/30 sm:h-[68px] sm:px-5">
                <LockKeyhole
                  size={24}
                  strokeWidth={1.8}
                  className="mr-4 shrink-0 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter unik"
                  required
                  minLength={8}
                  className="min-w-0 flex-1 bg-transparent font-poppins text-base text-slate-700 outline-none placeholder:text-slate-500 sm:text-lg"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-3 shrink-0 text-slate-500 hover:text-[#23652d]"
                  aria-label="Tampilkan password"
                >
                  {showPassword ? (
                    <EyeOff size={23} />
                  ) : (
                    <Eye size={23} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="konfirmasiPassword"
                className="mb-2 block font-poppins text-base font-semibold text-[#35414c] sm:text-lg"
              >
                Konfirmasi Kata Sandi
              </label>

              <div className="flex h-[60px] items-center rounded-2xl bg-[#e8f5e9] px-4 transition focus-within:ring-2 focus-within:ring-[#2a7133]/30 sm:h-[68px] sm:px-5">
                <RotateCcw
                  size={24}
                  strokeWidth={1.8}
                  className="mr-4 shrink-0 text-slate-500"
                />

                <input
                  id="konfirmasiPassword"
                  name="konfirmasiPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.konfirmasiPassword}
                  onChange={handleChange}
                  placeholder="Ketik ulang kata sandi"
                  required
                  minLength={8}
                  className="min-w-0 flex-1 bg-transparent font-poppins text-base text-slate-700 outline-none placeholder:text-slate-500 sm:text-lg"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="ml-3 shrink-0 text-slate-500 hover:text-[#23652d]"
                  aria-label="Tampilkan konfirmasi password"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={23} />
                  ) : (
                    <Eye size={23} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-[#196b26] px-5 font-poppins text-base font-bold text-white shadow-sm transition hover:bg-[#145b20] active:scale-[0.99] sm:h-[64px] sm:text-lg"
            >
              Daftar & Mulai Dapur Cerdas
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-300" />

            <span className="shrink-0 font-poppins text-xs uppercase tracking-wider text-slate-500 sm:text-sm">
              atau daftar instan
            </span>

            <div className="h-px flex-1 bg-slate-300" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="flex h-[54px] w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white font-poppins text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:h-[60px] sm:text-lg"
          >
            <span className="text-xl font-bold text-red-500">G</span>
            Lanjutkan dengan Google
          </button>

          {/* Login */}
          <p className="pb-8 pt-7 text-center font-poppins text-sm text-slate-600 sm:text-base">
            Sudah punya akun Bunda?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-[#23652d] hover:underline"
            >
              Masuk Sekarang
            </button>
          </p>
        </main>
      </div>
    </div>
  );
}

export default Register;