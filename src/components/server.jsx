import { useState, useEffect } from "react";
import axios from "axios";
import Main from "../App";

export default function Server() {
  const [serverStatus, setServerStatus] = useState(null); // null untuk loading

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get("http://serveo.net:8080/active-users");
        setServerStatus("up!");
      } catch (error) {
        setServerStatus("down");
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Cek setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center text-center p-4 flex-col">
      <div className="flex items-center">
        <p className="font-normal text-base sm:text-lg m-0 leading-none">
          rooxdotnet-wakatobi{" "}
        </p>
        <p className="mx-3 text-lg sm:text-3xl "> - </p>
        <p
          className={`text-base sm:text-lg font-medium m-0 leading-none ${
            serverStatus === "up!"
              ? "text-green-200"
              : serverStatus === "down"
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          server is {serverStatus === null ? "Loading..." : serverStatus}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <Main></Main>
      </div>
    </div>
  );
}
