import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Utensils,
} from "lucide-react";

const notifikasi = [
  {
    id: 1,
    nama: "Telur Ayam",
    jumlah: "50 butir",
    status: "Kedaluwarsa",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    nama: "Ikan Tuna",
    jumlah: "1000 gram",
    status: "Kedaluwarsa",
    image:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=300&q=80",
  },
];

function Notifikasi() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eaf8ec] text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#eaf8ec]">

        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 pb-4 pt-5 sm:px-8 sm:pt-7 lg:px-10">

          {/* Tombol kembali */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#202833] transition hover:bg-white/60 sm:h-11 sm:w-11"
            aria-label="Kembali"
          >
            <ArrowLeft
              size={30}
              strokeWidth={2}
              className="sm:h-8 sm:w-8"
            />
          </button>

          <h1 className="font-playfair text-3xl font-bold text-[#24642e] sm:text-4xl">
            Notifikasi
          </h1>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8 lg:px-10">

        {/* Judul kategori */}
        <div className="mb-4 mt-4 flex items-center justify-between gap-4 sm:mt-5">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2c7] text-[#e28d00]">
              <AlertTriangle
                size={23}
                strokeWidth={2}
              />
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              Perlu Diolah
            </h2>

          </div>

          <span className="shrink-0 rounded-full bg-[#fff0cf] px-4 py-2 text-sm font-bold text-[#b76b00] sm:text-base">
            {notifikasi.length} bahan
          </span>

        </div>

        {/* ===================================================
            LIST NOTIFIKASI
        =================================================== */}

        <div className="space-y-4">

          {notifikasi.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onRecipe={() => {
                // Nanti bisa diarahkan ke halaman resep
                console.log(`Cari resep untuk ${item.nama}`);
              }}
            />
          ))}

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   NOTIFICATION CARD
========================================================= */

function NotificationCard({ item, onRecipe }) {
  return (
    <article className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[26px] sm:p-5 lg:p-6">

      {/* Informasi bahan */}
      <div className="flex items-center gap-4 sm:gap-5">

        {/* Gambar */}
        <img
          src={item.image}
          alt={item.nama}
          className="h-[78px] w-[78px] shrink-0 rounded-[18px] object-cover sm:h-[82px] sm:w-[82px] lg:h-[88px] lg:w-[88px]"
        />

        {/* Detail */}
        <div className="min-w-0 flex-1">

          <h3 className="truncate text-xl font-bold text-[#202833] sm:text-2xl">
            {item.nama}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-[#c73535]">

            <AlertTriangle
              size={17}
              strokeWidth={2.5}
              className="shrink-0"
            />

            <span className="text-base font-semibold sm:text-lg">
              {item.status}
            </span>

          </div>

          <p className="mt-1 text-base text-slate-500 sm:text-lg">
            {item.jumlah}
          </p>

        </div>

      </div>

      {/* Tombol resep */}
      <button
        type="button"
        onClick={onRecipe}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[#d8f8e3] text-base font-bold text-[#246b35] transition hover:bg-[#c7f2d6] sm:h-13 sm:text-lg"
      >
        <Utensils
          size={21}
          strokeWidth={2.5}
        />

        <span>Olah Jadi Resep</span>
      </button>

    </article>
  );
}

export default Notifikasi;