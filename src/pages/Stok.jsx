import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Trash2,
  Plus,
  X,
  CalendarDays,
} from "lucide-react";

/* =========================================================
   DATA AWAL
========================================================= */

const bahanAwal = [
  {
    id: 1,
    nama: "Telur Ayam",
    jumlah: "50 butir",
    kategori: "Protein",
    tanggal: "24/09/2026",
    tanggalBeli: "03/09/2026",
    harga: "50000",
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
    tanggalBeli: "03/09/2026",
    harga: "85000",
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
    tanggalBeli: "03/09/2026",
    harga: "15000",
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
    tanggalBeli: "03/09/2026",
    harga: "90000",
    status: "Aman",
    type: "aman",
    image:
      "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=300&q=80",
  },
];

/* =========================================================
   KATEGORI FILTER
========================================================= */

const kategoriFilter = [
  "Semua",
  "Buah",
  "Bumbu",
  "Dairy",
  "Karbohidrat",
  "Protein",
  "Sayur",
];

/* =========================================================
   KATEGORI FORM
========================================================= */

const kategoriForm = [
  {
    nama: "Sayuran",
    value: "Sayur",
    icon: "🥬",
  },
  {
    nama: "Buah-buahan",
    value: "Buah",
    icon: "🍎",
  },
  {
    nama: "Daging & Ikan",
    value: "Protein",
    icon: "🥩",
  },
  {
    nama: "Susu & Telur",
    value: "Dairy",
    icon: "🥚",
  },
  {
    nama: "Karbohidrat",
    value: "Karbohidrat",
    icon: "🍚",
  },
  {
    nama: "Bumbu & Saus",
    value: "Bumbu",
    icon: "🧄",
  },
  {
    nama: "Siap Saji",
    value: "Siap Saji",
    icon: "🍲",
  },
  {
    nama: "Lainnya",
    value: "Lainnya",
    icon: "📦",
  },
];

/* =========================================================
   IMAGE DEFAULT BERDASARKAN KATEGORI
========================================================= */

const imageKategori = {
  Sayur:
    "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&w=300&q=80",

  Buah:
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80",

  Protein:
    "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=300&q=80",

  Dairy:
    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80",

  Karbohidrat:
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",

  Bumbu:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80",

  "Siap Saji":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80",

  Lainnya:
    "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=300&q=80",
};

/* =========================================================
   FORM AWAL
========================================================= */

const formAwal = {
  nama: "",
  kategori: "Sayur",
  tanggal: "",
  jumlah: "1",
  satuan: "pcs",
  harga: "",
  tanggalBeli: "",
};

/* =========================================================
   STOK
========================================================= */

