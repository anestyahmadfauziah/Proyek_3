import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Pencil,
  LockKeyhole,
  LogOut,
  Camera,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const nama =
    user?.user_metadata?.nama ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Pengguna";
  const email = user?.email || "-";

  const handleLogout = async () => {
    const yakin = window.confirm("Apakah kamu yakin ingin keluar?");
    if (!yakin) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Gagal logout:", error);
      alert("Gagal keluar dari akun.");
      return;
    }
    navigate("/login", { replace: true });
  };

  const handleUbahProfil = async () => {
    const namaBaru = window.prompt("Masukkan nama tampilan baru:", nama);
    if (namaBaru === null) return;
    const namaBersih = namaBaru.trim();

    if (!namaBersih) {
      alert("Nama tidak boleh kosong.");
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { ...user?.user_metadata, nama: namaBersih },
    });

    if (error) {
      console.error("Gagal mengubah profil:", error);
      alert("Nama profil gagal diperbarui.");
      return;
    }

    setUser(data.user);
    alert("Nama profil berhasil diperbarui.");
  };

  const handleGantiKataSandi = async () => {
    const kataSandi = window.prompt("Masukkan kata sandi baru (minimal 8 karakter):");
    if (kataSandi === null) return;

    if (kataSandi.length < 8) {
      alert("Kata sandi minimal 8 karakter.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: kataSandi });
    if (error) {
      console.error("Gagal mengganti kata sandi:", error);
      alert("Kata sandi gagal diperbarui. Silakan login ulang jika diminta.");
      return;
    }
    alert("Kata sandi berhasil diperbarui.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#e6f4e8] via-[#f3f9f3] to-[#f8fbf8] font-jakarta">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white bg-white/80 px-10 py-8 shadow-[0_8px_28px_rgba(35,101,45,0.1)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f3e5]">
            <Loader2 size={26} className="animate-spin text-[#23652d]" />
          </div>
          <p className="text-sm font-medium text-slate-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#e6f4e8] via-[#f3f9f3] to-[#f8fbf8] font-jakarta text-[#202833]">
      {/* DEKORASI LATAR */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-green-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[55%] h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 shadow-[0_4px_20px_rgba(35,101,45,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#e1ece3] bg-white text-[#23652d] shadow-sm transition hover:-translate-x-0.5 hover:bg-[#f1f8f2] hover:shadow-md active:scale-95"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-[#1c3a22] sm:text-xl">
              Profil Saya
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 sm:text-xs">
              Kelola informasi akun Anda dengan mudah.
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        {/* PROFILE SUMMARY */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#12471f] via-[#1b6b2d] to-[#2f9e4f] px-5 py-7 text-white shadow-[0_20px_50px_rgba(18,71,31,0.3)] sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-emerald-300/20 blur-2xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
          />

          <div className="relative flex items-center gap-4 sm:gap-7">
            <div className="relative shrink-0">
              <div className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-gradient-to-br from-[#e5f3e7] to-[#cfeBd4] shadow-xl shadow-black/20 ring-4 ring-white/20 sm:h-[116px] sm:w-[116px]">
                <UserRound
                  size={55}
                  strokeWidth={1.5}
                  className="text-[#2f8a45] sm:h-[68px] sm:w-[68px]"
                />
              </div>
              <button
                type="button"
                onClick={() => alert("Fitur ubah foto profil belum tersedia.")}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-[#f79500] to-[#ffb020] text-white shadow-lg transition hover:scale-110 active:scale-95"
                aria-label="Ubah foto profil"
              >
                <Camera size={15} strokeWidth={2.2} />
              </button>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80 sm:text-base">
                Halo,
              </p>
              <h2 className="mt-0.5 break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-[32px]">
                {nama}
              </h2>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-bold backdrop-blur-md sm:text-sm">
                <UserRound size={14} strokeWidth={2.2} />
                Pengguna
              </div>
            </div>
          </div>
        </section>

        {/* INFORMASI AKUN */}
        <section className="mt-5 rounded-3xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(35,101,45,0.08)] sm:mt-6 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f6b2b] to-[#2f9e4f] text-white shadow-md shadow-green-900/20">
              <UserRound size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-[#202833] sm:text-base">
                Informasi Akun
              </h2>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400 sm:text-xs">
                Data diri Anda yang terdaftar di aplikasi.
              </p>
            </div>
          </div>

          {/* DATA AKUN: Nama dan Email */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <ProfileInfo icon={<UserRound size={18} />} label="Nama" value={nama} />
            <ProfileInfo icon={<Mail size={18} />} label="Email" value={email} />
          </div>

          {/* AKSI AKUN: dua kartu dalam grid yang sama */}
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ProfileAction
              icon={<Pencil size={18} />}
              title="Ubah Profil"
              description="Ubah nama tampilan"
              onClick={handleUbahProfil}
            />
            <ProfileAction
              icon={<LockKeyhole size={18} />}
              title="Ganti Kata Sandi"
              description="Minimal 8 karakter"
              onClick={handleGantiKataSandi}
            />
          </div>
        </section>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white text-sm font-extrabold text-[#d33232] shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:shadow-md active:scale-[0.99] sm:h-[52px] sm:text-base"
        >
          <LogOut
            size={19}
            strokeWidth={2.2}
            className="transition group-hover:-translate-x-0.5"
          />
          Keluar
        </button>

        {/* FOOTER */}
        <p className="mt-4 pb-3 text-center text-xs font-medium text-slate-400 sm:text-sm">
          © 2026 Dapur Cerdas · Bijak Mengolah, Sehat Bertumbuh
        </p>
      </main>
    </div>
  );
}

function ProfileInfo({ icon, label, value }) {
  return (
    <div className="group flex min-h-[72px] items-center gap-3 rounded-2xl border border-[#e4eee6] bg-white px-3.5 py-3 shadow-[0_4px_14px_rgba(32,40,51,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#cfe3d2] hover:shadow-[0_10px_24px_rgba(35,101,45,0.1)] sm:min-h-[78px] sm:px-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3f6e8] to-[#c9eed2] text-[#23652d] shadow-sm transition group-hover:scale-105 sm:h-11 sm:w-11">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
          {label}
        </p>
        <p
          className="mt-0.5 max-w-full truncate text-sm font-bold text-[#202833]"
          title={value}
        >
          {value}
        </p>
      </div>
      <ChevronRight size={17} className="shrink-0 text-slate-300" />
    </div>
  );
}

function ProfileAction({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-[#e4eee6] bg-white px-3.5 py-3 text-left shadow-[0_4px_14px_rgba(32,40,51,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#f3d9a4] hover:shadow-[0_10px_24px_rgba(231,155,40,0.15)] active:scale-[0.99] sm:min-h-[78px] sm:px-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fff4dd] to-[#ffe4a8] text-[#c87800] shadow-sm transition group-hover:scale-105 sm:h-11 sm:w-11">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold tracking-tight text-[#202833]">
          {title}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 sm:text-xs">
          {description}
        </p>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[#f79500] group-hover:text-white">
        <ChevronRight
          size={16}
          className="transition group-hover:translate-x-0.5"
        />
      </div>
    </button>
  );
}

export default Profil;
