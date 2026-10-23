import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

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
  Loader2,
} from "lucide-react";

// ======================================================
// HELPER GAMBAR
// ======================================================


const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
  }

  let path = String(imagePath).trim();

  if (!path) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
  }

  // Normalisasi garis miring
  path = path.replace(/\\/g, "/");

  // Jika sudah berupa URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Hilangkan ./ dan slash awal
  path = path.replace(/^\.\//, "").replace(/^\/+/, "");

  // Hilangkan prefix public/
  if (path.startsWith("public/")) {
    path = path.slice("public/".length);
  }

  // Jika path sudah image/ingredients/...
  if (path.startsWith("image/ingredients/")) {
    return `/${path}`;
  }

  // Jika path berupa ingredients/...
  if (path.startsWith("ingredients/")) {
    return `/image/${path}`;
  }

  // Jika hanya nama file, misalnya 13-buncis.jpg
  if (!path.includes("/")) {
    return `/image/ingredients/${path}`;
  }

  // Jika path memiliki folder ingredients di dalamnya
  const index = path.indexOf("ingredients/");

  if (index !== -1) {
    return `/image/${path.slice(index)}`;
  }

  // Path public lainnya
  return `/${path}`;
};


// ======================================================
// ICON KATEGORI
// ======================================================

const getCategoryIcon = (namaKategori) => {
  const nama = namaKategori.toLowerCase();

  if (
    nama.includes("protein") ||
    nama.includes("hewani") ||
    nama.includes("daging") ||
    nama.includes("ikan")
  ) {
    return Beef;
  }

  if (
    nama.includes("karbo") ||
    nama.includes("beras") ||
    nama.includes("tepung")
  ) {
    return Wheat;
  }

  if (
    nama.includes("dairy") ||
    nama.includes("susu")
  ) {
    return Milk;
  }

  return Leaf;
};

// ======================================================
// HELPER TANGGAL & ESTIMASI MASA SIMPAN
// ======================================================

// Format YYYY-MM-DD menurut zona waktu lokal
const keISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const hariIni = () => keISO(new Date());

const tambahHari = (iso, jumlahHari) => {
  const [y, m, d] = iso.split("-").map(Number);

  return keISO(new Date(y, m - 1, d + jumlahHari));
};

// YYYY-MM-DD -> DD/MM/YYYY (hanya untuk tampilan)
const formatTampil = (iso) => {
  if (!iso) return "-";

  const [y, m, d] = iso.split("-");

  return `${d}/${m}/${y}`;
};

// Perkiraan masa simpan (hari) berdasarkan kategori/nama bahan.
// Idealnya nanti disimpan di kolom shelf_life_days pada ingredients_master.
const estimasiHariSimpan = (bahan) => {
  const teks = `${bahan.kategori} ${bahan.nama}`.toLowerCase();

  if (/(ikan|udang|cumi|daging|ayam|sapi|hewani)/.test(teks)) return 3;
  if (/(susu|dairy|keju|yogurt)/.test(teks)) return 7;
  if (/(telur)/.test(teks)) return 21;
  if (/(beras|tepung|karbo|kacang|serealia)/.test(teks)) return 180;
  if (/(sayur|bayam|kangkung|sawi|daun)/.test(teks)) return 5;
  if (/(buah|alpukat|pisang|pepaya)/.test(teks)) return 5;

  return 7;
};


// ======================================================
// KOMPONEN UTAMA
// ======================================================

