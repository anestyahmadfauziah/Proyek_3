import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";

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
   FALLBACK GAMBAR
========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";

/* =========================================================
   HELPER GAMBAR
========================================================= */

/*
 * Semua gambar bahan lokal disimpan di:
 *
 * public/
 * └── image/
 *     └── ingredients/
 *         ├── 1-telur-ayam.jpg
 *         ├── 2-ikan-tuna.jpg
 *         ├── 13-buncis.jpg
 *         └── ...
 *
 * Sehingga URL browser:
 *
 * /image/ingredients/13-buncis.jpg
 *
 * Helper ini dibuat fleksibel supaya walaupun isi
 * image_path di database berbeda format, hasil akhirnya
 * tetap menggunakan URL yang sama.
 */

function getImageUrl(imagePath) {
  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  let path = String(imagePath).trim();

  if (!path) {
    return FALLBACK_IMAGE;
  }

  /*
   * Normalisasi slash.
   *
   * Contoh:
   * image\ingredients\13-buncis.jpg
   *
   * menjadi:
   * image/ingredients/13-buncis.jpg
   */
  path = path.replace(/\\/g, "/");

  /*
   * Kalau sudah URL lengkap.
   */
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  /*
   * Hapus prefix ./ kalau ada.
   *
   * ./image/ingredients/13-buncis.jpg
   * ->
   * image/ingredients/13-buncis.jpg
   */
  path = path.replace(/^\.\/+/, "");

  /*
   * Hapus slash awal sementara.
   *
   * /image/ingredients/13-buncis.jpg
   * ->
   * image/ingredients/13-buncis.jpg
   */
  path = path.replace(/^\/+/, "");

  /*
   * Kalau database menyimpan:
   *
   * public/image/ingredients/13-buncis.jpg
   *
   * buang "public/" karena folder public
   * tidak ikut ditulis pada URL browser.
   */
  if (path.startsWith("public/")) {
    path = path.substring("public/".length);
  }

  /*
   * =======================================================
   * KASUS 1
   *
   * image/ingredients/13-buncis.jpg
   * =======================================================
   */
  if (
    path.startsWith("image/ingredients/")
  ) {
    return `/${path}`;
  }

  /*
   * =======================================================
   * KASUS 2
   *
   * ingredients/13-buncis.jpg
   *
   * Tambahkan "image/".
   * =======================================================
   */
  if (
    path.startsWith("ingredients/")
  ) {
    return `/image/${path}`;
  }

  /*
   * =======================================================
   * KASUS 3
   *
   * /image/...
   *
   * Setelah slash awal dihapus, biasanya sudah tertangani
   * oleh kondisi image/ingredients di atas.
   * =======================================================
   */

  /*
   * =======================================================
   * KASUS 4
   *
   * Hanya nama file:
   *
   * 13-buncis.jpg
   *
   * Maka otomatis arahkan ke:
   *
   * /image/ingredients/13-buncis.jpg
   * =======================================================
   */
  if (
    !path.includes("/")
  ) {
    return `/image/ingredients/${path}`;
  }

  /*
   * =======================================================
   * KASUS 5
   *
   * Kalau path mengandung folder ingredients tetapi
   * formatnya berbeda.
   *
   * Contoh:
   * assets/ingredients/13-buncis.jpg
   * =======================================================
   */

  const ingredientsIndex =
    path.indexOf("ingredients/");

  if (ingredientsIndex !== -1) {
    const namaFile =
      path.substring(
        ingredientsIndex +
          "ingredients/".length
      );

    if (namaFile) {
      return `/image/ingredients/${namaFile}`;
    }
  }

  /*
   * =======================================================
   * KASUS 6
   *
   * Kalau path lainnya memang merupakan path public.
   * =======================================================
   */
  return `/${path}`;
}

/* =========================================================
   FORMAT TANGGAL
========================================================= */

function formatTanggal(tanggal) {
  if (!tanggal) {
    return "-";
  }

  const bagian = tanggal.split("-");

  if (bagian.length !== 3) {
    return tanggal;
  }

  const [tahun, bulan, hari] = bagian;

  return `${hari}/${bulan}/${tahun}`;
}

/* =========================================================
   STATUS STOK
========================================================= */

