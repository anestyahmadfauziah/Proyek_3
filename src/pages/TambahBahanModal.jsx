import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  XCircle,
  Check,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Leaf,
  Beef,
  Wheat,
  Milk,
} from "lucide-react";

// ======================================================
// DATA BAHAN
// ======================================================

const bahanData = [
  {
    id: 1,
    nama: "Kangkung",
    kategori: "Sayuran",
    deskripsi:
      "Sayuran hijau yang kaya akan vitamin A, K, dan serat.",
    image:
      "https://images.unsplash.com/photo-1515367462048-0d2f1e8f5e3c?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "19 kkal",
      protein: "2.6 g",
      lemak: "0.2 g",
      karbohidrat: "3.1 g",
      serat: "2.1 g",
    },
  },
  {
    id: 2,
    nama: "Bayam",
    kategori: "Sayuran",
    deskripsi:
      "Sayuran hijau yang kaya zat besi, vitamin, dan mineral.",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "23 kkal",
      protein: "2.9 g",
      lemak: "0.4 g",
      karbohidrat: "3.6 g",
      serat: "2.2 g",
    },
  },
  {
    id: 3,
    nama: "Sawi",
    kategori: "Sayuran",
    deskripsi:
      "Sayuran hijau dengan kandungan vitamin dan mineral.",
    image:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "27 kkal",
      protein: "2.9 g",
      lemak: "0.4 g",
      karbohidrat: "4.7 g",
      serat: "2.0 g",
    },
  },
  {
    id: 4,
    nama: "Wortel",
    kategori: "Sayuran",
    deskripsi:
      "Sayuran berwarna oranye yang kaya vitamin A dan beta karoten.",
    image:
      "https://images.unsplash.com/photo-1447175008436-170170753d52?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "41 kkal",
      protein: "0.9 g",
      lemak: "0.2 g",
      karbohidrat: "9.6 g",
      serat: "2.8 g",
    },
  },
  {
    id: 5,
    nama: "Brokoli",
    kategori: "Sayuran",
    deskripsi:
      "Sayuran hijau yang kaya vitamin C, K, folat, dan serat.",
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "34 kkal",
      protein: "2.8 g",
      lemak: "0.4 g",
      karbohidrat: "6.6 g",
      serat: "2.6 g",
    },
  },
  {
    id: 6,
    nama: "Kol",
    kategori: "Sayuran",
    deskripsi:
      "Sayuran yang mengandung vitamin C, K, dan serat.",
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "25 kkal",
      protein: "1.3 g",
      lemak: "0.1 g",
      karbohidrat: "5.8 g",
      serat: "2.5 g",
    },
  },
  {
    id: 7,
    nama: "Ikan Tuna",
    kategori: "Protein",
    deskripsi:
      "Sumber protein hewani yang kaya omega-3 dan vitamin B.",
    image:
      "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "132 kkal",
      protein: "28 g",
      lemak: "1.3 g",
      karbohidrat: "0 g",
      serat: "0 g",
    },
  },
  {
    id: 8,
    nama: "Telur Ayam",
    kategori: "Protein",
    deskripsi:
      "Sumber protein lengkap dengan berbagai vitamin dan mineral.",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "143 kkal",
      protein: "12.6 g",
      lemak: "9.5 g",
      karbohidrat: "0.7 g",
      serat: "0 g",
    },
  },
  {
    id: 9,
    nama: "Apel",
    kategori: "Buah-buahan",
    deskripsi:
      "Buah yang kaya serat, vitamin C, dan antioksidan.",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80",
    nutrisi: {
      kalori: "52 kkal",
      protein: "0.3 g",
      lemak: "0.2 g",
      karbohidrat: "13.8 g",
      serat: "2.4 g",
    },
  },
];

// ======================================================
// KATEGORI
// ======================================================

const kategoriData = [
  {
    nama: "Semua",
    icon: Leaf,
  },
  {
    nama: "Sayuran",
    icon: Leaf,
  },
  {
    nama: "Buah-buahan",
    icon: null,
  },
  {
    nama: "Protein",
    icon: Beef,
  },
];

// ======================================================
// KOMPONEN UTAMA
// ======================================================

