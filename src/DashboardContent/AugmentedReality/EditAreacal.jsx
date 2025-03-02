import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

// Translations object
const translations = {
  en: {
    editAreacal: "Edit Area Calculation",
    locationName: "Location Name",
    width: "Width",
    height: "Height",
    airConditionersNeeded: "Air Conditioners Needed",
    fiveTonUsed: "5 Ton AC Used",
    tenTonUsed: "10 Ton AC Used",
    twentyTonUsed: "20 Ton AC Used",
    areaType: "Area Type",
    submit: "Update",
  },
  th: {
    editAreacal: "แก้ไขการคำนวณพื้นที่",
    locationName: "ชื่อสถานที่",
    width: "ความกว้าง",
    height: "ความสูง",
    airConditionersNeeded: "จำนวนเครื่องปรับอากาศที่ต้องการ",
    fiveTonUsed: "เครื่องปรับอากาศ 5 ตันที่ใช้",
    tenTonUsed: "เครื่องปรับอากาศ 10 ตันที่ใช้",
    twentyTonUsed: "เครื่องปรับอากาศ 20 ตันที่ใช้",
    areaType: "ประเภทพื้นที่",
    submit: "อัปเดต",
  },
};

const EditAreacal = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assignment_id: "",
    location_name: "",
    width: "",
    height: "",
    air_conditioners_needed: "",
    room_type_id: "",
    air_5ton_used: "",
    air_10ton_used: "",
    air_20ton_used: "",
  });
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [areaTypes, setAreaTypes] = useState([]);

  useEffect(() => {
    const fetchAreaTypes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/area-types`
        );
        setAreaTypes(res.data);
      } catch (err) {
        console.error("Error fetching area types:", err);
      }
    };

    fetchAreaTypes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  // Fetch area calculation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/area_cal/${areaId}`
        );
        if (res.data) {
          setFormData(res.data[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [areaId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/area_cal/${areaId}`,
        formData
      );
      await Swal.fire({
        title: "Updated Successfully!",
        text: "The area calculation has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/area-cal/content");
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update area calculation.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto p-6 bg-white shadow rounded-lg font-prompt">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translations[language].editAreacal}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            {translations[language].locationName}
            <input
              type="text"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].width} (m)
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].height} (m)
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].airConditionersNeeded}
            <input
              type="number"
              name="air_conditioners_needed"
              value={formData.air_conditioners_needed}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].fiveTonUsed}
            <input
              type="number"
              name="air_5ton_used"
              value={formData.air_5ton_used}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].tenTonUsed}
            <input
              type="number"
              name="air_10ton_used"
              value={formData.air_10ton_used}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].twentyTonUsed}
            <input
              type="number"
              name="air_20ton_used"
              value={formData.air_20ton_used}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </label>

          <label className="block">
            {translations[language].areaType}
            <select
              name="area_type"
              value={formData.area_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select an area type</option>
              {areaTypes.map((type, index) => (
                <option key={index + 1} value={type.id}>
                  {index + 1} {type.room_name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full bg-blue text-white py-2 rounded hover:bg-blue"
          >
            {translations[language].submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAreacal;
