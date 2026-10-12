
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import {
  ArrowLeft,
  Bell,
  UserCircle,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Apple,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  Baby,
  CalendarDays,
  Utensils,
  AlertCircle,
} from "lucide-react";

const CHILD_STORAGE_KEY = "dapurCerdasSelectedChildId";

const NUTRISI = [
  {
    nama: "Kalori",
    key: "kalori",
    satuan: "kkal",
    icon: Flame,
    iconBg: "bg-[#fff0df]",
    iconColor: "text-[#e88b00]",
  },
  {
    nama: "Protein",
    key: "protein",
    satuan: "g",
    icon: Beef,
    iconBg: "bg-[#ffe1e1]",
    iconColor: "text-[#bd3838]",
  },
  {
    nama: "Karbohidrat",
    key: "karbohidrat",
    satuan: "g",
    icon: Wheat,
    iconBg: "bg-[#fff1bf]",
    iconColor: "text-[#c18a00]",
  },
  {
    nama: "Lemak",
    key: "lemak",
    satuan: "g",
    icon: Droplets,
    iconBg: "bg-[#dceeff]",
    iconColor: "text-[#3b78ae]",
  },
  {
    nama: "Serat",
    key: "serat",
    satuan: "g",
    icon: Apple,
    iconBg: "bg-[#dcf7e3]",
    iconColor: "text-[#2d813a]",
  },
];

const ACUAN_AKG_ANAK = [
  {
    label: "0–5 bulan",
    min: 0,
    max: 5,
    energi: 550,
    protein: 9,
    lemak: 31,
    karbohidrat: 59,
    serat: 0,
    catatan:
      "Pada usia ini, kebutuhan zat gizi terutama dipenuhi melalui ASI. Catatan makanan pendamping saja tidak mewakili seluruh asupan bayi.",
  },
  {
    label: "6–11 bulan",
    min: 6,
    max: 11,
    energi: 800,
    protein: 15,
    lemak: 35,
    karbohidrat: 105,
    serat: 11,
    catatan:
      "ASI tetap dilanjutkan dan MP-ASI diberikan sesuai usia. Catatan makanan mungkin belum mencakup ASI, susu, atau seluruh porsi yang dikonsumsi.",
  },
  {
    label: "1–3 tahun",
    min: 12,
    max: 35,
    energi: 1350,
    protein: 20,
    lemak: 45,
    karbohidrat: 215,
    serat: 19,
    catatan:
      "Ini merupakan acuan AKG kelompok umur 1–3 tahun, bukan target klinis individual.",
  },
];

const formatTanggal = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const parseTanggal = (value) => {
  if (!value) return null;

  const [tahun, bulan, hari] = String(value)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!tahun || !bulan || !hari) return null;

  const tanggal = new Date(tahun, bulan - 1, hari);

  return Number.isNaN(tanggal.getTime()) ? null : tanggal;
};

const formatTanggalIndonesia = (tanggal) => {
  if (!tanggal) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(tanggal);
};

const formatAngka = (nilai, digit = 1) =>
  new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digit,
  }).format(Number.isFinite(Number(nilai)) ? Number(nilai) : 0);

const angka = (nilai) => {
  const hasil = Number(nilai);
  return Number.isFinite(hasil) ? hasil : 0;
};

const hitungUmurBulan = (tanggalLahir, tanggalAcuan = new Date()) => {
  const lahir = parseTanggal(tanggalLahir);

  if (!lahir || lahir > tanggalAcuan) return null;

  let bulan =
    (tanggalAcuan.getFullYear() - lahir.getFullYear()) * 12 +
    (tanggalAcuan.getMonth() - lahir.getMonth());

  if (tanggalAcuan.getDate() < lahir.getDate()) bulan--;

  return Math.max(0, bulan);
};

const hitungUmurHari = (tanggalLahir, tanggalAcuan = new Date()) => {
  const lahir = parseTanggal(tanggalLahir);

  if (!lahir || lahir > tanggalAcuan) return null;

  const awal = new Date(
    lahir.getFullYear(),
    lahir.getMonth(),
    lahir.getDate()
  );

  const akhir = new Date(
    tanggalAcuan.getFullYear(),
    tanggalAcuan.getMonth(),
    tanggalAcuan.getDate()
  );

  return Math.floor((akhir - awal) / 86400000);
};

const hitungUmur = (tanggalLahir) => {
  const bulan = hitungUmurBulan(tanggalLahir);

  if (bulan === null) return "Umur belum tersedia";

  const tahun = Math.floor(bulan / 12);
  const sisaBulan = bulan % 12;

  if (tahun > 0) {
    return sisaBulan > 0
      ? `${tahun} tahun ${sisaBulan} bulan`
      : `${tahun} tahun`;
  }

  return `${bulan} bulan`;
};

const dapatkanAcuanAkg = (tanggalLahir) => {
  const umurBulan = hitungUmurBulan(tanggalLahir);

  if (umurBulan === null) return null;

  return (
    ACUAN_AKG_ANAK.find(
      (item) => umurBulan >= item.min && umurBulan <= item.max
    ) || null
  );
};

const jumlahkanNutrisi = (daftar) =>
  daftar.reduce(
    (total, item) => ({
      kalori: total.kalori + angka(item.kalori_kcal),
      protein: total.protein + angka(item.protein_g),
      karbohidrat: total.karbohidrat + angka(item.karbohidrat_g),
      lemak: total.lemak + angka(item.lemak_g),
      serat: total.serat + angka(item.serat_g),
    }),
    {
      kalori: 0,
      protein: 0,
      karbohidrat: 0,
      lemak: 0,
      serat: 0,
    }
  );

const BUAT_RENTANG_TANGGAL = (awal, akhir) => {
  const hasil = [];
  const tanggal = new Date(awal);

  while (tanggal <= akhir) {
    hasil.push(new Date(tanggal));
    tanggal.setDate(tanggal.getDate() + 1);
  }

  return hasil;
};

