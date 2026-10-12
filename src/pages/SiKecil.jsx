
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
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";
const labelClass = "block text-sm font-semibold text-slate-700";

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup">
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-green-700">
        {icon}
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-bold">{value || "Belum diisi"}</p>
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

export default function SiKecil() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ibu, setIbu] = useState(null);
  const [kehamilan, setKehamilan] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [anak, setAnak] = useState([]);
  const [selectedAnakId, setSelectedAnakId] = useState("");
  const [pengukuran, setPengukuran] = useState([]);

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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f9f5]">
        <LoaderCircle className="mr-3 animate-spin" /> Memuat data 1000 HPK...
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f9f5] p-5">
        <section className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <Baby size={40} className="mx-auto text-green-700" />
          <h1 className="mt-4 text-2xl font-bold">Pantau 1000 HPK</h1>
          <p className="mt-2 text-sm text-slate-500">
            Masuk untuk mendaftarkan kehamilan dan memantau pertumbuhan anak.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 w-full rounded-xl bg-[#23652d] px-4 py-3 font-semibold text-white"
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
    <div className="min-h-screen bg-[#f5f9f5] font-jakarta text-slate-800">
      
      
<header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
  <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
    <button
      type="button"
      onClick={() => navigate("/dashboard")}
      className="flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition hover:text-green-700"
    >
      <ArrowLeft size={19} />
    </button>
  </div>
</header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="rounded-3xl bg-gradient-to-r from-[#23652d] to-[#39874a] p-6 text-white sm:p-8">
          <p className="text-sm text-green-100">Dapur Cerdas · 1000 HPK</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Pantau Perjalanan 1000 HPK
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50">
            Mulai dari kehamilan ibu, pencatatan kelahiran, hingga pemantauan
            pertumbuhan anak.
          </p>
        </section>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {success}
          </div>
        )}

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Profil Ibu</h2>
              <p className="mt-1 text-sm text-slate-500">
                Data ibu menjadi induk dari setiap pendaftaran kehamilan.
              </p>
            </div>
            <button
              onClick={() => {
                setFormIbu({ nama_ibu: ibu?.nama_ibu || "" });
                setModalIbu(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 px-4 py-3 text-sm font-semibold text-green-800"
            >
              <UserRound size={17} /> {ibu ? "Edit Profil Ibu" : "Daftar Profil Ibu"}
            </button>
          </div>
          {ibu ? (
            <div className="mt-4 rounded-2xl bg-green-50 p-4">
              <p className="text-xs text-green-800">Nama ibu</p>
              <p className="mt-1 font-bold text-green-950">{ibu.nama_ibu}</p>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Isi profil ibu terlebih dahulu sebelum mendaftarkan kehamilan.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Data Kehamilan</h2>
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#23652d] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
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

          {!selectedPregnancy ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-7 text-center">
              <CalendarDays className="mx-auto text-green-700" size={32} />
              <p className="mt-3 font-semibold">Belum ada data kehamilan</p>
              <p className="mt-1 text-sm text-slate-500">
                Daftarkan kehamilan agar pemantauan bisa dimulai.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
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
                    className="inline-flex items-center gap-2 rounded-xl bg-[#23652d] px-4 py-2.5 text-sm font-semibold text-white"
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
                <div className="mt-4 rounded-2xl bg-green-50 p-5">
                  <p className="text-sm font-semibold text-green-900">
                    Perkiraan usia kehamilan
                  </p>
                  {weeks !== null && daysPregnancy >= 0 ? (
                    <p className="mt-2 text-2xl font-bold text-green-900">
                      {weeks} minggu {daysInWeek} hari
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600">
                      Belum dapat dihitung dari HPHT.
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-5 text-green-900">
                    Perhitungan berdasarkan HPHT merupakan perkiraan, bukan
                    penentuan medis usia kehamilan.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-bold">Profil Anak</h2>
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
                      <div className="mt-4 rounded-2xl bg-green-50 p-5">
                        <p className="font-semibold text-green-900">Perjalanan 1000 HPK setelah lahir</p>
                        <p className="mt-2 text-2xl font-bold text-green-900">
                          Hari ke-{Math.min(childDays + 1, 1000)} dari 1000
                        </p>
                        <p className="mt-1 text-sm text-green-900">
                          {childDays < 1000
                            ? `Sekitar ${1000 - childDays - 1} hari tersisa sampai hari ke-1000.`
                            : "Periode 1000 hari setelah lahir telah terlewati."}
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-green-700"
                            style={{ width: `${Math.min(100, ((childDays + 1) / 1000) * 100)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-green-900">
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
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold">Riwayat Pertumbuhan</h3>
                      <p className="text-sm text-slate-500">
                        {pengukuran.length} catatan pengukuran
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFormGrowth({ ...initialGrowth, tanggal_pengukuran: today() });
                        setModalGrowth(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#23652d] px-4 py-3 text-sm font-semibold text-white"
                    >
                      <Plus size={17} /> Catat Pengukuran
                    </button>
                  </div>

                  {pengukuran.length === 0 ? (
                    <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                      Belum ada pengukuran tersimpan.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[570px] text-left text-sm">
                        <thead>
                          <tr className="border-b text-slate-500">
                            <th className="px-3 py-3">Tanggal</th>
                            <th className="px-3 py-3">Berat</th>
                            <th className="px-3 py-3">Panjang/tinggi</th>
                            <th className="px-3 py-3">Lingkar kepala</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pengukuran.map((r) => (
                            <tr key={r.id} className="border-b border-slate-50">
                              <td className="px-3 py-3">{formatTanggal(r.tanggal_pengukuran)}</td>
                              <td className="px-3 py-3">{r.berat_kg != null ? `${r.berat_kg} kg` : "—"}</td>
                              <td className="px-3 py-3">{r.panjang_tinggi_cm != null ? `${r.panjang_tinggi_cm} cm` : "—"}</td>
                              <td className="px-3 py-3">{r.lingkar_kepala_cm != null ? `${r.lingkar_kepala_cm} cm` : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
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
              <button type="button" onClick={() => setModalIbu(false)} className="rounded-xl border px-4 py-3 text-sm">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#23652d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
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
              <button type="button" onClick={() => setModalHamil(false)} className="rounded-xl border px-4 py-3 text-sm">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#23652d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
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
              <button type="button" onClick={() => setModalLahir(false)} className="rounded-xl border px-4 py-3 text-sm">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#23652d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
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
              <button type="button" onClick={() => setModalGrowth(false)} className="rounded-xl border px-4 py-3 text-sm">Batal</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#23652d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
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
