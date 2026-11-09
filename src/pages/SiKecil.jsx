
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Baby,
  CalendarDays,
  Heart,
  LoaderCircle,
  Plus,
  Ruler,
  Bell,
  UserCircle,
  RefreshCw,
  Scale,
  Save,
  UserRound,
  X,
  ClipboardList,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const initialIbu = { nama_ibu: "" };
const initialHamil = { hpht: "", hpl: "", catatan: "" };
const initialLahir = {
  nama: "",
  tanggal_persalinan: today(),
  jenis_kelamin: "",
  berat_lahir_kg: "",
  panjang_lahir_cm: "",
};
const initialGrowth = {
  tanggal_pengukuran: today(),
  berat_kg: "",
  panjang_tinggi_cm: "",
  lingkar_kepala_cm: "",
  catatan: "",
};

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-[#d9e6dc] bg-[#fbfdfb] px-4 py-3 text-sm text-[#16241a] outline-none transition placeholder:text-slate-400 focus:border-[#2fa356] focus:bg-white focus:ring-4 focus:ring-[#2fa356]/15";
const labelClass = "block text-sm font-semibold text-[#2c4a34]";

function Field({ label, children, hint }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0b2412]/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-[0_40px_80px_-20px_rgba(11,36,18,0.55)] ring-1 ring-[#14301b]/5 sm:rounded-[28px] sm:p-8"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-[#0f3d1e]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef5ef] text-[#3a5a42] transition hover:bg-[#e0ece3]">
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#e8efe9] bg-gradient-to-b from-white to-[#f6faf7] p-4">
      <div className="flex items-center gap-2 text-[#176b26]">
        {icon}
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[#16241a]">{value || "Belum diisi"}</p>
    </div>
  );
}

function formatTanggal(value) {
  if (!value) return "Belum diisi";
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function angkaPositif(value) {
  return value === "" || (Number.isFinite(Number(value)) && Number(value) > 0);
}

function hitungHari(start, end = today()) {
  if (!start) return null;
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(a.getTime()) || b < a) return null;
  return Math.floor((b - a) / 86400000);
}

function hitungHPL(hpht) {
  if (!hpht) return "";
  const d = new Date(`${hpht}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 280);
  return d.toISOString().slice(0, 10);
}

function usiaAnak(tanggal) {
  const hari = hitungHari(tanggal);
  if (hari === null) return "Belum diketahui";
  const bulan = Math.floor(hari / 30.4375);
  const tahun = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  if (tahun && sisa) return `${tahun} tahun ${sisa} bulan`;
  if (tahun) return `${tahun} tahun`;
  return `${bulan} bulan`;
}

function KartuAnalisisWHO({ hasil, loading, error }) {
  if (loading) {
    return (
      <p className="mt-3 text-xs text-slate-500">
        Menghitung standar pertumbuhan WHO...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
        Analisis WHO belum tersedia: {error}.
      </p>
    );
  }

  if (!hasil) {
    return (
      <p className="mt-3 text-xs text-slate-500">
        Belum ada hasil analisis WHO.
      </p>
    );
  }

  const indikator = [
    {
      nama: "BB/U",
      data: hasil.bbu,
      keterangan: "Berat badan sesuai dengan usia anak.",
      keteranganPeringatan: "Berat badan perlu diperhatikan untuk usia anak.",
    },
    {
      nama: "TB/U",
      data: hasil.pbu_tbu,
      keterangan: "Tinggi badan sesuai dengan usia anak.",
      keteranganPeringatan: "Tinggi badan perlu diperhatikan untuk usia anak.",
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      {indikator.map(({ nama, data, keterangan, keteranganPeringatan }) => {
        if (!data) return null;

        const kategori = String(data.kategori || "").toLowerCase();
        const normal = kategori.includes("normal");

        return (
          <div
            key={nama}
            className={`rounded-xl border p-3 ${
              normal
                ? "border-[#a7f3c0] bg-[#dcfce7]"
                : "border-[#ffdf75] bg-[#fef3c7]"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm font-bold ${
                normal ? "text-[#15803d]" : "text-[#d97706]"
              }`}
            >
              {normal ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-current">
                  ✓
                </span>
              ) : (
                <span className="text-sm">⚠</span>
              )}

              <span>
                {nama}: {data.kategori || "Belum dapat dinilai"}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#647b68]">
              {normal ? keterangan : keteranganPeringatan}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function KurvaPertumbuhanWHO({ records, hasilAnalisis, child }) {
  const [indikator, setIndikator] = useState("bbu");

  const konfigurasi = {
    bbu: {
      label: "Berat badan menurut umur",
      nama: "BB/U",
    },
    pbu_tbu: {
      label: "Panjang/tinggi badan menurut umur",
      nama: "PB/U atau TB/U",
    },
  };

  const data = records
    .map((record) => {
      const usiaHari = hitungHari(child?.tanggal_lahir, record.tanggal_pengukuran);
      const usiaBulan = usiaHari == null ? null : usiaHari / 30.4375;
      const analisis = hasilAnalisis[record.id]?.data;
      const indikatorData = analisis?.[indikator];
      const zScore = indikatorData?.z_score;

      return {
        id: record.id,
        usiaBulan,
        zScore: zScore == null ? null : Number(zScore),
        tanggal: record.tanggal_pengukuran,
      };
    })
    .filter(
      (item) =>
        item.usiaBulan != null &&
        item.usiaBulan >= 0 &&
        item.usiaBulan <= 36 &&
        Number.isFinite(item.zScore)
    )
    .sort((a, b) => a.usiaBulan - b.usiaBulan);

  const width = 720;
  const height = 310;
  const left = 58;
  const right = 12;
  const top = 18;
  const bottom = 58;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const minZ = -3.5;
  const maxZ = 3;

  const x = (month) => left + (month / 36) * plotWidth;
  const y = (z) => top + ((maxZ - z) / (maxZ - minZ)) * plotHeight;
  const ticksY = [-3, -2, -1, 0, 1, 2, 3];
  const ticksX = [6, 12, 18, 24, 30, 36];
  const garisAnak = data
    .map((item) => `${x(item.usiaBulan)},${y(item.zScore)}`)
    .join(" ");

  return (
    <section className="mt-5 rounded-[22px] border border-[#d5e5d9] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-bold text-[#193d24]">Kurva pertumbuhan WHO</h4>
          <p className="mt-1 text-xs text-slate-500">
            {konfigurasi[indikator].label}
          </p>
        </div>
        <div className="flex rounded-full border border-[#d5e5d9] bg-[#f7faf7] p-1">
          {Object.entries(konfigurasi).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setIndikator(key)}
              aria-pressed={indikator === key}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                indikator === key
                  ? "bg-[#0f3d1e] text-white shadow-sm"
                  : "text-[#53675a] hover:bg-white"
              }`}
            >
              {item.nama}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Kurva ${konfigurasi[indikator].nama} berdasarkan Z-score WHO`}
          className="h-auto w-full"
        >
          {ticksY.map((tick) => (
            <g key={tick}>
              <line
                x1={left}
                x2={width - right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="#e8eee9"
                strokeWidth="1"
              />
              <text
                x={left - 12}
                y={y(tick) + 4}
                textAnchor="end"
                fontSize="12"
                fill="#7a8580"
              >
                {tick}
              </text>
            </g>
          ))}

          {ticksX.map((tick) => (
            <g key={tick}>
              <line
                x1={x(tick)}
                x2={x(tick)}
                y1={top}
                y2={height - bottom}
                stroke="#b9c5bd"
                strokeDasharray="5 6"
                strokeWidth="1"
              />
              <text
                x={x(tick)}
                y={height - bottom + 22}
                textAnchor="middle"
                fontSize="12"
                fill="#7a8580"
              >
                {tick} bln
              </text>
            </g>
          ))}

          <line
            x1={left}
            x2={width - right}
            y1={y(0)}
            y2={y(0)}
            stroke="#ed9b13"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={left}
            x2={width - right}
            y1={y(-2)}
            y2={y(-2)}
            stroke="#c34b4b"
            strokeWidth="2.5"
            strokeDasharray="9 7"
          />

          {data.length > 1 && (
            <polyline
              points={garisAnak}
              fill="none"
              stroke="#0f3d1e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {data.map((item, index) => {
            const isLatest = index === data.length - 1;
            const markerX = x(item.usiaBulan);
            const markerY = y(item.zScore);

            return (
              <g key={item.id}>
                {isLatest ? (
                  <g transform={`translate(${markerX - 13}, ${markerY - 29})`}>
                    {/* Latar putih membuat ikon anak tetap terbaca di atas garis grafik. */}
                    <circle cx="13" cy="15" r="15" fill="white" stroke="#0f3d1e" strokeWidth="1.5" />
                    {/* Ikon anak sederhana: kepala, telinga, badan, tangan, dan kaki. */}
                    <circle cx="13" cy="8" r="4.2" fill="#0f3d1e" />
                    <path
                      d="M7.5 21.5c.2-4.2 2.2-6.8 5.5-6.8s5.3 2.6 5.5 6.8M8.5 17.5l-3 3M17.5 17.5l3 3M10.5 21.5l-1.2 3M15.5 21.5l1.2 3"
                      fill="none"
                      stroke="#0f3d1e"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <title>
                      Pengukuran terbaru · {formatTanggal(item.tanggal)} · Z-score {item.zScore.toFixed(2)} SD
                    </title>
                  </g>
                ) : (
                  <circle
                    cx={markerX}
                    cy={markerY}
                    r="6"
                    fill="#0f3d1e"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <title>
                      {formatTanggal(item.tanggal)} · Z-score {item.zScore.toFixed(2)} SD
                    </title>
                  </circle>
                )}
              </g>
            );
          })}

          <text
            x={left}
            y={height - 10}
            fontSize="11"
            fill="#7a8580"
          >
            Usia anak
          </text>
          <text
            x="15"
            y={top + plotHeight / 2}
            fontSize="11"
            fill="#7a8580"
            textAnchor="middle"
            transform={`rotate(-90 15 ${top + plotHeight / 2})`}
          >
            Z-score (SD)
          </text>
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <svg viewBox="0 0 26 30" className="h-5 w-5" aria-hidden="true">
            <circle cx="13" cy="8" r="4" fill="#0f3d1e" />
            <path d="M7.5 23c.2-4.2 2.2-6.8 5.5-6.8s5.3 2.6 5.5 6.8M8.5 19l-3 3m12-3 3 3m-10 1-1.2 3m5.2-3 1.2 3" fill="none" stroke="#0f3d1e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {child?.nama || "Anak"}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-[3px] w-5 rounded bg-[#ed9b13]" />
          Median WHO (0 SD)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed border-[#c34b4b]" />
          −2 SD
        </span>
      </div>

      {data.length === 0 ? (
        <p className="mt-4 rounded-xl bg-[#f5f9f5] p-3 text-xs leading-5 text-slate-500">
          Titik kurva akan muncul setelah analisis WHO {konfigurasi[indikator].nama} tersedia untuk pengukuran anak.
        </p>
      ) : (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Ikon anak menunjukkan pengukuran terbaru, sedangkan titik hijau kecil
          menunjukkan pengukuran sebelumnya. Garis median dan −2 SD menunjukkan
          batas Z-score WHO. Grafik memakai hasil analisis backend.
        </p>
      )}
    </section>
  );
}

export default function SiKecil() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ibu, setIbu] = useState(null);
  const [kehamilan, setKehamilan] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [anak, setAnak] = useState([]);
  const [selectedAnakId, setSelectedAnakId] = useState("");
  const [pengukuran, setPengukuran] = useState([]);
  const [hasilAnalisis, setHasilAnalisis] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalIbu, setModalIbu] = useState(false);
  const [modalHamil, setModalHamil] = useState(false);
  const [modalLahir, setModalLahir] = useState(false);
  const [modalGrowth, setModalGrowth] = useState(false);

  const [formIbu, setFormIbu] = useState(initialIbu);
  const [formHamil, setFormHamil] = useState(initialHamil);
  const [formLahir, setFormLahir] = useState(initialLahir);
  const [formGrowth, setFormGrowth] = useState(initialGrowth);

  const selectedPregnancy =
    kehamilan.find((p) => p.id === selectedId) || null;
  const selectedChild = anak.find((a) => a.id === selectedAnakId) || null;

  const reload = useCallback(async (preferredPregnancyId, preferredChildId) => {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;

      const currentUser = authData.user;
      setUser(currentUser);

      if (!currentUser) {
        setIbu(null);
        setKehamilan([]);
        setAnak([]);
        setPengukuran([]);
        return;
      }

      const { data: ibuRows, error: ibuError } = await supabase
        .from("maternal_profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: true });

      if (ibuError) throw ibuError;

      const currentMother = ibuRows?.[0] || null;
      setIbu(currentMother);
      setFormIbu({ nama_ibu: currentMother?.nama_ibu || "" });

      let pregnancies = [];
      if (currentMother) {
        const { data, error: pregnancyError } = await supabase
          .from("pregnancies")
          .select("*")
          .eq("mother_id", currentMother.id)
          .order("created_at", { ascending: false });

        if (pregnancyError) throw pregnancyError;
        pregnancies = data || [];
      }
      setKehamilan(pregnancies);

      const nextPregnancyId =
        preferredPregnancyId && pregnancies.some((p) => p.id === preferredPregnancyId)
          ? preferredPregnancyId
          : selectedId && pregnancies.some((p) => p.id === selectedId)
            ? selectedId
            : pregnancies[0]?.id || "";
      setSelectedId(nextPregnancyId);

      const { data: children, error: childError } = await supabase
        .from("children_profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: true });

      if (childError) throw childError;

      const childRows = children || [];
      setAnak(childRows);

      const nextChildId =
        preferredChildId && childRows.some((c) => c.id === preferredChildId)
          ? preferredChildId
          : selectedAnakId && childRows.some((c) => c.id === selectedAnakId)
            ? selectedAnakId
            : childRows[0]?.id || "";
      setSelectedAnakId(nextChildId);

      if (nextChildId) {
        const { data: records, error: growthError } = await supabase
          .from("growth_records")
          .select("*")
          .eq("child_id", nextChildId)
          .order("tanggal_pengukuran", { ascending: false })
          .order("created_at", { ascending: false });

        if (growthError) throw growthError;
        setPengukuran(records || []);
      } else {
        setPengukuran([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Data gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [selectedId, selectedAnakId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Analisis dihitung oleh backend menggunakan tabel standar WHO resmi (LMS).
  // Frontend tidak membuat perkiraan Z-score agar hasil tidak menyesatkan.
  useEffect(() => {
    let aktif = true;
    async function muatAnalisis() {
      if (!selectedChild || pengukuran.length === 0) {
        setHasilAnalisis({});
        return;
      }
      const tokenResult = await supabase.auth.getSession();
      const token = tokenResult.data?.session?.access_token;
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const hasilBaru = {};
      await Promise.all(pengukuran.map(async (record) => {
        try {
          const response = await fetch(`${apiUrl}/api/pertumbuhan/analisis`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              child_id: selectedChild.id,
              jenis_kelamin: selectedChild.jenis_kelamin,
              tanggal_lahir: selectedChild.tanggal_lahir,
              tanggal_pengukuran: record.tanggal_pengukuran,
              berat_kg: record.berat_kg,
              panjang_tinggi_cm: record.panjang_tinggi_cm,
              lingkar_kepala_cm: record.lingkar_kepala_cm,
              posisi_pengukuran: hitungHari(selectedChild.tanggal_lahir, record.tanggal_pengukuran) < 730 ? "berbaring" : "berdiri",
            }),
          });
          if (!response.ok) throw new Error(response.status === 404 ? "Endpoint analisis WHO belum tersedia di backend." : `Server merespons ${response.status}.`);
          hasilBaru[record.id] = { data: await response.json(), error: "", loading: false };
        } catch (err) {
          hasilBaru[record.id] = { data: null, error: err.message || "Gagal menghitung.", loading: false };
        }
      }));
      if (aktif) setHasilAnalisis(hasilBaru);
    }
    muatAnalisis();
    return () => { aktif = false; };
  }, [selectedChild, pengukuran]);

  async function simpanIbu(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) return setError("Silakan login terlebih dahulu.");
    if (!formIbu.nama_ibu.trim()) return setError("Nama ibu wajib diisi.");

    setSaving(true);
    try {
      let result;

      if (ibu) {
        result = await supabase
          .from("maternal_profiles")
          .update({
            nama_ibu: formIbu.nama_ibu.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", ibu.id)
          .eq("user_id", user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("maternal_profiles")
          .insert({
            user_id: user.id,
            nama_ibu: formIbu.nama_ibu.trim(),
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      setModalIbu(false);
      setSuccess("Profil ibu berhasil disimpan.");
      await reload();
    } catch (err) {
      setError(err.message || "Profil ibu gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function simpanKehamilan(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!ibu) return setError("Simpan profil ibu terlebih dahulu.");
    if (!formHamil.hpht) return setError("HPHT wajib diisi.");
    if (formHamil.hpht > today()) return setError("HPHT tidak boleh di masa depan.");

    const hpl = formHamil.hpl || hitungHPL(formHamil.hpht);
    if (hpl < formHamil.hpht) return setError("HPL tidak boleh sebelum HPHT.");

    setSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from("pregnancies")
        .insert({
          mother_id: ibu.id,
          hpht: formHamil.hpht,
          hpl,
          catatan: formHamil.catatan.trim() || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setModalHamil(false);
      setFormHamil(initialHamil);
      setSuccess("Data kehamilan berhasil didaftarkan.");
      await reload(data.id);
    } catch (err) {
      setError(err.message || "Data kehamilan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function simpanKelahiran(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !ibu || !selectedPregnancy) {
      return setError("Pilih data kehamilan terlebih dahulu.");
    }
    if (selectedPregnancy.status !== "hamil") {
      return setError("Kehamilan ini tidak lagi berstatus hamil.");
    }
    if (!formLahir.nama.trim() || !formLahir.tanggal_persalinan) {
      return setError("Nama anak dan tanggal lahir wajib diisi.");
    }
    if (formLahir.tanggal_persalinan > today()) {
      return setError("Tanggal lahir tidak boleh di masa depan.");
    }
    if (formLahir.tanggal_persalinan < selectedPregnancy.hpht) {
      return setError("Tanggal lahir tidak boleh sebelum HPHT.");
    }
    if (!formLahir.jenis_kelamin) {
      return setError("Pilih jenis kelamin anak.");
    }
    if (
      !angkaPositif(formLahir.berat_lahir_kg) ||
      !angkaPositif(formLahir.panjang_lahir_cm)
    ) {
      return setError("Berat dan panjang lahir harus positif.");
    }

    setSaving(true);
    try {
      const { data: child, error: childError } = await supabase
        .from("children_profiles")
        .insert({
          user_id: user.id,
          pregnancy_id: selectedPregnancy.id,
          nama: formLahir.nama.trim(),
          tanggal_lahir: formLahir.tanggal_persalinan,
          jenis_kelamin: formLahir.jenis_kelamin,
          hpht: selectedPregnancy.hpht,
          hpl: selectedPregnancy.hpl,
          berat_lahir_kg:
            formLahir.berat_lahir_kg === ""
              ? null
              : Number(formLahir.berat_lahir_kg),
          panjang_lahir_cm:
            formLahir.panjang_lahir_cm === ""
              ? null
              : Number(formLahir.panjang_lahir_cm),
        })
        .select()
        .single();

      if (childError) throw childError;

      const { error: pregnancyError } = await supabase
        .from("pregnancies")
        .update({
          status: "lahir",
          tanggal_persalinan: formLahir.tanggal_persalinan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedPregnancy.id);

      if (pregnancyError) {
        // Hapus anak yang baru dibuat bila pembaruan kehamilan gagal.
        await supabase
          .from("children_profiles")
          .delete()
          .eq("id", child.id)
          .eq("user_id", user.id);
        throw pregnancyError;
      }

      setModalLahir(false);
      setFormLahir(initialLahir);
      setSuccess("Kelahiran dicatat dan profil anak berhasil dibuat.");
      await reload(selectedPregnancy.id, child.id);
    } catch (err) {
      setError(err.message || "Data kelahiran gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function simpanPengukuran(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !selectedChild) {
      return setError("Pilih profil anak terlebih dahulu.");
    }
    if (!formGrowth.tanggal_pengukuran) {
      return setError("Tanggal pengukuran wajib diisi.");
    }
    if (formGrowth.tanggal_pengukuran > today()) {
      return setError("Tanggal pengukuran tidak boleh di masa depan.");
    }

    const values = [
      formGrowth.berat_kg,
      formGrowth.panjang_tinggi_cm,
      formGrowth.lingkar_kepala_cm,
    ];
    if (values.every((v) => v === "")) {
      return setError("Isi setidaknya satu hasil pengukuran.");
    }
    if (!values.every(angkaPositif)) {
      return setError("Nilai pengukuran harus berupa angka positif.");
    }

    setSaving(true);
    try {
      const { error: insertError } = await supabase
        .from("growth_records")
        .insert({
          child_id: selectedChild.id,
          tanggal_pengukuran: formGrowth.tanggal_pengukuran,
          berat_kg: formGrowth.berat_kg === "" ? null : Number(formGrowth.berat_kg),
          panjang_tinggi_cm:
            formGrowth.panjang_tinggi_cm === ""
              ? null
              : Number(formGrowth.panjang_tinggi_cm),
          lingkar_kepala_cm:
            formGrowth.lingkar_kepala_cm === ""
              ? null
              : Number(formGrowth.lingkar_kepala_cm),
          catatan: formGrowth.catatan.trim() || null,
        });

      if (insertError) throw insertError;

      setModalGrowth(false);
      setFormGrowth({ ...initialGrowth, tanggal_pengukuran: today() });
      setSuccess("Pengukuran berhasil disimpan.");
      await reload(selectedId, selectedChild.id);
    } catch (err) {
      setError(err.message || "Pengukuran gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef5ef] bg-[image:radial-gradient(900px_480px_at_90%_-8%,#d8eedd_0%,transparent_60%),radial-gradient(700px_420px_at_-10%_35%,#f7f0d8_0%,transparent_55%)] bg-no-repeat font-sans text-sm font-medium text-[#3a5a42]">
        <LoaderCircle className="mr-3 animate-spin text-[#176b26]" /> Memuat data 1000 HPK...
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef5ef] bg-[image:radial-gradient(900px_480px_at_90%_-8%,#d8eedd_0%,transparent_60%),radial-gradient(700px_420px_at_-10%_35%,#f7f0d8_0%,transparent_55%)] bg-no-repeat p-5 font-sans">
        <section className="max-w-md text-center rounded-[24px] border border-white bg-white shadow-[0_1px_2px_rgba(20,48,27,0.05),0_18px_40px_-18px_rgba(20,48,27,0.18)] ring-1 ring-[#14301b]/5 p-8 sm:p-10">
          <Baby size={40} className="mx-auto box-content rounded-3xl p-4 bg-gradient-to-br from-[#e6f7ea] to-[#c9ecd3] text-[#176b26] ring-1 ring-white shadow-sm" />
          <h1 className="mt-6 font-sans text-2xl font-semibold tracking-tight text-[#0f3d1e]">Pantau 1000 HPK</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Masuk untuk mendaftarkan kehamilan dan memantau pertumbuhan anak.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-7 w-full rounded-2xl px-4 py-3.5 bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]"
          >
            Masuk
          </button>
        </section>
      </main>
    );
  }

  const daysPregnancy = selectedPregnancy
    ? hitungHari(selectedPregnancy.hpht)
    : null;
  const weeks = daysPregnancy === null ? null : Math.floor(daysPregnancy / 7);
  const daysInWeek = daysPregnancy === null ? null : daysPregnancy % 7;
  const days1000 = selectedPregnancy
    ? hitungHari(selectedPregnancy.tanggal_persalinan || selectedPregnancy.hpht)
    : null;

  return (
    <div className="min-h-screen bg-[#eef5ef] bg-[image:radial-gradient(900px_480px_at_90%_-8%,#d8eedd_0%,transparent_60%),radial-gradient(700px_420px_at_-10%_35%,#f7f0d8_0%,transparent_55%)] bg-no-repeat font-sans text-[#16241a]">
      
      
<header className="sticky top-0 z-30 border-b border-[#14301b]/5 bg-white/70 backdrop-blur-xl">
  <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">

    {/* Kiri: Kembali dan judul */}
    <div className="flex min-w-0 items-center gap-3">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        aria-label="Kembali ke Dashboard"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0f3d1e] ring-1 ring-[#14301b]/10 transition hover:bg-[#f1f7f2] hover:shadow-sm"
      >
        <ArrowLeft size={19} />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-lg font-extrabold tracking-tight text-[#0f3d1e] sm:text-2xl">
          Si Kecil
        </h1>
      </div>
    </div>

    {/* Kanan: Notifikasi, profil, refresh */}
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => navigate("/notifikasi")}
        aria-label="Notifikasi"
        title="Notifikasi"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#3a5a42] transition hover:bg-[#e6efe8] sm:h-10 sm:w-10"
      >
        <Bell size={19} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/profil")}
        aria-label="Profil"
        title="Profil"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#e6f7ea] to-[#c9ecd3] text-[#0f3d1e] shadow-sm ring-1 ring-white transition hover:shadow-md sm:h-10 sm:w-10"
      >
        <UserCircle size={21} />
      </button>

      <button
        type="button"
        onClick={() => reload()}
        disabled={loading}
        aria-label="Muat ulang data"
        title="Muat ulang data"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#3a5a42] transition hover:bg-[#e6efe8] disabled:opacity-50 sm:h-10 sm:w-10"
      >
        <RefreshCw
          size={17}
          className={loading ? "animate-spin" : ""}
        />
      </button>
    </div>
  </div>
</header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <section className="relative overflow-hidden rounded-[28px] bg-[#0f3d1e] bg-[image:radial-gradient(560px_300px_at_100%_0%,rgba(226,170,60,0.30),transparent_60%),radial-gradient(520px_340px_at_0%_100%,rgba(70,176,106,0.40),transparent_60%),linear-gradient(135deg,#0f3d1e_0%,#17612d_100%)] p-6 text-white shadow-[0_30px_60px_-28px_rgba(15,61,30,0.75)] ring-1 ring-white/10 sm:p-10">
          <p className="text-sm font-medium text-white/70">Dapur Cerdas · 1000 HPK</p>
          <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Pantau Perjalanan 1000 HPK
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Mulai dari kehamilan ibu, pencatatan kelahiran, hingga pemantauan
            pertumbuhan anak.
          </p>
        </section>

        {error && (
          <div role="alert" className="mt-5 rounded-2xl border border-red-200/70 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="mt-5 rounded-2xl border border-[#bfe3c9] bg-[#effaf1] p-4 text-sm text-[#176b26] shadow-sm">
            {success}
          </div>
        )}

        <section className="mt-6 rounded-[24px] border border-white bg-white shadow-[0_1px_2px_rgba(20,48,27,0.05),0_18px_40px_-18px_rgba(20,48,27,0.18)] ring-1 ring-[#14301b]/5 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-[#0f3d1e]">Profil Ibu</h2>
              <p className="mt-1 text-sm text-slate-500">
                Data ibu menjadi induk dari setiap pendaftaran kehamilan.
              </p>
            </div>
            <button
              onClick={() => {
                setFormIbu({ nama_ibu: ibu?.nama_ibu || "" });
                setModalIbu(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm border border-[#cfe4d2] bg-white font-semibold text-[#0f3d1e] shadow-sm transition hover:bg-[#f3faf4] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]"
            >
              <UserRound size={17} /> {ibu ? "Edit Profil Ibu" : "Daftar Profil Ibu"}
            </button>
          </div>
          {ibu ? (
            <div className="mt-5 rounded-2xl border border-[#dcebdf] bg-gradient-to-br from-[#f3faf4] to-[#e8f4eb] p-5">
              <p className="text-xs font-medium text-[#3a5a42]">Nama ibu</p>
              <p className="mt-1 font-sans text-xl font-semibold text-[#0f3d1e]">{ibu.nama_ibu}</p>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-[#bcd9c3] bg-[#f4faf5] text-sm text-slate-500 p-5">
              Isi profil ibu terlebih dahulu sebelum mendaftarkan kehamilan.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-[24px] border border-white bg-white shadow-[0_1px_2px_rgba(20,48,27,0.05),0_18px_40px_-18px_rgba(20,48,27,0.18)] ring-1 ring-[#14301b]/5 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-[#0f3d1e]">Data Kehamilan</h2>
              <p className="mt-1 text-sm text-slate-500">
                Pilih kehamilan atau daftarkan kehamilan baru.
              </p>
            </div>
            <button
              disabled={!ibu}
              onClick={() => {
                setFormHamil(initialHamil);
                setModalHamil(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm disabled:opacity-40 disabled:shadow-none bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]"
            >
              <Plus size={18} /> Daftar Kehamilan
            </button>
          </div>

          {kehamilan.length > 0 && (
            <div className="mt-5">
              <label className={labelClass}>Pilih kehamilan</label>
              <select
                className={inputClass}
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {kehamilan.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatTanggal(p.hpht)} · {p.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kehamilan.length > 1 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {kehamilan.map((p, index) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  aria-pressed={selectedId === p.id}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedId === p.id
                      ? "border-[#2fa356] bg-[#f0faf2] ring-2 ring-[#2fa356]/15"
                      : "border-[#e8efe9] bg-white hover:border-[#bcd9c3]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-[#176b26]">
                      <Heart size={18} />
                      <span className="text-sm font-bold">Kehamilan {kehamilan.length - index}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.status === "hamil" ? "bg-[#e6f4e8] text-[#176b26]" : "bg-slate-100 text-slate-600"}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">HPHT</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#16241a]">{formatTanggal(p.hpht)}</p>
                  <p className="mt-2 text-xs text-slate-500">HPL: {formatTanggal(p.hpl)}</p>
                  <p className="mt-3 text-xs font-semibold text-[#176b26]">{selectedId === p.id ? "Sedang dipilih" : "Pilih pemantauan"}</p>
                </button>
              ))}
            </div>
          )}

          {!selectedPregnancy ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[#bcd9c3] bg-[#f4faf5] p-8 text-center">
              <CalendarDays className="mx-auto box-content rounded-3xl p-4 bg-gradient-to-br from-[#e6f7ea] to-[#c9ecd3] text-[#176b26] ring-1 ring-white shadow-sm" size={32} />
              <p className="mt-3 font-semibold text-[#0f3d1e]">Belum ada data kehamilan</p>
              <p className="mt-1 text-sm text-slate-500">
                Daftarkan kehamilan agar pemantauan bisa dimulai.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#e6f4e8] px-3.5 py-1 text-xs font-semibold text-[#176b26] ring-1 ring-[#cfe4d2]">
                  Status: {selectedPregnancy.status}
                </span>
                {selectedPregnancy.status === "hamil" && (
                  <button
                    onClick={() => {
                      setFormLahir({
                        ...initialLahir,
                        tanggal_persalinan: today(),
                      });
                      setModalLahir(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]"
                  >
                    <Baby size={17} /> Catat Kelahiran
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info icon={<CalendarDays size={20} />} label="HPHT" value={formatTanggal(selectedPregnancy.hpht)} />
                <Info icon={<Heart size={20} />} label="HPL" value={formatTanggal(selectedPregnancy.hpl)} />
                <Info icon={<CalendarDays size={20} />} label="Tanggal persalinan" value={formatTanggal(selectedPregnancy.tanggal_persalinan)} />
              </div>

              {selectedPregnancy.status === "hamil" && (
                <div className="mt-5 rounded-2xl border border-[#dcebdf] bg-gradient-to-br from-[#f3faf4] to-[#e4f3e8] p-6">
                  <p className="text-sm font-semibold text-[#0f3d1e]">
                    Perkiraan usia kehamilan
                  </p>
                  {weeks !== null && daysPregnancy >= 0 ? (
                    <p className="mt-2 font-sans text-4xl font-semibold lining-nums tracking-tight text-[#0f3d1e]">
                      {weeks} minggu {daysInWeek} hari
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">
                      Belum dapat dihitung dari HPHT.
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-5 text-[#0f3d1e]">
                    Perhitungan berdasarkan HPHT merupakan perkiraan, bukan
                    penentuan medis usia kehamilan.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        <section className="mt-6 rounded-[24px] border border-white bg-white shadow-[0_1px_2px_rgba(20,48,27,0.05),0_18px_40px_-18px_rgba(20,48,27,0.18)] ring-1 ring-[#14301b]/5 p-6 sm:p-8">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-[#0f3d1e]">Profil Anak</h2>
          <p className="mt-1 text-sm text-slate-500">
            Profil anak dibuat saat data kelahiran dicatat.
          </p>

          {anak.length > 0 ? (
            <>
              <div className="mt-4">
                <label className={labelClass}>Pilih anak</label>
                <select
                  className={inputClass}
                  value={selectedAnakId}
                  onChange={(e) => setSelectedAnakId(e.target.value)}
                >
                  {anak.map((a) => (
                    <option key={a.id} value={a.id}>{a.nama}</option>
                  ))}
                </select>
              </div>

              {anak.length > 1 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {anak.map((a, index) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setSelectedAnakId(a.id);
                        reload(selectedId, a.id);
                      }}
                      aria-pressed={selectedAnakId === a.id}
                      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                        selectedAnakId === a.id
                          ? "border-[#2fa356] bg-[#f0faf2] ring-2 ring-[#2fa356]/15"
                          : "border-[#e8efe9] bg-white hover:border-[#bcd9c3]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-[#176b26]">
                          <Baby size={18} />
                          <span className="text-sm font-bold">{a.nama || `Anak ${index + 1}`}</span>
                        </div>
                        {a.tanggal_lahir && hitungHari(a.tanggal_lahir) < 1000 ? (
                          <span className="rounded-full bg-[#e6f4e8] px-2.5 py-1 text-[11px] font-semibold text-[#176b26]">1000 HPK</span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Riwayat</span>
                        )}
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Usia</p>
                      <p className="mt-0.5 text-sm font-semibold text-[#16241a]">{usiaAnak(a.tanggal_lahir)}</p>
                      <p className="mt-2 text-xs text-slate-500">Lahir: {formatTanggal(a.tanggal_lahir)}</p>
                      <p className="mt-3 text-xs font-semibold text-[#176b26]">{selectedAnakId === a.id ? "Sedang dipilih" : "Lihat detail anak"}</p>
                    </button>
                  ))}
                </div>
              )}

              {selectedChild && (
                <>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Info icon={<Baby size={20} />} label="Nama anak" value={selectedChild.nama} />
                    <Info icon={<CalendarDays size={20} />} label="Tanggal lahir" value={formatTanggal(selectedChild.tanggal_lahir)} />
                    <Info icon={<Heart size={20} />} label="Jenis kelamin" value={selectedChild.jenis_kelamin} />
                    <Info icon={<Scale size={20} />} label="Berat lahir" value={selectedChild.berat_lahir_kg != null ? `${selectedChild.berat_lahir_kg} kg` : "Belum diisi"} />
                    <Info icon={<Ruler size={20} />} label="Panjang lahir" value={selectedChild.panjang_lahir_cm != null ? `${selectedChild.panjang_lahir_cm} cm` : "Belum diisi"} />
                    <Info icon={<CalendarDays size={20} />} label="Usia anak" value={usiaAnak(selectedChild.tanggal_lahir)} />
                  </div>

                  {selectedChild.tanggal_lahir && (() => {
                    const childDays = hitungHari(selectedChild.tanggal_lahir);
                    return (
                      <div className="mt-5 rounded-2xl border border-[#dcebdf] bg-gradient-to-br from-[#f3faf4] to-[#e4f3e8] p-6">
                        <p className="font-semibold text-[#0f3d1e]">Perjalanan 1000 HPK setelah lahir</p>
                        <p className="mt-2 font-sans text-4xl font-semibold lining-nums tracking-tight text-[#0f3d1e]">
                          Hari ke-{Math.min(childDays + 1, 1000)} dari 1000
                        </p>
                        <p className="mt-1 text-sm text-[#0f3d1e]">
                          {childDays < 1000
                            ? `Sekitar ${1000 - childDays - 1} hari tersisa sampai hari ke-1000.`
                            : "Periode 1000 hari setelah lahir telah terlewati."}
                        </p>
                        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-[#14301b]/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1f8a43] to-[#7bd08f] transition-all duration-700"
                            style={{ width: `${Math.min(100, ((childDays + 1) / 1000) * 100)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-[#0f3d1e]">
                          Ini penghitung hari setelah lahir. Periode 1000 HPK
                          secara keseluruhan dimulai sejak masa kehamilan.
                        </p>
                      </div>
                    );
                  })()}
                </>
              )}

              
{selectedChild && (
  <div className="mt-6">
    {/* Judul riwayat */}
    <div className="mb-4">
      <h3 className="font-sans text-xl font-semibold tracking-tight text-[#0f3d1e]">
        Riwayat Pertumbuhan
      </h3>
      <p className="text-sm text-slate-500">
        {pengukuran.length} catatan pengukuran
      </p>
    </div>

    {/* Grafik WHO tetap dipertahankan */}
    {pengukuran.length > 0 && (
      <KurvaPertumbuhanWHO
        records={pengukuran}
        hasilAnalisis={hasilAnalisis}
        child={selectedChild}
      />
    )}

    {/* Daftar riwayat pengukuran */}
    {pengukuran.length === 0 ? (
      <p className="mt-4 rounded-2xl border border-dashed border-[#bcd9c3] bg-[#f4faf5] p-6 text-sm text-slate-500">
        Belum ada pengukuran tersimpan.
      </p>
    ) : (
      <div className="mt-4 space-y-4">
        {[...pengukuran]
          .sort(
            (a, b) =>
              new Date(b.tanggal_pengukuran) -
              new Date(a.tanggal_pengukuran)
          )
          .map((r) => (
            <div key={r.id}>
              {/* Tanggal dan ringkasan pengukuran */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#294b32]">
                  {formatTanggal(r.tanggal_pengukuran)}
                </p>

                <p className="text-xs text-[#647b68]">
                  BB {r.berat_kg != null ? `${r.berat_kg} kg` : "—"}
                  {" · "}
                  TB {r.panjang_tinggi_cm != null
                    ? `${r.panjang_tinggi_cm} cm`
                    : "—"}
                  {" · "}
                  LK {r.lingkar_kepala_cm != null
                    ? `${r.lingkar_kepala_cm} cm`
                    : "—"}
                </p>
              </div>

              {/* Hasil analisis WHO */}
              <div className="mt-2">
                <KartuAnalisisWHO
                  hasil={hasilAnalisis[r.id]?.data}
                  error={hasilAnalisis[r.id]?.error}
                  loading={!hasilAnalisis[r.id]}
                  record={r}
                />
              </div>
            </div>
          ))}
      </div>
    )}

    {/* Panduan MPASI */}
    <div className="mt-5 rounded-2xl border border-[#ffdfb0] bg-[#fff7ed] p-4">
      <div className="flex items-start gap-3">
        <ClipboardList
          size={20}
          className="mt-0.5 shrink-0 text-[#b77900]"
        />

        <div>
          <h4 className="text-sm font-bold text-[#a66b00]">
            Panduan MPASI
          </h4>

          <p className="mt-2 text-xs leading-5 text-[#647b68]">
            MPASI dimulai usia 6 bulan sambil melanjutkan ASI
            sampai 2 tahun. Sertakan sumber protein hewani
            pada menu harian.
          </p>
        </div>
      </div>
    </div>

    {/* Tombol catat pengukuran */}
    <button
      type="button"
      onClick={() => {
        setFormGrowth({
          ...initialGrowth,
          tanggal_pengukuran: today(),
        });
        setModalGrowth(true);
      }}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d1e] px-4 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]"
    >
      <Plus size={19} />
      Catat pengukuran baru
    </button>
  </div>
)}
</>
) : (
  <p className="mt-5 rounded-2xl border border-dashed border-[#bcd9c3] bg-[#f4faf5] p-6 text-sm text-slate-500">
    Belum ada profil anak. Setelah bayi lahir, pilih kehamilan lalu
    tekan “Catat Kelahiran”.
  </p>
)}
</section>

