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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

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

          {/* Back */}

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


          {/* Title */}

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
            rounded-b-[22px]
            bg-white
            px-4
            py-5
            text-center
            shadow-sm
            sm:rounded-[22px]
            sm:px-6
            sm:py-6
          "
        >

          <h2
            className="
              break-words
              text-lg
              font-bold
              sm:text-xl
            "
          >
            {nama}
          </h2>


          <p
            className="
              mt-1
              break-all
              text-sm
              text-slate-500
            "
          >
            {email}
          </p>


          <div
            className="
              mt-3
              inline-flex
              rounded-full
              bg-[#d9f8e3]
              px-3
              py-1.5
              text-xs
              font-bold
              text-[#287341]
            "
          >
            Akun Aktif
          </div>

        </section>


        {/* ===================================================
            USER INFORMATION
        =================================================== */}

        <section className="mt-5 space-y-3">

          <ProfileInfo
            icon={<UserRound size={19} />}
            label="Nama"
            value={nama}
          />


          <ProfileInfo
            icon={<Mail size={19} />}
            label="Email"
            value={email}
          />


          <ProfileInfo
            icon={<Badge size={19} />}
            label="ID Pengguna"
            value={idPengguna}
          />

        </section>


        {/* ===================================================
            PROFILE ACTIONS
        =================================================== */}

        <section className="mt-5 space-y-3">

          <ProfileAction
            icon={<Pencil size={19} />}
            title="Ubah Profil"
            description="Ubah nama tampilan"
            onClick={() => {
              console.log("Ubah profil");
            }}
          />


          <ProfileAction
            icon={<LockKeyhole size={19} />}
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
    <div
      className="
        flex
        min-h-[76px]
        items-center
        gap-3
        rounded-[18px]
        border
        border-slate-100
        bg-white
        px-4
        py-3
        shadow-sm
        sm:min-h-[82px]
        sm:px-5
      "
    >

      {/* Icon */}

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-[12px]
          bg-[#f1f3f4]
          text-slate-500
          sm:h-11
          sm:w-11
        "
      >
        {icon}
      </div>


      {/* Text */}

      <div className="min-w-0">

        <p
          className="
            text-xs
            text-slate-400
            sm:text-sm
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
            font-medium
            sm:text-base
          "
          title={value}
        >
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
      className="
        flex
        min-h-[76px]
        w-full
        items-center
        gap-3
        rounded-[18px]
        border
        border-slate-100
        bg-white
        px-4
        py-3
        text-left
        shadow-sm
        transition
        hover:bg-slate-50
        sm:min-h-[82px]
        sm:px-5
      "
    >

      {/* Icon */}

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          text-slate-600
          sm:h-11
          sm:w-11
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
            sm:text-base
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-xs
            text-slate-400
            sm:text-sm
          "
        >
          {description}
        </p>

      </div>


      {/* Arrow */}

      <ChevronRight
        size={19}
        className="shrink-0 text-slate-400"
      />

    </button>
  );
}

export default Profil;