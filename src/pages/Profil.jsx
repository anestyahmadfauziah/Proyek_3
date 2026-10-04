import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Badge,
  Pencil,
  LockKeyhole,
  LogOut,
  Camera,
  ChevronRight,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";

function Profil() {
  const navigate = useNavigate();

  /* =====================================================
     USER STATE
  ===================================================== */

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     AMBIL USER DARI SUPABASE
  ===================================================== */

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Gagal mengambil data user:", error);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    /* ===================================================
       CEK JIKA STATUS LOGIN BERUBAH
    =================================================== */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =====================================================
     DATA USER
  ===================================================== */

  const nama =
    user?.user_metadata?.nama ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Pengguna";

  const email = user?.email || "-";

  /*
   * Supabase Auth menggunakan UUID sebagai ID user.
   * Kita tampilkan sebagian ID supaya lebih pendek.
   */
  const idPengguna = user?.id
    ? `#${user.id.substring(0, 8)}`
    : "-";

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin keluar?"
    );

    if (!yakin) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Gagal logout:", error);
      alert("Gagal keluar dari akun.");
      return;
    }

    navigate("/login", { replace: true });
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8f5] font-jakarta">
        <p className="text-sm text-slate-500">
          Memuat profil...
        </p>
      </div>
    );
  }

  /* =====================================================
     TAMPILAN
  ===================================================== */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f8f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}
    <header className="bg-[#f1f5f1]">
  <div
    className="
      mx-auto
      flex
      w-full
      max-w-5xl
      items-center
      gap-3
      px-4
      py-4
      sm:px-6
      sm:py-5
      lg:px-8
    "
  >

    {/* Tombol kembali */}
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
        sm:h-10
        sm:w-10
      "
      aria-label="Kembali"
    >
      <ArrowLeft
        size={23}
        strokeWidth={2}
        className="sm:h-6 sm:w-6"
      />
    </button>

    {/* Judul + Subjudul */}
    <div>
      <h1
        className="
          font-playfair
          text-xl
          font-bold
          text-[#24642e]
          sm:text-2xl
        "
      >
        Profil Saya
      </h1>

      <p
        className="
          mt-0.5
          text-xs
          text-slate-500
          sm:text-sm
        "
      >
        Kelola informasi akun Anda dengan mudah.
      </p>
    </div>

  </div>
</header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-5xl
          px-4
          pb-8
          sm:px-6
          lg:px-8
        "
      >

       {/* ===================================================
    PROFILE SUMMARY
=================================================== */}

<section
  className="
    relative
    mt-0
    overflow-hidden
    rounded-b-[20px]
    border
    border-[#d9efdc]
    bg-[#f5fbf5]
    px-5
    py-5
    shadow-sm
    sm:rounded-[20px]
    sm:px-7
    sm:py-6
  "
>
  {/* Background dekorasi sederhana */}
  <div
    className="
      pointer-events-none
      absolute
      -right-16
      -top-20
      h-48
      w-48
      rounded-full
      bg-[#e8f6e9]
      opacity-70
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      -bottom-24
      right-20
      h-44
      w-44
      rounded-full
      bg-[#edf8ee]
      opacity-80
    "
  />

  {/* Isi Profile */}

  <div
    className="
      relative
      flex
      items-center
      gap-4
      sm:gap-6
    "
  >

    {/* Avatar */}

    <div className="relative shrink-0">

      <div
        className="
          flex
          h-[92px]
          w-[92px]
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border-[4px]
          border-white
          bg-[#e5f3e7]
          shadow-sm
          sm:h-[112px]
          sm:w-[112px]
        "
      >
        <UserRound
          size={55}
          strokeWidth={1.5}
          className="
            text-[#3d9951]
            sm:h-[68px]
            sm:w-[68px]
          "
        />
      </div>


      {/* Tombol Kamera */}

      <button
        type="button"
        onClick={() => {
          console.log("Ubah foto profil");
        }}
        className="
          absolute
          bottom-0
          right-0
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border-[3px]
          border-white
          bg-[#287341]
          text-white
          shadow-sm
          transition
          hover:bg-[#205e35]
          sm:h-9
          sm:w-9
        "
        aria-label="Ubah foto profil"
      >
        <Camera
          size={15}
          strokeWidth={2.2}
        />
      </button>

    </div>


    {/* Informasi Pengguna */}

    <div className="min-w-0">

      {/* Halo */}

      <p
        className="
          text-sm
          text-slate-500
          sm:text-base
        "
      >
        Halo,
      </p>


      {/* Nama */}

      <h2
        className="
          mt-0.5
          break-words
          text-2xl
          font-bold
          leading-tight
          text-[#202833]
          sm:text-[28px]
        "
      >
        {nama}
      </h2>


      {/* Badge Pengguna */}

      <div
        className="
          mt-2
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-[#d9f8e3]
          px-3
          py-1.5
          text-xs
          font-bold
          text-[#287341]
          sm:text-sm
        "
      >
        <UserRound
          size={14}
          strokeWidth={2.2}
        />

        Pengguna
      </div>


    </div>

  </div>

</section>

        {/* ===================================================
    INFORMASI AKUN
=================================================== */}

<section
  className="
    mt-5
    rounded-[20px]
    border
    border-slate-100
    bg-white
    p-4
    shadow-sm
    sm:p-5
  "
>
  {/* Header Informasi Akun */}

  <div className="mb-4 flex items-center gap-3">
    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#d9f8e3]
        text-[#287341]
      "
    >
      <UserRound
        size={20}
        strokeWidth={2}
      />
    </div>

    <div>
      <h2
        className="
          text-sm
          font-bold
          text-[#202833]
          sm:text-base
        "
      >
        Informasi Akun
      </h2>

      <p
        className="
          mt-0.5
          text-[11px]
          text-slate-400
          sm:text-xs
        "
      >
        Data diri Anda yang terdaftar di aplikasi.
      </p>
    </div>
  </div>


  {/* =================================================
      DATA AKUN
  ================================================= */}

  <div
    className="
      grid
      grid-cols-1
      gap-3
      md:grid-cols-2
    "
  >

    {/* Nama */}

    <ProfileInfo
      icon={<UserRound size={18} />}
      label="Nama"
      value={nama}
    />


    {/* Email */}

    <ProfileInfo
      icon={<Mail size={18} />}
      label="Email"
      value={email}
    />


    {/* ID Pengguna */}

    <ProfileInfo
      icon={<Badge size={18} />}
      label="ID Pengguna"
      value={idPengguna}
    />


    {/* Ubah Profil */}

    <ProfileAction
      icon={<Pencil size={18} />}
      title="Ubah Profil"
      description="Ubah nama tampilan"
      onClick={() => {
        console.log("Ubah profil");
      }}
    />

  </div>


  {/* =================================================
      GANTI KATA SANDI
  ================================================= */}

  <div className="mt-3">
    <ProfileAction
      icon={<LockKeyhole size={18} />}
      title="Ganti Kata Sandi"
      description="Minimal 8 karakter"
      onClick={() => {
        console.log("Ganti kata sandi");
      }}
    />
  </div>

</section>

        {/* ===================================================
            LOGOUT
        =================================================== */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-5
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-[16px]
            border
            border-red-200
            bg-white
            text-sm
            font-bold
            text-[#d33232]
            transition
            hover:bg-red-50
            sm:h-12
            sm:text-base
          "
        >

          <LogOut
            size={19}
            strokeWidth={2.2}
          />

          Keluar

        </button>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <p
          className="
            mt-3
            pb-3
            text-center
            text-xs
            text-slate-400
            sm:text-sm
          "
        >
          © 2026 Dapur Cerdas · Bijak Mengolah, Sehat Bertumbuh
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
    <div
      className="
        flex
        min-h-[70px]
        items-center
        gap-3
        rounded-[14px]
        border
        border-slate-100
        bg-[#f8fbf9]
        px-3
        py-2.5
        transition
        hover:bg-[#f3f9f4]
        sm:min-h-[76px]
        sm:px-4
      "
    >

      {/* Icon */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-[11px]
          bg-[#dff7e6]
          text-[#287341]
          sm:h-10
          sm:w-10
        "
      >
        {icon}
      </div>


      {/* Text */}

      <div className="min-w-0 flex-1">

        <p
          className="
            text-[11px]
            text-slate-400
            sm:text-xs
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            max-w-full
            truncate
            text-sm
            font-semibold
            text-[#202833]
            sm:text-sm
          "
          title={value}
        >
          {value}
        </p>

      </div>


      {/* Arrow */}

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-400"
      />

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
      className="
        flex
        min-h-[70px]
        w-full
        items-center
        gap-3
        rounded-[14px]
        border
        border-slate-100
        bg-[#f8fbf9]
        px-3
        py-2.5
        text-left
        transition
        hover:bg-[#f3f9f4]
        sm:min-h-[76px]
        sm:px-4
      "
    >

      {/* Icon */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-[11px]
          bg-[#fff1d9]
          text-[#e79b28]
          sm:h-10
          sm:w-10
        "
      >
        {icon}
      </div>


      {/* Text */}

      <div className="min-w-0 flex-1">

        <p
          className="
            text-sm
            font-semibold
            text-[#202833]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[11px]
            text-slate-400
            sm:text-xs
          "
        >
          {description}
        </p>

      </div>


      {/* Arrow */}

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-400"
      />

    </button>
  );
}

export default Profil;