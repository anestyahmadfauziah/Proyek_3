# Design Direction: Dapur Cerdas

Dokumen ini merangkum arah desain yang telah diterapkan pada aplikasi **Dapur Cerdas**. Gunakan sebagai acuan saat menambah halaman, komponen, atau memperbarui tampilan agar pengalaman tetap konsisten.

## 1. Ringkasan Produk

Dapur Cerdas adalah aplikasi pendamping pangan keluarga. Pengguna dapat mencatat stok bahan, melihat bahan yang mendekati kedaluwarsa, meracik resep dari stok yang tersedia, menyimpan resep, serta memantau profil tumbuh kembang dan catatan nutrisi ibu atau anak.

### Pengguna utama

- Ibu dan keluarga yang mengelola bahan pangan di rumah.
- Pengguna yang membutuhkan bantuan menyusun menu bergizi dari stok yang tersedia.
- Pengguna yang ingin mencatat konteks kehamilan, kelahiran, pertumbuhan anak, dan asupan makanan keluarga.

### Prinsip pengalaman

1. **Menenangkan**: data kesehatan dan stok disajikan tanpa membuat pengguna merasa tertekan.
2. **Mudah dipindai**: status bahan, progres, dan tindakan berikutnya harus terlihat cepat.
3. **Hangat dan membumi**: visual merujuk pada dapur rumahan, pangan segar, dan perhatian keluarga.
4. **Berorientasi tindakan**: setiap halaman membantu pengguna mengambil langkah yang jelas, seperti menambah bahan, mengolah bahan prioritas, atau menyimpan catatan.

## 2. Design Read

Membaca produk ini sebagai aplikasi pengelolaan pangan dan nutrisi keluarga untuk pengguna Indonesia, dengan bahasa visual segar, hangat, dan tepercaya.

**Dial desain:** ENERGY 2 / RHYTHM 2 / MOTION 1.

- **ENERGY 2**: aksen hijau dan oranye memberi rasa hidup, tetapi data tetap menjadi fokus utama.
- **RHYTHM 2**: komposisi berganti antara hero informatif, kartu ringkasan, daftar data, formulir, dan keadaan kosong agar halaman tidak monoton.
- **MOTION 1**: gunakan transisi singkat untuk hover, fokus, pemilihan, dan umpan balik. Hindari animasi dekoratif yang mengganggu pembacaan data.

## 3. Identitas Visual

### Karakter

- Segar dan sehat
- Hangat dan suportif
- Terstruktur serta dapat dipercaya
- Ramah untuk penggunaan harian

### Motif utama

**Hijau pangan segar** adalah motif visual utama. Hijau tua dipakai untuk area fokus dan aksi utama, hijau muda dipakai untuk permukaan pendukung, sedangkan oranye atau kuning hanya dipakai untuk perhatian, resep, dan informasi yang perlu segera ditindaklanjuti.

### Penggunaan gradien

Gradien hijau tua dipakai pada hero atau panel ringkasan utama untuk membedakan konteks penting dari permukaan data putih. Gradien oranye dipakai terbatas untuk ajakan membuat resep atau aksi yang bersifat hangat dan aktif. Gradien tidak digunakan sebagai latar seluruh halaman tanpa alasan hierarki.

## 4. Sistem Warna

| Peran | Nilai utama | Penggunaan |
| --- | --- | --- |
| Hijau utama | `#176B2C` | Tombol utama, judul merek, ikon utama, teks aksi |
| Hijau dalam | `#0F3D1E`, `#12471F` | Hero, header data penting, kontras tinggi |
| Hijau sekunder | `#23652D`, `#2F9E4F`, `#35934A` | Status aktif, gradien, progres, hover |
| Latar hijau lembut | `#F2F9F2`, `#EEF5EF`, `#E6F4E8` | Latar halaman dan permukaan pendukung |
| Permukaan | `#FFFFFF`, `#FBFDFB` | Kartu, formulir, tabel, modal |
| Teks utama | `#202833`, `#16241A`, `#29313A` | Judul dan data penting |
| Teks sekunder | `#3A5A42`, `#68747D`, `#6D757D` | Deskripsi dan informasi pendukung |
| Aksen hangat | `#F79500`, `#FFB020`, `#F5A400` | Aksi resep, tips, sorotan hangat |
| Peringatan | `#F5A524`, `#A46A00` | Bahan yang perlu segera diolah |
| Bahaya | `#E5484D`, `#C43B3B` | Kedaluwarsa, hapus data, galat penting |
| Informasi | `#4775C7` | Notifikasi informatif yang netral |

