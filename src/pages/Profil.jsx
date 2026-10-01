import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Badge,
  Pencil,
  LockKeyhole,
  LogOut,
  ChevronRight,
} from "lucide-react";

function Profil() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin keluar?"
    );

    if (!yakin) return;

    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f8f5] text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#f1f5f1]">

        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-5 sm:px-8 sm:py-7 lg:px-10">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#202833] transition hover:bg-white/70 sm:h-11 sm:w-11"
            aria-label="Kembali"
          >
            <ArrowLeft
              size={30}
              strokeWidth={2}
              className="sm:h-8 sm:w-8"
            />
          </button>

          <h1 className="font-playfair text-3xl font-bold text-[#24642e] sm:text-4xl">
            Profil Saya
          </h1>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto w-full max-w-5xl px-5 pb-8 sm:px-8 lg:px-10">

        {/* ===================================================
            PROFILE SUMMARY
        =================================================== */}

        <section className="rounded-b-[26px] bg-white px-5 py-5 text-center shadow-sm sm:rounded-[26px] sm:px-8 sm:py-7">

          <h2 className="text-2xl font-bold sm:text-3xl">
            Bunda Test
          </h2>

          <p className="mt-1 text-base text-slate-500 sm:text-lg">
            bunda@test.dev
          </p>

          <div className="mt-3 inline-flex rounded-full bg-[#d9f8e3] px-4 py-2 text-sm font-bold text-[#287341]">
            Akun Aktif
          </div>

        </section>


        {/* ===================================================
            USER INFORMATION
        =================================================== */}

        <section className="mt-6 space-y-4">

          <ProfileInfo
            icon={<UserRound size={23} />}
            label="Nama"
            value="Bunda Test"
          />

          <ProfileInfo
            icon={<Mail size={23} />}
            label="Email"
            value="bunda@test.dev"
          />

          <ProfileInfo
            icon={<Badge size={23} />}
            label="ID Pengguna"
            value="#7"
          />

        </section>


        {/* ===================================================
            PROFILE ACTIONS
        =================================================== */}

        <section className="mt-6 space-y-4">

          <ProfileAction
            icon={<Pencil size={23} />}
            title="Ubah Profil"
            description="Ubah nama tampilan"
            onClick={() => {
              console.log("Ubah profil");
            }}
          />

          <ProfileAction
            icon={<LockKeyhole size={23} />}
            title="Ganti Kata Sandi"
            description="Minimal 8 karakter"
            onClick={() => {
              console.log("Ganti kata sandi");
            }}
          />

        </section>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-[18px] border border-red-200 bg-white text-lg font-bold text-[#d33232] transition hover:bg-red-50 sm:h-14"
        >
          <LogOut
            size={23}
            strokeWidth={2.2}
          />

          Keluar
        </button>


        {/* Footer */}
        <p className="mt-4 pb-3 text-center text-sm text-slate-400 sm:text-base">
          Dapur Cerdas v1.0 • Cegah stunting sejak dapur
        </p>

      </main>

    </div>
  );
}


/* =========================================================
   PROFILE INFO
========================================================= */

function ProfileInfo({ icon, label, value }) {
  return (
    <div className="flex min-h-[94px] items-center gap-4 rounded-[22px] border border-slate-100 bg-white px-5 py-4 shadow-sm sm:min-h-[96px] sm:px-6">

      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#f1f3f4] text-slate-500 sm:h-14 sm:w-14">
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0">

        <p className="text-sm text-slate-400 sm:text-base">
          {label}
        </p>

        <p className="mt-1 truncate text-lg font-medium sm:text-xl">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   PROFILE ACTION
========================================================= */

function ProfileAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[94px] w-full items-center gap-4 rounded-[22px] border border-slate-100 bg-white px-5 py-4 text-left shadow-sm transition hover:bg-slate-50 sm:min-h-[96px] sm:px-6"
    >

      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center text-slate-600 sm:h-14 sm:w-14">
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">

        <p className="text-lg font-medium sm:text-xl">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-400 sm:text-base">
          {description}
        </p>

      </div>

      {/* Arrow */}
      <ChevronRight
        size={24}
        className="shrink-0 text-slate-400"
      />

    </button>
  );
}

export default Profil;