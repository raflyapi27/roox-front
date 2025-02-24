import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const DetailPembayaran = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Mapping paket ke profil Mikrotik
  const profileMap = {
    "Paket 4 jam": "online1",
    "Paket 1 hari": "online2",
    "Paket 2 hari": "online3",
    "Paket 7 hari": "online4",
  };

  // Ambil data order dari Firebase
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOrderData(data);
          setVoucher(data.voucher || null);
          setPaymentStatus(data.paymentStatus || "pending");
        } else {
          alert("Data tidak ditemukan. Pastikan Anda melakukan pembayaran.");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        alert("Terjadi kesalahan saat mengambil data pesanan.");
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Salin teks ke clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin: " + text);
  };

  // Cek apakah voucher sudah pernah digunakan
  const checkVoucherExists = async (voucherCode) => {
    const voucherRef = doc(db, "vouchers", voucherCode);
    const voucherSnap = await getDoc(voucherRef);
    return voucherSnap.exists();
  };

  // Simpan voucher ke Firebase
  const saveVoucherToFirebase = async (voucherCode) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        voucher: voucherCode,
        paymentStatus: "success",
      });

      // Simpan voucher ke koleksi "vouchers" agar tidak bisa dipakai ulang
      const voucherRef = doc(db, "vouchers", voucherCode);
      await setDoc(voucherRef, {
        orderId: orderId,
        voucher: voucherCode,
        createdAt: new Date(),
      });

      setVoucher(voucherCode);
      alert("Voucher berhasil disimpan!");
    } catch (error) {
      console.error("Error saving voucher:", error);
      alert("Terjadi kesalahan saat menyimpan voucher.");
    }
  };

  // Proses pembayaran dan pembuatan voucher di Mikrotik
  const handlePayment = async () => {
    if (!voucherCode.trim()) {
      alert("Masukkan kode voucher terlebih dahulu!");
      return;
    }

    const voucherExists = await checkVoucherExists(voucherCode);
    if (voucherExists) {
      alert("Voucher itu sudah dipakai, masukkan voucher lain");
      return;
    }

    if (!orderData?.token) {
      alert("Token pembayaran tidak ditemukan.");
      return;
    }

    window.snap.pay(orderData.token, {
      onSuccess: async function () {
        setPaymentStatus("success");
        alert("Pembayaran berhasil!");

        try {
          // Kirim permintaan ke backend untuk membuat voucher di Mikrotik
          const response = await fetch(
            "http://serveo.net:8080/api/create-voucher-after-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                voucherCode: voucherCode,
                profile: profileMap[orderData.selectedProduct.name], // Profil Mikrotik sesuai paket
              }),
            }
          );

          const result = await response.json();

          if (response.ok) {
            await saveVoucherToFirebase(voucherCode); // Simpan voucher ke Firebase setelah sukses
          } else {
            alert("Gagal membuat voucher: " + result.error);
          }
        } catch (error) {
          console.error("Error creating voucher:", error);
          alert("Terjadi kesalahan saat membuat voucher.");
        }
      },
      onPending: function () {
        setPaymentStatus("pending");
        alert("Pembayaran tertunda!");
      },
      onError: function () {
        setPaymentStatus("failed");
        alert("Pembayaran gagal!");
      },
      onClose: function () {
        alert("Pembayaran dibatalkan");
      },
    });
  };

  if (!orderData)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Detail Pembayaran
      </h1>
      <div className="mb-4 p-4 rounded-lg bg-emerald-700 text-white">
        <p>
          <strong>Nama Paket:</strong> {orderData.selectedProduct.name}
        </p>
        <p>
          <strong>Harga:</strong> Rp{" "}
          {orderData.selectedProduct.price.toLocaleString()}
        </p>
        <p
          className={`text-lg mt-2 font-semibold ${
            paymentStatus === "success" ? "text-green-300" : "text-red-300"
          }`}
        >
          *{paymentStatus === "success" ? "Sudah Dibayar" : "Belum Dibayar"}
        </p>
      </div>
      <div>
        <p className="text-lg font-semibold">Tokenmu :</p>
        <p className="bg-emerald-700 pl-2 rounded flex justify-between items-center">
          {orderData.orderId}
          <button
            onClick={() => handleCopy(orderData.orderId)}
            className="bg-emerald-600 p-3 rounded"
          >
            Salin
          </button>
        </p>
        <p className="text-sm text-gray-200">
          Jangan lupakan tokenmu, salin bila perlu
        </p>
      </div>
      {!voucher && (
        <div className="text-white mt-4">
          <h2 className="text-lg font-semibold">Buat Voucher!</h2>
          <input
            type="text"
            className="w-full p-3 rounded bg-white text-black"
            value={voucherCode}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z0-9]{0,6}$/.test(value)) {
                setVoucherCode(value);
              }
            }}
            placeholder="Masukkan kode voucher, bebas"
          />
          <p className="text-sm text-gray-200">
            Voucher dibuat setelah pembayaran berhasil
          </p>
        </div>
      )}
      {voucher && (
        <div className="mt-6 text-white">
          <h2 className="text-lg font-semibold">Vouchermu :</h2>
          <p className="pl-2 rounded bg-green-100 flex text-emerald-600 justify-between items-center">
            <strong>{voucher}</strong>
            <button
              onClick={() => handleCopy(voucher)}
              className="ml-2 p-3 bg-emerald-600 text-white rounded"
            >
              Salin
            </button>
          </p>
        </div>
      )}
      {!voucher && (
        <button
          className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 mt-6"
          onClick={handlePayment}
        >
          Bayar Sekarang
        </button>
      )}
    </div>
  );
};

export default DetailPembayaran;
