import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../../firebase"; // Pastikan path-nya benar
import { doc, setDoc, getDoc } from "firebase/firestore";

const Produk = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tokenInput, setTokenInput] = useState(""); // Untuk cek token
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "Paket 4 jam", price: 1000 },
    { id: 2, name: "Paket 1 hari", price: 3000 },
    { id: 3, name: "Paket 2 hari", price: 6000, discountMessage: "+ 5 jam" },
    { id: 4, name: "Paket 7 hari", price: 21000, discountMessage: "+ 10 jam" },
  ];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handlePayment = async () => {
    if (!selectedProduct) {
      alert("Pilih paket terlebih dahulu!");
      return;
    }
    if (!customerName || !customerPhone) {
      alert("Harap isi semua data pelanggan!");
      return;
    }

    setLoading(true);
    try {
      const orderId = `roox-${Date.now()}`; // Menggunakan prefix "roox-"
      const response = await axios.post("http://serveo.net:8080/api/payment", {
        orderId,
        grossAmount: selectedProduct.price,
        customerName,
        phone: customerPhone,
      });

      setLoading(false);

      if (response.data.token) {
        const orderData = {
          orderId,
          selectedProduct,
          token: response.data.token,
          customerName,
          customerPhone,
        };

        // Simpan ke Firebase Firestore
        await setDoc(doc(db, "orders", orderId), orderData);

        // Simpan ke localStorage sebagai cache sementara
        localStorage.setItem(orderId, JSON.stringify(orderData));

        // Navigasi ke halaman pembayaran
        navigate(`/detail-pembayaran/${orderId}`, {
          state: orderData,
        });
      } else {
        alert("Token pembayaran tidak valid.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Terjadi kesalahan saat memulai pembayaran.");
      setLoading(false);
    }
  };

  const checkToken = async () => {
    if (!tokenInput.trim()) {
      alert("Masukkan token terlebih dahulu!");
      return;
    }

    try {
      const docRef = doc(db, "orders", tokenInput);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Jika data ditemukan di Firestore, navigasi ke halaman pembayaran
        navigate(`/detail-pembayaran/${tokenInput}`, {
          state: docSnap.data(),
        });
      } else {
        alert("Token tidak ditemukan. Periksa kembali.");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      alert("Terjadi kesalahan saat mengecek token.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-lg text-left">
        silakan pilih paket yang akan dibeli :
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`p-4 rounded-lg cursor-pointer bg-emerald-700 text-white relative shadow-lg transition duration-300 ${
              selectedProduct?.id === product.id ? "scale-105" : ""
            }`}
            onClick={() => handleProductSelect(product)}
          >
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-sm">Rp {product.price.toLocaleString()}</p>
            {product.discountMessage && (
              <span className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-2 py-1 font-semibold rounded-bl-lg">
                {product.discountMessage}
              </span>
            )}
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="mb-4 p-4 rounded-lg bg-emerald-700 flex gap-2">
          <p>{selectedProduct.name}</p>
          <p>Rp {selectedProduct.price.toLocaleString()}</p>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Nama Anda"
          className="p-2 border rounded w-full mb-2 text-black"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nomor Telepon"
          className="p-2 border rounded w-full text-black"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>

      <button
        className="w-full font-semibold p-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:bg-gray-400"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>

      <hr className="my-6" />

      <h2 className="text-xl text-left mb-4">cek pesanan :</h2>
      <p>masukkan token anda disini :</p>
      <input
        type="text"
        placeholder="roox-123..."
        className="p-2 border rounded w-full mb-2 text-black"
        value={tokenInput}
        onChange={(e) => {
          if (e.target.value.length <= 23) {
            setTokenInput(e.target.value);
          }
        }}
      />
      <button
        className="w-full p-3 bg-emerald-600 font-semibold text-white rounded hover:bg-emerald-700"
        onClick={checkToken}
      >
        Cek Pesanan
      </button>
    </div>
  );
};

export default Produk;