### Aturan warna

- Gunakan hijau sebagai warna identitas dan aksi utama.
- Gunakan oranye atau kuning hanya untuk fokus yang membutuhkan perhatian positif, terutama resep dan tips.
- Gunakan merah hanya untuk kondisi berisiko, data kedaluwarsa, galat, atau tindakan destruktif.
- Status tidak boleh dibedakan oleh warna saja. Sertakan teks, ikon, atau label status.
- Pertahankan kontras teks minimum WCAG AA: 4.5:1 untuk teks normal dan 3:1 untuk teks besar.

## 5. Tipografi

| Peran | Font | Bobot dan karakter |
| --- | --- | --- |
| Font antarmuka utama | Plus Jakarta Sans | 400 sampai 800. Dipakai pada dashboard, stok, profil, resep, dan teks data. Karakternya bersih serta mudah dipindai. |
| Font formulir dan autentikasi | Poppins | 400 sampai 800. Dipakai pada layar masuk dan daftar untuk memberi nuansa ramah serta jelas pada formulir. |
| Font editorial cadangan | Playfair Display | Tersedia di proyek, tetapi belum menjadi gaya utama antarmuka. Gunakan hanya jika suatu konten editorial benar-benar membutuhkan penekanan yang lebih personal. |

### Skala teks

- Judul halaman: `20px` sampai `24px`, tebal.
- Judul hero: `24px` sampai `42px`, sangat tebal, dengan `tracking-tight`.
- Judul kartu dan bagian: `14px` sampai `18px`, tebal atau sangat tebal.
- Isi utama: `14px` sampai `16px`, line-height lega.
- Metadata dan label pendukung: `10px` sampai `12px`, gunakan dengan warna sekunder yang tetap terbaca.
- Angka metrik: `30px` sampai `48px`, tebal, gunakan angka tabular bila membandingkan nilai.

Jangan menggunakan huruf kapital berjarak lebar sebagai gaya dekoratif. Gunakan kapital hanya ketika membantu label data.

## 6. Tata Letak dan Responsivitas

### Lebar konten

- Dashboard memakai lebar maksimum sekitar `1500px` agar ringkasan data tetap luas di desktop.
- Halaman detail, seperti stok dan profil, memakai kontainer lebih sempit sekitar `max-w-5xl` untuk menjaga fokus.
- Halaman autentikasi dibatasi sekitar `500px`.
- Alur tambah bahan dibatasi sekitar `460px` agar terasa seperti langkah input yang fokus.

### Breakpoint

- Basis mobile: mulai dari lebar minimum `320px`.
- `sm`: menambah ruang horizontal, ukuran teks, dan grid sederhana.
- `md`: navigasi desktop dapat muncul, navigasi bawah mobile disembunyikan.
- `lg`: hero dapat berubah menjadi dua kolom dan jumlah kartu bertambah.

### Navigasi

- **Desktop**: gunakan header lengket dengan logo, menu utama, notifikasi, dan akses akun.
- **Mobile**: gunakan bottom navigation untuk Beranda, Stok Kulkas, Nutrisi, dan Si Kecil. Aksi Racik Resep ditempatkan sebagai tombol pusat yang menonjol.
- Semua item navigasi harus menuju rute yang benar-benar tersedia.
- Area tekan tombol dan kontrol penting harus nyaman disentuh, dengan target minimum `44px` bila memungkinkan.

### Ritme ruang

- Padding halaman mobile: sekitar `16px`.
- Padding halaman tablet hingga desktop: `24px` sampai `32px`.
- Jarak antarbagian utama: `20px` sampai `32px`.
- Jarak dalam kartu: `14px` sampai `24px` sesuai kepadatan informasi.
- Gunakan ruang kosong untuk memisahkan kelompok data, bukan sekadar mengisi ruang.

## 7. Bentuk, Elevasi, dan Permukaan

### Radius

