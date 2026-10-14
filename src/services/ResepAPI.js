
import { supabase } from "../lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

async function requestAPI(path, options = {}) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("Gagal memeriksa sesi login.");
  }

  if (!session?.access_token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Permintaan gagal.");
  }

  return result;
}

export function getBahanStok() {
  return requestAPI("/api/resep/bahan");
}

export function racikResep(data) {
  return requestAPI("/api/resep/racik", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
