import { useEffect, useState } from "react";
import { toHijri } from "hijri-date-converter";
import Kupon from "../components/kupon";

export default function Ramadhan() {
  const [hijriDate, setHijriDate] = useState({
    day: "01",
    month: "Ramadhan",
    year: "1446",
  });

  useEffect(() => {
    const today = new Date(); // Ambil tanggal hari ini
    const hijri = toHijri(today); // Gunakan objek Date langsung

    if (hijri) {
      const hijriMonths = [
        "Muharram",
        "Safar",
        "Rabi'ul Awwal",
        "Rabi'ul Akhir",
        "Jumadil Awwal",
        "Jumadil Akhir",
        "Rajab",
        "Sya'ban",
        "Ramadhan",
        "Syawal",
        "Dzulqa'dah",
        "Dzulhijjah",
      ];

      setHijriDate({
        day: hijri.d ? hijri.d.toString().padStart(2, "0") : "01", // Handle undefined
        month: hijriMonths[hijri.m - 1] || "Ramadhan", // Handle bulan undefined
        year: hijri.y ? hijri.y.toString() : "1446", // Handle tahun undefined
      });
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 w-screen sm:w-auto justify-center items-center">
    <div className="max-w-4xl w-full bg-emerald-700 p-6 rounded-xl shadow-md">
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
