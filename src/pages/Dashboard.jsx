import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import {
  Bell,
  UserCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Refrigerator,
  Plus,
  Sparkles,
  Home,
  Package,
  TrendingUp,
  Baby,
  Lightbulb,
  ChefHat,
  Clock,
  Bookmark,
  Utensils,
  CookingPot,
  BookOpen,
  ShoppingBasket,
  X,
  
} from "lucide-react";

import logoDapurCerdas from "../assets/logo-dapur-cerdas.png";

/* =========================================================
   MENU NAVIGASI
========================================================= */

const menu = [
  { label: "Beranda", icon: Home, path: "/" },
  { label: "Stok Kulkas", icon: Package, path: "/stok" },
  { label: "Nutrisi", icon: TrendingUp, path: "/nutrisi" },
  { label: "Si Kecil", icon: Baby, path: "/si-kecil" },
  
];

/* =========================================================
   HELPER GAMBAR
========================================================= */

function getImageUrl(imagePath) {
  if (!imagePath) {
    return "https://placehold.co/200x200?text=No+Image";
  }

  const cleanPath = imagePath.trim().replace(/\\/g, "/");

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("/image/")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("image/")) {
    return `/${cleanPath}`;
  }

  if (cleanPath.startsWith("ingredients/")) {
    return `/image/${cleanPath}`;
  }

  if (!cleanPath.includes("/") && /\.(jpg|jpeg|png|webp)$/i.test(cleanPath)) {
    return `/image/ingredients/${cleanPath}`;
  }

  return `/${cleanPath.replace(/^\/+/, "")}`;
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
   FORMAT TANGGAL