<p className="mt-5 text-xs leading-5 text-slate-500">
  Informasi usia kehamilan dan hitungan 1000 HPK merupakan panduan
  kalender. Gunakan tanggal dan penilaian tenaga kesehatan untuk
  pemantauan medis. Catatan pertumbuhan tidak otomatis menentukan
  status gizi.
</p>
</main>


      {modalIbu && (
        <Modal title="Profil Ibu" onClose={() => !saving && setModalIbu(false)}>
          <form onSubmit={simpanIbu} className="space-y-4">
            <Field label="Nama ibu">
              <input
                className={inputClass}
                value={formIbu.nama_ibu}
                onChange={(e) => setFormIbu({ nama_ibu: e.target.value })}
                maxLength={100}
                required
                placeholder="Masukkan nama ibu"
              />
            </Field>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalIbu(false)} className="rounded-2xl border border-[#cfe4d2] bg-white px-5 py-3 text-sm font-semibold text-[#3a5a42] transition hover:bg-[#f3faf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm disabled:opacity-50 disabled:shadow-none bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">
                {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalHamil && (
        <Modal title="Daftar Kehamilan" onClose={() => !saving && setModalHamil(false)}>
          <form onSubmit={simpanKehamilan} className="space-y-4">
            <Field label="HPHT" hint="Hari Pertama Haid Terakhir">
              <input
                type="date"
                className={inputClass}
                max={today()}
                required
                value={formHamil.hpht}
                onChange={(e) => setFormHamil((v) => ({
                  ...v,
                  hpht: e.target.value,
                  hpl: v.hpl || hitungHPL(e.target.value),
                }))}
              />
            </Field>
            <Field label="HPL" hint="Boleh disesuaikan dengan perkiraan dari tenaga kesehatan.">
              <input
                type="date"
                className={inputClass}
                value={formHamil.hpl || (formHamil.hpht ? hitungHPL(formHamil.hpht) : "")}
                min={formHamil.hpht || undefined}
                onChange={(e) => setFormHamil((v) => ({ ...v, hpl: e.target.value }))}
              />
            </Field>
            <Field label="Catatan (opsional)">
              <textarea
                className={inputClass}
                rows={3}
                value={formHamil.catatan}
                onChange={(e) => setFormHamil((v) => ({ ...v, catatan: e.target.value }))}
                placeholder="Catatan kehamilan"
              />
            </Field>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalHamil(false)} className="rounded-2xl border border-[#cfe4d2] bg-white px-5 py-3 text-sm font-semibold text-[#3a5a42] transition hover:bg-[#f3faf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm disabled:opacity-50 disabled:shadow-none bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">
                {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
                Simpan Kehamilan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalLahir && (
        <Modal title="Catat Kelahiran" onClose={() => !saving && setModalLahir(false)}>
          <form onSubmit={simpanKelahiran} className="space-y-4">
            <Field label="Nama anak">
              <input
                className={inputClass}
                value={formLahir.nama}
                onChange={(e) => setFormLahir((v) => ({ ...v, nama: e.target.value }))}
                required
                maxLength={100}
                placeholder="Nama anak"
              />
            </Field>
            <Field label="Tanggal lahir sebenarnya">
              <input
                type="date"
                className={inputClass}
                min={selectedPregnancy?.hpht}
                max={today()}
                value={formLahir.tanggal_persalinan}
                onChange={(e) => setFormLahir((v) => ({ ...v, tanggal_persalinan: e.target.value }))}
                required
              />
            </Field>
            <Field label="Jenis kelamin">
              <select
                className={inputClass}
                value={formLahir.jenis_kelamin}
                onChange={(e) => setFormLahir((v) => ({ ...v, jenis_kelamin: e.target.value }))}
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Berat lahir (kg)">
                <input type="number" min="0.01" step="0.01" className={inputClass} value={formLahir.berat_lahir_kg} onChange={(e) => setFormLahir((v) => ({ ...v, berat_lahir_kg: e.target.value }))} />
              </Field>
              <Field label="Panjang lahir (cm)">
                <input type="number" min="0.01" step="0.01" className={inputClass} value={formLahir.panjang_lahir_cm} onChange={(e) => setFormLahir((v) => ({ ...v, panjang_lahir_cm: e.target.value }))} />
              </Field>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Setelah disimpan, sistem membuat profil anak yang terhubung
              dengan kehamilan ini.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalLahir(false)} className="rounded-2xl border border-[#cfe4d2] bg-white px-5 py-3 text-sm font-semibold text-[#3a5a42] transition hover:bg-[#f3faf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm disabled:opacity-50 disabled:shadow-none bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">
                {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
                Simpan Kelahiran
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalGrowth && (
        <Modal title="Catat Pengukuran" onClose={() => !saving && setModalGrowth(false)}>
          <form onSubmit={simpanPengukuran} className="space-y-4">
            <Field label="Tanggal pengukuran">
              <input type="date" className={inputClass} max={today()} required value={formGrowth.tanggal_pengukuran} onChange={(e) => setFormGrowth((v) => ({ ...v, tanggal_pengukuran: e.target.value }))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Berat badan (kg)">
                <input type="number" min="0.01" step="0.01" className={inputClass} value={formGrowth.berat_kg} onChange={(e) => setFormGrowth((v) => ({ ...v, berat_kg: e.target.value }))} />
              </Field>
              <Field label="Tinggi/panjang (cm)">
                <input type="number" min="0.01" step="0.01" className={inputClass} value={formGrowth.panjang_tinggi_cm} onChange={(e) => setFormGrowth((v) => ({ ...v, panjang_tinggi_cm: e.target.value }))} />
              </Field>
            </div>
            <Field label="Lingkar kepala (cm)">
              <input type="number" min="0.01" step="0.01" className={inputClass} value={formGrowth.lingkar_kepala_cm} onChange={(e) => setFormGrowth((v) => ({ ...v, lingkar_kepala_cm: e.target.value }))} />
            </Field>
            <Field label="Catatan">
              <textarea rows={3} className={inputClass} value={formGrowth.catatan} onChange={(e) => setFormGrowth((v) => ({ ...v, catatan: e.target.value }))} />
            </Field>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalGrowth(false)} className="rounded-2xl border border-[#cfe4d2] bg-white px-5 py-3 text-sm font-semibold text-[#3a5a42] transition hover:bg-[#f3faf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm disabled:opacity-50 disabled:shadow-none bg-[#0f3d1e] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,61,30,0.8)] transition hover:bg-[#145427] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2fa356]">
                {saving ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
                Simpan Pengukuran
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}