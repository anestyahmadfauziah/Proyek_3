import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Notifikasi from "./pages/Notifikasi";
import Profil from "./pages/Profil";
import Stok from "./pages/Stok";
import SiKecil from "./pages/SiKecil";
import Nutrisi from "./pages/Nutrisi";
import TambahBahanModal from "./pages/TambahBahanModal";
import RacikResepAI from "./pages/RacikResepAI";

function App() {
  return (
    <BrowserRouter>
     
  <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/login" element={<Auth />} />
  <Route path="/register" element={<Auth />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/stok" element={<Stok />} />
  <Route path="/notifikasi" element={<Notifikasi />} />
  <Route path="/profil" element={<Profil />} />
  <Route path="/nutrisi" element={<Nutrisi />} />
  <Route path="/si-kecil" element={<SiKecil />} />
  <Route path="/tambah-bahan" element={<TambahBahanModal />} />
  <Route path="/racik-resep" element={<RacikResepAI />} />
  <Route path="/splash" element={<Splash />} />

  </Routes>
    </BrowserRouter>
  );
}

export default App;