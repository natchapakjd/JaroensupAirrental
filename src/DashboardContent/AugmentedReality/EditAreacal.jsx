import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const EditAreacal = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assignment_id: "",
    location_name: "",
    width: "",
    height: "",
    air_conditioners_needed: "",
    area_type: "",
    air_5ton_used: "",
    air_10ton_used: "",
    air_20ton_used: "",
  });
  const [loading, setLoading] = useState(true);

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
    <div className="mx-auto p-6 bg-white shadow rounded-lg font-inter">
      <h2 className="text-2xl font-bold mb-4">Edit Area Calculation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Assignment ID
          <input
            type="text"
            name="assignment_id"
            value={formData.assignment_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </label>

        <label className="block">
          Location Name
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
          Width (m)
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
          Height (m)
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
          AC Needed
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
          5 Ton AC Used
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
          10 Ton AC Used
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
          20 Ton AC Used
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
          Area Type
          <select
            name="area_type"
            value={formData.area_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="750">1. ห้องนอนปกติ - ไม่โดนแดดโดยตรง</option>
            <option value="800">2. ห้องนอนปกติ - โดนแดดมาก</option>
            <option value="850">3. ห้องทำงาน - ไม่โดนแดดโดยตรง</option>
            <option value="900">4. ห้องทำงาน - โดนแดดมาก</option>
            <option value="950">5. ร้านอาหาร/ร้านค้า - ไม่โดนแดด</option>
            <option value="1000">6. ร้านอาหาร/ร้านค้า - โดนแดดมาก</option>
            <option value="1100">7. ห้องประชุม</option>
            <option value="1200">8. ห้องประชุมขนาดใหญ่เพดานสูง</option>
            <option value="1300">9. สนามเปิด/พื้นที่เปิด</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-blue text-white py-2 rounded hover:bg-blue"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditAreacal;
