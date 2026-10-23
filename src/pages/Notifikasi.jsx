import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import {
  ArrowLeft,
  AlertTriangle,
  PackagePlus,
  Clock3,
  Lightbulb,
  ChevronRight,
  Utensils,
} from "lucide-react";

/* =========================================================
   HELPER GAMBAR
========================================================= */

function getImageUrl(imagePath) {
  if (!imagePath) {
    return "https://placehold.co/300x300?text=No+Image";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  if (imagePath.startsWith("image/")) {
    return `/${imagePath}`;
  }

  if (imagePath.startsWith("ingredients/")) {
    return `/${imagePath}`;
  }

  return imagePath;
}

/* =========================================================
   FORMAT JUMLAH
========================================================= */

function formatJumlah(jumlah, satuan) {
  const angka = Number(jumlah);

  if (Number.isNaN(angka)) {
    return `${jumlah} ${satuan || ""}`.trim();
  }

  const jumlahFormatted = Number.isInteger(angka)
    ? angka
    : angka.toLocaleString("id-ID", {
        maximumFractionDigits: 2,
      });

  return `${jumlahFormatted} ${satuan || ""}`.trim();
}

/* =========================================================
   FORMAT WAKTU RELATIF
========================================================= */

function formatWaktu(tanggal) {
  if (!tanggal) {
    return "";
  }

  const waktu = new Date(tanggal);

  if (Number.isNaN(waktu.getTime())) {
    return "";
  }

  const sekarang = new Date();

  const selisihMs = sekarang.getTime() - waktu.getTime();

  const menit = Math.floor(
    selisihMs / (1000 * 60)
  );

  const jam = Math.floor(
    selisihMs / (1000 * 60 * 60)
  );

  const hari = Math.floor(
    selisihMs / (1000 * 60 * 60 * 24)
  );

  if (menit < 1) {
    return "Baru saja";
  }

  if (menit < 60) {
    return `${menit} menit lalu`;
  }

  if (jam < 24) {
    return `${jam} jam lalu`;
  }

  if (hari === 1) {
    return "Kemarin";
  }

  if (hari < 7) {
    return `${hari} hari lalu`;
  }

  return waktu.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   HITUNG SELISIH HARI KADALUARSA
========================================================= */

function hitungHariKedaluwarsa(tanggalKadaluarsa) {
  if (!tanggalKadaluarsa) {
    return null;
  }

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const tanggalExp = new Date(
    `${tanggalKadaluarsa}T00:00:00`
  );

  if (Number.isNaN(tanggalExp.getTime())) {
    return null;
  }

  return Math.ceil(
    (tanggalExp.getTime() - hariIni.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   BUAT PESAN KEDALUWARSA
========================================================= */

function getPesanKedaluwarsa(
  tanggalKadaluarsa
) {
  const selisih = hitungHariKedaluwarsa(
    tanggalKadaluarsa
  );

  if (selisih === null) {
    return "Periksa tanggal kedaluwarsa bahan.";
  }

  if (selisih < 0) {
    return "Bahan ini sudah melewati tanggal kedaluwarsa.";
  }

  if (selisih === 0) {
    return "Bahan ini kedaluwarsa hari ini.";
  }

  if (selisih === 1) {
    return "Bahan ini akan kedaluwarsa besok.";
  }

  return `Bahan ini akan kedaluwarsa dalam ${selisih} hari.`;
}

/* =========================================================
   ICON BERDASARKAN TIPE
========================================================= */

function IconNotifikasi({ tipe }) {
  if (tipe === "stok_baru") {
    return <PackagePlus size={18} />;
  }

  if (tipe === "kedaluwarsa") {
    return <AlertTriangle size={18} />;
  }

  if (tipe === "pengingat") {
    return <Lightbulb size={18} />;
  }

  return <Clock3 size={18} />;
}

/* =========================================================
   WARNA ICON
========================================================= */

function warnaNotifikasi(tipe) {
  if (tipe === "stok_baru") {
    return {
      wrapper: "bg-[#e3f6e7]",
      icon: "text-[#27823b]",
    };
  }

  if (tipe === "kedaluwarsa") {
    return {
      wrapper: "bg-[#ffe7e7]",
      icon: "text-[#d63b3b]",
    };
  }

  if (tipe === "pengingat") {
    return {
      wrapper: "bg-[#fff3cf]",
      icon: "text-[#e29a00]",
    };
  }

  return {
    wrapper: "bg-[#eaf1ff]",
    icon: "text-[#4775c7]",
  };
}

/* =========================================================
   NOTIFIKASI
========================================================= */

function Notifikasi() {
  const navigate = useNavigate();

  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     AMBIL DATA STOK
  ======================================================= */

  useEffect(() => {
    const ambilNotifikasi = async () => {
      try {
        setLoading(true);
        setError("");

        /* =================================================
           USER LOGIN
        ================================================= */

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setNotifikasi([]);
          return;
        }

        /* =================================================
           AMBIL STOK USER
        ================================================= */

        const {
          data: stokData,
          error: stokError,
        } = await supabase
          .from("stok")
          .select(
            `
              id,
              user_id,
              bahan_pangan_id,
              jumlah,
              satuan,
              tanggal_masuk,
              tanggal_kadaluarsa,
              created_at
            `
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (stokError) {
          throw stokError;
        }

        if (!stokData || stokData.length === 0) {
          setNotifikasi([]);
          return;
        }

        /* =================================================
           AMBIL MASTER BAHAN
        ================================================= */

        const bahanIds = [
          ...new Set(
            stokData
              .map(
                (item) =>
                  item.bahan_pangan_id
              )
              .filter(Boolean)
          ),
        ];

        let ingredientsData = [];

        if (bahanIds.length > 0) {
          const {
            data,
            error: ingredientsError,
          } = await supabase
            .from("ingredients_master")
            .select(
              `
                id,
                name,
                image_path
              `
            )
            .in("id", bahanIds);

          if (ingredientsError) {
            throw ingredientsError;
          }

          ingredientsData = data || [];
        }

        /* =================================================
           BUAT AKTIVITAS / NOTIFIKASI
        ================================================= */

        const aktivitas = [];

        stokData.forEach((stok) => {
          const bahanMaster =
            ingredientsData.find(
              (item) =>
                item.id ===
                stok.bahan_pangan_id
            );

          const nama =
            bahanMaster?.name ||
            "Bahan Tidak Diketahui";

          const image = getImageUrl(
            bahanMaster?.image_path
          );

          const jumlah = formatJumlah(
            stok.jumlah,
            stok.satuan
          );

          /* =============================================
             1. STOK BARU
          ============================================= */

          aktivitas.push({
            id: `stok-${stok.id}`,
            tipe: "stok_baru",
            judul: "Stok Baru Ditambahkan",
            nama,
            pesan: `${nama} berhasil ditambahkan ke stok kulkas.`,
            jumlah,
            image,
            waktu: stok.created_at,
            timestamp: new Date(
              stok.created_at
            ).getTime(),
          });

          /* =============================================
             2. KEDALUWARSA
          ============================================= */

          const selisihHari =
            hitungHariKedaluwarsa(
              stok.tanggal_kadaluarsa
            );

          if (
            selisihHari !== null &&
            selisihHari <= 3
          ) {
            aktivitas.push({
              id: `exp-${stok.id}`,
              tipe: "kedaluwarsa",
              judul:
                selisihHari < 0
                  ? "Bahan Sudah Kedaluwarsa"
                  : "Pengingat Kedaluwarsa",
              nama,
              pesan: getPesanKedaluwarsa(
                stok.tanggal_kadaluarsa
              ),
              jumlah,
              image,
              waktu: stok.tanggal_kadaluarsa,
              timestamp: new Date(
                `${stok.tanggal_kadaluarsa}T00:00:00`
              ).getTime(),
              tanggalKadaluarsa:
                stok.tanggal_kadaluarsa,
            });
          }

          /* =============================================
             3. PENGINGAT STOK LAMA
          ============================================= */

          if (stok.tanggal_masuk) {
            const tanggalMasuk = new Date(
              `${stok.tanggal_masuk}T00:00:00`
            );

            const hariIni = new Date();

            const umurStok = Math.floor(
              (hariIni.getTime() -
                tanggalMasuk.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            /*
             * Jika sudah tersimpan minimal 5 hari,
             * buat pengingat.
             */
            if (umurStok >= 5) {
              aktivitas.push({
                id: `lama-${stok.id}`,
                tipe: "pengingat",
                judul: "Pengingat Stok",
                nama,
                pesan: `${nama} sudah tersimpan selama ${umurStok} hari. Pertimbangkan untuk mengolahnya.`,
                jumlah,
                image,
                waktu: stok.tanggal_masuk,
                timestamp: tanggalMasuk.getTime(),
              });
            }
          }
        });

        /* =================================================
           URUTKAN DARI YANG TERBARU
        ================================================= */

        aktivitas.sort(
          (a, b) =>
            b.timestamp - a.timestamp
        );

        /*
         * Batasi agar halaman tidak terlalu panjang.
         */
        setNotifikasi(
          aktivitas.slice(0, 20)
        );
      } catch (error) {
        console.error(
          "Gagal mengambil notifikasi:",
          error
        );

        setError(
          error?.message ||
            "Gagal mengambil data notifikasi."
        );

        setNotifikasi([]);
      } finally {
        setLoading(false);
      }
    };

    ambilNotifikasi();
  }, []);

  /* =======================================================
     JUMLAH PENGINGAT PENTING
  ======================================================= */

  const jumlahPenting = notifikasi.filter(
    (item) =>
      item.tipe === "kedaluwarsa"
  ).length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eaf8ec] font-jakarta text-[#202833]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-[#eaf8ec]">

        <div className="mx-auto flex w-full max-w-3xl items-center gap-2.5 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">

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
              hover:bg-white/60
              sm:h-10
              sm:w-10
            "
            aria-label="Kembali"
          >
            <ArrowLeft
              size={22}
              strokeWidth={2}
            />
          </button>

          <div className="min-w-0">

            <h1 className="font-sans text-xl font-bold text-[#24642e] sm:text-2xl">
              Notifikasi
            </h1>

            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              Aktivitas dan pengingat stok kamu
            </p>

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">

        {/* ===================================================
            RINGKASAN NOTIFIKASI
        =================================================== */}

        {!loading &&
          !error &&
          notifikasi.length > 0 && (
            <div
              className="
                mb-4
                mt-3
                rounded-2xl
                border
                border-[#dcebdd]
                bg-white
                p-4
                shadow-[0_2px_8px_rgba(32,40,51,0.04)]
                sm:mt-4
              "
            >

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-[11px] font-semibold text-slate-500 sm:text-xs">
                    Aktivitas Terbaru
                  </p>

                  <h2 className="mt-0.5 text-base font-bold text-[#202833] sm:text-lg">
                    {notifikasi.length} informasi
                  </h2>

                </div>

                {jumlahPenting > 0 && (
                  <div className="rounded-full bg-[#fff0cf] px-3 py-1.5 text-[10px] font-bold text-[#b76b00] sm:text-xs">
                    {jumlahPenting} perlu diperhatikan
                  </div>
                )}

              </div>

            </div>
          )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="mt-4 rounded-2xl bg-white p-6 text-center text-xs text-slate-400">
            Memuat aktivitas dan pengingat...
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-white p-5 text-center text-xs text-red-500">
            {error}
          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          !error &&
          notifikasi.length === 0 && (
            <div className="mt-4 rounded-2xl bg-white p-7 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f7eb] text-[#29934b]">
                <Clock3 size={22} />
              </div>

              <h2 className="mt-3 text-sm font-bold">
                Belum Ada Aktivitas
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Aktivitas stok dan pengingat akan
                muncul di sini.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/tambah-bahan")
                }
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-[#23652d]
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-[#1b5424]
                "
              >
                <PackagePlus size={15} />
                Tambah Bahan
              </button>

            </div>
          )}

        {/* ===================================================
            AKTIVITAS
        =================================================== */}

        {!loading &&
          !error &&
          notifikasi.length > 0 && (
            <section className="mt-4">

              <div className="mb-3 flex items-center justify-between">

                <h2 className="text-sm font-bold text-[#202833] sm:text-base">
                  Riwayat Aktivitas
                </h2>

              </div>

              <div className="space-y-2.5">

                {notifikasi.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    onRecipe={() =>
                      navigate("/racik-resep")
                    }
                  />
                ))}

              </div>

            </section>
          )}

      </main>

    </div>
  );
}

/* =========================================================
   NOTIFICATION CARD
========================================================= */

function NotificationCard({
  item,
  onRecipe,
}) {
  const warna = warnaNotifikasi(item.tipe);

  return (
    <article
      className="
        rounded-2xl
        border
        border-[#e5ebe6]
        bg-white
        px-3
        py-3
        shadow-[0_2px_8px_rgba(32,40,51,0.05)]
        transition
        hover:shadow-[0_4px_12px_rgba(32,40,51,0.08)]
        sm:px-4
        sm:py-3.5
      "
    >

      <div className="flex items-start gap-3">

        {/* ICON */}

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${warna.wrapper}
            ${warna.icon}
          `}
        >
          <IconNotifikasi tipe={item.tipe} />
        </div>

        {/* ISI */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <h3 className="text-sm font-bold leading-tight text-[#202833] sm:text-[15px]">
                {item.judul}
              </h3>

              <p className="mt-0.5 truncate text-xs font-semibold text-[#24642e]">
                {item.nama}
              </p>

            </div>

            <span className="shrink-0 text-[10px] text-slate-400 sm:text-[11px]">
              {formatWaktu(item.waktu)}
            </span>

          </div>

          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            {item.pesan}
          </p>

          {/* JUMLAH */}

          {item.jumlah && (
            <p className="mt-1 text-[10px] font-medium text-slate-400 sm:text-[11px]">
              Jumlah: {item.jumlah}
            </p>
          )}

          {/* BUTTON */}

          {item.tipe === "kedaluwarsa" && (
            <button
              type="button"
              onClick={onRecipe}
              className="
                mt-2.5
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-[#d8f8e3]
                px-2.5
                py-1.5
                text-[10px]
                font-bold
                text-[#246b35]
                transition
                hover:bg-[#c7f2d6]
                active:scale-[0.98]
                sm:text-[11px]
              "
            >
              <Utensils
                size={13}
                strokeWidth={2.3}
              />
              Olah Resep
              <ChevronRight size={12} />
            </button>
          )}

        </div>

      </div>

    </article>
  );
}

export default Notifikasi;