| Elemen | Radius yang disarankan |
| --- | --- |
| Hero dan panel utama | `28px` |
| Kartu konten | `16px` sampai `24px` |
| Input dan tombol umum | `12px` sampai `18px` |
| Chip status dan filter | `9999px` |
| Avatar dan tombol ikon tertentu | Lingkaran penuh |

Radius besar membuat antarmuka terasa ramah dan aman, tetapi jangan mengubah seluruh elemen menjadi pil. Gunakan bentuk pil hanya untuk status, filter, metadata ringkas, atau tombol kecil yang memang bersifat ringkas.

### Elevasi

- Kartu biasa memakai border hijau abu yang lembut dan bayangan kecil.
- Hero memakai bayangan lebih dalam untuk menjadi titik fokus layar.
- Modal memakai bayangan kuat serta overlay gelap untuk memisahkan konteks pengeditan dari halaman di bawahnya.
- Jangan memberi bayangan besar pada semua komponen. Bayangan harus menandakan hierarki atau lapisan interaksi.

## 8. Komponen Inti

### Header

- Latar putih semi-transparan dengan border tipis dan blur ringan.
- Logo Dapur Cerdas menjadi titik pengenal utama.
- Tombol ikon menggunakan bidang putih atau hijau muda, sudut membulat, dan label `aria-label` bila tidak memiliki teks.

### Hero

- Gunakan hijau dalam dengan gradien terarah.
- Satu fokus utama per layar, misalnya sapaan pengguna, ringkasan stok, atau ringkasan perkembangan.
- Dekorasi latar berupa bentuk hijau atau putih beropasitas rendah, hanya untuk memberi kedalaman tanpa mengurangi keterbacaan.
- Pada hero data, tampilkan metrik aktual dari aplikasi. Jangan memasukkan angka pemasaran atau statistik yang tidak bersumber.

### Kartu informasi

- Latar putih atau gradasi hijau sangat lembut.
- Gunakan ikon yang relevan dengan isi, seperti kulkas untuk stok, bayi untuk profil anak, dan kalender untuk data tanggal.
- Variasikan kartu menurut peran konten: metrik, daftar, tindakan, peringatan, atau keadaan kosong. Jangan memaksa semua informasi menjadi kartu yang identik.

### Tombol

| Jenis | Tampilan | Penggunaan |
| --- | --- | --- |
| Primer | Hijau tua atau gradien hijau, teks putih | Simpan, masuk, tambah bahan, tindakan utama halaman |
| Sekunder | Putih atau hijau muda, border atau teks hijau | Kembali, lihat detail, tindakan pendamping |
| Hangat | Gradien oranye, teks putih | Racik resep dan aksi resep utama |
| Destruktif | Putih dengan border atau teks merah | Keluar, hapus, tindakan berisiko |
| Ikon | Kotak atau lingkaran dengan ikon relevan | Kembali, notifikasi, profil, tutup modal |

Label tombol harus menyatakan tindakan, misalnya `Tambah Bahan`, `Buat Resep AI`, `Simpan Pengukuran`, atau `Lihat Stok`. Hindari label umum yang tidak menjelaskan hasil tindakan.

### Input dan formulir

- Gunakan latar hijau sangat muda atau putih, teks gelap, dan label yang selalu terlihat.
- Tinggi input utama sekitar `52px` atau lebih agar nyaman di perangkat sentuh.
- Fokus input menggunakan border hijau dan ring hijau transparan.
- Tampilkan pesan galat di dekat konteks data yang gagal divalidasi.
- Modal formulir tampil dari bawah pada mobile dan terpusat pada layar lebih besar.

### Chip, filter, dan status

- Filter kategori dapat berbentuk chip horizontal yang bisa digeser atau membungkus baris sesuai ruang.
- Status harus singkat dan konsisten: `Aman`, `Perlu diolah`, atau `Kedaluwarsa`.
- `Aman` memakai hijau, `Perlu diolah` memakai kuning atau oranye, `Kedaluwarsa` memakai merah.
- Teks status harus tetap tampil walau warna tidak terlihat.

### Keadaan data

Setiap tampilan data perlu memiliki tiga keadaan:

