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
    <div className="min-h-screen overflow-x-hidden bg-[#eaf8ec] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="bg-[#eaf8ec]">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2.5 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
          
          {/* Tombol kembali */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#202833] transition hover:bg-white/60 sm:h-10 sm:w-10"
            aria-label="Kembali"
          >
            <ArrowLeft
              size={22}
              strokeWidth={2}
            />
          </button>

          {/* Judul */}
          <h1 className="font-playfair text-xl font-bold text-[#24642e] sm:text-2xl">
            Notifikasi
          </h1>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <main className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">

        {/* ===================================================
            HEADER KATEGORI
        =================================================== */}
        <div className="mb-3 mt-3 flex items-center justify-between gap-3 sm:mt-4">

          <div className="flex min-w-0 items-center gap-2.5">

            {/* Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff2c7] text-[#e28d00] sm:h-10 sm:w-10">
              <AlertTriangle
                size={18}
                strokeWidth={2}
              />
            </div>

            {/* Judul */}
            <h2 className="text-sm font-bold text-[#202833] sm:text-base">
              Perlu Diolah
            </h2>

          </div>

          {/* Jumlah */}
          <span className="shrink-0 rounded-full bg-[#fff0cf] px-3 py-1.5 text-[11px] font-bold text-[#b76b00] sm:text-xs">
            {notifikasi.length} bahan
          </span>

        </div>

        {/* ===================================================
            LIST NOTIFIKASI
        =================================================== */}
        <div className="space-y-2.5">

          {notifikasi.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              onRecipe={() => {
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
    <article
      className="
        rounded-2xl
        border
        border-[#e5ebe6]
        bg-white
        px-3
        py-3
        shadow-[0_2px_8px_rgba(32,40,51,0.06)]
        transition
        hover:shadow-[0_4px_12px_rgba(32,40,51,0.08)]
        sm:px-3.5
        sm:py-3.5
      "
    >

      {/* ===================================================
          ISI CARD
      =================================================== */}
      <div className="flex items-center gap-3">

        {/* =================================================
            GAMBAR
        ================================================= */}
        <img
          src={item.image}
          alt={item.nama}
          className="
            h-[58px]
            w-[58px]
            shrink-0
            rounded-xl
            object-cover
            sm:h-[64px]
            sm:w-[64px]
          "
        />

        {/* =================================================
            INFORMASI
        ================================================= */}
        <div className="min-w-0 flex-1">

          {/* Nama */}
          <h3 className="truncate text-sm font-bold leading-tight text-[#202833] sm:text-[15px]">
            {item.nama}
          </h3>

          {/* Status */}
          <div className="mt-1 flex items-center gap-1.5 text-[#c73535]">

            <AlertTriangle
              size={13}
              strokeWidth={2.4}
              className="shrink-0"
            />

            <span className="text-[11px] font-semibold leading-none sm:text-xs">
              {item.status}
            </span>

          </div>

          {/* Jumlah */}
          <p className="mt-1 text-[11px] leading-none text-slate-500 sm:text-xs">
            {item.jumlah}
          </p>

        </div>

        {/* =================================================
            BUTTON RESEP
        ================================================= */}
        <button
          type="button"
          onClick={onRecipe}
          className="
            flex
            h-8
            shrink-0
            items-center
            gap-1.5
            rounded-lg
            bg-[#d8f8e3]
            px-2.5
            text-[10px]
            font-bold
            text-[#246b35]
            transition
            hover:bg-[#c7f2d6]
            active:scale-[0.98]
            sm:h-9
            sm:px-3
            sm:text-[11px]
          "
        >
          <Utensils
            size={13}
            strokeWidth={2.3}
          />

          <span className="hidden xs:inline sm:inline">
            Olah Resep
          </span>
        </button>

      </div>

    </article>
  );
}

export default Notifikasi;