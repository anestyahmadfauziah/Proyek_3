import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
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

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

                {/* Stok Kulkas */}
        <Route path="/stok" element={<Stok />} />

        {/* Notifikasi */}
        <Route path="/notifikasi" element={<Notifikasi />} />

        {/* Profil */}
        <Route path="/profil" element={<Profil />} />

        <Route path="/nutrisi" element={<Nutrisi />} />

        <Route path="/si-kecil" element={<SiKecil />} />

        {/* Splash jika masih ingin digunakan */}
        <Route path="/splash" element={<Splash />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;