1. **Memuat**: spinner atau indikator pemuatan yang jelas.
2. **Kosong**: jelaskan bahwa belum ada data dan, bila tersedia, sediakan tindakan yang relevan.
3. **Galat**: tampilkan pesan yang dapat dipahami dan opsi mencoba lagi bila tindakan tersebut tersedia.

## 9. Ikon dan Citra

- Gunakan ikon garis dari `lucide-react` dengan ukuran yang konsisten, umumnya `16px` sampai `22px`.
- Ikon harus menjelaskan fungsinya. Contoh: `Refrigerator` untuk stok, `Bell` untuk notifikasi, `CalendarDays` untuk tanggal, dan `Trash2` untuk hapus.
- Ikon `Sparkles` hanya digunakan pada fitur resep berbantuan AI, bukan sebagai dekorasi generik pada setiap kartu.
- Foto bahan berasal dari aset lokal di `public/image/ingredients/` atau nilai `image_path` dari data. Gambar berfungsi membantu pengguna mengenali bahan, bukan sebagai dekorasi acak.
- Jangan membuat foto profil, testimoni, atau ilustrasi orang sebagai konten final tanpa sumber yang jelas.

## 10. Pola Interaksi dan Motion

### Interaksi yang digunakan

- Hover ringan pada kartu dan tombol desktop, termasuk perubahan bayangan atau pergeseran kecil ke atas.
- `active:scale` singkat pada tombol untuk memberi respons tekan.
- Transisi warna pada hover, fokus, filter aktif, dan perubahan status.
- Indikator pemuatan berputar untuk data yang sedang diambil.

### Batasan motion

- Durasi transisi pendek, umumnya sekitar 200ms.
- Motion harus memberi umpan balik, bukan menjadi hiasan yang bersaing dengan data.
- Jangan menambahkan parallax, animasi loop besar, atau rangkaian animasi masuk pada seluruh elemen.
- Hormati preferensi pengurangan gerak pengguna bila animasi baru ditambahkan.

## 11. Arsitektur Halaman

| Rute | Peran halaman | Pola desain |
| --- | --- | --- |
| `/splash` | Pengantar produk | Logo, nilai utama, kartu fitur, masuk dan daftar |
| `/login`, `/register` | Autentikasi | Kartu formulir terpusat dengan latar hijau lembut |
| `/`, `/dashboard` | Ringkasan harian | Header, hero stok, kondisi prioritas, resep, stok, tips, navigasi mobile |
| `/stok` | Manajemen persediaan | Header kembali, pencarian, filter kategori, daftar bahan menurut prioritas |
| `/tambah-bahan` | Penambahan stok | Alur input fokus dan ringkas dalam lebar mobile-first |
| `/racik-resep` | Pembuatan resep | Pemilihan bahan, target resep, jumlah porsi, hasil resep, simpan resep |
| `/racik-resep/tersimpan` | Koleksi resep | Daftar dan detail resep yang telah disimpan |
| `/nutrisi` | Pemantauan asupan | Ringkasan nutrisi, tab rentang waktu, progres, catatan makanan |
| `/si-kecil` | 1000 HPK dan pertumbuhan | Profil ibu, kehamilan, anak, riwayat ukuran, modal input |
| `/notifikasi` | Aktivitas stok | Daftar stok baru, pengingat, dan bahan kedaluwarsa |
| `/profil` | Akun pengguna | Ringkasan profil, aksi akun, keluar |

## 12. Suara Konten

- Gunakan bahasa Indonesia yang ramah, singkat, dan mendukung.
- Utamakan instruksi praktis: `Pilih setidaknya satu bahan dari stok kulkas`, `Simpan profil ibu terlebih dahulu`, atau `Bahan ini akan kedaluwarsa besok`.
- Hindari jargon, janji kesehatan yang tidak didukung sumber, statistik promosi, dan nada yang menghakimi.
- Untuk data kesehatan atau nutrisi, jelaskan konteks dan batasannya jika diperlukan. Tampilan tidak boleh menyiratkan diagnosis medis.
- Gunakan istilah yang sudah ada secara konsisten: `stok kulkas`, `bahan`, `resep`, `kedaluwarsa`, `nutrisi`, `profil ibu`, dan `profil anak`.

## 13. Aksesibilitas