function tentukanStatus(tanggalKadaluarsa) {
  if (!tanggalKadaluarsa) {
    return {
      status: "Aman",
      type: "aman",
    };
  }

  const sekarang = new Date();

  const hariIni = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth(),
    sekarang.getDate()
  );

  const bagian = tanggalKadaluarsa.split("-");

  if (bagian.length !== 3) {
    return {
      status: "Aman",
      type: "aman",
    };
  }

  const [tahun, bulan, hari] = bagian;

  const tanggalExpired = new Date(
    Number(tahun),
    Number(bulan) - 1,
    Number(hari)
  );

  const selisihMs =
    tanggalExpired.getTime() -
    hariIni.getTime();

  const selisihHari = Math.ceil(
    selisihMs /
      (1000 * 60 * 60 * 24)
  );

  /*
   * Sudah kedaluwarsa
   */
  if (selisihHari < 0) {
    return {
      status: "Kedaluwarsa",
      type: "prioritas",
    };
  }

  /*
   * Kedaluwarsa maksimal 3 hari lagi
   */
  if (selisihHari <= 3) {
    return {
      status: "Perlu diolah",
      type: "prioritas",
    };
  }

  /*
   * Masih aman
   */
  return {
    status: "Aman",
    type: "aman",
  };
}

/* =========================================================
   FORMAT JUMLAH
========================================================= */

function formatJumlah(jumlah, satuan) {
  if (
    jumlah === null ||
    jumlah === undefined
  ) {
    return `0 ${satuan || ""}`.trim();
  }

  const angka = Number(jumlah);

  if (Number.isNaN(angka)) {
    return `${jumlah} ${satuan || ""}`.trim();
  }

  const jumlahTampil =
    Number.isInteger(angka)
      ? angka
      : angka.toLocaleString(
          "id-ID",
          {
            maximumFractionDigits: 2,
          }
        );

  return `${jumlahTampil} ${satuan || ""}`.trim();
}

/* =========================================================
   STOK
========================================================= */

