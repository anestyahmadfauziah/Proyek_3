import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Notifikasi from "./pages/Notifikasi";
import Profil from "./pages/Profil";
import Stok from "./pages/Stok";
import SiKecil from "./pages/SiKecil";
import Nutrisi from "./pages/Nutrisi";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Halaman utama */}
        <Route path="/" element={<Dashboard />} />

        {/* Login & Register menjadi satu halaman */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Stok Kulkas */}
        <Route path="/stok" element={<Stok />} />

        {/* Notifikasi */}
        <Route path="/notifikasi" element={<Notifikasi />} />

        {/* Profil */}
        <Route path="/profil" element={<Profil />} />

        {/* Nutrisi */}
        <Route path="/nutrisi" element={<Nutrisi />} />

        {/* Si Kecil */}
        <Route path="/si-kecil" element={<SiKecil />} />

        {/* Splash */}
        <Route path="/splash" element={<Splash />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;