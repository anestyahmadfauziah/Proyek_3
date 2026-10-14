
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  ChefHat,
  Clock,
  Trash2,
  Users,
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  Utensils,
  Flame,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

async function requestTersimpan(path, options = {}) {
  let { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Gagal membaca sesi login.");
  }

  if (!session?.access_token) {
    const refreshed = await supabase.auth.refreshSession();
    session = refreshed.data.session;

    if (refreshed.error || !session?.access_token) {
      throw new Error("Sesi login berakhir. Silakan login kembali.");
    }
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.access_token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Backend tidak dapat dihubungi.");
  }

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(result?.message || "Permintaan gagal.");
  }

  return result;
}

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

function formatAngka(value) {
  const angka = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(Number.isFinite(angka) ? angka : 0);
}

export default function ResepTersimpan() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");
  const [terbuka, setTerbuka] = useState(null);
  const [menghapus, setMenghapus] = useState(null);

  const ambilResep = useCallback(async () => {
    setMemuat(true);
    setError("");

    try {
      const result = await requestTersimpan("/api/resep/tersimpan");
      setItems(Array.isArray(result?.items) ? result.items : []);
    } catch (err) {
      setError(err.message || "Gagal mengambil resep tersimpan.");
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    ambilResep();
  }, [ambilResep]);

  async function hapusResep(id) {
    const setuju = window.confirm(
      "Yakin ingin menghapus resep ini?"
    );

    if (!setuju) return;

    setMenghapus(id);
    setError("");

    try {
      await requestTersimpan(
        `/api/resep/tersimpan/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      setItems((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (terbuka === id) setTerbuka(null);
    } catch (err) {
      setError(err.message || "Gagal menghapus resep.");
    } finally {
      setMenghapus(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f9f5] text-gray-800">
      <header className="sticky top-0 z-20 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Kembali"
            className="rounded-xl p-2 hover:bg-green-50"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-800">
            <Bookmark size={21} />
          </div>

          <div>
            <h1 className="font-bold text-green-950">
              Resep Tersimpan
            </h1>
            <p className="text-xs text-gray-500">
              Koleksi resep favoritmu
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-9">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-green-950">
              Koleksi Resep
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Resep yang kamu simpan dapat dibuka kembali kapan saja.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/racik-resep")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800"
          >
            <ChefHat size={18} />
            Racik Resep Baru
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            <button
              type="button"
              onClick={ambilResep}
              className="ml-2 font-bold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {memuat ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-green-100 bg-white">
            <LoaderCircle
              size={30}
              className="animate-spin text-green-700"
            />
            <p className="mt-3 text-sm text-gray-500">
              Memuat resep tersimpan...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-green-200 bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <Bookmark size={30} />
            </div>
            <h3 className="mt-4 font-bold text-green-950">
              Belum ada resep tersimpan
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Setelah berhasil meracik resep, tekan tombol Simpan Resep
              agar resep masuk ke koleksimu.
            </p>
            <button
              type="button"
              onClick={() => navigate("/racik-resep")}
              className="mt-5 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
            >
              Mulai Racik Resep
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const resep = item.data_resep || {};
              const isOpen = terbuka === item.id;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <Utensils size={23} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-green-950">
                          {item.nama_resep}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Disimpan {formatTanggal(item.created_at)}
                        </p>

                        {resep.deskripsi && (
                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {resep.deskripsi}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={14} />
                            {formatAngka(resep.waktu_menit)} menit
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users size={14} />
                            {formatAngka(resep.porsi)} porsi
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Flame size={14} />
                            {formatAngka(resep.nutrisi?.kalori)} kkal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setTerbuka(isOpen ? null : item.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-bold text-green-800 hover:bg-green-100"
                      >
                        {isOpen ? "Tutup detail" : "Lihat detail"}
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => hapusResep(item.id)}
                        disabled={menghapus === item.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        {menghapus === item.id
                          ? "Menghapus..."
                          : "Hapus"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-green-100 bg-green-50/40 p-4 sm:p-5">
                      <h4 className="font-bold text-green-950">
                        Bahan
                      </h4>

                      <div className="mt-3 space-y-2">
                        {(resep.bahan || []).map((bahan, index) => (
                          <div
                            key={`${bahan.nama}-${index}`}
                            className="flex justify-between gap-3 rounded-lg bg-white p-3 text-sm"
                          >
                            <span>{bahan.nama}</span>
                            <span className="text-right font-semibold text-gray-600">
                              {bahan.jumlah}
                            </span>
                          </div>
                        ))}
                      </div>

                      <h4 className="mt-6 font-bold text-green-950">
                        Langkah memasak
                      </h4>

                      <ol className="mt-3 space-y-3">
                        {(resep.langkah || []).map((langkah, index) => (
                          <li
                            key={`${index}-${langkah}`}
                            className="flex gap-3 text-sm leading-6"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <span>{langkah}</span>
                          </li>
                        ))}
                      </ol>

                      {resep.nutrisi && (
                        <>
                          <h4 className="mt-6 font-bold text-green-950">
                            Perkiraan nutrisi seluruh resep
                          </h4>
                          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {[
                              ["Protein", resep.nutrisi.protein, "g"],
                              ["Lemak", resep.nutrisi.lemak, "g"],
                              ["Karbohidrat", resep.nutrisi.karbohidrat, "g"],
                              ["Serat", resep.nutrisi.serat, "g"],
                            ].map(([label, value, unit]) => (
                              <div
                                key={label}
                                className="rounded-xl bg-white p-3"
                              >
                                <p className="text-xs text-gray-500">
                                  {label}
                                </p>
                                <p className="mt-1 font-bold text-green-800">
                                  {formatAngka(value)} {unit}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {resep.tips && (
                        <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                          <strong>Tips:</strong> {resep.tips}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}