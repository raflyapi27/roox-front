import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Server from "./components/server.jsx";
import Produk from "./components/produk.jsx";
import DetailPembayaran from "./components/detailPembayaran.jsx"; // Halaman pembayaran

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Server />} />  {/* Halaman utama */}
        <Route path="/produk" element={<Produk />} />  {/* Halaman pilih produk */}
        <Route path="/detail-pembayaran/:orderId" element={<DetailPembayaran />} />
      </Routes>
    </Router>
  </StrictMode>
);