export default function TambahBahanModal() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [search, setSearch] = useState("");

  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const [bahanTerpilih, setBahanTerpilih] = useState(null);

  const [jumlah, setJumlah] = useState("500");

  const [satuan, setSatuan] = useState("gram");

  const [tanggalMasuk, setTanggalMasuk] = useState("06/10/2026");

  const [tanggalKadaluarsa, setTanggalKadaluarsa] =
    useState("10/10/2026");

  // ====================================================
  // FILTER BAHAN
  // ====================================================

  const bahanFiltered = useMemo(() => {
    return bahanData.filter((item) => {
      const cocokSearch = item.nama
        .toLowerCase()
        .includes(search.toLowerCase());

      const cocokKategori =
        kategoriAktif === "Semua" ||
        item.kategori === kategoriAktif;

      return cocokSearch && cocokKategori;
    });
  }, [search, kategoriAktif]);

  // ====================================================
  // PILIH BAHAN
  // ====================================================

  const pilihBahan = (item) => {
    setBahanTerpilih(item);
  };

  // ====================================================
  // LANJUT KE DETAIL
  // ====================================================

  const handleLanjut = () => {
    if (!bahanTerpilih) return;

    setStep(2);
  };

  // ====================================================
  // SIMPAN
  // ====================================================

  const handleSimpan = (e) => {
    e.preventDefault();

    if (!bahanTerpilih) return;

    const dataBahan = {
      id: Date.now(),
      nama: bahanTerpilih.nama,
      kategori: bahanTerpilih.kategori,
      jumlah,
      satuan,
      tanggalMasuk,
      tanggalKadaluarsa,
    };

    console.log("Data bahan:", dataBahan);

    navigate("/stok");
  };

  // ====================================================
  // KEMBALI
  // ====================================================

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }

    navigate(-1);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f5f9f5] font-jakarta text-[#24313d]">
      {/* CONTAINER DIBUAT LEBIH KECIL */}
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-[#f5f9f5]">
        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="sticky top-0 z-30 flex h-[58px] items-center gap-2.5 border-b border-[#e6eee8] bg-[#f5f9f5]/95 px-3.5 backdrop-blur sm:h-[62px] sm:px-4">
          <button
            type="button"
            onClick={handleBack}
            className="
              flex h-8 w-8 shrink-0 items-center
              justify-center rounded-full
              text-[#263746]
              transition hover:bg-white
              sm:h-9 sm:w-9
            "
            aria-label="Kembali"
          >
            <ArrowLeft
              size={19}
              strokeWidth={2}
            />
          </button>

          <h1 className="text-xl font-bold text-[#24313d] sm:text-2xl">
            Tambah Bahan
          </h1>
        </header>

        {/* ==================================================
            STEP 1 - PILIH BAHAN
        ================================================== */}

        {step === 1 && (
          <main className="px-3.5 pb-7 pt-3 sm:px-4 sm:pt-3.5">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={17}
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-[#7890a3]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari bahan..."
                className="
                  h-10 w-full
                  rounded-[11px]
                  border border-[#dce6eb]
                  bg-white
                  pl-9 pr-9
                  text-sm
                  text-[#24313d]
                  outline-none
                  transition
                  placeholder:text-[#7890a3]
                  focus:border-[#159b68]
                  focus:ring-2
                  focus:ring-[#159b68]/10
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    absolute right-2.5 top-1/2
                    -translate-y-1/2
                    text-[#6f8291]
                  "
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            {/* KATEGORI */}

            <div className="scrollbar-none mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
              {kategoriData.map((item) => {
                const aktif = kategoriAktif === item.nama;

                return (
                  <button
                    key={item.nama}
                    type="button"
                    onClick={() => setKategoriAktif(item.nama)}
                    className={`
                      shrink-0
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      transition
                      ${
                        aktif
                          ? "bg-[#169b68] text-white shadow-sm"
                          : "bg-white text-[#758798] hover:bg-[#edf7f1]"
                      }
                    `}
                  >
                    {item.nama}
                  </button>
                );
              })}
            </div>

            {/* ==================================================
                LIST BAHAN
            ================================================== */}

            <div className="mt-2.5 overflow-hidden rounded-[15px] border border-[#e3ebef] bg-white shadow-[0_1px_5px_rgba(30,50,40,0.03)]">
              {bahanFiltered.length > 0 ? (
                bahanFiltered.map((item, index) => {
                  const aktif =
                    bahanTerpilih?.id === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pilihBahan(item)}
                      className={`
                        flex w-full items-center
                        gap-2.5
                        px-2.5
                        py-2
                        text-left
                        transition
                        sm:px-3
                        ${
                          index !==
                          bahanFiltered.length - 1
                            ? "border-b border-[#edf1f3]"
                            : ""
                        }
                        ${
                          aktif
                            ? "bg-[#effaf5]"
                            : "bg-white hover:bg-[#fafcfb]"
                        }
                      `}
                    >
                      {/* GAMBAR LEBIH KECIL */}

                      <img
                        src={item.image}
                        alt={item.nama}
                        className="
                          h-10 w-10
                          shrink-0
                          rounded-[10px]
                          object-cover
                          sm:h-11 sm:w-11
                        "
                      />

                      {/* INFO */}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold leading-tight text-[#273746] sm:text-base">
                          {item.nama}
                        </p>

                        <p className="mt-0.5 text-xs leading-tight text-[#8293a0] sm:text-sm">
                          {item.kategori}
                        </p>
                      </div>

                      {/* ICON */}

                      {aktif ? (
                        <span className="
                          flex h-5 w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#169b68]
                          text-white
                        ">
                          <Check
                            size={12}
                            strokeWidth={3}
                          />
                        </span>
                      ) : (
                        <ChevronRight
                          size={17}
                          className="shrink-0 text-[#8b9cab]"
                        />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-[#607382]">
                    Bahan tidak ditemukan
                  </p>

                  <p className="mt-1 text-xs text-[#95a3ae]">
                    Coba gunakan kata pencarian lain.
                  </p>
                </div>
              )}
            </div>

            {/* ==================================================
                LANJUT
            ================================================== */}

            <button
              type="button"
              onClick={handleLanjut}
              disabled={!bahanTerpilih}
              className={`
                mt-3
                h-10
                w-full
                rounded-[11px]
                text-xs
                font-bold
                transition
                sm:text-sm
                ${
                  bahanTerpilih
                    ? "bg-[#159b68] text-white shadow-sm hover:bg-[#11895b]"
                    : "cursor-not-allowed bg-[#cfe4da] text-white"
                }
              `}
            >
              Lanjut
            </button>
          </main>
        )}

        {/* ==================================================
            STEP 2 - DETAIL BAHAN
        ================================================== */}

        {step === 2 && bahanTerpilih && (
          <main className="px-3.5 pb-7 pt-3 sm:px-4 sm:pt-3.5">
            {/* ==================================================
                INFORMASI BAHAN
            ================================================== */}

            <section className="flex items-start gap-2.5">
              <img
                src={bahanTerpilih.image}
                alt={bahanTerpilih.nama}
                className="
                  h-[68px]
                  w-[86px]
                  shrink-0
                  rounded-xl
                  object-cover
                  sm:h-[74px]
                  sm:w-[94px]
                "
              />

              <div className="min-w-0 pt-0.5">
                <h2 className="text-base font-bold leading-tight text-[#273746] sm:text-lg">
                  {bahanTerpilih.nama}
                </h2>

                <p className="mt-0.5 text-xs text-[#169b68] sm:text-sm">
                  {bahanTerpilih.kategori}
                </p>

                <p className="mt-1 text-[11px] leading-snug text-[#758694] sm:text-xs">
                  {bahanTerpilih.deskripsi}
                </p>
              </div>
            </section>

            {/* ==================================================
                INFORMASI NUTRISI
            ================================================== */}

            <section className="mt-3.5 rounded-[14px] bg-[#eef9f4] p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#315264] sm:text-base">
                  Informasi Nutrisi (per 100g)
                </h3>

                <ChevronRight
                  size={17}
                  className="text-[#169b68]"
                />
              </div>

              <div className="mt-2.5 grid grid-cols-5 gap-0.5">
                <NutrisiItem
                  icon={<Leaf size={14} />}
                  label="Kalori"
                  value={bahanTerpilih.nutrisi.kalori}
                />

                <NutrisiItem
                  icon={<Beef size={14} />}
                  label="Protein"
                  value={bahanTerpilih.nutrisi.protein}
                />

                <NutrisiItem
                  icon={<Milk size={14} />}
                  label="Lemak"
                  value={bahanTerpilih.nutrisi.lemak}
                />

                <NutrisiItem
                  icon={<Wheat size={14} />}
                  label="Karbohidrat"
                  value={
                    bahanTerpilih.nutrisi.karbohidrat
                  }
                />

                <NutrisiItem
                  icon={<Leaf size={14} />}
                  label="Serat"
                  value={bahanTerpilih.nutrisi.serat}
                />
              </div>
            </section>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSimpan}
              className="mt-4"
            >
              {/* JUMLAH */}

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#455968] sm:text-sm">
                  Jumlah
                </label>

                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    value={jumlah}
                    onChange={(e) =>
                      setJumlah(e.target.value)
                    }
                    className="
                      h-10
                      min-w-0
                      flex-1
                      rounded-[10px]
                      border border-[#dce6eb]
                      bg-white
                      px-3
                      text-sm
                      text-[#24313d]
                      outline-none
                      focus:border-[#159b68]
                      focus:ring-2
                      focus:ring-[#159b68]/10
                    "
                    required
                  />

                  <div className="relative w-[105px] shrink-0 sm:w-[115px]">
                    <select
                      value={satuan}
                      onChange={(e) =>
                        setSatuan(e.target.value)
                      }
                      className="
                        h-10
                        w-full
                        appearance-none
                        rounded-[10px]
                        border border-[#dce6eb]
                        bg-white
                        px-3
                        pr-8
                        text-sm
                        text-[#24313d]
                        outline-none
                        focus:border-[#159b68]
                        focus:ring-2
                        focus:ring-[#159b68]/10
                      "
                    >
                      <option value="gram">gram</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="liter">liter</option>
                      <option value="butir">butir</option>
                      <option value="pcs">pcs</option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="
                        pointer-events-none
                        absolute right-2.5
                        top-1/2
                        -translate-y-1/2
                        text-[#758694]
                      "
                    />
                  </div>
                </div>
              </div>

              {/* TANGGAL MASUK */}

              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-[#455968] sm:text-sm">
                  Tanggal Masuk
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={tanggalMasuk}
                    onChange={(e) =>
                      setTanggalMasuk(e.target.value)
                    }
                    placeholder="DD/MM/YYYY"
                    className="
                      h-10
                      w-full
                      rounded-[10px]
                      border border-[#dce6eb]
                      bg-white
                      px-3
                      pr-10
                      text-sm
                      text-[#24313d]
                      outline-none
                      focus:border-[#159b68]
                      focus:ring-2
                      focus:ring-[#159b68]/10
                    "
                    required
                  />

                  <CalendarDays
                    size={16}
                    className="
                      pointer-events-none
                      absolute right-3
                      top-1/2
                      -translate-y-1/2
                      text-[#64798a]
                    "
                  />
                </div>
              </div>

              {/* TANGGAL KADALUARSA */}

              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-[#455968] sm:text-sm">
                  Tanggal Kedaluwarsa
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={tanggalKadaluarsa}
                    onChange={(e) =>
                      setTanggalKadaluarsa(e.target.value)
                    }
                    placeholder="DD/MM/YYYY"
                    className="
                      h-10
                      w-full
                      rounded-[10px]
                      border border-[#dce6eb]
                      bg-white
                      px-3
                      pr-10
                      text-sm
                      text-[#24313d]
                      outline-none
                      focus:border-[#159b68]
                      focus:ring-2
                      focus:ring-[#159b68]/10
                    "
                    required
                  />

                  <CalendarDays
                    size={16}
                    className="
                      pointer-events-none
                      absolute right-3
                      top-1/2
                      -translate-y-1/2
                      text-[#64798a]
                    "
                  />
                </div>
              </div>

              {/* SIMPAN */}

              <button
                type="submit"
                className="
                  mt-4
                  h-10
                  w-full
                  rounded-[10px]
                  bg-[#159b68]
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#11895b]
                  sm:text-sm
                "
              >
                Simpan
              </button>
            </form>
          </main>
        )}
      </div>
    </div>
  );
}

// ======================================================
// KOMPONEN NUTRISI
// ======================================================

function NutrisiItem({ icon, label, value }) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="flex h-6 w-6 items-center justify-center text-[#169b68]">
        {icon}
      </div>

      <p className="mt-0.5 w-full truncate text-[10px] text-[#617887]">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[10px] font-bold text-[#47616d] sm:text-xs">
        {value}
      </p>
    </div>
  );
}