- Semua kontrol interaktif harus dapat dicapai dengan keyboard dan memiliki fokus yang terlihat.
- Tombol ikon wajib memiliki `aria-label` bila teksnya tidak terlihat.
- Gambar bahan memakai `alt` berdasarkan nama bahan.
- Gunakan elemen semantik, label formulir, dan struktur judul berurutan.
- Jangan hanya mengandalkan placeholder sebagai label input.
- Pastikan teks tidak terpotong, kartu tidak melampaui layar, dan navigasi bawah tidak menutupi konten pada mobile.
- Modal perlu dapat ditutup dengan tombol yang jelas, klik overlay bila sesuai, dan idealnya tombol Escape.

## 14. Keputusan Desain dan Alasannya

| Keputusan | Alasan |
| --- | --- |
| Hijau menjadi warna utama | Menghubungkan aplikasi dengan bahan segar, nutrisi, dan rasa aman untuk keluarga. |
| Oranye menjadi aksen terbatas | Menarik perhatian pada resep, tips, dan tindakan yang membutuhkan energi tanpa mengalahkan hijau sebagai identitas. |
| Plus Jakarta Sans sebagai font utama | Bentuk hurufnya bersih dan tetap mudah dibaca pada kartu data, daftar, serta layar mobile. |
| Hero hijau gelap | Membuat ringkasan paling penting terpisah jelas dari data operasional di bawahnya. |
| Kartu putih pada latar hijau lembut | Memberi area baca yang bersih sambil mempertahankan nuansa segar. |
| Radius besar pada panel utama | Menyampaikan karakter ramah dan lembut yang sesuai untuk aplikasi keluarga. |
| Bayangan ringan pada kartu | Memisahkan kelompok informasi tanpa membuat seluruh antarmuka terasa melayang. |
| Foto bahan pada stok | Mempercepat pengenalan bahan saat pengguna memindai daftar persediaan. |
| Navigasi bawah khusus mobile | Menempatkan tujuan utama dalam jangkauan ibu jari pada penggunaan sehari-hari. |
| Tombol resep beraksen oranye | Menandai pembuatan resep sebagai aksi produktif utama yang berbeda dari manajemen stok. |
| Motion minimal | Memberi respons interaksi tanpa mengganggu pembacaan data kesehatan dan rumah tangga. |

## 15. Panduan Saat Menambah UI

### Lakukan

- Mulai dari kebutuhan pengguna dan data nyata yang akan ditampilkan.
- Pakai token warna, tipografi, radius, dan pola tombol dari dokumen ini.
- Tambahkan keadaan memuat, kosong, dan galat pada tampilan berbasis data.
- Buat tindakan dapat bekerja sepenuhnya, termasuk validasi, feedback, dan navigasi tujuan.
- Uji layar kecil terlebih dahulu, lalu perluas komposisi untuk tablet dan desktop.

### Hindari

- Menambahkan statistik, testimoni, profil pengguna, atau klaim kesehatan tanpa sumber nyata.
- Menggunakan gradien, glow, badge, atau ikon hanya sebagai hiasan.
- Menjadikan semua konten berupa kartu identik dalam grid.
- Menambah tombol atau item navigasi tanpa tujuan yang berfungsi.
- Menggunakan teks abu muda pada latar terang hingga sulit dibaca.
- Mengubah aksi berisiko menjadi warna hijau. Hapus dan keluar harus tetap mudah dikenali sebagai tindakan berbeda.

## 16. Referensi Implementasi Saat Ini

- Konfigurasi font dan dasar halaman: `src/index.css`
- Rute aplikasi: `src/App.jsx`
- Dashboard dan navigasi responsif: `src/pages/Dashboard.jsx`
- Stok dan status bahan: `src/pages/Stok.jsx`
- Alur resep: `src/pages/RacikResepAI.jsx`
- Nutrisi dan profil keluarga: `src/pages/Nutrisi.jsx`, `src/pages/SiKecil.jsx`
- Autentikasi: `src/pages/Auth.jsx`
- Komponen dasar splash: `src/components/TombolUtama.jsx`, `src/components/KartuFitur.jsx`

Dokumen ini mencatat arah visual dari implementasi yang ada. Jika identitas merek, target pengguna, atau kebutuhan produk berubah, perbarui dokumen ini terlebih dahulu sebelum melakukan perubahan UI besar.