const STATUS_KEHAMILAN_AKTIF = [
  "hamil",
  "aktif",
  "berlangsung",
  "pregnant",
];

function Nutrisi() {
  const navigate = useNavigate();

  const [tabAktif, setTabAktif] = useState("Harian");
  const [user, setUser] = useState(null);
  const [profilIbu, setProfilIbu] = useState(null);
  const [anak, setAnak] = useState(null);
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [childId, setChildId] = useState("");
  const [kehamilanTerkait, setKehamilanTerkait] = useState(null);
  const [modeNutrisi, setModeNutrisi] = useState("anak");

  const [catatanMakanan, setCatatanMakanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memuatMakanan, setMemuatMakanan] = useState(false);
  const [error, setError] = useState("");

  const [hariIni, setHariIni] = useState(() => new Date());

  const tanggalHariIni = formatTanggal(hariIni);

  const awalMinggu = useMemo(() => {
    const tanggal = new Date(hariIni);
    tanggal.setDate(tanggal.getDate() - 6);
    return tanggal;
  }, [hariIni]);

  const awalBulan = useMemo(
    () => new Date(hariIni.getFullYear(), hariIni.getMonth(), 1),
    [hariIni]
  );

  const akhirBulan = useMemo(
    () => new Date(hariIni.getFullYear(), hariIni.getMonth() + 1, 0),
    [hariIni]
  );

  /*
   * MEMUAT PROFIL IBU, KEHAMILAN, DAN ANAK
   *
   * Prioritas:
   * 1. Kehamilan aktif -> mode ibu.
   * 2. Tidak ada kehamilan aktif tetapi ada anak -> mode anak.
   * 3. Tidak ada keduanya -> tampilkan petunjuk membuat profil.
   */
  const muatProfil = useCallback(async () => {
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError) throw authError;

    const pengguna = authData?.user;

    if (!pengguna) {
      setUser(null);
      setProfilIbu(null);
      setAnak(null);
      setDaftarAnak([]);
      setChildId("");
      setKehamilanTerkait(null);
      setCatatanMakanan([]);
      setModeNutrisi("anak");
      return;
    }

    setUser(pengguna);

    // Profil ibu boleh belum tersedia.
    const { data: ibu, error: ibuError } = await supabase
      .from("maternal_profiles")
      .select("id, user_id, nama_ibu")
      .eq("user_id", pengguna.id)
      .maybeSingle();

    if (ibuError) throw ibuError;

    setProfilIbu(ibu || null);

    // Ambil riwayat kehamilan milik ibu.
    let daftarKehamilan = [];

    if (ibu?.id) {
      const { data, error: pregnancyError } = await supabase
        .from("pregnancies")
        .select(
          "id, mother_id, hpht, hpl, tanggal_persalinan, status, created_at"
        )
        .eq("mother_id", ibu.id)
        .order("created_at", { ascending: false });

      if (pregnancyError) throw pregnancyError;

      daftarKehamilan = data || [];
    }

    // Ambil profil anak.
    const { data: profiles, error: profileError } = await supabase
      .from("children_profiles")
      .select(
        "id, user_id, nama, jenis_kelamin, tanggal_lahir, hpht, hpl, pregnancy_id, created_at"
      )
      .eq("user_id", pengguna.id)
      .order("created_at", { ascending: true });

    if (profileError) throw profileError;

    const profilAnak = profiles || [];

    setDaftarAnak(profilAnak);

    // Periksa apakah ada kehamilan yang masih berlangsung.
    const kehamilanAktif = daftarKehamilan.find((item) =>
      STATUS_KEHAMILAN_AKTIF.includes(
        String(item.status || "").toLowerCase().trim()
      )
    );

    if (kehamilanAktif) {
      setModeNutrisi("ibu");
      setKehamilanTerkait(kehamilanAktif);
      setAnak(null);
      setChildId("");
      setCatatanMakanan([]);
      return;
    }

    // Tidak hamil aktif dan belum ada anak.
    if (profilAnak.length === 0) {
      setModeNutrisi("anak");
      setAnak(null);
      setChildId("");
      setKehamilanTerkait(null);
      setCatatanMakanan([]);
      return;
    }

    // Pilih anak yang sebelumnya disimpan, jika masih tersedia.
    let idTersimpan = "";

    try {
      idTersimpan =
        window.localStorage.getItem(CHILD_STORAGE_KEY) || "";
    } catch {
      idTersimpan = "";
    }

    const anakTerpilih =
      profilAnak.find((item) => item.id === idTersimpan) ||
      profilAnak[0];

    setModeNutrisi("anak");
    setAnak(anakTerpilih);
    setChildId(anakTerpilih.id);

    try {
      window.localStorage.setItem(
        CHILD_STORAGE_KEY,
        anakTerpilih.id
      );
    } catch {
      // Tetap berfungsi jika localStorage tidak tersedia.
    }

    // Ambil kehamilan yang terkait dengan anak.
    if (anakTerpilih.pregnancy_id) {
      const { data: pregnancy, error: pregnancyError } =
        await supabase
          .from("pregnancies")
          .select("id, hpht, hpl, tanggal_persalinan, status")
          .eq("id", anakTerpilih.pregnancy_id)
          .maybeSingle();

      if (pregnancyError) throw pregnancyError;

      setKehamilanTerkait(pregnancy || null);
    } else {
      setKehamilanTerkait(null);
    }
  }, []);

  /*
   * MEMUAT CATATAN MAKANAN DARI TABEL SESUAI MODE
   *
   * Ibu  -> maternal_food_logs berdasarkan pregnancy_id.
   * Anak -> food_logs berdasarkan child_id.
   */
  const muatCatatanMakanan = useCallback(
    async (idRelasi, mode = "anak") => {
      if (!idRelasi) {
        setCatatanMakanan([]);
        return;
      }

      setMemuatMakanan(true);

      try {
        const enamHariLalu = new Date(hariIni);
        enamHariLalu.setDate(enamHariLalu.getDate() - 6);

        const mulai =
          enamHariLalu < awalBulan
            ? enamHariLalu
            : awalBulan;

        const tabel =
          mode === "ibu" ? "maternal_food_logs" : "food_logs";

        const kolomRelasi =
          mode === "ibu" ? "pregnancy_id" : "child_id";

        const kolomSelect =
          mode === "ibu"
            ? "id, pregnancy_id, nama_makanan, tanggal_konsumsi, waktu_makan, porsi, kalori_kcal, protein_g, karbohidrat_g, lemak_g, serat_g, created_at"
            : "id, child_id, nama_makanan, tanggal_konsumsi, waktu_makan, porsi, kalori_kcal, protein_g, karbohidrat_g, lemak_g, serat_g, created_at";

        const { data, error: foodError } = await supabase
          .from(tabel)
          .select(kolomSelect)
          .eq(kolomRelasi, idRelasi)
          .gte("tanggal_konsumsi", formatTanggal(mulai))
          .lte("tanggal_konsumsi", formatTanggal(akhirBulan))
          .order("tanggal_konsumsi", { ascending: true });

        if (foodError) throw foodError;

        setCatatanMakanan(data || []);
      } finally {
        setMemuatMakanan(false);
      }
    },
    [hariIni, awalBulan, akhirBulan]
  );

  const muatSemua = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await muatProfil();
    } catch (err) {
      console.error("Gagal memuat profil nutrisi:", err);
      setError(
        err.message ||
          "Profil nutrisi gagal dimuat. Periksa koneksi dan kebijakan RLS Supabase."
      );
    } finally {
      setLoading(false);
    }
  }, [muatProfil]);

  useEffect(() => {
    muatSemua();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Hindari menjalankan permintaan Supabase di callback auth secara langsung.
      Promise.resolve().then(() => muatSemua());
    });

    return () => subscription.unsubscribe();
  }, [muatSemua]);

  useEffect(() => {
    const idRelasi =
      modeNutrisi === "ibu" ? kehamilanTerkait?.id : childId;

    if (!idRelasi) {
      setCatatanMakanan([]);
      return;
    }

    let masihAktif = true;

    muatCatatanMakanan(idRelasi, modeNutrisi).catch((err) => {
      if (!masihAktif) return;

      console.error("Gagal memuat catatan nutrisi:", err);
      setError(
        err.message ||
          "Catatan nutrisi gagal dimuat. Periksa tabel dan kebijakan RLS."
      );
    });

    return () => {
      masihAktif = false;
    };
  }, [
    childId,
    modeNutrisi,
    kehamilanTerkait?.id,
    muatCatatanMakanan,
  ]);

  const pilihAnak = async (id) => {
    const pilihan = daftarAnak.find((item) => item.id === id);
    if (!pilihan) return;

    setModeNutrisi("anak");
    setAnak(pilihan);
    setChildId(id);
    setError("");

    try {
      window.localStorage.setItem(CHILD_STORAGE_KEY, id);
    } catch {
      // Tidak wajib.
    }

    if (pilihan.pregnancy_id) {
      const { data, error: pregnancyError } = await supabase
        .from("pregnancies")
        .select("id, hpht, hpl, tanggal_persalinan, status")
        .eq("id", pilihan.pregnancy_id)
        .maybeSingle();

      if (pregnancyError) {
        setError(pregnancyError.message);
        return;
      }

      setKehamilanTerkait(data || null);
    } else {
      setKehamilanTerkait(null);
    }
  };

  // TOTAL HARIAN
  const makananHariIni = useMemo(
    () =>
      catatanMakanan.filter(
        (item) => item.tanggal_konsumsi === tanggalHariIni
      ),
    [catatanMakanan, tanggalHariIni]
  );

  const totalHarian = useMemo(
    () => jumlahkanNutrisi(makananHariIni),
    [makananHariIni]
  );

  // TOTAL MINGGUAN
  const totalMingguan = useMemo(
    () =>
      jumlahkanNutrisi(
        catatanMakanan.filter(
          (item) =>
            item.tanggal_konsumsi >= formatTanggal(awalMinggu) &&
            item.tanggal_konsumsi <= tanggalHariIni
        )
      ),
    [catatanMakanan, awalMinggu, tanggalHariIni]
  );

  // TOTAL BULANAN
  const totalBulanan = useMemo(
    () =>
      jumlahkanNutrisi(
        catatanMakanan.filter(
          (item) =>
            item.tanggal_konsumsi >= formatTanggal(awalBulan) &&
            item.tanggal_konsumsi <= formatTanggal(akhirBulan)
        )
      ),
    [catatanMakanan, awalBulan, akhirBulan]
  );

  const dataHarianMingguan = useMemo(
    () =>
      BUAT_RENTANG_TANGGAL(awalMinggu, hariIni).map((tanggal) => {
        const tanggalKey = formatTanggal(tanggal);

        const daftar = catatanMakanan.filter(
          (item) => item.tanggal_konsumsi === tanggalKey
        );

        return {
          tanggal: tanggalKey,
          hari: new Intl.DateTimeFormat("id-ID", {
            weekday: "short",
          })
            .format(tanggal)
            .replace(".", ""),
          total: jumlahkanNutrisi(daftar),
          jumlahMakanan: daftar.length,
        };
      }),
    [catatanMakanan, awalMinggu, hariIni]
  );

  const dataBulanan = useMemo(() => {
    const jumlahMinggu = Math.ceil(akhirBulan.getDate() / 7);

    return Array.from({ length: jumlahMinggu }, (_, index) => {
      const hariAwal = index * 7 + 1;
      const hariAkhir = Math.min(
        hariAwal + 6,
        akhirBulan.getDate()
      );

      const daftar = catatanMakanan.filter((item) => {
        const tanggal = parseTanggal(item.tanggal_konsumsi);

        return (
          tanggal &&
          tanggal.getDate() >= hariAwal &&
          tanggal.getDate() <= hariAkhir
        );
      });

      const total = jumlahkanNutrisi(daftar);
      const jumlahHari = new Set(
        daftar.map((item) => item.tanggal_konsumsi)
      ).size;

      return {
        nama: `M${index + 1}`,
        rentang: `${hariAwal}–${hariAkhir}`,
        total,
        jumlahMakanan: daftar.length,
        jumlahHari,
        rataKalori:
          jumlahHari > 0 ? total.kalori / jumlahHari : 0,
      };
    });
  }, [catatanMakanan, akhirBulan]);

  const jumlahHariTercatat = dataHarianMingguan.filter(
    (item) => item.jumlahMakanan > 0
  ).length;

  // DATA ANAK DAN 1000 HPK
  const namaAnak = anak?.nama || "Si Kecil";
  const umurAnak = hitungUmur(anak?.tanggal_lahir);
  const umurBulanAnak = hitungUmurBulan(anak?.tanggal_lahir);
  const umurHariAnak = hitungUmurHari(anak?.tanggal_lahir);
  const acuanAkgAnak = dapatkanAcuanAkg(anak?.tanggal_lahir);

  const hphtTersedia = Boolean(
    kehamilanTerkait?.hpht || anak?.hpht
  );

  const awal1000HPK = parseTanggal(
    kehamilanTerkait?.hpht || anak?.hpht
  );

  const tanggalLahirAnak = parseTanggal(anak?.tanggal_lahir);

  const hariKe1000 = awal1000HPK
    ? new Date(
        awal1000HPK.getFullYear(),
        awal1000HPK.getMonth(),
        awal1000HPK.getDate() + 999
      )
    : null;

  const hariHPK = awal1000HPK
    ? Math.max(
        1,
        Math.floor(
          (new Date(
            hariIni.getFullYear(),
            hariIni.getMonth(),
            hariIni.getDate()
          ) -
            new Date(
              awal1000HPK.getFullYear(),
              awal1000HPK.getMonth(),
              awal1000HPK.getDate()
            )) /
            86400000
        ) + 1
      )
    : 0;

  const progresHPK = hariKe1000
    ? Math.min(100, Math.max(0, (hariHPK / 1000) * 100))
    : 0;

  const selesai1000HPK = hariKe1000
    ? hariIni > hariKe1000
    : false;

  // DATA IBU HAMIL
  const namaIbu =
    profilIbu?.nama_ibu ||
    user?.user_metadata?.nama ||
    "Ibu";

  const hphtIbu = parseTanggal(kehamilanTerkait?.hpht);

  const hariKehamilan = hphtIbu
    ? Math.max(
        0,
        Math.floor(
          (new Date(
            hariIni.getFullYear(),
            hariIni.getMonth(),
            hariIni.getDate()
          ) -
            new Date(
              hphtIbu.getFullYear(),
              hphtIbu.getMonth(),
              hphtIbu.getDate()
            )) /
            86400000
        )
      )
    : null;

  const mingguKehamilan =
    hariKehamilan === null
      ? null
      : Math.floor(hariKehamilan / 7);

  const trimester =
    mingguKehamilan === null
      ? "Belum diketahui"
      : mingguKehamilan < 13
        ? "Trimester 1"
        : mingguKehamilan < 27
          ? "Trimester 2"
          : "Trimester 3";

  const totalTampil =
    tabAktif === "Harian"
      ? totalHarian
      : tabAktif === "Mingguan"
        ? totalMingguan
        : totalBulanan;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf8ec] font-jakarta">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-[#23652d]"
            size={30}
          />
          <p className="mt-3 text-sm font-semibold text-[#23652d]">
            Memuat data nutrisi...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf8ec] px-4 font-jakarta">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
          <UserCircle
            className="mx-auto text-[#23652d]"
            size={42}
          />
          <h1 className="mt-3 text-xl font-extrabold text-[#23652d]">
            Masuk terlebih dahulu
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Masuk ke akun Dapur Cerdas untuk melihat data nutrisi.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 w-full rounded-xl bg-[#176b26] px-4 py-3 text-sm font-bold text-white hover:bg-[#12551f]"
          >
            Masuk
          </button>
        </section>
      </div>
    );
  }

  // HEADER DIPAKAI OLEH MODE IBU DAN ANAK
  const Header = ({ judul }) => (
    <header className="sticky top-0 z-50 border-b border-[#d9eadb] bg-[#eaf8ec]/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[60px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 sm:min-h-[64px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/70 sm:h-10 sm:w-10"
            aria-label="Kembali"
          >
            <ArrowLeft size={21} />
          </button>
          <h1 className="truncate font-playfair text-xl font-bold text-[#23652d] sm:text-2xl">
            {judul}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => navigate("/notifikasi")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-white/70 sm:h-10 sm:w-10"
            aria-label="Notifikasi"
          >
            <Bell size={19} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/profil")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#176324] hover:bg-[#e0f1e3] sm:h-10 sm:w-10"
            aria-label="Profil"
          >
            <UserCircle size={21} />
          </button>

          <button
            type="button"
            onClick={() => {
              muatSemua();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#23652d] hover:bg-white/70"
            aria-label="Muat ulang data"
            title="Muat ulang data"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>
    </header>
  );

  const ErrorBanner = () =>
    error ? (
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="mt-0.5 shrink-0" size={19} />
        <div className="min-w-0 flex-1">
          <p className="font-bold">Ada masalah saat memuat data</p>
          <p className="mt-1 break-words">{error}</p>
        </div>
        <button
          onClick={() => {
            setError("");
            muatSemua();
          }}
          className="shrink-0 font-bold underline"
        >
          Coba lagi
        </button>
      </div>
    ) : null;

  const TabNavigasi = () => (
    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
      {["Harian", "Mingguan", "Tren Bulanan"].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setTabAktif(tab)}
          className={`rounded-[14px] px-2 py-2.5 text-xs font-bold transition sm:px-3 sm:text-sm ${
            tabAktif === tab
              ? "bg-[#176b26] text-white shadow-sm"
              : "bg-white text-[#286432] hover:bg-slate-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const KartuSemuaNutrisi = ({ periode }) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {NUTRISI.map((item) => {
        const Icon = item.icon;

        return (
          <NutritionCard
            key={item.key}
            icon={<Icon size={19} />}
            title={`${item.nama}${periode ? ` · ${periode}` : ""}`}
            value={`${formatAngka(totalTampil[item.key])} ${item.satuan}`}
            target="Total dari catatan makanan"
            percentage={null}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
          />
        );
      })}
    </div>
  );

  // MODE IBU HAMIL
  if (modeNutrisi === "ibu" && kehamilanTerkait) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#eaf8ec] font-jakarta text-[#202833]">
        <Header judul="Nutrisi Ibu" />

        <main className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-4 sm:px-6 sm:pt-5 lg:px-8">
          <ErrorBanner />

          <section className="rounded-[20px] bg-gradient-to-br from-[#1f742b] to-[#2d8b37] p-4 text-white shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold sm:text-2xl">
              Pemantauan Nutrisi Ibu
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <UserCircle size={27} />
              </div>
              <div>
                <p className="font-extrabold">{namaIbu}</p>
                <p className="mt-1 text-xs text-white/80 sm:text-sm">
                  Catatan makanan selama kehamilan
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/15 p-3">
                <p className="text-xs text-white/80">Usia kehamilan</p>
                <p className="mt-1 text-lg font-extrabold">
                  {mingguKehamilan === null
                    ? "Belum diketahui"
                    : `${mingguKehamilan} minggu ${hariKehamilan % 7} hari`}
                </p>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <p className="text-xs text-white/80">
                  Tahap kehamilan
                </p>
                <p className="mt-1 text-lg font-extrabold">
                  {trimester}
                </p>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#286432]">
              <CalendarDays size={16} />
              Hari ini: {formatTanggalIndonesia(hariIni)}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-white/85 sm:text-sm">
              HPL: {formatTanggalIndonesia(
                parseTanggal(kehamilanTerkait.hpl)
              )}. Ringkasan berikut hanya berdasarkan makanan yang
              dicatat, bukan seluruh asupan harian.
            </p>
          </section>

          <section className="mt-4 rounded-[20px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1d8] text-[#a86400]">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#245c2c] sm:text-base">
                  Ringkasan Asupan Ibu
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Data dibaca dari tabel maternal_food_logs.
                </p>
              </div>
            </div>

            <TabNavigasi />

            <div className="mt-4">
              <p className="text-xs text-slate-500">
                {tabAktif === "Harian"
                  ? `Ringkasan ${formatTanggalIndonesia(hariIni)}`
                  : tabAktif === "Mingguan"
                    ? `${formatTanggalIndonesia(awalMinggu)} – ${formatTanggalIndonesia(hariIni)}`
                    : new Intl.DateTimeFormat("id-ID", {
                        month: "long",
                        year: "numeric",
                      }).format(hariIni)}
              </p>
            </div>

            {memuatMakanan ? (
              <p className="mt-4 text-sm text-slate-500">
                Memuat catatan makanan...
              </p>
            ) : (
              <div className="mt-4">
                <KartuSemuaNutrisi
                  periode={
                    tabAktif === "Harian"
                      ? "Hari ini"
                      : tabAktif === "Mingguan"
                        ? "7 hari"
                        : "Bulan ini"
                  }
                />
              </div>
            )}
          </section>

          <section className="mt-4 rounded-[20px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e1f8e5] text-[#238039]">
                <Utensils size={20} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold sm:text-base">
                  Catatan Makanan Ibu
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Daftar makanan pada tanggal yang dipilih.
                </p>
              </div>
            </div>

            {memuatMakanan ? (
              <p className="mt-4 text-sm text-slate-500">
                Memuat data...
              </p>
            ) : makananHariIni.length === 0 ? (
              <div className="mt-4 rounded-xl bg-[#f6faf6] p-4 text-center">
                <p className="text-sm font-bold text-[#286432]">
                  Belum ada catatan makanan hari ini
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Tambahkan catatan ke maternal_food_logs dengan
                  pregnancy_id yang sesuai agar data tampil di sini.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {makananHariIni.map((item) => (
                  <BarisMakanan key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          <InsightBox
            title="Informasi kebutuhan gizi"
            text="Kebutuhan gizi selama kehamilan berubah sesuai usia kehamilan dan kondisi ibu. Halaman ini menampilkan catatan yang tersimpan, dan belum menetapkan status cukup atau kurang secara otomatis."
          />

          <button
            type="button"
            onClick={() => navigate("/si-kecil")}
            className="mt-4 rounded-xl border border-[#cfe4d2] bg-white px-4 py-3 text-xs font-bold text-[#23652d] transition hover:bg-[#f3faf4]"
          >
            Buka halaman Si Kecil
          </button>
        </main>
      </div>
    );
  }

  // BELUM ADA PROFIL IBU HAMIL ATAU PROFIL ANAK
  if (!anak) {
    return (
      <div className="min-h-screen bg-[#eaf8ec] font-jakarta text-[#202833]">
        <Header judul="Nutrisi" />

        <main className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-5 sm:px-6 lg:px-8">
          <ErrorBanner />

          <section className="rounded-[20px] border border-[#d7ead9] bg-white p-6 text-center shadow-sm sm:p-10">
            <Baby size={48} className="mx-auto text-[#2d813a]" />

            <h2 className="mt-4 text-xl font-extrabold text-[#23652d]">
              Profil belum tersedia
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
              Tambahkan profil ibu dan data kehamilan, atau buat
              profil anak melalui halaman Si Kecil agar pemantauan
              nutrisi dapat dimulai.
            </p>

            <button
              onClick={() => navigate("/si-kecil")}
              className="mt-5 rounded-xl bg-[#176b26] px-5 py-3 text-sm font-bold text-white hover:bg-[#12551f]"
            >
              Buka Si Kecil
            </button>
          </section>
        </main>
      </div>
    );
  }

  // MODE ANAK
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eaf8ec] font-jakarta text-[#202833]">
      <Header judul="Nutrisi" />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-4 sm:px-6 sm:pt-5 lg:px-8">
        <ErrorBanner />

        {/* HERO */}
        <section className="rounded-[20px] bg-gradient-to-br from-[#1f742b] to-[#2d8b37] p-4 text-white shadow-sm sm:rounded-[22px] sm:p-5 lg:p-6">
          <h2 className="text-lg font-extrabold leading-tight sm:text-xl lg:text-2xl">
            Analisis Nutrisi Harian
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-base font-bold">
              {namaAnak.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold sm:text-base">
                {namaAnak}
              </p>
              <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
                {umurAnak}
              </p>
            </div>

            {daftarAnak.length > 1 && (
              <select
                value={childId}
                onChange={(e) => pilihAnak(e.target.value)}
                className="max-w-full rounded-xl border border-white/30 bg-white px-3 py-2 text-xs font-bold text-[#23652d] outline-none sm:text-sm"
                aria-label="Pilih anak"
              >
                {daftarAnak.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#286432] sm:text-sm">
            <CalendarDays size={16} className="text-[#f5a400]" />
            {formatTanggalIndonesia(hariIni)}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-white/85 sm:text-sm">
            Ringkasan berdasarkan catatan makanan yang tersimpan.
            Angka nol berarti belum ada asupan yang tercatat pada
            periode ini, bukan berarti anak belum makan.
          </p>
        </section>

        {/* PEMANTAUAN 1000 HPK */}
        <section className="mt-4 rounded-[20px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e1f8e5] text-[#238039]">
              <Baby size={21} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-extrabold text-[#245c2c] sm:text-base">
                Pemantauan 1000 Hari Pertama Kehidupan (HPK)
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                {hphtTersedia
                  ? "Perhitungan menggunakan HPHT dari data kehamilan yang terhubung dengan profil anak."
                  : "HPHT belum tersedia. Lengkapi data kehamilan agar periode 1000 HPK dapat dihitung."}
              </p>
            </div>
          </div>

          {awal1000HPK ? (
            <>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Hari ke-
                  </p>
                  <p className="text-2xl font-extrabold text-[#176b26]">
                    {Math.min(hariHPK, 1000)}
                    <span className="text-sm font-semibold text-slate-400">
                      {" "}/ 1000
                    </span>
                  </p>
                </div>

                <span className="rounded-full bg-[#e6f4e8] px-3 py-1.5 text-xs font-extrabold text-[#286432]">
                  {selesai1000HPK
                    ? "Periode 1000 HPK terlewati"
                    : `${formatAngka(progresHPK)}%`}
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#edf2ee]">
                <div
                  className="h-full rounded-full bg-[#29934b] transition-all"
                  style={{ width: `${progresHPK}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] text-slate-500 sm:text-xs">
                <span>
                  Awal hitungan:{" "}
                  {formatTanggalIndonesia(awal1000HPK)}
                </span>
                <span>
                  Hari ke-1000:{" "}
                  {formatTanggalIndonesia(hariKe1000)}
                </span>
              </div>

              {tanggalLahirAnak && (
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Tanggal lahir:{" "}
                  {formatTanggalIndonesia(tanggalLahirAnak)}.
                </p>
              )}
            </>
          ) : (
            <div className="mt-4 rounded-xl bg-[#fff8e9] p-3 text-xs leading-relaxed text-slate-600">
              Usia setelah lahir: {umurHariAnak ?? "—"} hari.
              Total 1000 HPK belum bisa dihitung karena HPHT belum
              tercatat.
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/si-kecil")}
            className="mt-4 rounded-xl border border-[#cfe4d2] px-4 py-2 text-xs font-bold text-[#23652d] transition hover:bg-[#f3faf4]"
          >
            Perbarui data di Si Kecil
          </button>
        </section>

        {/* ACUAN AKG */}
        <section className="mt-4 rounded-[20px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff1d8] text-[#a86400]">
              <TrendingUp size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-extrabold text-[#245c2c] sm:text-base">
                Acuan Kebutuhan Gizi Berdasarkan Umur
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                Umur anak saat ini:{" "}
                {umurBulanAnak === null
                  ? "belum diketahui"
                  : `${umurBulanAnak} bulan (${umurHariAnak} hari)`}
              </p>
            </div>
          </div>

          {acuanAkgAnak ? (
            <>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f3faf4] p-3">
                <span className="text-xs font-bold text-[#286432]">
                  Kelompok acuan AKG
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#23652d]">
                  {acuanAkgAnak.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  {
                    label: "Energi",
                    value: acuanAkgAnak.energi,
                    unit: "kkal/hari",
                  },
                  {
                    label: "Protein",
                    value: acuanAkgAnak.protein,
                    unit: "g/hari",
                  },
                  {
                    label: "Lemak",
                    value: acuanAkgAnak.lemak,
                    unit: "g/hari",
                  },
                  {
                    label: "Karbohidrat",
                    value: acuanAkgAnak.karbohidrat,
                    unit: "g/hari",
                  },
                  {
                    label: "Serat",
                    value: acuanAkgAnak.serat,
                    unit: "g/hari",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#e5eee6] p-3"
                  >
                    <p className="text-[11px] font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-[#23652d]">
                      {formatAngka(item.value, 0)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.unit}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {acuanAkgAnak.catatan}
              </p>
            </>
          ) : (
            <div className="mt-3 rounded-xl bg-[#fff8e9] p-3 text-xs leading-relaxed text-[#805514]">
              {umurBulanAnak !== null && umurBulanAnak > 35
                ? "Umur anak berada di luar kelompok acuan bayi dan anak kecil yang tersedia di halaman ini."
                : "Acuan belum tersedia karena umur anak belum dapat dihitung."}
            </div>
          )}

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-extrabold text-amber-900">
              Status penilaian: belum dapat dinilai otomatis
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900/80">
              Catatan makanan belum tentu mencakup seluruh asupan,
              ASI, susu, atau ukuran porsi aktual. Karena itu sistem
              tidak menyimpulkan cukup atau kurang hanya berdasarkan
              total catatan.
            </p>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-slate-400">
            Sumber acuan: Permenkes RI No. 28 Tahun 2019 tentang
            Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat
            Indonesia.
          </p>
        </section>

        {/* TABS */}
        <TabNavigasi />

        {/* HARIAN */}
        {tabAktif === "Harian" && (
          <div className="space-y-5">
            <section className="mt-4 rounded-[20px] bg-white p-4 text-center shadow-sm sm:p-5 lg:p-6">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-slate-500 sm:text-xs">
                RINGKASAN ASUPAN HARI INI
              </p>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {formatTanggalIndonesia(hariIni)}
              </p>

              <div className="relative mx-auto mt-5 h-44 w-44 sm:h-52 sm:w-52">
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full -rotate-90"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="82"
                    fill="none"
                    stroke="#e6f4e8"
                    strokeWidth="14"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="82"
                    fill="none"
                    stroke="#2e8438"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 82}
                    strokeDashoffset={
                      2 *
                        Math.PI *
                        82 -
                      (2 * Math.PI * 82) *
                        (makananHariIni.length > 0 ? 1 : 0)
                    }
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <span className="text-3xl font-extrabold text-[#176b26] sm:text-4xl">
                    {makananHariIni.length}
                  </span>
                  <span className="mt-1 rounded-full bg-[#e6f4e8] px-3 py-1 text-center text-[9px] font-extrabold tracking-wider text-[#286432] sm:text-[10px]">
                    CATATAN MAKAN
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500 sm:text-sm">
                {makananHariIni.length > 0
                  ? `${makananHariIni.length} catatan makanan tersimpan untuk hari ini.`
                  : "Belum ada makanan yang tercatat untuk hari ini."}
              </p>
            </section>

            <section>
              <SectionTitle title="Makronutrisi Harian" />
              <KartuSemuaNutrisi periode="Hari ini" />
            </section>

            <section className="rounded-[18px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e1f8e5] text-[#238039]">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold sm:text-base">
                    Catatan Makanan Hari Ini
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    Daftar makanan yang sudah disimpan untuk Si Kecil.
                  </p>
                </div>
              </div>

              {memuatMakanan ? (
                <p className="mt-4 text-sm text-slate-500">
                  Memuat catatan makanan...
                </p>
              ) : makananHariIni.length === 0 ? (
                <EmptyFood mode="anak" />
              ) : (
                <div className="mt-4 space-y-3">
                  {makananHariIni.map((item) => (
                    <BarisMakanan key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* MINGGUAN */}
        {tabAktif === "Mingguan" && (
          <div className="space-y-4 sm:space-y-5">
            <section className="mt-4 rounded-[20px] border border-[#d7ead9] bg-white p-4 text-center shadow-sm sm:p-5 lg:p-6">
              <h2 className="font-playfair text-base font-bold text-[#24642e] sm:text-lg">
                RINGKASAN NUTRISI MINGGUAN
              </h2>

              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                {formatTanggalIndonesia(awalMinggu)} –{" "}
                {formatTanggalIndonesia(hariIni)}
              </p>

              <div className="mt-5">
                <p className="text-xs font-medium text-slate-500">
                  Hari dengan catatan makanan
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[#24642e] sm:text-4xl">
                  {jumlahHariTercatat} dari 7 hari
                </p>
              </div>

              <div className="mx-auto mt-6 grid max-w-2xl grid-cols-7 gap-1 sm:gap-3">
                {dataHarianMingguan.map((item) => {
                  const maxKalori = Math.max(
                    1,
                    ...dataHarianMingguan.map(
                      (hari) => hari.total.kalori
                    )
                  );

                  const tinggi = item.jumlahMakanan
                    ? Math.max(
                        5,
                        (item.total.kalori / maxKalori) * 48
                      )
                    : 3;

                  return (
                    <div
                      key={item.tanggal}
                      className="flex flex-col items-center"
                    >
                      <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                        {item.hari}
                      </span>
                      <span className="mt-1 text-[10px] font-bold text-[#24642e] sm:text-xs">
                        {item.jumlahMakanan
                          ? formatAngka(item.total.kalori, 0)
                          : "—"}
                      </span>
                      <div className="mt-2 flex h-12 items-end">
                        <div
                          className={`w-3 rounded-t-md sm:w-4 ${
                            item.jumlahMakanan
                              ? "bg-[#53b875]"
                              : "bg-[#e6eee7]"
                          }`}
                          style={{ height: `${tinggi}px` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Grafik menunjukkan kalori yang tercatat per hari,
                bukan persentase kecukupan gizi.
              </p>
            </section>

            <KartuSemuaNutrisi periode="7 hari" />

            <section className="rounded-[20px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-extrabold text-[#202833] sm:text-base">
                Rincian Harian
              </h2>

              <div className="mt-4 space-y-3">
                {dataHarianMingguan.map((item) => (
                  <div
                    key={item.tanggal}
                    className="flex items-center justify-between gap-3 border-b border-[#edf1ee] pb-3 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#202833]">
                        {item.hari}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTanggalIndonesia(
                          parseTanggal(item.tanggal)
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-extrabold text-[#24642e]">
                        {formatAngka(item.total.kalori)} kkal
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.jumlahMakanan} catatan
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <InsightBox
              title={
                jumlahHariTercatat > 0
                  ? "Ringkasan catatan minggu ini"
                  : "Belum ada data mingguan"
              }
              text={
                jumlahHariTercatat > 0
                  ? `Makanan tercatat pada ${jumlahHariTercatat} dari 7 hari. Lengkapi pencatatan untuk mendapatkan ringkasan yang lebih representatif.`
                  : "Catat makanan yang dikonsumsi Si Kecil agar ringkasan mingguan dapat dihitung."
              }
            />
          </div>
        )}

        {/* TREN BULANAN */}
        {tabAktif === "Tren Bulanan" && (
          <div className="space-y-4 sm:space-y-5">
            <section className="mt-4 rounded-[20px] border border-[#d7ead9] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
              <div className="text-center">
                <h2 className="font-playfair text-base font-bold text-[#24642e] sm:text-lg">
                  TREN ASUPAN BULANAN
                </h2>
                <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                  {new Intl.DateTimeFormat("id-ID", {
                    month: "long",
                    year: "numeric",
                  }).format(hariIni)}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {dataBulanan.map((item) => {
                  const nilaiMaksimum = Math.max(
                    1,
                    ...dataBulanan.map((minggu) => minggu.rataKalori)
                  );

                  const lebar =
                    item.jumlahHari > 0
                      ? (item.rataKalori / nilaiMaksimum) * 100
                      : 0;

                  return (
                    <div key={item.nama}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-600 sm:text-sm">
                          {item.nama} ({item.rentang})
                        </span>
                        <span className="text-xs font-bold text-[#24642e] sm:text-sm">
                          {item.jumlahHari > 0
                            ? `${formatAngka(item.rataKalori)} kkal/hari`
                            : "Belum ada data"}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-[#edf2ee]">
                        <div
                          className="h-full rounded-full bg-[#29934b] transition-all"
                          style={{ width: `${lebar}%` }}
                        />
                      </div>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {item.jumlahMakanan} catatan makanan ·{" "}
                        {item.jumlahHari} hari tercatat
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Grafik membandingkan rata-rata kalori pada hari
                yang memiliki catatan makanan. Grafik tidak
                menyatakan kecukupan atau kualitas gizi.
              </p>
            </section>

            <KartuSemuaNutrisi periode="Bulan ini" />

            <section className="overflow-hidden rounded-[20px] border border-[#d7ead9] bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <h2 className="text-sm font-extrabold text-[#202833] sm:text-base">
                  Perbandingan Asupan per Minggu
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[470px] border-collapse">
                  <thead>
                    <tr className="border-y border-[#edf1ee] bg-[#f8fbf8]">
                      {[
                        "Minggu",
                        "Kalori",
                        "Protein",
                        "Karbo",
                        "Lemak",
                      ].map((judul) => (
                        <th
                          key={judul}
                          className="px-3 py-3 text-center text-xs font-bold text-slate-500 first:text-left"
                        >
                          {judul}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {dataBulanan.map((item) => (
                      <tr
                        key={item.nama}
                        className="border-b border-[#edf1ee] last:border-b-0"
                      >
                        <td className="px-4 py-3 text-xs font-semibold text-[#202833] sm:text-sm">
                          {item.nama}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-[#24642e] sm:text-sm">
                          {formatAngka(item.total.kalori, 0)}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-[#24642e] sm:text-sm">
                          {formatAngka(item.total.protein)}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-[#24642e] sm:text-sm">
                          {formatAngka(item.total.karbohidrat)}
                        </td>
                        <td className="px-3 py-3 text-center text-xs text-[#24642e] sm:text-sm">
                          {formatAngka(item.total.lemak)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <InsightBox
              title={
                totalBulanan.kalori > 0
                  ? "Catatan asupan bulan ini tersedia"
                  : "Belum ada catatan bulan ini"
              }
              text={
                totalBulanan.kalori > 0
                  ? `Total kalori yang tercatat bulan ini adalah ${formatAngka(totalBulanan.kalori)} kkal. Angka ini merupakan total catatan, bukan penilaian kecukupan gizi.`
                  : "Tambahkan catatan makanan agar tren bulanan dapat dihitung dari data sebenarnya."
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}

function NutritionCard({
  icon,
  title,
  value,
  target,
  percentage,
  iconBg,
  iconColor,
}) {
  return (
    <article className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        {percentage !== null && percentage !== undefined && (
          <span className="text-xs font-extrabold text-[#176b26]">
            {percentage}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-600">
        {title}
      </h3>

      <p className="mt-1 break-words text-xl font-extrabold text-[#202833]">
        {value}
      </p>

      <p className="mt-1 text-[11px] leading-relaxed text-slate-400 sm:text-xs">
        {target}
      </p>
    </article>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-6 w-1 rounded-full bg-[#176b26]" />
      <h2 className="text-base font-extrabold text-[#245c2c] sm:text-lg">
        {title}
      </h2>
    </div>
  );
}

function BarisMakanan({ item }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-[#edf1ee] p-3">
      <div className="min-w-0">
        <p className="break-words text-sm font-bold text-[#202833]">
          {item.nama_makanan}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {item.waktu_makan || "Waktu makan belum diisi"}
          {" · "}
          Porsi {formatAngka(angka(item.porsi))}
        </p>
      </div>
      <p className="shrink-0 text-xs font-bold text-[#24642e]">
        {formatAngka(angka(item.kalori_kcal))} kkal
      </p>
    </div>
  );
}

function EmptyFood({ mode = "anak" }) {
  return (
    <div className="mt-4 rounded-xl bg-[#f6faf6] p-4 text-center">
      <p className="text-sm font-bold text-[#286432]">
        Belum ada catatan makanan
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {mode === "ibu"
          ? "Tambahkan makanan ke tabel maternal_food_logs dengan pregnancy_id yang sesuai."
          : "Tambahkan makanan ke tabel food_logs dengan child_id yang sesuai."}
      </p>
    </div>
  );
}

function InsightBox({ title, text }) {
  return (
    <section className="flex items-start gap-3 rounded-[18px] border border-[#d7ead9] bg-[#f5fbf6] p-4 sm:p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e1f8e5] text-[#238039]">
        <Lightbulb size={18} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#245c2c]">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {text}
        </p>
      </div>
    </section>
  );
}

export default Nutrisi;
