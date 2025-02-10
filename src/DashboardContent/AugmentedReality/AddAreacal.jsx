import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddAreacal = () => {
  const [formData, setFormData] = useState({
    assignment_id: "",
    location_name: "",
    width: "",
    height: "",
    air_conditioners_needed: "",
    area_type: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [roomType, setRoomType] = useState("750");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/appointments`);
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/area_cal`, {
        ...formData,
        area_type: roomType,
      });
      Swal.fire("Success", "Area calculation added successfully!", "success");
      navigate("/dashboard/area-cal/content");
    } catch (error) {
      Swal.fire("Error", "Failed to add area calculation", "error");
      console.error("Error adding area calculation:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md my-5">
      <h2 className="text-2xl font-semibold mb-4">Add Area Calculation</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="assignment_id"
          className="input input-bordered w-full mb-2"
          value={formData.assignment_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Assignment ID</option>
          {assignments.map((assignment) => (
            <option key={assignment.assignment_id} value={assignment.assignment_id}>
              {assignment.assignment_id}. {assignment.description}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="location_name"
          placeholder="Location Name"
          className="input input-bordered w-full mb-2"
          value={formData.location_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="width"
          placeholder="Width (m)"
          className="input input-bordered w-full mb-2"
          value={formData.width}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="height"
          placeholder="Height (m)"
          className="input input-bordered w-full mb-2"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="air_conditioners_needed"
          placeholder="AC Needed"
          className="input input-bordered w-full mb-2"
          value={formData.air_conditioners_needed}
          onChange={handleChange}
          required
        />
        <select
          id="room-type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="select-air input input-bordered w-full mb-2"
        >
          <option value="750">1. ห้องนอนปกติ - ไม่โดนแดดโดยตรง</option>
          <option value="800">2. ห้องนอนปกติ - โดนแดดมาก</option>
          <option value="850">3.ห้องทำงาน - ไม่โดนแดดโดยตรง</option>
          <option value="900">4.ห้องทำงาน - โดนแดดมาก</option>
          <option value="950">5.ร้านอาหาร/ร้านค้า - ไม่โดนแดด</option>
          <option value="1000">6.ร้านอาหาร/ร้านค้า - โดนแดดมาก</option>
          <option value="1100">7.ห้องประชุม</option>
          <option value="1200">8.ห้องประชุมขนาดใหญ่เพดานสูง</option>
          <option value="1300">9.สนามเปิด/พื้นที่เปิด</option>
        </select>
        <button type="submit" className="btn bg-blue text-white w-full hover:bg-blue">
          Add Calculation
        </button>
      </form>
    </div>
  );
};

export default AddAreacal;