========================================================= */

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const date = new Date(`${tanggal}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return tanggal;
  }

  return `${date.getDate()}/${date.getMonth() + 1}`;
}

/* =========================================================
   HITUNG SELISIH HARI
========================================================= */

function hitungSelisihHari(tanggalKadaluarsa) {
  if (!tanggalKadaluarsa) return null;

  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const tanggalExp = new Date(`${tanggalKadaluarsa}T00:00:00`);

  if (Number.isNaN(tanggalExp.getTime())) {
    return null;
  }

  return Math.ceil(
    (tanggalExp.getTime() - hariIni.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/* =========================================================
   TENTUKAN STATUS BAHAN
========================================================= */

function tentukanStatus(tanggalKadaluarsa) {
  const selisihHari = hitungSelisihHari(tanggalKadaluarsa);

  if (selisihHari === null) return "Aman";
  if (selisihHari < 0) return "Kedaluwarsa";
  if (selisihHari <= 3) return "Perlu diolah";

  return "Aman";
}

/* =========================================================
   LABEL STATUS
========================================================= */

function getStatusLabel(item) {
  if (item.status === "Kedaluwarsa") {
    return "Kedaluwarsa";
  }

  if (item.status === "Perlu diolah") {
    const selisihHari = hitungSelisihHari(item.tanggalKadaluarsa);

    if (selisihHari === 0) {
      return "Kedaluwarsa hari ini";
    }

    if (selisihHari === 1) {
      return "Kedaluwarsa besok";
    }

    if (selisihHari !== null && selisihHari > 1) {
      return `Kedaluwarsa ${selisihHari} hari lagi`;
    }

    return "Segera diolah";
  }

  return "Aman";
}

/* =========================================================
   PEDOMAN MENU MAKANAN (DATA STATIS)
========================================================= */

const pedomanMenu = [
  {
    id: "hamil",
    judul: "Ibu Hamil",
    deskripsi: "Pilihan menu bergizi selama masa kehamilan.",
    label: "Gizi selama kehamilan",
    warna: "from-rose-50 to-orange-50",
    aksen: "bg-rose-100 text-rose-700",
    gambar:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    pengantar:
      "Pilih makanan yang beragam dengan sumber karbohidrat, protein, sayur, dan buah. Kebutuhan setiap ibu dapat berbeda sesuai kondisi kehamilan.",
    menu: [
      {
        waktu: "Sarapan",
        nama: "Nasi, telur matang, dan tumis bayam",
        bahan: "Nasi, telur, bayam, bawang putih, dan sedikit minyak.",
        manfaat: "Memberikan energi, protein, serta zat besi dan folat dari bahan pangan.",
      },
      {
        waktu: "Makan siang",
        nama: "Nasi, ikan matang, sayur bening, dan jeruk",
        bahan: "Nasi, ikan, bayam atau oyong, wortel, dan jeruk.",
        manfaat: "Kombinasi karbohidrat, protein, sayuran, dan buah sumber vitamin C.",
      },
      {
        waktu: "Makan malam",
        nama: "Sup ayam, tahu, dan nasi",
        bahan: "Ayam matang, tahu, wortel, kentang, buncis, dan nasi.",
        manfaat: "Menyediakan protein dan variasi sayuran dalam satu hidangan.",
      },
    ],
    tips: [
      "Konsumsi makanan beragam dan makan dalam porsi yang nyaman.",
      "Pastikan daging, ikan, telur, dan makanan laut dimasak hingga matang.",
      "Cuci sayur dan buah dengan air bersih sebelum dikonsumsi.",
      "Hindari alkohol serta batasi kafein sesuai anjuran tenaga kesehatan.",
    ],
  },
  {
    id: "menyusui",
    judul: "Ibu Menyusui",
    deskripsi: "Inspirasi makanan bergizi untuk mendukung kebutuhan ibu.",
    label: "Gizi ibu menyusui",
    warna: "from-violet-50 to-fuchsia-50",
    aksen: "bg-violet-100 text-violet-700",
    gambar:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    pengantar:
      "Ibu menyusui dianjurkan mengonsumsi makanan beragam dan seimbang, cukup minum, serta menyesuaikan porsi dengan rasa lapar dan kebutuhan tubuh.",
    menu: [
      {
        waktu: "Sarapan",
        nama: "Nasi, omelet sayur matang, dan pepaya",
        bahan: "Nasi, telur, wortel, bayam, dan pepaya.",
        manfaat: "Memberikan energi, protein, serat, serta vitamin dari buah dan sayur.",
      },
      {
        waktu: "Makan siang",
        nama: "Nasi, ikan, tempe, dan sayur bening",
        bahan: "Nasi, ikan matang, tempe, bayam, dan jagung.",
        manfaat: "Mengombinasikan sumber protein hewani dan nabati dengan sayuran.",
      },
      {
        waktu: "Makan malam",
        nama: "Sup ayam kentang dan tumis buncis",
        bahan: "Ayam matang, kentang, wortel, buncis, dan nasi.",
        manfaat: "Pilihan menu dengan protein, karbohidrat, dan sayuran.",
      },
    ],
    tips: [
      "Makan secara teratur dengan menu yang bervariasi.",
      "Sediakan air minum dan minum sesuai rasa haus.",
      "Tidak perlu menghindari banyak jenis makanan tanpa alasan medis.",
      "Konsultasikan kebutuhan suplemen atau pantangan khusus dengan tenaga kesehatan.",
    ],
  },
  {
    id: "balita",
    judul: "Balita",
    deskripsi: "Contoh menu sesuai tahapan usia dan tekstur makanan.",
    label: "MPASI dan menu balita",
    warna: "from-amber-50 to-yellow-50",
    aksen: "bg-amber-100 text-amber-700",
    gambar:
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=900&q=85",
    pengantar:
      "Menu balita perlu disesuaikan dengan usia, kemampuan makan, dan tahap perkembangan. Untuk anak di bawah 2 tahun, lanjutkan ASI sesuai anjuran.",
    menu: [
      {
        waktu: "Usia 6–8 bulan",
        nama: "Bubur kental nasi, ayam, dan wortel",
        bahan: "Nasi, ayam matang tanpa tulang, wortel, dan sedikit minyak.",
        manfaat: "Tekstur lumat/kental dengan sumber protein hewani dan sayuran. Mulai dari porsi kecil dan tingkatkan bertahap.",
      },
      {
        waktu: "Usia 9–11 bulan",
        nama: "Nasi tim lembek, ikan, tahu, dan sayur",
        bahan: "Nasi tim, ikan matang tanpa duri, tahu, labu, dan bayam.",
        manfaat: "Tekstur cincang atau makanan lunak yang dapat dipegang sesuai kemampuan anak.",
      },
      {
        waktu: "Usia 12–23 bulan",
        nama: "Nasi, ayam suwir, tumis sayur, dan buah",
        bahan: "Nasi, ayam suwir lembut, wortel, buncis, dan pisang.",
        manfaat: "Makanan keluarga dengan tekstur yang disesuaikan dan potongan aman untuk anak.",
      },
    ],
    tips: [
      "Berikan MPASI mulai usia 6 bulan sambil meneruskan ASI.",
      "Sesuaikan tekstur dan ukuran potongan dengan kemampuan anak.",
      "Hindari makanan yang berisiko menyebabkan tersedak, seperti kacang utuh dan potongan keras.",
      "Hindari madu sebelum usia 12 bulan dan jangan menambahkan gula atau garam berlebihan.",
      "Dampingi anak selama makan dan terapkan jadwal makan yang teratur.",
    ],
  },
  {
    id: "umum",
    judul: "Umum",
    deskripsi: "Menu rumahan seimbang untuk dinikmati seluruh keluarga.",
    label: "Menu sehat keluarga",
    warna: "from-emerald-50 to-green-50",
    aksen: "bg-emerald-100 text-emerald-700",
    gambar:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    pengantar:
      "Pilih menu beragam yang memadukan sumber karbohidrat, protein, sayur, dan buah. Sesuaikan porsi serta kebutuhan setiap anggota keluarga.",
    menu: [
      {
        waktu: "Sarapan",
        nama: "Nasi, telur dadar sayur, dan buah",
        bahan: "Nasi, telur, wortel, bayam, dan pepaya.",
        manfaat: "Kombinasi energi, protein, serat, dan vitamin.",
      },
      {
        waktu: "Makan siang",
        nama: "Nasi, ayam panggang, dan capcay",
        bahan: "Nasi, ayam matang, wortel, brokoli, dan kembang kol.",
        manfaat: "Sumber protein dengan variasi sayuran.",
      },
      {
        waktu: "Makan malam",
        nama: "Sup tahu ikan dan kentang",
        bahan: "Tahu, ikan matang tanpa duri, kentang, wortel, dan sayuran.",
        manfaat: "Mengombinasikan protein, karbohidrat, dan sayuran.",
      },
    ],
    tips: [
      "Usahakan variasi bahan pangan dan warna sayuran setiap hari.",
      "Pilih cara memasak seperti kukus, rebus, panggang, atau tumis secukupnya.",
      "Sesuaikan porsi dengan usia, aktivitas, dan kebutuhan masing-masing anggota keluarga.",
      "Perhatikan alergi dan kebutuhan khusus setiap anggota keluarga.",
    ],
  },
];

/* =========================================================
   MENU HARIAN 7 HARI (DATA STATIS, BERGANTI OTOMATIS)
========================================================= */

const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const menuHarian = {
  hamil: [
    [
      ["Sarapan", "Nasi, telur matang, dan tumis bayam", "Nasi, telur matang, bayam, dan sedikit minyak.", "Sumber energi, protein, serta folat dan zat besi dari bahan pangan."],
      ["Makan siang", "Nasi, ikan matang, sayur bening, dan jeruk", "Nasi, ikan matang, bayam, wortel, dan jeruk.", "Protein, sayuran, dan buah sumber vitamin C."],
      ["Makan malam", "Sup ayam, tahu, dan nasi", "Ayam matang, tahu, wortel, kentang, buncis, dan nasi.", "Kombinasi protein, karbohidrat, dan sayuran."],
    ],
    [
      ["Sarapan", "Roti gandum, telur matang, dan pisang", "Roti gandum, telur matang, dan pisang.", "Karbohidrat, protein, dan serat."],
      ["Makan siang", "Nasi, ayam panggang matang, dan capcay", "Nasi, ayam matang, wortel, brokoli, dan kembang kol.", "Protein dan variasi sayuran."],
      ["Makan malam", "Sup ikan, tahu, dan kentang", "Ikan matang tanpa duri, tahu, kentang, dan sayuran.", "Protein dan sumber energi."],
    ],
    [
      ["Sarapan", "Bubur kacang hijau dan telur matang", "Kacang hijau matang, santan secukupnya, dan telur matang.", "Energi, protein nabati, dan protein hewani."],
      ["Makan siang", "Nasi, daging sapi matang, dan sayur bening", "Nasi, daging sapi matang, bayam, dan jagung.", "Daging sapi merupakan sumber zat besi dan protein."],
      ["Makan malam", "Nasi, tempe, dan tumis buncis wortel", "Nasi, tempe matang, buncis, dan wortel.", "Protein nabati dan serat."],
    ],
    [
      ["Sarapan", "Oat, susu pasteurisasi, dan pepaya", "Oat matang, susu pasteurisasi, dan pepaya.", "Serat, protein, kalsium, dan vitamin."],
      ["Makan siang", "Nasi, ikan kembung matang, dan sayur", "Nasi, ikan kembung matang, labu siam, dan wortel.", "Protein dan lemak sehat dari ikan."],
      ["Makan malam", "Sup ayam, tahu, dan nasi", "Ayam matang, tahu, kentang, wortel, dan nasi.", "Protein dan karbohidrat."],
    ],
    [
      ["Sarapan", "Nasi, omelet sayur matang, dan alpukat", "Nasi, telur matang, wortel, bayam, dan alpukat.", "Energi, protein, dan lemak tak jenuh."],
      ["Makan siang", "Nasi, ikan matang, tempe, dan sayur", "Nasi, ikan matang, tempe, dan sayur bening.", "Protein hewani dan nabati."],
      ["Makan malam", "Kentang, ayam kukus matang, dan brokoli", "Kentang, ayam matang, dan brokoli.", "Karbohidrat, protein, dan serat."],
    ],
    [
      ["Sarapan", "Bubur ayam rumahan dan buah", "Bubur nasi, ayam matang, wortel, dan pir.", "Menu hangat dengan protein dan buah."],
      ["Makan siang", "Nasi, telur balado matang, dan sayur", "Nasi, telur matang, bumbu tanpa berlebihan, dan sayuran.", "Protein dan variasi sayuran."],
      ["Makan malam", "Sup tahu ikan dan nasi", "Ikan matang tanpa duri, tahu, sawi, dan nasi.", "Protein dan cairan dari sup."],
    ],
    [
      ["Sarapan", "Ubi kukus, telur matang, dan susu pasteurisasi", "Ubi, telur matang, dan susu pasteurisasi.", "Energi, protein, dan kalsium."],
      ["Makan siang", "Nasi, ayam semur matang, dan tumis sayur", "Nasi, ayam matang, wortel, dan buncis.", "Protein dan sayuran."],
      ["Makan malam", "Nasi, pepes ikan matang, dan sayur bening", "Nasi, ikan matang, bayam, dan jagung.", "Protein dan zat gizi dari sayuran."],
    ],
  ],
  menyusui: [
    [
      ["Sarapan", "Nasi, omelet sayur, dan pepaya", "Nasi, telur, wortel, bayam, dan pepaya.", "Energi, protein, serat, dan vitamin."],
      ["Makan siang", "Nasi, ikan, tempe, dan sayur bening", "Nasi, ikan matang, tempe, bayam, dan jagung.", "Protein hewani dan nabati."],
      ["Makan malam", "Sup ayam kentang dan tumis buncis", "Ayam matang, kentang, wortel, buncis, dan nasi.", "Protein, karbohidrat, dan sayuran."],
    ],
    [
      ["Sarapan", "Roti gandum, telur, dan susu", "Roti gandum, telur matang, dan susu.", "Energi, protein, dan kalsium."],
      ["Makan siang", "Nasi, ikan kembung, dan tumis kangkung", "Nasi, ikan matang, kangkung, dan tahu.", "Protein dan variasi sayuran."],
      ["Makan malam", "Sup daging, wortel, dan kentang", "Daging matang, wortel, kentang, dan nasi.", "Protein dan sumber energi."],
    ],
    [
      ["Sarapan", "Bubur kacang hijau dan pisang", "Kacang hijau matang dan pisang.", "Energi, serat, dan protein nabati."],
      ["Makan siang", "Nasi, ayam panggang, dan capcay", "Nasi, ayam matang, brokoli, wortel, dan kembang kol.", "Protein dan serat."],
      ["Makan malam", "Pepes tahu ikan dan nasi", "Tahu, ikan matang tanpa duri, dan nasi.", "Protein hewani dan nabati."],
    ],
    [
      ["Sarapan", "Oat susu dan potongan mangga", "Oat matang, susu, dan mangga.", "Serat, kalsium, dan vitamin."],
      ["Makan siang", "Nasi, telur balado matang, dan sayur asem", "Nasi, telur matang, labu, kacang panjang, dan jagung.", "Energi, protein, dan sayuran."],
      ["Makan malam", "Sup ikan tahu dan nasi", "Ikan matang, tahu, wortel, dan nasi.", "Protein dan cairan."],
    ],
    [
      ["Sarapan", "Ubi kukus, telur, dan alpukat", "Ubi, telur matang, dan alpukat.", "Energi, protein, dan lemak tak jenuh."],
      ["Makan siang", "Nasi, ayam kecap, dan tumis buncis", "Nasi, ayam matang, buncis, dan wortel.", "Protein dan sayuran."],
      ["Makan malam", "Nasi, tempe, dan sayur bayam", "Nasi, tempe matang, bayam, dan jagung.", "Protein nabati dan serat."],
    ],
    [
      ["Sarapan", "Nasi goreng sayur dan telur matang", "Nasi, telur matang, wortel, dan sawi.", "Energi dan protein."],
      ["Makan siang", "Ikan kuah kuning, nasi, dan lalap matang", "Ikan matang, nasi, dan sayuran matang.", "Protein dan variasi sayuran."],
      ["Makan malam", "Sup ayam makaroni dan sayur", "Ayam matang, makaroni, wortel, dan buncis.", "Karbohidrat, protein, dan serat."],
    ],
    [
      ["Sarapan", "Pancake pisang dan susu", "Pisang, telur matang, tepung, dan susu.", "Energi, protein, dan kalsium."],
      ["Makan siang", "Nasi, pepes tahu, dan sayur bening", "Nasi, tahu, bayam, dan wortel.", "Protein nabati dan sayuran."],
      ["Makan malam", "Nasi, ikan panggang matang, dan tumis brokoli", "Nasi, ikan matang, dan brokoli.", "Protein dan serat."],
    ],
  ],
  balita: [
    [
      ["Sarapan", "Bubur nasi kental ayam dan wortel", "Nasi, ayam matang tanpa tulang, wortel, dan sedikit minyak.", "Sajikan lumat atau cincang sesuai usia dan kemampuan makan."],
      ["Makan siang", "Nasi tim ikan, tahu, dan bayam", "Nasi tim, ikan matang tanpa duri, tahu, dan bayam.", "Protein hewani dan nabati; sesuaikan tekstur."],
      ["Makan malam", "Nasi lembek, telur matang, dan sup labu", "Nasi, telur matang, labu, dan wortel.", "Menu beragam dengan tekstur aman untuk anak."],
    ],
    [
      ["Sarapan", "Bubur oat pisang dan telur matang", "Oat matang, pisang, dan telur matang.", "Energi dan protein; sesuaikan kekentalan."],
      ["Makan siang", "Nasi, ayam cincang, dan brokoli", "Nasi, ayam matang cincang, brokoli, dan wortel.", "Protein dan sayuran dengan potongan sesuai kemampuan."],
      ["Makan malam", "Sup kentang tahu dan ikan", "Kentang, tahu, ikan matang tanpa duri, dan sayuran.", "Sumber energi dan protein."],
    ],
    [
      ["Sarapan", "Nasi lembek, telur orak-arik matang, dan pepaya", "Nasi, telur matang, dan pepaya matang.", "Protein dan buah; potong buah sesuai usia."],
      ["Makan siang", "Bubur nasi daging dan wortel", "Nasi, daging matang cincang, dan wortel.", "Protein hewani dan zat besi."],
      ["Makan malam", "Nasi tim tempe dan sayur", "Nasi tim, tempe matang, labu, dan bayam.", "Protein nabati dan sayuran."],
    ],
    [
      ["Sarapan", "Bubur kentang ayam dan bayam", "Kentang, ayam matang, dan bayam.", "Energi, protein, dan sayuran."],
      ["Makan siang", "Nasi, ikan matang, dan sup wortel", "Nasi, ikan tanpa duri, wortel, dan tahu.", "Protein dan vitamin dari sayuran."],
      ["Makan malam", "Nasi lembek, telur matang, dan tumis labu", "Nasi, telur matang, dan labu yang dimasak lunak.", "Protein dan energi."],
    ],
    [
      ["Sarapan", "Bubur kacang hijau dan pisang", "Kacang hijau matang lembut dan pisang.", "Energi dan protein nabati."],
      ["Makan siang", "Nasi, ayam suwir lembut, dan buncis", "Nasi, ayam matang suwir halus, dan buncis lunak.", "Protein dan serat."],
      ["Makan malam", "Sup tahu ikan dan nasi", "Tahu, ikan matang tanpa duri, sayuran, dan nasi.", "Protein hewani dan nabati."],
    ],
    [
      ["Sarapan", "Roti lembut, telur matang, dan alpukat", "Roti lembut, telur matang, dan alpukat.", "Energi, protein, dan lemak sehat."],
      ["Makan siang", "Nasi tim ayam dan labu kuning", "Nasi, ayam matang, dan labu kuning.", "Protein dan sumber energi."],
      ["Makan malam", "Nasi, tahu, dan sup sayuran", "Nasi, tahu, wortel, kentang, dan bayam.", "Protein nabati dan sayuran."],
    ],
    [
      ["Sarapan", "Bubur nasi ikan dan wortel", "Nasi, ikan matang tanpa duri, dan wortel.", "Protein hewani dan sayuran."],
      ["Makan siang", "Nasi, telur matang, dan sup ayam", "Nasi, telur matang, ayam, dan sayuran.", "Protein dan energi."],
      ["Makan malam", "Nasi lembek, tempe, dan sayur bening", "Nasi, tempe matang, bayam, dan jagung.", "Protein nabati dan serat."],
    ],
  ],
  umum: [
    [
      ["Sarapan", "Nasi, telur dadar sayur, dan pepaya", "Nasi, telur matang, wortel, bayam, dan pepaya.", "Energi, protein, serat, dan vitamin."],
      ["Makan siang", "Nasi, ayam panggang, dan capcay", "Nasi, ayam matang, wortel, brokoli, dan kembang kol.", "Protein dan variasi sayuran."],
      ["Makan malam", "Sup tahu ikan dan kentang", "Tahu, ikan matang tanpa duri, kentang, dan wortel.", "Protein, karbohidrat, dan sayuran."],
    ],
    [
      ["Sarapan", "Oat, susu, dan pisang", "Oat, susu, dan pisang matang.", "Serat, energi, dan kalsium."],
      ["Makan siang", "Nasi, ikan kembung, dan tumis kangkung", "Nasi, ikan matang, kangkung, dan tahu.", "Protein dan variasi sayuran."],
      ["Makan malam", "Ayam kecap dan tumis buncis", "Ayam matang, buncis, wortel, dan nasi.", "Protein dan serat."],
    ],
    [
      ["Sarapan", "Roti gandum, telur, dan alpukat", "Roti gandum, telur matang, dan alpukat.", "Karbohidrat, protein, dan lemak tak jenuh."],
      ["Makan siang", "Nasi, tempe, dan sayur bening", "Nasi, tempe matang, bayam, dan jagung.", "Protein nabati dan serat."],
      ["Makan malam", "Sup ayam makaroni", "Ayam matang, makaroni, wortel, dan buncis.", "Energi, protein, dan sayuran."],
    ],
    [
      ["Sarapan", "Ubi kukus dan telur matang", "Ubi dan telur matang.", "Energi dan protein."],
      ["Makan siang", "Nasi, pepes ikan, dan tumis sayur", "Nasi, ikan matang, wortel, dan buncis.", "Protein dan sayuran."],
      ["Makan malam", "Capcay tahu dan nasi", "Tahu, brokoli, wortel, sawi, dan nasi.", "Protein nabati dan serat."],
    ],
    [
      ["Sarapan", "Bubur kacang hijau dan buah", "Kacang hijau matang dan potongan buah.", "Energi dan protein nabati."],
      ["Makan siang", "Nasi, ayam semur, dan sayur", "Nasi, ayam matang, kentang, dan wortel.", "Protein dan karbohidrat."],
      ["Makan malam", "Telur kukus, tumis brokoli, dan nasi", "Telur matang, brokoli, dan nasi.", "Protein dan serat."],
    ],
    [
      ["Sarapan", "Pancake pisang dan susu", "Pisang, telur matang, tepung, dan susu.", "Energi dan protein."],
      ["Makan siang", "Nasi, ikan kuah kuning, dan sayur", "Nasi, ikan matang, labu siam, dan wortel.", "Protein dan sayuran."],
      ["Makan malam", "Tumis tahu tempe dan sup sayur", "Tahu, tempe matang, wortel, kentang, dan bayam.", "Protein nabati dan serat."],
    ],
    [
      ["Sarapan", "Nasi goreng sayur dan telur", "Nasi, telur matang, wortel, dan sawi.", "Energi dan protein."],
      ["Makan siang", "Ayam panggang, nasi, dan lalap matang", "Ayam matang, nasi, dan sayuran matang.", "Protein dan variasi sayuran."],
      ["Makan malam", "Sup ikan tahu dan nasi", "Ikan matang tanpa duri, tahu, wortel, dan nasi.", "Protein dan cairan dari sup."],
    ],
  ],
};

function getTanggalMenuHariIni() {
  const tanggal = new Date();
  return `${namaHari[tanggal.getDay()]}, ${tanggal.getDate()} ${namaBulan[tanggal.getMonth()]} ${tanggal.getFullYear()}`;
}

function getMenuHariIni(id) {
  const indeksHari = new Date().getDay(); // 0 Minggu sampai 6 Sabtu
  const daftarMenu = (menuHarian[id] || [])[indeksHari] || [];

  return daftarMenu.map(([waktu, nama, bahan, manfaat]) => ({
    waktu,
    nama,
    bahan,
    manfaat,
  }));
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [bahan, setBahan] = useState([]);
  const [loadingBahan, setLoadingBahan] = useState(true);
  const [errorBahan, setErrorBahan] = useState("");

  // Slider horizontal Ringkasan Bahan Kulkas
  const sliderBahanRef = useRef(null);

  /* =======================================================
     STATE RESEP TERSIMPAN
  ======================================================= */

  const [resepTersimpan, setResepTersimpan] = useState([]);
  const [loadingResep, setLoadingResep] = useState(true);
  const [errorResep, setErrorResep] = useState("");

  // Detail pedoman menu statis yang sedang dibuka
  const [pedomanTerpilih, setPedomanTerpilih] = useState(null);

  /* =======================================================
     SESSION SUPABASE
  ======================================================= */

  useEffect(() => {
    let aktif = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (aktif) {
          setSession(session);
        }
      } catch (error) {
        console.error("Gagal mengambil session:", error);
      } finally {
        if (aktif) {
          setLoadingSession(false);
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sessionBaru) => {
      if (aktif) {
        setSession(sessionBaru);
        setLoadingSession(false);
      }
    });

    return () => {
      aktif = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     AMBIL DATA STOK DARI DATABASE
  ======================================================= */

  useEffect(() => {
    let aktif = true;

    const ambilDataBahan = async () => {
      try {
        setLoadingBahan(true);
        setErrorBahan("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (aktif) setBahan([]);
          return;
        }

        const { data: stokData, error: stokError } = await supabase
          .from("stok")
          .select(`
            id,
            user_id,
            bahan_pangan_id,
            jumlah,
            satuan,
            tanggal_masuk,
            tanggal_kadaluarsa,
            status
          `)
          .eq("user_id", user.id)
          .order("tanggal_kadaluarsa", {
            ascending: true,
          });

        if (stokError) throw stokError;

        if (!stokData || stokData.length === 0) {
          if (aktif) setBahan([]);
          return;
        }

        const bahanIds = [
          ...new Set(
            stokData.map((item) => item.bahan_pangan_id).filter(Boolean)
          ),
        ];

        let ingredientsData = [];

        if (bahanIds.length > 0) {
          const { data, error: ingredientsError } = await supabase
            .from("ingredients_master")
            .select("id, name, image_path")
            .in("id", bahanIds);

          if (ingredientsError) throw ingredientsError;

          ingredientsData = data || [];
        }

        // Hanya tampilkan stok aktif. Tanggal juga diperiksa sebagai
        // pengaman jika proses Cron belum berjalan pada hari ini.
        const stokAktif = stokData.filter((stok) => {
          const selisihHari = hitungSelisihHari(stok.tanggal_kadaluarsa);
          const sudahKedaluwarsa =
            stok.status === "kedaluwarsa" ||
            (selisihHari !== null && selisihHari < 0);

          return !sudahKedaluwarsa;
        });

        const hasil = stokAktif.map((stok) => {
          const bahanMaster = ingredientsData.find(
            (item) => item.id === stok.bahan_pangan_id
          );

          return {
            id: stok.id,
            nama: bahanMaster?.name || "Bahan Tidak Diketahui",
            jumlah: formatJumlah(stok.jumlah, stok.satuan),
            tanggal: formatTanggal(stok.tanggal_kadaluarsa),
            image: getImageUrl(bahanMaster?.image_path),
            status: tentukanStatus(stok.tanggal_kadaluarsa),
            tanggalKadaluarsa: stok.tanggal_kadaluarsa,
            tanggalMasuk: stok.tanggal_masuk,
          };
        });

        if (aktif) setBahan(hasil);
      } catch (error) {
        console.error("Gagal mengambil data bahan:", error);

        if (aktif) {
          setErrorBahan(error?.message || "Gagal mengambil data stok.");
          setBahan([]);
        }
      } finally {
        if (aktif) setLoadingBahan(false);
      }
    };

    if (!loadingSession) {
      ambilDataBahan();
    }

    return () => {
      aktif = false;
    };
  }, [session, loadingSession]);

  /* =======================================================
     AMBIL RESEP TERSIMPAN MILIK USER LOGIN
  ======================================================= */

  useEffect(() => {
    let aktif = true;

    const ambilResepTersimpan = async () => {
      try {
        setLoadingResep(true);
        setErrorResep("");

        if (!session?.user?.id) {
          if (aktif) setResepTersimpan([]);
          return;
        }

        const { data, error } = await supabase
          .from("resep_tersimpan")
          .select(`
            id,
            user_id,
            nama_resep,
            deskripsi,
            waktu_memasak,
            porsi,
            bahan,
            langkah,
            nutrisi,
            tag,
            tips,
            created_at
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        if (aktif) {
          setResepTersimpan(data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil resep tersimpan:", error);

        if (aktif) {
          setErrorResep(error?.message || "Gagal memuat resep tersimpan.");
        }
      } finally {
        if (aktif) setLoadingResep(false);
      }
    };

    if (!loadingSession) {
      ambilResepTersimpan();
    }

    return () => {
      aktif = false;
    };
  }, [session, loadingSession]);

  /* =======================================================
     TANGGAL HARI INI
  ======================================================= */

  const tanggalHariIni = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());

  /* =======================================================
     NAVIGASI MENU
  ======================================================= */

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /* =======================================================
     STATISTIK STOK
  ======================================================= */

  const totalBahan = bahan.length;

  const jumlahAman = bahan.filter((item) => item.status === "Aman").length;

  const jumlahPerluDiolah = bahan.filter(
    (item) => item.status === "Perlu diolah"
  ).length;

  // Bahan kedaluwarsa sudah dikeluarkan dari data Dashboard.
  const jumlahKedaluwarsa = 0;

  const bahanPrioritas = bahan
    .filter((item) => item.status === "Perlu diolah")
    .slice(0, 3);

  const bahanRingkasan = bahan;

  /* =======================================================
     NAMA USER
  ======================================================= */

  const namaUser =
    session?.user?.user_metadata?.nama ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.user_metadata?.name ||
    session?.user?.email?.split("@")[0] ||
    "Pengguna";

  /* =======================================================
     BUKA DETAIL RESEP
  ======================================================= */

  const bukaDetailResep = (resep) => {
    navigate("/racik-resep/tersimpan", {
      state: { resep },
    });
  };

  /* =======================================================
     SLIDER RINGKASAN BAHAN KULKAS
  ======================================================= */

  const geserBahan = (arah) => {
    if (!sliderBahanRef.current) return;

    const lebarGeser = Math.max(
      260,
      Math.floor(sliderBahanRef.current.clientWidth * 0.8)
    );

    sliderBahanRef.current.scrollBy({
      left: arah === "kanan" ? lebarGeser : -lebarGeser,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#e6f4e8] via-[#f3f9f3] to-[#f8fbf8] font-jakarta text-[#202833]">
      {/* DEKORASI LATAR */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-40 h-80 w-80 rounded-full bg-green-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-[55%] h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-[0_4px_20px_rgba(35,101,45,0.06)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[64px] items-center justify-between gap-2 sm:min-h-[68px] lg:min-h-[72px]">
            {/* LOGO */}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex shrink-0 items-center gap-2.5 transition active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-green-100 bg-white shadow-sm">
                <img
                  src={logoDapurCerdas}
                  alt="Dapur Cerdas"
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div className="hidden text-left leading-none sm:block">
                <h1 className="text-base font-extrabold tracking-tight text-[#1c4a24] sm:text-lg">
                  Dapur Cerdas
                </h1>
                <p className="mt-1 text-[10px] font-medium text-slate-400 sm:text-[11px]">
                  Asisten Dapur Cerdas
                </p>
              </div>
            </button>

            {/* NAVIGASI DESKTOP */}

            <nav className="hidden items-center gap-1 rounded-2xl border border-green-100/80 bg-white/70 p-1 shadow-sm md:flex">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition lg:px-4 lg:text-sm ${
                      active
                        ? "bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] text-white shadow-md shadow-green-900/20"
                        : "text-slate-500 hover:bg-green-50 hover:text-[#176b26]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* BAGIAN KANAN */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate("/notifikasi")}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-green-100 bg-white text-slate-600 shadow-sm transition hover:bg-green-50 hover:text-[#176b26] active:scale-95"
                aria-label="Notifikasi"
              >
                <Bell size={19} />

                {jumlahPerluDiolah + jumlahKedaluwarsa > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1 text-[9px] font-extrabold text-white shadow-md ring-2 ring-white">
                    {jumlahPerluDiolah + jumlahKedaluwarsa}
                  </span>
                )}
              </button>

              {!session ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-3 py-2 text-[11px] font-bold text-white shadow-md shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-95 sm:px-4 sm:text-xs lg:text-sm"
                  >
                    Masuk
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="rounded-xl border border-[#23652d]/40 bg-white px-3 py-2 text-[11px] font-bold text-[#23652d] transition hover:bg-[#e8f7eb] active:scale-95 sm:px-4 sm:text-xs lg:text-sm"
                  >
                    Daftar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/profil")}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#d3ecd8] text-[#176324] shadow-sm ring-2 ring-white transition hover:shadow-md active:scale-95"
                  aria-label="Profil"
                >
                  <UserCircle size={22} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="relative mx-auto w-full max-w-[1500px] px-4 pb-28 pt-5 sm:px-5 sm:pt-6 md:pb-28 lg:px-7 lg:pb-10 lg:pt-7">
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#12471f] via-[#1b6b2d] to-[#2f9e4f] px-5 py-6 text-white shadow-[0_20px_50px_rgba(18,71,31,0.35)] sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          {/* dekorasi */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-sm" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-300/20 blur-2xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
          />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10">
            <div className="flex min-w-0 flex-1 flex-col justify-center lg:max-w-[43%]">
              <div className="mb-3 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold backdrop-blur-md sm:text-[11px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9df0ae]" />
                {tanggalHariIni}
              </div>

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Halo, {namaUser}!
              </h2>

              <p className="mt-3 max-w-md text-xs leading-relaxed text-white/85 sm:text-sm">
                Yuk, pilih bahan pangan bergizi untuk mendukung tumbuh kembang.
              </p>
            </div>

            {/* STATISTIK KONDISI STOK */}

            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-[57%]">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15 sm:p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Package size={18} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {loadingBahan ? "..." : totalBahan}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/80 sm:text-xs">
                  Total Bahan
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 text-[#23652d] shadow-xl shadow-black/10 transition hover:-translate-y-0.5 sm:p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e3f6e8]">
                  <Refrigerator size={18} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {loadingBahan ? "..." : jumlahAman}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-500 sm:text-xs">
                  Aman
                </p>
              </div>

              <div className="rounded-2xl border border-[#f8d35b]/40 bg-gradient-to-br from-[#f8d35b]/25 to-[#f79500]/20 p-4 backdrop-blur-md transition hover:from-[#f8d35b]/30 sm:p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8d35b]/25 text-[#f8d35b]">
                  <AlertTriangle size={18} />
                </div>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#ffe27a] sm:text-4xl">
                  {loadingBahan ? "..." : jumlahPerluDiolah + jumlahKedaluwarsa}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/90 sm:text-xs">
                  Perlu Diperhatikan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            KONDISI STOK SAAT INI
        =================================================== */}

        <section className="mt-5 rounded-3xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(35,101,45,0.08)] sm:mt-6 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff4cc] to-[#ffe49a] text-[#c98500] shadow-sm">
                <AlertTriangle size={20} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold tracking-tight sm:text-base">
                  Kondisi Stok Saat Ini
                </h3>

                {jumlahPerluDiolah > 0 ? (
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {jumlahPerluDiolah} bahan perlu diolah segera
                  </p>
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Semua bahan dalam kondisi aman
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/stok")}
              className="group flex items-center gap-1 self-start rounded-full bg-[#e8f7eb] px-3.5 py-2 text-xs font-bold text-[#1f7a35] transition hover:bg-[#d6f0db]"
            >
              Lihat Stok
              <ChevronRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loadingBahan ? (
              <p className="col-span-full text-xs text-slate-400">
                Memuat data bahan...
              </p>
            ) : errorBahan ? (
              <p className="col-span-full text-xs text-red-500">{errorBahan}</p>
            ) : bahanPrioritas.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-green-200 bg-[#f7faf7] px-4 py-5 text-center">
                <p className="text-xs font-bold text-green-600">
                  Semua bahan dalam kondisi baik.
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Tidak ada bahan yang mendekati kedaluwarsa.
                </p>
              </div>
            ) : (
              bahanPrioritas.map((item) => (
                <div
                  key={item.id}
                  className={`relative flex min-w-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border bg-white py-2.5 pl-4 pr-3 shadow-[0_4px_14px_rgba(32,40,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-md ${
                    item.status === "Kedaluwarsa"
                      ? "border-red-100"
                      : "border-orange-100"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1.5 ${
                      item.status === "Kedaluwarsa"
                        ? "bg-red-500"
                        : "bg-orange-400"
                    }`}
                  />

                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.nama}
                      className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm ring-2 ring-white sm:h-12 sm:w-12"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/200x200?text=No+Image";
                      }}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.nama}</p>
                      <p
                        className={`text-xs font-medium ${
                          item.status === "Kedaluwarsa"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      >
                        {getStatusLabel(item)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600 sm:text-[11px]">
                    {item.jumlah}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===================================================
            AI RECIPE
        =================================================== */}

        <section className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f3d1c] via-[#17582a] to-[#1f7a3a] p-6 shadow-[0_20px_44px_rgba(15,61,28,0.3)] sm:mt-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 rounded-full bg-[#f8d35b]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
          />

          <div className="relative z-10 max-w-2xl">
            <p className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Racik Resep
              <br />
              <span className="bg-gradient-to-r from-[#ffe27a] to-[#9df0ae] bg-clip-text text-transparent">
                dengan AI
              </span>
            </p>

            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">
              AI otomatis menyesuaikan stok kulkas dengan bahan yang tersedia.
            </p>

            <button
              type="button"
              onClick={() => navigate("/racik-resep")}
              className="group mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#f79500] to-[#ffb020] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 sm:text-sm"
            >
              <Sparkles size={16} />
              Buat Resep AI
            </button>
          </div>

          <div className="pointer-events-none absolute -right-4 -top-6 text-[110px] text-white/10 sm:text-[160px]">
            ♨
          </div>
        </section>

        {/* ===================================================
            PEDOMAN MENU MAKANAN
        =================================================== */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-[#f1e2cf] bg-gradient-to-br from-[#fffaf1] via-[#fff6e9] to-[#fff1df] p-4 shadow-[0_8px_28px_rgba(160,105,45,0.08)] sm:mt-7 sm:p-6">
          <div className="mb-4 flex items-start gap-3 sm:mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#23652d] to-[#39964b] text-white shadow-md">
              <CookingPot size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-extrabold tracking-tight text-[#202833] sm:text-lg">
                Menu Sehat Keluarga
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {getTanggalMenuHariIni()} · Pilih kategori sesuai kebutuhan keluarga.
              </p>
            </div>
            <span className="hidden rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-[#9a6a27] sm:inline-flex">
              Menu Harian
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {pedomanMenu.map((pedoman) => (
              <article
                key={pedoman.id}
                className="group overflow-hidden rounded-2xl border border-white/90 bg-white/90 shadow-[0_4px_14px_rgba(32,40,51,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(32,40,51,0.1)]"
              >
                <div className="relative h-40 overflow-hidden sm:h-36 lg:h-40">
                  <img
                    src={pedoman.gambar}
                    alt={`Inspirasi menu ${pedoman.judul}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "https://placehold.co/600x400?text=Menu+Sehat";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-extrabold ${pedoman.aksen}`}>
                    {pedoman.judul}
                  </span>
                </div>
                <div className="p-3.5 sm:p-4">
                  <p className="min-h-[36px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {pedoman.deskripsi}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPedomanTerpilih({ ...pedoman, menuHariIni: getMenuHariIni(pedoman.id) })}
                    className="group/link mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#23652d] transition hover:text-[#174b22]"
                  >
                    Lihat Menu
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
            Catatan: Rekomendasi menu harian berganti mengikuti tanggal perangkat dalam siklus 7 hari. Sesuaikan porsi, tekstur, alergi, serta kondisi kesehatan dengan anjuran tenaga kesehatan.
          </p>
        </section>

        {/* MODAL DETAIL PEDOMAN MENU */}
        {pedomanTerpilih && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPedomanTerpilih(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-pedoman-menu"
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#fbfdfb] shadow-2xl sm:rounded-3xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-green-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#39834a]">{pedomanTerpilih.label} · {namaHari[new Date().getDay()]}</p>
                  <h3 id="judul-pedoman-menu" className="mt-0.5 text-base font-extrabold text-[#202833] sm:text-lg">
                    Pedoman {pedomanTerpilih.judul}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPedomanTerpilih(null)}
                  aria-label="Tutup panduan"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <img
                  src={pedomanTerpilih.gambar}
                  alt={`Menu ${pedomanTerpilih.judul}`}
                  className="h-40 w-full rounded-2xl object-cover sm:h-52"
                />
                <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {pedomanTerpilih.pengantar}
                </p>

                <div className="mt-5">
                  <h4 className="text-sm font-extrabold text-[#202833]">Menu {getTanggalMenuHariIni()}</h4>
                  <div className="mt-3 space-y-3">
                    {pedomanTerpilih.menuHariIni.map((item, index) => (
                      <article key={`${pedomanTerpilih.id}-${item.waktu}`} className="rounded-2xl border border-green-100 bg-white p-3.5 sm:p-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] font-extrabold text-[#23652d]">{index + 1}</span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-[#39834a]">{item.waktu}</p>
                            <h5 className="text-xs font-extrabold text-[#202833] sm:text-sm">{item.nama}</h5>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                          <div className="rounded-xl bg-[#f5faf5] p-3">
                            <p className="font-bold text-[#23652d]">Bahan</p>
                            <p className="mt-1 leading-relaxed text-slate-600">{item.bahan}</p>
                          </div>
                          <div className="rounded-xl bg-[#fff9ed] p-3">
                            <p className="font-bold text-[#9a6a27]">Keterangan gizi</p>
                            <p className="mt-1 leading-relaxed text-slate-600">{item.manfaat}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <h4 className="text-sm font-extrabold text-[#80551d]">Tips Penting</h4>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#765e43]">
                    {pedomanTerpilih.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-[10px] leading-relaxed text-slate-500">
                  Menu ini merupakan referensi edukasi umum dalam siklus 7 hari, bukan pengganti konsultasi dokter, bidan, atau ahli gizi. Untuk alergi, penyakit tertentu, kehamilan berisiko, atau masalah pertumbuhan anak, konsultasikan menu dengan tenaga kesehatan.
                </p>
                <button
                  type="button"
                  onClick={() => setPedomanTerpilih(null)}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-4 py-3 text-xs font-extrabold text-white shadow-md transition hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  Tutup Panduan
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================
            RESEP TERSIMPAN
        =================================================== */}

        <section className="mt-5 rounded-3xl border border-white bg-white/90 p-4 shadow-[0_8px_28px_rgba(35,101,45,0.08)] sm:mt-6 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f6b2b] to-[#2f9e4f] text-white shadow-md shadow-green-900/20">
                <BookOpen size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-extrabold tracking-tight text-[#202833] sm:text-base">
                  Resep Tersimpan
                </h2>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                  Koleksi resep favoritmu
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/racik-resep/tersimpan")}
              className="group flex shrink-0 items-center gap-1 rounded-full bg-[#e8f7eb] px-3.5 py-2 text-xs font-bold text-[#1f7a35] transition hover:bg-[#d6f0db] sm:text-sm"
            >
              Lihat Semua
              <ChevronRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {!session ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-[#f7faf7] p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <ChefHat size={28} />
              </div>

              <p className="text-sm font-bold text-[#202833]">
                Masuk untuk menyimpan resep
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Simpan resep favorit dan temukan kembali kapan saja.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-4 rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-95"
              >
                Masuk
              </button>
            </div>
          ) : loadingResep ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-3 rounded-2xl border border-slate-100 p-3.5"
                >
                  <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                    <div className="h-2.5 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorResep ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-600">
                Resep belum dapat dimuat
              </p>
              <p className="mt-1 break-words text-xs text-red-500">
                {errorResep}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
              >
                Coba Lagi
              </button>
            </div>
          ) : resepTersimpan.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-green-200 bg-[#f7faf7] p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f6e8] text-[#23652d]">
                <ChefHat size={26} />
              </div>

              <p className="text-sm font-bold text-[#202833]">
                Belum ada resep tersimpan
              </p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                Buat resep menggunakan AI, lalu simpan resep favoritmu agar
                muncul di sini.
              </p>

              <button
                type="button"
                onClick={() => navigate("/racik-resep")}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-green-900/20 transition hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles size={15} />
                Buat Resep AI
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resepTersimpan.map((resep) => (
                <button
                  key={resep.id}
                  type="button"
                  onClick={() => bukaDetailResep(resep)}
                  className="group flex w-full items-center gap-3.5 rounded-2xl border border-[#e4eee6] bg-white p-3.5 text-left shadow-[0_4px_14px_rgba(32,40,51,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#bfe3c6] hover:shadow-[0_12px_28px_rgba(35,101,45,0.12)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff4dd] to-[#ffe4a8] text-[#c87800] shadow-sm transition group-hover:scale-105">
                    <ChefHat size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold tracking-tight text-[#202833]">
                      {resep.nama_resep}
                    </p>

                    {resep.deskripsi && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {resep.deskripsi}
                      </p>
                    )}

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[#23652d]">
                        <Clock size={11} />
                        {resep.waktu_memasak || 15} menit
                      </span>

                      <span className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-500">
                        {resep.porsi || 1} porsi
                      </span>
                    </div>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[#23652d] group-hover:text-white">
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ===================================================
            RINGKASAN STOK
        =================================================== */}

        <section className="mt-7 sm:mt-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9f6df] to-[#b9ecc4] text-[#1f7a35] shadow-sm">
                <ShoppingBasket size={20} />
              </div>

              <h2 className="truncate text-base font-extrabold tracking-tight sm:text-lg">
                Ringkasan Bahan Kulkas
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tambah-bahan")}
              className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-900/25 transition hover:-translate-y-0.5 active:scale-95 sm:text-sm"
            >
              <Plus size={16} />
              Tambah Bahan
            </button>
          </div>

          {loadingBahan ? (
            <p className="text-xs text-slate-400">Memuat bahan kulkas...</p>
          ) : errorBahan ? (
            <p className="text-xs text-red-500">{errorBahan}</p>
          ) : bahan.length === 0 ? (
            <p className="text-xs text-slate-400">
              Belum ada bahan di stok kulkas.
            </p>
          ) : bahanRingkasan.length === 0 ? (
            <p className="text-xs text-slate-400">
              Belum ada bahan aktif di stok kulkas.
            </p>
          ) : (
            <div className="relative">
              {/* Tombol geser kiri - tampil di tablet/desktop */}
              <button
                type="button"
                onClick={() => geserBahan("kiri")}
                aria-label="Geser bahan ke kiri"
                className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-green-100 bg-white text-[#1f7a35] shadow-lg transition hover:bg-green-50 active:scale-95 sm:flex"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Slider bahan: swipe di HP, tombol kiri/kanan di desktop */}
              <div
                ref={sliderBahanRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-0.5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {bahanRingkasan.map((item) => (
                  <div
                    key={item.id}
                    className="w-[78%] min-w-[78%] snap-start sm:w-[42%] sm:min-w-[42%] md:w-[31%] md:min-w-[31%] lg:w-[23.5%] lg:min-w-[23.5%] xl:w-[19%] xl:min-w-[19%]"
                  >
                    <BahanCard item={item} />
                  </div>
                ))}
              </div>

              {/* Tombol geser kanan - tampil di tablet/desktop */}
              <button
                type="button"
                onClick={() => geserBahan("kanan")}
                aria-label="Geser bahan ke kanan"
                className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-green-100 bg-white text-[#1f7a35] shadow-lg transition hover:bg-green-50 active:scale-95 sm:flex"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/stok")}
            className="group mt-5 flex w-full items-center justify-end gap-1 text-xs font-bold text-[#1f7a35]"
          >
            Lihat Semua {bahan.length} Bahan
            <ChevronRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </button>
        </section>

        {/* ===================================================
            TIPS
        =================================================== */}

        <section className="mt-6 flex items-start gap-3.5 rounded-3xl border border-[#f1db72]/70 bg-gradient-to-br from-[#fffbea] to-[#fff4c9] p-4 shadow-[0_8px_24px_rgba(245,164,0,0.1)] sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5a400] to-[#ffc233] text-white shadow-md shadow-amber-900/20">
            <Lightbulb size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-extrabold tracking-tight">
              Tips Hari Ini
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-[#765e43] sm:text-sm">
              Pastikan bahan pangan yang mendekati kedaluwarsa digunakan
              terlebih dahulu.
            </p>
          </div>
        </section>
      </main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/90 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_28px_rgba(35,101,45,0.12)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-xl items-end justify-around">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleMenuClick(item)}
                className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-bold transition sm:text-[10px] ${
                  active ? "text-[#216b2c]" : "text-slate-400"
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 h-1 w-8 rounded-full bg-gradient-to-r from-[#1f6b2b] to-[#2f9e4f]"
                  />
                )}
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* TOMBOL AI */}

          <button
            type="button"
            onClick={() => navigate("/racik-resep")}
            className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#f79500] to-[#ffb020] text-white shadow-[0_10px_24px_rgba(247,149,0,0.5)] ring-4 ring-white transition hover:scale-105 active:scale-95"
            aria-label="Resep AI"
          >
            <Sparkles size={23} />
          </button>
        </div>
      </nav>
    </div>
  );
}

/* =========================================================
   CARD BAHAN
========================================================= */

function BahanCard({ item }) {
  const isExpired = item.status === "Kedaluwarsa";
  const isNeedProcess = item.status === "Perlu diolah";

  return (
    <article className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-3xl border border-[#e4eee6] bg-white p-3.5 shadow-[0_4px_14px_rgba(32,40,51,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#cfe3d2] hover:shadow-[0_12px_28px_rgba(35,101,45,0.13)] sm:min-h-[196px] sm:p-4">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          isExpired
            ? "bg-red-500"
            : isNeedProcess
            ? "bg-orange-400"
            : "bg-[#35934a]"
        }`}
      />

      <h3 className="truncate text-sm font-extrabold leading-tight tracking-tight text-[#202833] sm:text-base">
        {item.nama}
      </h3>

      <div className="mt-3">
        <img
          src={item.image}
          alt={item.nama}
          className="h-14 w-14 rounded-2xl object-cover shadow-md ring-2 ring-white transition duration-300 group-hover:scale-105 sm:h-16 sm:w-16"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://placehold.co/200x200?text=No+Image";
          }}
        />
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
        <span className="font-bold text-[#23652d]">{item.jumlah}</span>
        <span className="mx-1.5 text-slate-300">•</span>
        {item.tanggal}
      </p>

      <p
        className={`mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold sm:text-xs ${
          isExpired
            ? "bg-red-50 text-red-500"
            : isNeedProcess
            ? "bg-orange-50 text-orange-500"
            : "bg-green-50 text-green-600"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isExpired
              ? "bg-red-500"
              : isNeedProcess
              ? "bg-orange-400"
              : "bg-green-500"
          }`}
        />
        {item.status}
      </p>
    </article>
  );
}

export default Dashboard;