function Stok() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("Semua");

  const [stock, setStock] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     AMBIL DATA STOK
  ======================================================= */

  useEffect(() => {
    const ambilStok = async () => {
      try {
        setLoading(true);
        setError("");

        /* -----------------------------------------------
           CEK USER
        ------------------------------------------------ */

        const {
          data: { user },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setStock([]);
          setError(
            "Silakan login terlebih dahulu."
          );
          return;
        }

        /* -----------------------------------------------
           AMBIL DATA STOK
        ------------------------------------------------ */

        const {
          data: stokData,
          error: stokError,
        } =
          await supabase
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
            .eq(
              "user_id",
              user.id
            )
            .order(
              "tanggal_kadaluarsa",
              {
                ascending: true,
                nullsFirst: false,
              }
            );

        if (stokError) {
          console.error(
            "Supabase GET STOK ERROR:",
            stokError
          );

          throw stokError;
        }

        /* -----------------------------------------------
           BELUM ADA STOK
        ------------------------------------------------ */

        if (
          !stokData ||
          stokData.length === 0
        ) {
          setStock([]);
          return;
        }

        /* -----------------------------------------------
           AMBIL ID BAHAN
        ------------------------------------------------ */

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

        /* -----------------------------------------------
           AMBIL MASTER BAHAN
        ------------------------------------------------ */

        let bahanData = [];

        if (bahanIds.length > 0) {
          const {
            data,
            error: bahanError,
          } =
            await supabase
              .from(
                "ingredients_master"
              )
              .select(
                `
                  id,
                  name,
                  category_id,
                  image_path
                `
              )
              .in(
                "id",
                bahanIds
              );

          if (bahanError) {
            console.error(
              "Supabase GET INGREDIENTS ERROR:",
              bahanError
            );

            throw bahanError;
          }

          bahanData = data || [];
        }

        /* -----------------------------------------------
           LOG UNTUK CEK IMAGE_PATH
        ------------------------------------------------ */

        console.log(
          "IMAGE PATH DARI DATABASE:",
          bahanData.map(
            (item) => ({
              id: item.id,
              name: item.name,
              image_path:
                item.image_path,
              image_url:
                getImageUrl(
                  item.image_path
                ),
            })
          )
        );

        /* -----------------------------------------------
           AMBIL KATEGORI
        ------------------------------------------------ */

        const categoryIds = [
          ...new Set(
            bahanData
              .map(
                (item) =>
                  item.category_id
              )
              .filter(Boolean)
          ),
        ];

        let kategoriData = [];

        if (
          categoryIds.length > 0
        ) {
          const {
            data,
            error: kategoriError,
          } =
            await supabase
              .from(
                "ingredient_categories"
              )
              .select(
                `
                  id,
                  name
                `
              )
              .in(
                "id",
                categoryIds
              );

          if (kategoriError) {
            console.error(
              "Supabase GET CATEGORY ERROR:",
              kategoriError
            );

            throw kategoriError;
          }

          kategoriData =
            data || [];
        }

        /* -----------------------------------------------
           MAP BAHAN
        ------------------------------------------------ */

        const bahanMap =
          new Map();

        bahanData.forEach(
          (bahan) => {
            bahanMap.set(
              bahan.id,
              bahan
            );
          }
        );

        /* -----------------------------------------------
           MAP KATEGORI
        ------------------------------------------------ */

        const kategoriMap =
          new Map();

        kategoriData.forEach(
          (kategori) => {
            kategoriMap.set(
              kategori.id,
              kategori.name
            );
          }
        );

        /* -----------------------------------------------
           GABUNGKAN DATA
        ------------------------------------------------ */

        const dataStok =
          stokData.map(
            (item) => {
              const bahan =
                bahanMap.get(
                  item.bahan_pangan_id
                );

              const namaKategori =
                bahan?.category_id
                  ? kategoriMap.get(
                      bahan.category_id
                    )
                  : null;

              const statusInfo =
                tentukanStatus(
                  item.tanggal_kadaluarsa
                );

              const imageUrl =
                getImageUrl(
                  bahan?.image_path
                );

              return {
                id: item.id,

                nama:
                  bahan?.name ||
                  `Bahan #${item.bahan_pangan_id}`,

                jumlah:
                  formatJumlah(
                    item.jumlah,
                    item.satuan
                  ),

                kategori:
                  namaKategori ||
                  "Lainnya",

                tanggal:
                  formatTanggal(
                    item.tanggal_kadaluarsa
                  ),

                tanggalBeli:
                  formatTanggal(
                    item.tanggal_masuk
                  ),

                harga: "",

                status:
                  statusInfo.status,

                type:
                  statusInfo.type,

                image:
                  imageUrl,

                imagePath:
                  bahan?.image_path ||
                  null,
              };
            }
          );

        console.log(
          "DATA STOK FINAL:",
          dataStok
        );

        setStock(dataStok);
      } catch (err) {
        console.error(
          "Gagal mengambil data stok:",
          err
        );

        setError(
          err?.message ||
            "Gagal mengambil data stok."
        );

        setStock([]);
      } finally {
        setLoading(false);
      }
    };

    ambilStok();
  }, []);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredStock =
    useMemo(() => {
      return stock.filter(
        (item) => {
          const cocokSearch =
            item.nama
              .toLowerCase()
              .includes(
                search
                  .toLowerCase()
              );

          const cocokKategori =
            activeCategory ===
              "Semua" ||
            item.kategori ===
              activeCategory;

          return (
            cocokSearch &&
            cocokKategori
          );
        }
      );
    }, [
      stock,
      search,
      activeCategory,
    ]);

  /* =======================================================
     PRIORITAS
  ======================================================= */

  const prioritas =
    filteredStock.filter(
      (item) =>
        item.type ===
        "prioritas"
    );

  /* =======================================================
     AMAN
  ======================================================= */

  const aman =
    filteredStock.filter(
      (item) =>
        item.type === "aman"
    );

  /* =======================================================
     DELETE
  ======================================================= */

  const hapusBahan =
    async (id) => {
      const bahan =
        stock.find(
          (item) =>
            item.id === id
        );

      const yakin =
        window.confirm(
          `Apakah kamu yakin ingin menghapus ${
            bahan?.nama ||
            "bahan ini"
          }?`
        );

      if (!yakin) {
        return;
      }

      try {
        setError("");

        /* ---------------------------------------------
           CEK USER
        --------------------------------------------- */

        const {
          data: { user },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setError(
            "Silakan login terlebih dahulu."
          );
          return;
        }

        /* ---------------------------------------------
           DELETE DATABASE
        --------------------------------------------- */

        const {
          error: deleteError,
        } =
          await supabase
            .from("stok")
            .delete()
            .eq("id", id)
            .eq(
              "user_id",
              user.id
            );

        if (deleteError) {
          console.error(
            "Supabase DELETE ERROR:",
            deleteError
          );

          throw deleteError;
        }

        /* ---------------------------------------------
           UPDATE UI
        --------------------------------------------- */

        setStock(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== id
            )
        );
      } catch (err) {
        console.error(
          "Gagal menghapus stok:",
          err
        );

        setError(
          err?.message ||
            "Gagal menghapus bahan."
        );
      }
    };

  /* =======================================================
     RETURN
  ======================================================= */

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
              onClick={() =>
                navigate("/")
              }
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
                Kelola bahan makanan di
                kulkas kamu
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
          pb-10
          pt-4
          sm:px-5
          sm:pt-5
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
              setSearch(
                e.target.value
              )
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

          {kategoriFilter.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    item
                  )
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
                    activeCategory ===
                    item
                      ? "border-[#23652d] bg-[#23652d] text-white"
                      : "border-[#dfe8df] bg-white text-slate-600 hover:bg-[#f1f8f2]"
                  }
                `}
              >
                {item}
              </button>
            )
          )}

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-xs
              text-red-600
              sm:text-sm
            "
          >
            {error}
          </div>
        )}

        {/* ===================================================
            CONTENT
        =================================================== */}

        {loading ? (
          <div
            className="
              flex
              min-h-[260px]
              flex-col
              items-center
              justify-center
              gap-3
              text-sm
              text-slate-500
            "
          >

            <Loader2
              size={26}
              className="
                animate-spin
                text-[#23652d]
              "
            />

            <span>
              Memuat stok kamu...
            </span>

          </div>
        ) : (
          <>

            {/* ===============================================
                PRIORITAS
            =============================================== */}

            <section className="mt-5">

              <SectionTitle
                title="Prioritas Olah (Mendekati Expired)"
                count={
                  prioritas.length
                }
              />

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

                {prioritas.length >
                0 ? (
                  prioritas.map(
                    (item) => (
                      <StockCard
                        key={
                          item.id
                        }
                        item={item}
                        onDelete={
                          hapusBahan
                        }
                      />
                    )
                  )
                ) : (
                  <div className="md:col-span-2">
                    <EmptyState
                      text="Tidak ada bahan yang perlu segera diolah."
                    />
                  </div>
                )}

              </div>

            </section>

            {/* ===============================================
                AMAN
            =============================================== */}

            <section className="mt-6">

              <SectionTitle
                title="Bahan Aman & Segar"
                count={
                  aman.length
                }
              />

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

                {aman.length >
                0 ? (
                  aman.map(
                    (item) => (
                      <StockCard
                        key={
                          item.id
                        }
                        item={item}
                        onDelete={
                          hapusBahan
                        }
                      />
                    )
                  )
                ) : (
                  <div className="md:col-span-2">
                    <EmptyState
                      text="Belum ada bahan yang aman."
                    />
                  </div>
                )}

              </div>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  title,
  count,
}) {
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

function StockCard({
  item,
  onDelete,
}) {
  const isExpired =
    item.status ===
    "Kedaluwarsa";

  const isNeedProcess =
    item.status ===
    "Perlu diolah";

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

      {/* =================================================
          GAMBAR
      ================================================= */}

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
        onError={(e) => {
          console.error(
            "Gambar gagal dimuat:",
            item.nama,
            item.imagePath,
            item.image
          );

          /*
           * Kalau gambar gagal, gunakan fallback.
           */
          e.currentTarget.onerror =
            null;

          e.currentTarget.src =
            FALLBACK_IMAGE;
        }}
      />

      {/* =================================================
          INFO
      ================================================= */}

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

          <span className="mx-1">
            •
          </span>

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

      {/* =================================================
          DELETE
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          onDelete(item.id)
        }
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

function EmptyState({
  text,
}) {
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