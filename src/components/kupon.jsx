import React, { useState, useEffect } from "react";
import axios from "axios";

const Voucher = () => {
  // Daftar voucher tetap
  const vouchers = [
    "SAVE50-5678",
    "dika",
    "roox-kareem",
    "SUMMER-1213",
    "WINTER-1415",
  ];

  const [voucher, setVoucher] = useState(vouchers[0]); // Ambil voucher pertama
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://roox.starlaxy.site/active-users"
        );
        setActiveUsers(response.data?.users || []); // Gunakan fallback agar tidak error
      } catch (error) {
        console.error("Error fetching active users:", error);
        setActiveUsers([]); // Reset ke array kosong jika gagal
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, []);

  useEffect(() => {
    if (voucher && activeUsers.length > 0) {
      const userIsActive = activeUsers.some((user) => user.user === voucher);
      setIsActive(userIsActive);
    } else {
      setIsActive(false);
    }
  }, [voucher, activeUsers]);

  return (
    <div className="flex items-center mt-6">
      <div className="bg-emerald-700 w-max pr-5 py-2 rounded shadow-md">
        <p className="text-white text-base ml-2">
          {loading ? "Loading..." : voucher}
        </p>
      </div>
      {loading ? (
        <p className="text-gray-300 text-xl ml-2">Loading...</p>
      ) : isActive ? (
        <p className="text-green-400 text-xl ml-2">✔ Sudah Dipakai</p>
      ) : (
        <p className="text-red-400 text-sm ml-2">✖ Belum Dipakai</p>
      )}
    </div>
  );
};

export default Voucher;
