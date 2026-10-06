import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Sparkles,
  Bot,
  Heart,
  Clock3,
  Users,
  Leaf,
  Beef,
  Wheat,
  Grid2X2,
  CircleDot,
  ChefHat,
  CircleCheck,
  Bookmark,
  UtensilsCrossed,
  Lightbulb,
} from "lucide-react";

/* =========================================================
   DATA BAHAN
   Nanti data ini bisa diganti dari API Golang / Supabase
========================================================= */

const bahanData = [
  {
    id: 1,
    nama: "Kangkung",
    jumlah: "500 g",
    kategori: "Sayuran",
    status: "Hampir kadaluarsa",
    image:
      "https://images.unsplash.com/photo-1515367462048-0d2f1e8f5e3c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    nama: "Telur",
    jumlah: "6 butir",
    kategori: "Protein",
    status: "Hampir kadaluarsa",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    nama: "Wortel",
    jumlah: "300 g",
    kategori: "Sayuran",
    status: "Aman",
    image:
      "https://images.unsplash.com/photo-1447175008436-170170753d52?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    nama: "Tempe",
    jumlah: "250 g",
    kategori: "Protein",
    status: "Aman",
    image:
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    nama: "Ikan Tuna",
    jumlah: "200 g",
    kategori: "Protein",
    status: "Aman",
    image:
      "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=300&q=80",
  },
];

/* =========================================================
   KATEGORI
========================================================= */

const kategoriData = [
  { id: "Semua", label: "Semua" },
  { id: "Sayuran", label: "Sayuran" },
  { id: "Buah", label: "Buah" },
  { id: "Protein", label: "Protein" },
  { id: "Karbo", label: "Karbo" },
];

/* =========================================================
   KOMPONEN UTAMA
========================================================= */

