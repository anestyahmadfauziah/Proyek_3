const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL =", API_URL);

export const cekBackend = async () => {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend tidak dapat diakses");
  }

  return response.json();
};