function Stok() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [stock, setStock] = useState(bahanAwal);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(formAwal);

  /* =======================================================
     FILTER
  ======================================================= */

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

  /* =======================================================
     HANDLE FORM
  ======================================================= */

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pilihKategori = (value) => {
    setForm((prev) => ({
      ...prev,
      kategori: value,
    }));
  };

  /* =======================================================
     FORMAT TANGGAL
  ======================================================= */

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "";

    const [tahun, bulan, hari] = tanggal.split("-");

    return `${hari}/${bulan}/${tahun}`;
  };

  /* =======================================================
     TAMBAH BAHAN
  ======================================================= */

  const tambahBahan = (e) => {
    e.preventDefault();

    if (!form.nama.trim()) {
      alert("Nama bahan wajib diisi.");
      return;
    }

    if (!form.tanggal) {
      alert("Tanggal kedaluwarsa wajib diisi.");
      return;
    }

    if (!form.jumlah || Number(form.jumlah) <= 0) {
      alert("Jumlah bahan harus lebih dari 0.");
      return;
    }

    const tanggalExpired = new Date(form.tanggal);
    const hariIni = new Date();

    const selisihHari = Math.ceil(
      (tanggalExpired - hariIni) /
        (1000 * 60 * 60 * 24)
    );

    const type =
      selisihHari <= 3
        ? "prioritas"
        : "aman";

    const status =
      selisihHari <= 0
        ? "Kedaluwarsa"
        : selisihHari <= 3
        ? "Perlu diolah"
        : "Aman";

    const bahanBaru = {
      id: Date.now(),
      nama: form.nama,
      jumlah: `${form.jumlah} ${form.satuan}`,
      kategori: form.kategori,
      tanggal: formatTanggal(form.tanggal),
      tanggalBeli: formatTanggal(form.tanggalBeli),
      harga: form.harga,
      status,
      type,
      image:
        imageKategori[form.kategori] ||
        imageKategori.Lainnya,
    };

    setStock((prev) => [bahanBaru, ...prev]);

    setForm(formAwal);
    setShowModal(false);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const hapusBahan = (id) => {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus bahan ini?"
    );

    if (!yakin) return;

    setStock((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /* =======================================================
     QUICK DATE
  ======================================================= */

  const setTanggalCepat = (hari) => {
    const tanggal = new Date();

    tanggal.setDate(
      tanggal.getDate() + hari
    );

    const tahun = tanggal.getFullYear();
    const bulan = String(
      tanggal.getMonth() + 1
    ).padStart(2, "0");

    const hariTanggal = String(
      tanggal.getDate()
    ).padStart(2, "0");

    setForm((prev) => ({
      ...prev,
      tanggal: `${tahun}-${bulan}-${hariTanggal}`,
    }));
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f9f5] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">

        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-5 lg:px-7">

          <div className="flex min-h-[62px] items-center gap-2.5 sm:min-h-[66px]">

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
                hover:bg-slate-100
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

            <div className="min-w-0">

              <h1
                className="
                  truncate
                  text-xl
                  font-bold
                  tracking-tight
                  text-[#202833]
                  sm:text-2xl
                "
              >
                Stok Saya
              </h1>

              <p className="hidden text-[11px] text-slate-500 sm:block">
                Kelola bahan makanan di kulkas kamu
              </p>

            </div>

          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          pb-28
          pt-4
          sm:px-5
          sm:pt-5
          md:pb-28
          lg:px-7
        "
      >

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari bahan..."
            className="
              h-11
              w-full
              rounded-[14px]
              border
              border-[#e1e9e2]
              bg-white
              pl-11
              pr-4
              text-sm
              text-[#202833]
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#2c7a35]
              focus:ring-2
              focus:ring-[#2c7a35]/10
              sm:h-12
              sm:rounded-[16px]
            "
          />

        </div>

        {/* ===================================================
            CATEGORY FILTER
        =================================================== */}

        <div
          className="
            mt-3
            flex
            w-full
            gap-1.5
            overflow-x-auto
            pb-1
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >

          {kategoriFilter.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setActiveCategory(item)
              }
              className={`
                shrink-0
                rounded-lg
                border
                px-3
                py-1.5
                text-[11px]
                font-semibold
                transition
                active:scale-95
                sm:text-xs
                ${
                  activeCategory === item
                    ? "border-[#23652d] bg-[#23652d] text-white"
                    : "border-[#dfe8df] bg-white text-slate-600 hover:bg-[#f1f8f2]"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>

        {/* ===================================================
            PRIORITAS
        =================================================== */}

        <section className="mt-5">

          <SectionTitle
            title="Prioritas Olah (Mendekati Expired)"
            count={prioritas.length}
          />

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

            {prioritas.length > 0 ? (
              prioritas.map((item) => (
                <StockCard
                  key={item.id}
                  item={item}
                  onDelete={hapusBahan}
                />
              ))
            ) : (
              <div className="md:col-span-2">
                <EmptyState text="Tidak ada bahan yang perlu segera diolah." />
              </div>
            )}

          </div>

        </section>

        {/* ===================================================
            AMAN
        =================================================== */}

        <section className="mt-6">

          <SectionTitle
            title="Bahan Aman & Segar"
            count={aman.length}
          />

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

            {aman.length > 0 ? (
              aman.map((item) => (
                <StockCard
                  key={item.id}
                  item={item}
                  onDelete={hapusBahan}
                />
              ))
            ) : (
              <div className="md:col-span-2">
                <EmptyState text="Belum ada bahan yang aman." />
              </div>
            )}

          </div>

        </section>

      </main>

      {/* =====================================================
          TOMBOL TAMBAH
      ===================================================== */}

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="
          fixed
          bottom-4
          right-4
          z-30
          flex
          h-11
          items-center
          gap-1.5
          rounded-[14px]
          bg-[#1d6b27]
          px-3.5
          text-xs
          font-bold
          text-white
          shadow-lg
          transition
          hover:bg-[#155a1f]
          active:scale-95
          sm:bottom-5
          sm:right-5
          sm:h-12
          sm:px-4
          sm:text-sm
        "
      >
        <Plus
          size={18}
          strokeWidth={2.5}
        />

        Tambah Bahan
      </button>

      {/* =====================================================
          MODAL TAMBAH BAHAN
      ===================================================== */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-[#17251a]/40
            p-0
            backdrop-blur-[2px]
            sm:items-center
            sm:p-4
          "
        >

          <div
            className="
              flex
              max-h-[94vh]
              w-full
              flex-col
              overflow-hidden
              rounded-t-[24px]
              bg-white
              shadow-2xl
              sm:max-w-[720px]
              sm:rounded-[24px]
            "
          >

            {/* HEADER MODAL */}

            <div
              className="
                flex
                shrink-0
                items-start
                justify-between
                border-b
                border-[#edf1ed]
                px-5
                py-5
                sm:px-6
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    tracking-tight
                    text-[#202833]
                    sm:text-2xl
                  "
                >
                  Tambah Bahan Baru
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Catat bahan agar terpantau sebelum kedaluwarsa.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                "
                aria-label="Tutup"
              >
                <X size={23} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={tambahBahan}
              className="
                overflow-y-auto
                px-5
                py-5
                sm:px-6
                sm:py-6
              "
            >

              {/* NAMA */}

              <div>

                <label
                  htmlFor="nama-bahan"
                  className="mb-1.5 block text-sm font-semibold text-[#34414c]"
                >
                  Nama Bahan{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="nama-bahan"
                  name="nama"
                  type="text"
                  value={form.nama}
                  onChange={handleFormChange}
                  placeholder="Contoh: Bayam Segar, Tempe, Telur Ayam..."
                  className="
                    h-12
                    w-full
                    rounded-[14px]
                    border
                    border-[#cbd8ea]
                    bg-white
                    px-4
                    text-sm
                    text-[#202833]
                    outline-none
                    transition
                    placeholder:text-[#91a4c0]
                    focus:border-[#00a968]
                    focus:ring-2
                    focus:ring-[#00a968]/10
                    sm:h-13
                    sm:text-base
                  "
                />

              </div>

              {/* KATEGORI */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-semibold text-[#34414c]">
                  Kategori{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                  {kategoriForm.map((item) => {
                    const active =
                      form.kategori === item.value;

                    return (
                      <button
                        key={item.nama}
                        type="button"
                        onClick={() =>
                          pilihKategori(item.value)
                        }
                        className={`
                          flex
                          min-h-[68px]
                          flex-col
                          items-center
                          justify-center
                          gap-1
                          rounded-[14px]
                          border
                          px-2
                          py-2
                          text-center
                          transition
                          ${
                            active
                              ? "border-[#00b878] bg-[#edfff7] text-[#126247] ring-1 ring-[#00b878]"
                              : "border-[#dce4ef] bg-white text-[#34414c] hover:bg-[#f8fafc]"
                          }
                        `}
                      >

                        <span className="text-xl leading-none">
                          {item.icon}
                        </span>

                        <span className="text-[11px] font-medium sm:text-xs">
                          {item.nama}
                        </span>

                      </button>
                    );
                  })}

                </div>

              </div>

              {/* TANGGAL EXPIRED */}

              <div className="mt-5">

                <label
                  htmlFor="tanggal-expired"
                  className="mb-1.5 block text-sm font-semibold text-[#34414c]"
                >
                  Tanggal Kedaluwarsa / Batas Pakai{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <input
                    id="tanggal-expired"
                    name="tanggal"
                    type="date"
                    value={form.tanggal}
                    onChange={handleFormChange}
                    className="
                      h-12
                      w-full
                      rounded-[14px]
                      border
                      border-[#cbd8ea]
                      bg-white
                      px-4
                      pr-11
                      text-sm
                      text-[#202833]
                      outline-none
                      focus:border-[#00a968]
                      focus:ring-2
                      focus:ring-[#00a968]/10
                      sm:h-13
                      sm:text-base
                    "
                  />

                  <CalendarDays
                    size={19}
                    className="
                      pointer-events-none
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-600
                    "
                  />

                </div>

                {/* QUICK DATE */}

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  <span className="text-xs text-slate-500">
                    Cepat:
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setTanggalCepat(1)
                    }
                    className="rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-2.5 py-1.5 text-[11px] font-medium text-slate-600"
                  >
                    Besok (1 hari)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTanggalCepat(3)
                    }
                    className="rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-2.5 py-1.5 text-[11px] font-medium text-slate-600"
                  >
                    3 hari
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTanggalCepat(7)
                    }
                    className="rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-2.5 py-1.5 text-[11px] font-medium text-slate-600"
                  >
                    1 minggu
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTanggalCepat(14)
                    }
                    className="rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-2.5 py-1.5 text-[11px] font-medium text-slate-600"
                  >
                    2 minggu
                  </button>

                </div>

              </div>

              {/* JUMLAH + SATUAN */}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="jumlah"
                    className="mb-1.5 block text-sm font-semibold text-[#34414c]"
                  >
                    Jumlah{" "}
                    <span className="font-normal text-slate-400">
                      (Opsional)
                    </span>
                  </label>

                  <input
                    id="jumlah"
                    name="jumlah"
                    type="number"
                    min="1"
                    value={form.jumlah}
                    onChange={handleFormChange}
                    className="
                      h-12
                      w-full
                      rounded-[14px]
                      border
                      border-[#cbd8ea]
                      bg-white
                      px-4
                      text-sm
                      text-[#202833]
                      outline-none
                      focus:border-[#00a968]
                      focus:ring-2
                      focus:ring-[#00a968]/10
                      sm:text-base
                    "
                  />

                </div>

                <div>

                  <label
                    htmlFor="satuan"
                    className="mb-1.5 block text-sm font-semibold text-[#34414c]"
                  >
                    Satuan
                  </label>

                  <select
                    id="satuan"
                    name="satuan"
                    value={form.satuan}
                    onChange={handleFormChange}
                    className="
                      h-12
                      w-full
                      rounded-[14px]
                      border
                      border-[#cbd8ea]
                      bg-white
                      px-4
                      text-sm
                      text-[#202833]
                      outline-none
                      focus:border-[#00a968]
                      focus:ring-2
                      focus:ring-[#00a968]/10
                      sm:text-base
                    "
                  >
                    <option value="pcs">
                      pcs
                    </option>
                    <option value="gram">
                      gram
                    </option>
                    <option value="kg">
                      kg
                    </option>
                    <option value="butir">
                      butir
                    </option>
                    <option value="ml">
                      ml
                    </option>
                    <option value="liter">
                      liter
                    </option>
                    <option value="bungkus">
                      bungkus
                    </option>
                  </select>

                </div>

              </div>

              {/* HARGA + TANGGAL BELI */}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="harga"
                    className="mb-1.5 block text-sm font-semibold text-[#34414c]"
                  >
                    Perkiraan Harga (Rp)
                  </label>

                  <input
                    id="harga"
                    name="harga"
                    type="number"
                    min="0"
                    value={form.harga}
                    onChange={handleFormChange}
                    placeholder="Contoh: 7000"
                    className="
                      h-12
                      w-full
                      rounded-[14px]
                      border
                      border-[#cbd8ea]
                      bg-white
                      px-4
                      text-sm
                      text-[#202833]
                      outline-none
                      placeholder:text-slate-400
                      focus:border-[#00a968]
                      focus:ring-2
                      focus:ring-[#00a968]/10
                      sm:text-base
                    "
                  />

                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                    Digunakan untuk menghitung total hemat saat bahan dipakai.
                  </p>

                </div>

                <div>

                  <label
                    htmlFor="tanggal-beli"
                    className="mb-1.5 block text-sm font-semibold text-[#34414c]"
                  >
                    Tanggal Beli{" "}
                    <span className="font-normal text-slate-400">
                      (Opsional)
                    </span>
                  </label>

                  <div className="relative">

                    <input
                      id="tanggal-beli"
                      name="tanggalBeli"
                      type="date"
                      value={form.tanggalBeli}
                      onChange={handleFormChange}
                      className="
                        h-12
                        w-full
                        rounded-[14px]
                        border
                        border-[#cbd8ea]
                        bg-white
                        px-4
                        pr-11
                        text-sm
                        text-[#202833]
                        outline-none
                        focus:border-[#00a968]
                        focus:ring-2
                        focus:ring-[#00a968]/10
                        sm:text-base
                      "
                    />

                    <CalendarDays
                      size={19}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-600
                      "
                    />

                  </div>

                </div>

              </div>

              {/* ACTION */}

              <div
                className="
                  mt-6
                  flex
                  justify-end
                  gap-2
                  border-t
                  border-[#edf1ed]
                  pt-4
                  sm:gap-3
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    h-11
                    rounded-[14px]
                    border
                    border-[#dce4ef]
                    bg-white
                    px-5
                    text-sm
                    font-semibold
                    text-[#34414c]
                    transition
                    hover:bg-slate-50
                  "
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="
                    flex
                    h-11
                    items-center
                    gap-1.5
                    rounded-[14px]
                    bg-[#00a968]
                    px-5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#00955b]
                    active:scale-[0.98]
                  "
                >
                  <Plus size={19} />
                  Simpan Bahan
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ title, count }) {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex min-w-0 items-center gap-2">

        <span
          className="
            h-6
            w-1
            shrink-0
            rounded-full
            bg-[#23652d]
          "
        />

        <h2
          className="
            truncate
            text-sm
            font-bold
            text-[#202833]
            sm:text-base
          "
        >
          {title}
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
          bg-[#dff2e1]
          px-1.5
          text-[11px]
          font-bold
          text-[#23652d]
        "
      >
        {count}
      </span>

    </div>
  );
}

/* =========================================================
   STOCK CARD
========================================================= */

function StockCard({ item, onDelete }) {
  const isExpired =
    item.status === "Kedaluwarsa";

  const isNeedProcess =
    item.status === "Perlu diolah";

  return (
    <article
      className="
        flex
        min-h-[96px]
        w-full
        min-w-0
        items-center
        gap-3
        rounded-[18px]
        border
        border-[#e4eee6]
        bg-white
        p-3
        shadow-[0_2px_8px_rgba(32,40,51,0.05)]
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        sm:min-h-[104px]
        sm:p-3.5
      "
    >

      {/* FOTO */}

      <img
        src={item.image}
        alt={item.nama}
        className="
          h-16
          w-16
          shrink-0
          rounded-[14px]
          object-cover
          sm:h-[72px]
          sm:w-[72px]
        "
      />

      {/* INFO */}

      <div className="min-w-0 flex-1">

        <h3
          className="
            truncate
            text-sm
            font-bold
            text-[#202833]
            sm:text-base
          "
        >
          {item.nama}
        </h3>

        <p
          className="
            mt-1
            truncate
            text-[11px]
            text-slate-500
            sm:text-xs
          "
        >
          {item.jumlah}
          <span className="mx-1">•</span>
          {item.tanggal}
        </p>

        <span
          className={`
            mt-2
            inline-flex
            rounded-lg
            px-2
            py-1
            text-[10px]
            font-semibold
            ${
              isExpired
                ? "bg-[#fff0f0] text-[#c43b3b]"
                : isNeedProcess
                ? "bg-[#fff7df] text-[#a46a00]"
                : "bg-[#edf8ef] text-[#27733a]"
            }
          `}
        >
          {item.status}
        </span>

      </div>

      {/* DELETE */}

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-slate-400
          transition
          hover:bg-red-50
          hover:text-red-500
          active:scale-90
        "
        aria-label={`Hapus ${item.nama}`}
      >
        <Trash2 size={16} />
      </button>

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
        rounded-[18px]
        border
        border-[#e4eee6]
        bg-white
        p-6
        text-center
        text-xs
        text-slate-500
        shadow-sm
        sm:text-sm
      "
    >
      {text}
    </div>
  );
}

export default Stok;