export default function RacikResepAI() {
  const navigate = useNavigate();

  /*
    step:
    1 = halaman awal
    2 = pilih bahan
    3 = AI sedang meracik
    4 = hasil resep
    5 = cara memasak
  */
  const [step, setStep] = useState(1);

  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const [bahanTerpilih, setBahanTerpilih] = useState([1, 2]);

  const [targetResep, setTargetResep] = useState("Semua");

  const [jumlahPorsi, setJumlahPorsi] = useState(4);

  const [resepDisimpan, setResepDisimpan] = useState(false);

  /* =====================================================
     FILTER BAHAN
  ===================================================== */

  const bahanFiltered = useMemo(() => {
    if (kategoriAktif === "Semua") {
      return bahanData;
    }

    return bahanData.filter(
      (item) => item.kategori === kategoriAktif
    );
  }, [kategoriAktif]);

  /* =====================================================
     PILIH BAHAN
  ===================================================== */

  const toggleBahan = (id) => {
    setBahanTerpilih((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  /* =====================================================
     MULAI RACIK AI
  ===================================================== */

  const handleBuatResep = () => {
    if (bahanTerpilih.length === 0) {
      return;
    }

    setStep(3);
  };

  /* =====================================================
     AI LOADING
  ===================================================== */

  useEffect(() => {
    if (step !== 3) return;

    const timer = setTimeout(() => {
      setStep(4);
    }, 3500);

    return () => clearTimeout(timer);
  }, [step]);

  /* =====================================================
     KEMBALI
  ===================================================== */

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 4) {
      setStep(2);
      return;
    }

    if (step === 5) {
      setStep(4);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6faf7] font-jakarta text-[#263746]">
      <div className="mx-auto min-h-screen w-full max-w-[520px] bg-[#f6faf7]">
        {/* =================================================
            STEP 1
        ================================================== */}

        {step === 1 && (
          <StepAwal
            navigate={navigate}
            targetResep={targetResep}
            setTargetResep={setTargetResep}
            jumlahPorsi={jumlahPorsi}
            setJumlahPorsi={setJumlahPorsi}
            onNext={() => setStep(2)}
          />
        )}

        {/* =================================================
            STEP 2
        ================================================== */}

        {step === 2 && (
          <StepPilihBahan
            onBack={handleBack}
            bahanFiltered={bahanFiltered}
            bahanTerpilih={bahanTerpilih}
            toggleBahan={toggleBahan}
            kategoriAktif={kategoriAktif}
            setKategoriAktif={setKategoriAktif}
            jumlahPorsi={jumlahPorsi}
            onNext={handleBuatResep}
          />
        )}

        {/* =================================================
            STEP 3
        ================================================== */}

        {step === 3 && <StepLoading />}

        {/* =================================================
            STEP 4
        ================================================== */}

        {step === 4 && (
          <StepHasilResep
            onBack={handleBack}
            onCaraMemasak={() => setStep(5)}
            resepDisimpan={resepDisimpan}
            setResepDisimpan={setResepDisimpan}
            jumlahPorsi={jumlahPorsi}
          />
        )}

        {/* =================================================
            STEP 5
        ================================================== */}

        {step === 5 && (
          <StepCaraMemasak
            onBack={handleBack}
            jumlahPorsi={jumlahPorsi}
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STEP 1 — HALAMAN AWAL
========================================================= */

function StepAwal({
  navigate,
  targetResep,
  setTargetResep,
  jumlahPorsi,
  setJumlahPorsi,
  onNext,
}) {
  const targetData = [
    "Semua",
    "Tinggi Protein",
    "Rendah Kalori",
    "Untuk Anak",
    "Menu Keluarga",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}

      <header className="flex h-[62px] items-center gap-3 border-b border-[#e1e9e4] bg-[#f6faf7] px-4 sm:h-[68px] sm:px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-sm font-bold text-[#263746] sm:text-base">
          Racik Resep AI
        </h1>
      </header>

      <main className="px-4 pb-8 pt-4 sm:px-5 sm:pt-5">
        <h2 className="text-base font-bold text-[#263746] sm:text-lg">
          Buat Resep Sehat dengan AI
        </h2>

        <p className="mt-1 text-[11px] leading-relaxed text-[#7c8d98] sm:text-xs">
          Pilih cara membuat resep sesuai kebutuhan kamu.
        </p>

        {/* Gunakan semua bahan */}

        <button
          type="button"
          onClick={onNext}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[#69cba1] bg-[#f5fffa] p-3.5 text-left transition hover:bg-[#effbf5]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3f8ee] text-[#159b68]">
            <Sparkles size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-[#263746] sm:text-sm">
              Gunakan Semua Bahan Tersedia
            </h3>

            <p className="mt-1 text-[10px] leading-relaxed text-[#81919c] sm:text-xs">
              AI akan menggunakan semua bahan yang ada di kulkas kamu.
            </p>

            <span className="mt-1.5 inline-flex rounded-full bg-[#dff5ea] px-2 py-0.5 text-[9px] font-semibold text-[#159b68] sm:text-[10px]">
              5 bahan tersedia
            </span>
          </div>

          <ChevronRight
            size={18}
            className="shrink-0 text-[#159b68]"
          />
        </button>

        {/* Pilih bahan sendiri */}

        <button
          type="button"
          onClick={onNext}
          className="mt-2.5 flex w-full items-center gap-3 rounded-xl border border-[#e1e9ed] bg-white p-3.5 text-left transition hover:bg-[#fafcfb]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f3fb] text-[#6f7e9c]">
            <ChefHat size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-[#263746] sm:text-sm">
              Pilih Bahan Sendiri
            </h3>

            <p className="mt-1 text-[10px] leading-relaxed text-[#81919c] sm:text-xs">
              Kamu bisa memilih bahan tertentu yang ingin digunakan.
            </p>
          </div>

          <ChevronRight
            size={18}
            className="shrink-0 text-[#718391]"
          />
        </button>

        {/* Target resep */}

        <section className="mt-5">
          <h3 className="text-[11px] font-bold text-[#50616d] sm:text-xs">
            Target Resep
          </h3>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {targetData.map((item) => {
              const active = targetResep === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTargetResep(item)}
                  className={`rounded-full px-3 py-1.5 text-[9px] font-semibold transition sm:text-[10px] ${
                    active
                      ? "bg-[#159b68] text-white"
                      : "bg-white text-[#80909b] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* Jumlah porsi */}

        <section className="mt-5">
          <h3 className="text-[11px] font-bold text-[#50616d] sm:text-xs">
            Jumlah Porsi
          </h3>

          <div className="mt-2 flex items-center justify-between rounded-xl bg-transparent">
            <span className="text-xs text-[#7d8d97]">
              Untuk {jumlahPorsi} orang
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setJumlahPorsi((prev) => Math.max(1, prev - 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#5b6d78] shadow-sm"
              >
                −
              </button>

              <span className="flex h-8 min-w-8 items-center justify-center text-xs font-bold text-[#344754]">
                {jumlahPorsi}
              </span>

              <button
                type="button"
                onClick={() =>
                  setJumlahPorsi((prev) => prev + 1)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#159b68] shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Button */}

        <button
          type="button"
          onClick={onNext}
          className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-[#159b68] text-xs font-bold text-white shadow-sm transition hover:bg-[#118a5c] sm:h-11 sm:text-sm"
        >
          Buat Resep AI
        </button>
      </main>
    </div>
  );
}

/* =========================================================
   STEP 2 — PILIH BAHAN
========================================================= */

function StepPilihBahan({
  onBack,
  bahanFiltered,
  bahanTerpilih,
  toggleBahan,
  kategoriAktif,
  setKategoriAktif,
  jumlahPorsi,
  onNext,
}) {
  return (
    <div className="min-h-screen">
      {/* Header */}

      <header className="flex h-[62px] items-center gap-3 border-b border-[#e1e9e4] bg-[#f6faf7] px-4 sm:h-[68px] sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#159b68] hover:bg-white"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-sm font-bold text-[#263746] sm:text-base">
          Racik Resep AI
        </h1>
      </header>

      <main className="px-4 pb-8 pt-3 sm:px-5 sm:pt-4">
        {/* Info */}

        <div className="flex gap-3 rounded-xl border border-[#cceef5] bg-[#effaff] p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9f3fa] text-[#378ab0]">
            <CircleDot size={17} />
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-[#34769b] sm:text-xs">
              Pilih bahan yang ingin digunakan
            </h3>

            <p className="mt-0.5 text-[9px] leading-relaxed text-[#7595a4] sm:text-[10px]">
              Bahan yang tersedia di kulkas kamu akan muncul otomatis dari stok.
            </p>
          </div>
        </div>

        {/* Category */}

        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {kategoriData.map((item) => {
            const active = kategoriAktif === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setKategoriAktif(item.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-semibold sm:text-[10px] ${
                  active
                    ? "bg-[#159b68] text-white"
                    : "bg-white text-[#7d8e9a]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Header bahan */}

        <div className="mt-3 flex items-end justify-between">
          <div>
            <h2 className="text-xs font-bold text-[#536570] sm:text-sm">
              Bahan Tersedia
            </h2>

            <p className="mt-0.5 text-[9px] text-[#8b9ba5]">
              {bahanTerpilih.length} bahan dipilih
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              bahanTerpilih.length === bahanData.length
                ? null
                : bahanData.forEach((item) => {
                    if (!bahanTerpilih.includes(item.id)) {
                      toggleBahan(item.id);
                    }
                  })
            }
            className="text-[9px] font-semibold text-[#159b68] sm:text-[10px]"
          >
            Pilih semua
          </button>
        </div>

        {/* List */}

        <div className="mt-2 overflow-hidden rounded-xl border border-[#e1e8eb] bg-white">
          {bahanFiltered.map((item, index) => {
            const selected = bahanTerpilih.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleBahan(item.id)}
                className={`flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition ${
                  index !== bahanFiltered.length - 1
                    ? "border-b border-[#edf1f3]"
                    : ""
                } ${
                  selected
                    ? "bg-[#f9fffc]"
                    : "bg-white hover:bg-[#fafcfb]"
                }`}
              >
                {/* Checkbox */}

                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    selected
                      ? "border-[#159b68] bg-[#159b68] text-white"
                      : "border-[#c7d2d8] bg-white"
                  }`}
                >
                  {selected && <Check size={11} strokeWidth={3} />}
                </div>

                {/* Image */}

                <img
                  src={item.image}
                  alt={item.nama}
                  className="h-9 w-9 shrink-0 rounded-lg object-cover sm:h-10 sm:w-10"
                />

                {/* Info */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <p className="truncate text-[10px] font-bold text-[#334652] sm:text-xs">
                      {item.nama}
                    </p>

                    <span className="text-[9px] text-[#81919b]">
                      ({item.jumlah})
                    </span>
                  </div>

                  {item.status === "Hampir kadaluarsa" && (
                    <span className="mt-0.5 inline-flex rounded-full bg-[#fff1c9] px-1.5 py-0.5 text-[8px] font-semibold text-[#d99316]">
                      {item.status}
                    </span>
                  )}
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-[#8797a2]"
                />
              </button>
            );
          })}
        </div>

        {/* Button */}

        <button
          type="button"
          onClick={onNext}
          disabled={bahanTerpilih.length === 0}
          className={`mt-4 h-10 w-full rounded-xl text-xs font-bold transition sm:h-11 sm:text-sm ${
            bahanTerpilih.length > 0
              ? "bg-[#159b68] text-white hover:bg-[#118a5c]"
              : "cursor-not-allowed bg-[#cfe3d9] text-white"
          }`}
        >
          Lanjut
        </button>

        <p className="mt-2 text-center text-[9px] text-[#8b9aa3]">
          Untuk {jumlahPorsi} porsi
        </p>
      </main>
    </div>
  );
}

/* =========================================================
   STEP 3 — AI SEDANG MERACIK
========================================================= */

function StepLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[62px] items-center gap-3 border-b border-[#e1e9e4] px-4 sm:h-[68px] sm:px-5">
        <div className="flex h-8 w-8 items-center justify-center">
          <ArrowLeft size={20} className="text-[#263746]" />
        </div>

        <h1 className="text-sm font-bold sm:text-base">
          Racik Resep AI
        </h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        {/* Robot */}

        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#effaf5] sm:h-32 sm:w-32">
          <div className="absolute inset-3 rounded-full border border-[#d5f1e4]" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-[#159b68] shadow-sm">
            <Bot size={42} strokeWidth={1.6} />
          </div>

          <Sparkles
            size={18}
            className="absolute right-3 top-5 text-[#159b68]"
          />

          <Sparkles
            size={13}
            className="absolute bottom-5 left-4 text-[#7ed6b1]"
          />
        </div>

        <h2 className="mt-6 text-sm font-bold text-[#344955] sm:text-base">
          AI sedang meracik resep untuk kamu...
        </h2>

        <p className="mt-2 max-w-[300px] text-[10px] leading-relaxed text-[#82919a] sm:text-xs">
          Kami sedang memilih bahan terbaik, menghitung nutrisi,
          dan membuat resep yang sehat dan lezat.
        </p>

        {/* Checklist */}

        <div className="mt-5 w-full max-w-[300px] rounded-xl bg-white p-3.5 shadow-[0_3px_12px_rgba(0,0,0,0.04)]">
          <LoadingItem text="Menganalisis bahan yang tersedia" />
          <LoadingItem text="Menentukan resep terbaik" />
          <LoadingItem text="Menghitung kandungan nutrisi" />
          <LoadingItem text="Menyesuaikan dengan kebutuhan keluarga" />
        </div>

        {/* Progress */}

        <div className="mt-5 flex w-full max-w-[300px] items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e8f2ed]">
            <div className="h-full w-[65%] rounded-full bg-[#159b68]" />
          </div>

          <span className="text-[10px] font-semibold text-[#7d8d97]">
            60%
          </span>
        </div>
      </main>
    </div>
  );
}

function LoadingItem({ text }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <CircleCheck
        size={14}
        className="shrink-0 text-[#159b68]"
        fill="#e7f8f0"
      />

      <span className="text-[10px] text-[#687b87] sm:text-[11px]">
        {text}
      </span>
    </div>
  );
}

/* =========================================================
   STEP 4 — HASIL RESEP
========================================================= */

function StepHasilResep({
  onBack,
  onCaraMemasak,
  resepDisimpan,
  setResepDisimpan,
  jumlahPorsi,
}) {
  return (
    <div className="min-h-screen">
      {/* Header */}

      <header className="flex h-[62px] items-center gap-3 border-b border-[#e1e9e4] bg-[#f6faf7] px-4 sm:h-[68px] sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-sm font-bold sm:text-base">
          Hasil Resep
        </h1>
      </header>

      <main className="px-4 pb-8 pt-3 sm:px-5 sm:pt-4">
        {/* Image */}

        <div className="relative overflow-hidden rounded-xl">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"
            alt="Tumis Kangkung Telur"
            className="h-[150px] w-full object-cover sm:h-[175px]"
          />

          <button
            type="button"
            onClick={() => setResepDisimpan(!resepDisimpan)}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm"
          >
            <Heart
              size={17}
              className={
                resepDisimpan
                  ? "fill-[#e65f6b] text-[#e65f6b]"
                  : "text-[#9aa8af]"
              }
            />
          </button>
        </div>

        {/* Title */}

        <div className="mt-2.5">
          <h2 className="text-sm font-bold text-[#263746] sm:text-base">
            Tumis Kangkung Telur
          </h2>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] text-[#7b8b95] sm:text-[10px]">
            <span>Cocok untuk {jumlahPorsi} porsi</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock3 size={11} />
              20 menit
            </span>
          </div>

          <span className="mt-1.5 inline-flex rounded-full bg-[#dff6eb] px-2 py-1 text-[9px] font-semibold text-[#159b68]">
            Tinggi Protein
          </span>
        </div>

        {/* Nutrisi */}

        <section className="mt-3 rounded-xl bg-[#edf8f3] p-3">
          <h3 className="text-[10px] font-bold text-[#48616c] sm:text-xs">
            Informasi Nutrisi{" "}
            <span className="font-normal text-[#82939c]">
              (total resep)
            </span>
          </h3>

          <div className="mt-3 grid grid-cols-5 gap-1">
            <Nutrition
              icon={<Leaf size={14} />}
              label="Kalori"
              value="420 kkal"
            />

            <Nutrition
              icon={<Beef size={14} />}
              label="Protein"
              value="24 g"
            />

            <Nutrition
              icon={<CircleDot size={14} />}
              label="Lemak"
              value="18 g"
            />

            <Nutrition
              icon={<Wheat size={14} />}
              label="Karbohidrat"
              value="35 g"
            />

            <Nutrition
              icon={<Grid2X2 size={14} />}
              label="Serat"
              value="6 g"
            />
          </div>
        </section>

        {/* Bahan */}

        <section className="mt-4">
          <h3 className="text-xs font-bold text-[#4c606c] sm:text-sm">
            Bahan yang Digunakan
          </h3>

          <div className="mt-2 space-y-1.5">
            <IngredientRow
              icon={<Leaf size={13} />}
              name="Kangkung"
              amount="200 g"
            />

            <IngredientRow
              icon={<CircleDot size={13} />}
              name="Telur"
              amount="4 butir"
            />

            <IngredientRow
              icon={<Leaf size={13} />}
              name="Bawang putih"
              amount="2 siung"
            />

            <IngredientRow
              icon={<CircleDot size={13} />}
              name="Minyak zaitun"
              amount="2 sdm"
            />

            <IngredientRow
              icon={<Leaf size={13} />}
              name="Garam & lada"
              amount="secukupnya"
            />
          </div>
        </section>

        {/* Cara memasak */}

        <button
          type="button"
          onClick={onCaraMemasak}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#159b68] text-xs font-bold text-white transition hover:bg-[#118a5c]"
        >
          <UtensilsCrossed size={15} />
          Lihat Cara Memasak
        </button>

        {/* Simpan */}

        <button
          type="button"
          onClick={() => setResepDisimpan(!resepDisimpan)}
          className={`mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl border text-[10px] font-bold transition sm:text-xs ${
            resepDisimpan
              ? "border-[#159b68] bg-[#effaf5] text-[#159b68]"
              : "border-[#61caa0] bg-white text-[#159b68]"
          }`}
        >
          <Bookmark
            size={14}
            className={resepDisimpan ? "fill-current" : ""}
          />
          {resepDisimpan ? "Resep Tersimpan" : "Simpan Resep"}
        </button>
      </main>
    </div>
  );
}

function Nutrition({ icon, label, value }) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="flex h-6 w-6 items-center justify-center text-[#159b68]">
        {icon}
      </div>

      <span className="mt-0.5 w-full truncate text-[8px] text-[#7b8d96] sm:text-[9px]">
        {label}
      </span>

      <span className="mt-0.5 text-[9px] font-bold text-[#48616c] sm:text-[10px]">
        {value}
      </span>
    </div>
  );
}

function IngredientRow({ icon, name, amount }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[#159b68]">{icon}</span>

        <span className="text-[10px] text-[#667a85] sm:text-[11px]">
          {name}
        </span>
      </div>

      <span className="text-[10px] font-semibold text-[#667a85] sm:text-[11px]">
        {amount}
      </span>
    </div>
  );
}

/* =========================================================
   STEP 5 — CARA MEMASAK
========================================================= */

function StepCaraMemasak({ onBack, jumlahPorsi }) {
  const langkah = [
    "Panaskan minyak, tumis bawang putih hingga harum.",
    "Masukkan telur, orak-arik hingga matang.",
    "Tambahkan wortel, masak sebentar.",
    "Masukkan kangkung, aduk hingga layu.",
    "Bumbui dengan garam dan lada, aduk rata.",
    "Sajikan selagi hangat.",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}

      <header className="flex h-[62px] items-center gap-3 border-b border-[#e1e9e4] bg-[#f6faf7] px-4 sm:h-[68px] sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-sm font-bold sm:text-base">
          Cara Memasak
        </h1>
      </header>

      <main className="px-4 pb-8 pt-3 sm:px-5 sm:pt-4">
        {/* Recipe mini header */}

        <section className="flex items-center gap-3 border-b border-[#e4ebe7] pb-3">
          <img
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80"
            alt="Tumis Kangkung Telur"
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />

          <div className="min-w-0">
            <h2 className="truncate text-xs font-bold text-[#344754] sm:text-sm">
              Tumis Kangkung Telur
            </h2>

            <div className="mt-1 flex items-center gap-2 text-[9px] text-[#81909a]">
              <span>{jumlahPorsi} porsi</span>
              <span>•</span>
              <span>20 menit</span>
            </div>
          </div>
        </section>

        {/* Title */}

        <h3 className="mt-4 text-xs font-bold text-[#4a606b] sm:text-sm">
          Langkah-langkah
        </h3>

        {/* Steps */}

        <div className="mt-3 space-y-3">
          {langkah.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#159b68] text-[9px] font-bold text-white">
                {index + 1}
              </div>

              <p className="pt-1 text-[10px] leading-relaxed text-[#657883] sm:text-[11px]">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Tips */}

        <div className="mt-5 flex gap-2.5 rounded-xl bg-[#f1f9f5] p-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ddf4e9] text-[#159b68]">
            <Lightbulb size={15} />
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#4c665d]">
              Tips
            </p>

            <p className="mt-0.5 text-[9px] leading-relaxed text-[#7c8d87]">
              Masak kangkung sebentar saja agar tetap renyah
              dan warna hijaunya tetap segar.
            </p>
          </div>
        </div>

        {/* Back */}

        <button
          type="button"
          onClick={onBack}
          className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-[#159b68] text-xs font-bold text-white transition hover:bg-[#118a5c] sm:h-11 sm:text-sm"
        >
          Kembali
        </button>
      </main>
    </div>
  );
}