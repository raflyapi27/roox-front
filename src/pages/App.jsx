import Beli from "../components/beli";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState("01");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          "http://serveo.net:8080/active-users"
        );

        if (response.data && typeof response.data.count === "number") {
          setActiveUsers(response.data.count.toString().padStart(2, "0"));
          setError(null); // Hapus error jika berhasil
        } else {
          throw new Error("Format data tidak valid");
        }
      } catch (error) {
        console.error("Error fetching active users:", error);
        setError("Gagal mengambil jumlah pengguna aktif");
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 60000);

    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("id-ID", { month: "long" });
  const year = today.getFullYear();

  return (
    <div className="flex flex-col items-center justify-center text-white mt-5">
      {/* Bagian Users Aktif & Tanggal */}
      <div className="flex items-center justify-between text-center w-full max-w-lg gap-5">
        {/* Active Users */}
        <div className="flex-1 flex items-center justify-end">
          <p className="text-[clamp(3rem,5vw,4rem)]">{activeUsers}</p>
          <div className="text-left ml-2">
            <h2 className="text-lg sm:text-xl md:text-2xl leading-tight">
              Users
            </h2>
            <h2 className="text-lg sm:text-xl md:text-2xl leading-tight">
              Online!
            </h2>
          </div>
        </div>

        {/* Garis Pemisah */}
        <div className="w-px h-16 mt-3 bg-gray-400 self-stretch"></div>

        {/* Date Section */}
        <div className="flex-1 flex items-center justify-start">
          <p className="text-[clamp(3rem,5vw,4rem)]">{day}</p>
          <div className="text-left mx-2 font-medium">
            <h2 className="text-lg sm:text-xl md:text-2xl leading-tight">
              {month}
            </h2>
            <h2 className="text-lg sm:text-xl md:text-2xl leading-tight">
              {year}
            </h2>
          </div>
        </div>
      </div>

      {/* Pesan Error jika API gagal */}
      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* Gambar */}
      <img className="w-52 my-5" src="/src/assets/wifi.svg" alt="WiFi Icon" />

      {/* Tombol Beli */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Beli />
      </div>
    </div>
  );
}
