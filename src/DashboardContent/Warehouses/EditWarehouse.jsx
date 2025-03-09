import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  th: {
    editWarehouse: "แก้ไขคลังสินค้า",
    location: "ที่ตั้ง",
    air5Ton: "แอร์ 5 ตัน",
    air10Ton: "แอร์ 10 ตัน",
    air20Ton: "แอร์ 20 ตัน",
    capacity: "ความจุ",
    updateWarehouse: "อัปเดตคลังสินค้า",
    updating: "กำลังอัปเดต...",
    errorFetch: "ไม่สามารถดึงข้อมูลคลังสินค้าได้",
    successUpdate: "อัปเดตคลังสินค้าสำเร็จ",
    errorUpdate: "ไม่สามารถอัปเดตคลังสินค้าได้",
  },
  en: {
    editWarehouse: "Edit Warehouse",
    location: "Location",
    air5Ton: "Air 5 Ton",
    air10Ton: "Air 10 Ton",
    air20Ton: "Air 20 Ton",
    capacity: "Capacity",
    updateWarehouse: "Update Warehouse",
    updating: "Updating...",
    errorFetch: "Failed to fetch warehouse details.",
    successUpdate: "Warehouse updated successfully.",
    errorUpdate: "Failed to update warehouse.",
  },
};

const EditWarehouse = () => {
  const { warehouseId } = useParams();
  const [location, setLocation] = useState("");
  const [air5Ton, setAir5Ton] = useState(0);
  const [air10Ton, setAir10Ton] = useState(0);
  const [air20Ton, setAir20Ton] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/warehouse/${warehouseId}`);
        const { location, air_5_ton, air_10_ton, air_20_ton } = response.data;
        setLocation(location);
        setAir5Ton(air_5_ton || 0);
        setAir10Ton(air_10_ton || 0);
        setAir20Ton(air_20_ton || 0);
        setCapacity((air_5_ton || 0) + (air_10_ton || 0) + (air_20_ton || 0));
      } catch (err) {
        Swal.fire("Error!", translations[language].errorFetch, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouse();
  }, [warehouseId, language]);

  useEffect(() => {
    setCapacity(air5Ton + air10Ton + air20Ton);
  }, [air5Ton, air10Ton, air20Ton]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/warehouse/${warehouseId}`, {
        location,
        air_5_ton: air5Ton,
        air_10_ton: air10Ton,
        air_20_ton: air20Ton,
      });
      Swal.fire("Success!", translations[language].successUpdate, "success");
      navigate("/dashboard/warehouses");
    } catch (err) {
      Swal.fire("Error!", translations[language].errorUpdate, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full mt-5">
        <div className="flex w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{translations[language].editWarehouse}</h1>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="text-sm font-medium">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].location}</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input input-bordered w-full" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].air5Ton}</label>
              <input type="number" value={air5Ton} onChange={(e) => setAir5Ton(parseInt(e.target.value) || 0)} className="input input-bordered w-full" required min="0" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].air10Ton}</label>
              <input type="number" value={air10Ton} onChange={(e) => setAir10Ton(parseInt(e.target.value) || 0)} className="input input-bordered w-full" required min="0" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].air20Ton}</label>
              <input type="number" value={air20Ton} onChange={(e) => setAir20Ton(parseInt(e.target.value) || 0)} className="input input-bordered w-full" required min="0" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{translations[language].capacity}</label>
              <input type="number" value={capacity} readOnly className="input input-bordered w-full bg-gray-100" />
            </div>
            <button type="submit" className="btn bg-blue text-white hover:bg-blue" disabled={loading}>
              {loading ? translations[language].updating : translations[language].updateWarehouse}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditWarehouse;
