import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate dari react-router-dom
import Kupon from "../components/kupon";

export default function Beli() {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk arahkan ke halaman produk
  const goToProduk = () => {
    navigate("/produk"); // Arahkan ke halaman produk
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 w-screen sm:w-auto justify-center items-center">
  {/* Kontainer 1 */}
  <div className="max-w-4xl w-full bg-emerald-800 p-6 rounded-xl shadow-md">
    <p className="text-4xl text-left">Beli online lebih</p>
    <p className="text-4xl text-left">hemat</p>
    <p className="text-left">Garansi 24 jam, Uang Kembali</p>
    <div className="flex items-center">
      <div
        onClick={goToProduk}
        className="flex items-center bg-sky-500 rounded w-max px-3 mt-6 p-2 cursor-pointer"
      >
        <img src="./src/assets/voucher.svg" className="w-8 absolute mb-4" />
        <p className="text-1xl ml-10 font-medium bg-sky-500">Beli Online</p>
      </div>
      <div className="flex items-center mt-8 ml-2">
        <p className="text-xs mt-2 ml-1">mulai</p>
        <p className="text-2xl font-medium ml-1">Rp1.000</p>
      </div>
    </div>
    {isProcessing && (
      <p className="text-gray-500 mt-4">Sedang memproses pembayaran...</p>
    )}
  </div>

  {/* Kontainer 2 */}
  <div className="max-w-4xl w-full bg-emerald-800 p-6 rounded-xl shadow-md">
    <p className="text-4xl text-left">Gratis voucher</p>
    <p className="text-4xl text-left">setiap hari</p>
    <p className="text-left">voucher gratis, ramadhan</p>
    <div className="flex items-center">
      <Kupon />
    </div>
  </div>
</div>

  );
}
