import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Trash2,
  Plus,
} from "lucide-react";

const bahan = [
  {
    id: 1,
    nama: "Telur Ayam",
    jumlah: "50 butir",
    kategori: "Protein",
    tanggal: "24/09/2026",
    status: "Kedaluwarsa",
    type: "prioritas",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    nama: "Ikan Tuna",
    jumlah: "1000 gram",
    kategori: "Protein",
    tanggal: "25/09/2026",
    status: "Kedaluwarsa",
    type: "prioritas",
    image:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    nama: "Kangkung",
    jumlah: "1000 gram",
    kategori: "Sayur",
    tanggal: "30/09/2026",
    status: "Aman",
    type: "aman",
    image:
      "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    nama: "Ikan Patin",
    jumlah: "3000 gram",
    kategori: "Protein",
    tanggal: "30/09/2026",
    status: "Aman",
    type: "aman",
    image:
      "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=300&q=80",
  },
];

const kategori = [
  "Semua",
  "Buah",
  "Bumbu",
  "Dairy",
  "Karbohidrat",
  "Protein",
  "Sayur",
];

function Stok() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [stock, setStock] = useState(bahan);

  /* ================= FILTER ================= */

  const filteredStock = useMemo(() => {
    return stock.filter((item) => {
      const cocokSearch = item.nama
        .toLowerCase()
        .includes(search.toLowerCase());

      const cocokKategori =
        activeCategory === "Semua" ||
        item.kategori === activeCategory;

      return cocokSearch && cocokKategori;
    });
  }, [stock, search, activeCategory]);

  const prioritas = filteredStock.filter(
    (item) => item.type === "prioritas"
  );

  const aman = filteredStock.filter(
    (item) => item.type === "aman"
  );

  /* ================= DELETE ================= */

  const hapusBahan = (id) => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus bahan ini?"
    );

    if (!yakin) return;

    setStock((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#eaf8ec] font-jakarta text-[#245c2c]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 bg-[#eaf8ec]/95 backdrop-blur">

        <div className="mx-auto w-full max-w-6xl px-4 pb-3 pt-3 sm:px-5 sm:pt-4 lg:px-7">

          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* BACK */}

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
                active:scale-95
                sm:h-10
                sm:w-10
              "
              aria-label="Kembali"
            >
              <ArrowLeft
                size={21}
                strokeWidth={2}
              />
            </button>

            {/* TITLE */}

            <h1
              className="
                truncate
                text-xl
                font-extrabold
                tracking-tight
                sm:text-2xl
                md:text-2xl
              "
            >
              Stok Saya
            </h1>

          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-6xl
          px-4
          pb-28
          sm:px-5
          md:pb-32
          lg:px-7
        "
      >

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="relative mt-2.5 sm:mt-3">

          <Search
            size={19}
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-slate-500
              sm:left-4
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari bahan..."
            className="
              h-11
              w-full
              rounded-[14px]
              border
              border-transparent
              bg-white
              pl-11
              pr-3
              text-sm
              text-[#202833]
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#2c7a35]
              focus:ring-2
              focus:ring-[#b9dfbd]
              sm:h-12
              sm:rounded-[16px]
              sm:pl-12
            "
          />

        </div>

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <div
          className="
            mt-2.5
            flex
            w-full
            gap-1.5
            overflow-x-auto
            pb-1
            sm:gap-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {kategori.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveCategory(item)}
              className={`
                shrink-0
                rounded-lg
                border
                px-3
                py-1.5
                text-xs
                font-bold
                transition
                active:scale-95
                sm:px-3.5
                sm:py-2
                sm:text-xs
                ${
                  activeCategory === item
                    ? "border-[#176b26] bg-[#176b26] text-white"
                    : "border-slate-300 bg-white text-[#245c2c] hover:bg-[#f4fff5]"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>

        {/* ===================================================
            PRIORITAS OLAH
        =================================================== */}

        <section className="mt-4 sm:mt-5">

          {/* SECTION TITLE */}

          <div className="mb-2.5 flex min-w-0 items-center justify-between gap-2 sm:mb-3">

            <div className="flex min-w-0 items-center gap-2">

              <span
                className="
                  h-6
                  w-1
                  shrink-0
                  rounded-full
                  bg-[#176b26]
                "
              />

              <h2
                className="
                  min-w-0
                  text-sm
                  font-extrabold
                  leading-tight
                  sm:text-base
                "
              >
                Prioritas Olah (Mendekati Expired)
              </h2>

            </div>

            <span
              className="
                flex
                h-6
                min-w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#6cc477]
                px-1.5
                text-[11px]
                font-bold
                text-[#176b26]
              "
            >
              {prioritas.length}
            </span>

          </div>

          {/* CARDS */}

          <div className="space-y-2.5 sm:space-y-3">

            {prioritas.length > 0 ? (
              prioritas.map((item) => (
                <StockCard
                  key={item.id}
                  item={item}
                  onDelete={hapusBahan}
                />
              ))
            ) : (
              <EmptyState
                text="Tidak ada bahan yang perlu segera diolah."
              />
            )}

          </div>

        </section>

        {/* ===================================================
            BAHAN AMAN
        =================================================== */}

        <section className="mt-5 sm:mt-6">

          {/* SECTION TITLE */}

          <div className="mb-2.5 flex min-w-0 items-center justify-between gap-2 sm:mb-3">

            <div className="flex min-w-0 items-center gap-2">

              <span
                className="
                  h-6
                  w-1
                  shrink-0
                  rounded-full
                  bg-[#176b26]
                "
              />

              <h2
                className="
                  min-w-0
                  text-sm
                  font-extrabold
                  leading-tight
                  sm:text-base
                "
              >
                Bahan Aman & Segar
              </h2>

            </div>

            <span
              className="
                flex
                h-6
                min-w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#6cc477]
                px-1.5
                text-[11px]
                font-bold
                text-[#176b26]
              "
            >
              {aman.length}
            </span>

          </div>

          {/* CARDS */}

          <div className="space-y-2.5 sm:space-y-3">

            {aman.length > 0 ? (
              aman.map((item) => (
                <StockCard
                  key={item.id}
                  item={item}
                  onDelete={hapusBahan}
                />
              ))
            ) : (
              <EmptyState text="Belum ada bahan yang aman." />
            )}

          </div>

        </section>

      </main>

      {/* =====================================================
          TAMBAH STOK
      ===================================================== */}

      <button
        type="button"
        className="
          fixed
          bottom-4
          right-4
          z-50
          flex
          h-11
          items-center
          gap-1.5
          rounded-[14px]
          bg-[#176b26]
          px-3.5
          text-xs
          font-extrabold
          text-white
          shadow-xl
          transition
          hover:-translate-y-1
          hover:bg-[#12581f]
          active:scale-95
          sm:bottom-5
          sm:right-5
          sm:h-12
          sm:gap-2
          sm:rounded-[15px]
          sm:px-4
          sm:text-sm
          md:right-7
        "
      >
        <Plus
          size={18}
          strokeWidth={2.5}
        />

        <span>Tambah Stok</span>
      </button>

    </div>
  );
}

/* =========================================================
   STOCK CARD
========================================================= */

function StockCard({ item, onDelete }) {
  const isExpired = item.status === "Kedaluwarsa";

  return (
    <article
      className="
        flex
        min-h-[88px]
        w-full
        min-w-0
        items-center
        gap-2.5
        rounded-[16px]
        border
        border-slate-100
        bg-white
        p-2.5
        shadow-sm
        transition
        hover:shadow-md
        sm:min-h-[96px]
        sm:gap-3
        sm:rounded-[18px]
        sm:p-3
        md:min-h-[100px]
        md:gap-3.5
        md:p-3.5
      "
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <img
        src={item.image}
        alt={item.nama}
        className="
          h-14
          w-14
          shrink-0
          rounded-[12px]
          object-cover
          sm:h-16
          sm:w-16
          sm:rounded-[13px]
          md:h-[68px]
          md:w-[68px]
        "
      />

      {/* =================================================
          INFO
      ================================================= */}

      <div className="min-w-0 flex-1">

        <h3
          className="
            truncate
            text-sm
            font-extrabold
            text-[#245c2c]
            sm:text-base
          "
        >
          {item.nama}
        </h3>

        <p
          className="
            mt-0.5
            truncate
            text-xs
            text-slate-500
            sm:text-sm
          "
        >
          {item.jumlah} · {item.kategori}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[11px]
            text-slate-500
            sm:text-xs
          "
        >
          Kedaluwarsa {item.tanggal}
        </p>

      </div>

      {/* =================================================
          STATUS + DELETE
      ================================================= */}

      <div
        className="
          flex
          shrink-0
          flex-col
          items-end
          justify-between
          gap-2
          self-stretch
        "
      >

        {/* STATUS */}

        <span
          className={`
            whitespace-nowrap
            rounded-full
            px-2
            py-0.5
            text-[10px]
            font-bold
            sm:px-2.5
            sm:py-1
            sm:text-[11px]
            ${
              isExpired
                ? "bg-[#ffe1e1] text-[#bb3434]"
                : "bg-[#e5f5e7] text-[#286b32]"
            }
          `}
        >
          {item.status}
        </span>

        {/* DELETE */}

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            text-slate-500
            transition
            hover:bg-red-50
            hover:text-red-500
            active:scale-90
            sm:h-8
            sm:w-8
          "
          aria-label={`Hapus ${item.nama}`}
        >
          <Trash2
            size={16}
          />
        </button>

      </div>

    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ text }) {
  return (
    <div
      className="
        rounded-[16px]
        bg-white
        p-5
        text-center
        text-xs
        text-slate-500
        shadow-sm
        sm:rounded-[18px]
        sm:p-6
        sm:text-sm
      "
    >
      {text}
    </div>
  );
}

export default Stok;