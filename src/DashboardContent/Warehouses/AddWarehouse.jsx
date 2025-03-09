import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  th: {
    addWarehouse: "เพิ่มคลังสินค้า",
    name: "ชื่อ",
    location: "ที่ตั้ง",
    capacity: "ความจุ",
    air_5_ton: "แอร์ 5 ตัน",
    air_10_ton: "แอร์ 10 ตัน",
    air_20_ton: "แอร์ 20 ตัน",
    add: "เพิ่มโกดัง",
    adding: "กำลังเพิ่ม...",
    success: "สำเร็จ!",
    error: "เกิดข้อผิดพลาด!",
  },
  en: {
    addWarehouse: "Add Warehouse",
    name: "Name",
    location: "Location",
    capacity: "Capacity",
    air_5_ton: "Air 5 Ton",
    air_10_ton: "Air 10 Ton",
    air_20_ton: "Air 20 Ton",
    add: "Add Warehouse",
    adding: "Adding...",
    success: "Success!",
    error: "Error!",
  },
};

const AddWarehouse = () => {
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [air5Ton, setAir5Ton] = useState(0);
  const [air10Ton, setAir10Ton] = useState(0);
  const [air20Ton, setAir20Ton] = useState(0);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalCapacity = air5Ton + air10Ton + air20Ton; // คำนวณความจุรวม
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/warehouses`, {
        location,
        capacity: totalCapacity,
        air_5_ton: air5Ton,
        air_10_ton: air10Ton,
        air_20_ton: air20Ton,
      });

      if (response.status === 201) {
        Swal.fire(translations[language].success, "Warehouse added successfully.", "success");
        navigate("/dashboard/warehouses");
      }
    } catch (err) {
      Swal.fire(translations[language].error, "Failed to add warehouse.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt">
        <div className="flex w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{translations[language].addWarehouse}</h1>
        </div>

        <form onSubmit={handleSubmit} className="text-sm font-medium">
      
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              {translations[language].location}
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="air_5_ton" className="block text-sm font-medium text-gray-700">
              {translations[language].air_5_ton}
            </label>
            <input
              type="number"
              id="air_5_ton"
              value={air5Ton}
              onChange={(e) => setAir5Ton(parseInt(e.target.value, 10) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="air_10_ton" className="block text-sm font-medium text-gray-700">
              {translations[language].air_10_ton}
            </label>
            <input
              type="number"
              id="air_10_ton"
              value={air10Ton}
              onChange={(e) => setAir10Ton(parseInt(e.target.value, 10) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="air_20_ton" className="block text-sm font-medium text-gray-700">
              {translations[language].air_20_ton}
            </label>
            <input
              type="number"
              id="air_20_ton"
              value={air20Ton}
              onChange={(e) => setAir20Ton(parseInt(e.target.value, 10) || 0)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn bg-blue text-white hover:bg-blue ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? translations[language].adding : translations[language].add}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWarehouse;