export default function TambahBahanModal() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [search, setSearch] = useState("");

  const [kategoriAktif, setKategoriAktif] =
    useState("Semua");

  const [bahanTerpilih, setBahanTerpilih] =
    useState(null);

  const [jumlah, setJumlah] = useState("500");

  const [satuan, setSatuan] = useState("gram");

  // Tanggal masuk otomatis hari ini
  const [tanggalMasuk, setTanggalMasuk] =
    useState(hariIni());

  const [ubahTanggalMasuk, setUbahTanggalMasuk] =
    useState(false);

  // Kedaluwarsa otomatis; pengguna boleh mengatur manual (opsional)
  const [aturKedaluwarsa, setAturKedaluwarsa] =
    useState(false);

  const [
    tanggalKedaluwarsaManual,
    setTanggalKedaluwarsaManual,
  ] = useState("");

  // ====================================================
  // DATA DARI DATABASE
  // ====================================================

  const [bahanData, setBahanData] = useState([]);

  const [kategoriData, setKategoriData] = useState([
    {
      nama: "Semua",
      icon: Leaf,
    },
  ]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Loading khusus saat menyimpan
  const [saving, setSaving] = useState(false);

  // ====================================================
  // AMBIL DATA DARI DATABASE
  // ====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // ==================================================
        // AMBIL KATEGORI
        // ==================================================

        const {
          data: kategori,
          error: kategoriError,
        } = await supabase
          .from("ingredient_categories")
          .select("id, name")
          .order("id", {
            ascending: true,
          });

        if (kategoriError) {
          throw kategoriError;
        }

        // ==================================================
        // AMBIL INGREDIENT MASTER
        // ==================================================

        const {
          data: ingredients,
          error: ingredientsError,
        } = await supabase
          .from("ingredients_master")
          .select(`
            id,
            category_id,
            name,
            default_unit,
            image_path,
            calories_per_100g,
            protein_g,
            fat_g,
            carbs_g,
            iron_mg,
            zinc_mg,
            vitamin_a_mcg,
            vitamin_c_mg
          `)
          .order("name", {
            ascending: true,
          });

        if (ingredientsError) {
          throw ingredientsError;
        }

        // ==================================================
        // BUAT MAP KATEGORI
        // ==================================================

        const kategoriMap = new Map(
          (kategori || []).map((item) => [
            item.id,
            item.name,
          ])
        );

        // ==================================================
        // UBAH DATA DATABASE KE FORMAT UI
        // ==================================================

        const bahanMapped = (
          ingredients || []
        ).map((item) => {
          const namaKategori =
            kategoriMap.get(item.category_id) ||
            "Lainnya";

          return {
            id: item.id,

            nama: item.name,

            kategori: namaKategori,

            categoryId: item.category_id,

            defaultUnit:
              item.default_unit || "gram",

            image: getImageUrl(item.image_path),

            imagePath: item.image_path,

            deskripsi:
              `Informasi nutrisi ${item.name} per 100 gram.`,

            nutrisi: {
              kalori:
                item.calories_per_100g !== null &&
                item.calories_per_100g !== undefined
                  ? `${item.calories_per_100g} kkal`
                  : "-",

              protein:
                item.protein_g !== null &&
                item.protein_g !== undefined
                  ? `${item.protein_g} g`
                  : "-",

              lemak:
                item.fat_g !== null &&
                item.fat_g !== undefined
                  ? `${item.fat_g} g`
                  : "-",

              karbohidrat:
                item.carbs_g !== null &&
                item.carbs_g !== undefined
                  ? `${item.carbs_g} g`
                  : "-",

              // Belum ada kolom serat pada query
              serat: "-",
            },

            nutrisiRaw: {
              kalori: item.calories_per_100g,
              protein: item.protein_g,
              lemak: item.fat_g,
              karbohidrat: item.carbs_g,
              zatBesi: item.iron_mg,
              zinc: item.zinc_mg,
              vitaminA: item.vitamin_a_mcg,
              vitaminC: item.vitamin_c_mg,
            },
          };
        });

        setBahanData(bahanMapped);

        // ==================================================
        // BUAT FILTER KATEGORI DARI DATABASE
        // ==================================================

        const kategoriMapped = [
          {
            nama: "Semua",
            icon: Leaf,
          },

          ...(kategori || []).map((item) => ({
            nama: item.name,
            icon: getCategoryIcon(item.name),
          })),
        ];

        setKategoriData(kategoriMapped);

      } catch (err) {
        console.error(
          "Gagal mengambil data bahan:",
          err
        );

        setError(
          "Data bahan gagal dimuat dari database."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  }, [
    bahanData,
    search,
    kategoriAktif,
  ]);

  // ====================================================
  // PILIH BAHAN
  // ====================================================

  const pilihBahan = (item) => {
    setBahanTerpilih(item);

    // Menggunakan satuan default dari database
    if (item.defaultUnit) {
      setSatuan(item.defaultUnit);
    }
  };

  // ====================================================
  // LANJUT KE DETAIL
  // ====================================================

  const handleLanjut = () => {
    if (!bahanTerpilih) return;

    setStep(2);
  };

  // ====================================================
  // ESTIMASI & HITUNG TANGGAL KEDALUWARSA
  // ====================================================

  const estimasiHari = bahanTerpilih
    ? estimasiHariSimpan(bahanTerpilih)
    : 7;

  const hitungKedaluwarsa = () => {
    // Manual hanya dipakai kalau pengguna benar-benar mengisi
    if (aturKedaluwarsa && tanggalKedaluwarsaManual) {
      return tanggalKedaluwarsaManual;
    }

    return tambahHari(
      tanggalMasuk || hariIni(),
      estimasiHari
    );
  };

  // ====================================================
  // SIMPAN
  // ====================================================

  const handleSimpan = async (e) => {
    e.preventDefault();

    // Pastikan bahan sudah dipilih
    if (!bahanTerpilih) {
      setError(
        "Silakan pilih bahan terlebih dahulu."
      );
      return;
    }

    // Pastikan jumlah valid
    if (!jumlah || Number(jumlah) <= 0) {
      setError(
        "Jumlah bahan harus lebih dari 0."
      );
      return;
    }

    // Tanggal masuk default hari ini, kedaluwarsa otomatis diestimasi
    const masukFinal = tanggalMasuk || hariIni();
    const kedaluwarsaFinal = hitungKedaluwarsa();

    if (kedaluwarsaFinal < masukFinal) {
      setError(
        "Tanggal kedaluwarsa tidak boleh sebelum tanggal masuk."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ==================================================
      // AMBIL USER YANG SEDANG LOGIN
      // ==================================================

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(
          "Silakan login terlebih dahulu."
        );
        return;
      }

      // Tanggal sudah dalam format YYYY-MM-DD (siap untuk database)
      const tanggalMasukDB = masukFinal;
      const tanggalKadaluarsaDB = kedaluwarsaFinal;

      // ==================================================
      // DATA YANG AKAN DISIMPAN
      // ==================================================

      const dataStok = {
        user_id: user.id,

        // FK ke ingredients_master.id
        bahan_pangan_id:
          bahanTerpilih.id,

        jumlah: Number(jumlah),

        satuan: satuan,

        tanggal_masuk:
          tanggalMasukDB,

        tanggal_kadaluarsa:
          tanggalKadaluarsaDB,
      };

      console.log(
        "Data yang akan disimpan ke stok:",
        dataStok
      );

      // ==================================================
      // INSERT KE TABEL STOK
      // ==================================================

      const {
        data,
        error: insertError,
      } = await supabase
        .from("stok")
        .insert(dataStok)
        .select()
        .single();

      if (insertError) {
        console.error(
          "Supabase INSERT ERROR:",
          insertError
        );

        throw insertError;
      }

      // ==================================================
      // BERHASIL
      // ==================================================

      console.log(
        "Stok berhasil disimpan:",
        data
      );

      // Kembali ke halaman stok
      navigate("/stok");

    } catch (err) {
      console.error(
        "Gagal menyimpan stok:",
        err
      );

      setError(
        err?.message ||
        "Gagal menyimpan bahan ke stok."
      );
    } finally {
      setSaving(false);
    }
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
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f9f5] font-jakarta">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#159b68]">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Memuat data bahan...
        </div>
      </div>
    );
  }

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
            ERROR
        ================================================== */}

        {error && (
          <div className="mx-3.5 mt-3 rounded-[11px] border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600 sm:mx-4">
            {error}
          </div>
        )}

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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
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
                  onClick={() =>
                    setSearch("")
                  }
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

                const aktif =
                  kategoriAktif ===
                  item.nama;

                return (
                  <button
                    key={item.nama}
                    type="button"
                    onClick={() =>
                      setKategoriAktif(
                        item.nama
                      )
                    }
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

                bahanFiltered.map(
                  (item, index) => {

                    const aktif =
                      bahanTerpilih?.id ===
                      item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          pilihBahan(item)
                        }
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
                          onError={(e) => {
                            e.currentTarget.src =
                              "/image/placeholder.png";
                          }}
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
                          <span
                            className="
                              flex h-5 w-5
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#169b68]
                              text-white
                            "
                          >
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

                  }
                )

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

        {step === 2 &&
          bahanTerpilih && (
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
                  onError={(e) => {
                    e.currentTarget.src =
                      "/image/placeholder.png";
                  }}
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
                    value={
                      bahanTerpilih
                        .nutrisi
                        .kalori
                    }
                  />

                  <NutrisiItem
                    icon={<Beef size={14} />}
                    label="Protein"
                    value={
                      bahanTerpilih
                        .nutrisi
                        .protein
                    }
                  />

                  <NutrisiItem
                    icon={<Milk size={14} />}
                    label="Lemak"
                    value={
                      bahanTerpilih
                        .nutrisi
                        .lemak
                    }
                  />

                  <NutrisiItem
                    icon={<Wheat size={14} />}
                    label="Karbohidrat"
                    value={
                      bahanTerpilih
                        .nutrisi
                        .karbohidrat
                    }
                  />

                  <NutrisiItem
                    icon={<Leaf size={14} />}
                    label="Serat"
                    value={
                      bahanTerpilih
                        .nutrisi
                        .serat
                    }
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
                        setJumlah(
                          e.target.value
                        )
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
                          setSatuan(
                            e.target.value
                          )
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

                        <option value="gram">
                          gram
                        </option>

                        <option value="kg">
                          kg
                        </option>

                        <option value="ml">
                          ml
                        </option>

                        <option value="liter">
                          liter
                        </option>

                        <option value="butir">
                          butir
                        </option>

                        <option value="pcs">
                          pcs
                        </option>

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

                {/* TANGGAL KEDALUWARSA (OTOMATIS) */}

                <div className="mt-3">

                  {!aturKedaluwarsa ? (
                    <p className="text-xs text-[#617887]">
                      Perkiraan kedaluwarsa:{" "}
                      <span className="font-semibold text-[#455968]">
                        {formatTampil(hitungKedaluwarsa())}
                      </span>
                      {" "}(±{estimasiHari} hari, diatur otomatis)
                      {" · "}
                      <button
                        type="button"
                        onClick={() =>
                          setAturKedaluwarsa(true)
                        }
                        className="font-semibold text-[#159b68] hover:underline"
                      >
                        Ubah
                      </button>
                    </p>
                  ) : (
                    <>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#455968] sm:text-sm">
                          Tanggal Kedaluwarsa
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setAturKedaluwarsa(false);
                            setTanggalKedaluwarsaManual("");
                          }}
                          className="text-xs font-semibold text-[#159b68] hover:underline"
                        >
                          Pakai otomatis
                        </button>
                      </div>

                      <input
                        type="date"
                        min={tanggalMasuk}
                        value={tanggalKedaluwarsaManual}
                        onChange={(e) =>
                          setTanggalKedaluwarsaManual(
                            e.target.value
                          )
                        }
                        className="
                          h-10
                          w-full
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
                      />
                    </>
                  )}

                </div>

                {/* TANGGAL MASUK (DEFAULT HARI INI) */}

                <div className="mt-3">

                  {!ubahTanggalMasuk ? (
                    <p className="text-xs text-[#617887]">
                      Dicatat masuk:{" "}
                      <span className="font-semibold text-[#455968]">
                        {tanggalMasuk === hariIni()
                          ? "Hari ini"
                          : formatTampil(tanggalMasuk)}
                      </span>
                      {" · "}
                      <button
                        type="button"
                        onClick={() =>
                          setUbahTanggalMasuk(true)
                        }
                        className="font-semibold text-[#159b68] hover:underline"
                      >
                        Ubah
                      </button>
                    </p>
                  ) : (
                    <>
                      <label className="mb-1 block text-xs font-semibold text-[#455968] sm:text-sm">
                        Tanggal Masuk
                      </label>

                      <input
                        type="date"
                        max={hariIni()}
                        value={tanggalMasuk}
                        onChange={(e) =>
                          setTanggalMasuk(e.target.value)
                        }
                        className="
                          h-10
                          w-full
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
                      />
                    </>
                  )}

                </div>

                {/* SIMPAN */}

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    mt-4
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    bg-[#159b68]
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#11895b]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:text-sm
                  "
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
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

function NutrisiItem({
  icon,
  label,
  value,
}) {
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