import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButton from "../../components/BackButton";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  en: {
    addAreacal: "Add Area Calculation",
    locationName: "Location Name",
    width: "Width",
    height: "Height",
    airConditionersNeeded: "Air Conditioners Needed",
    roomType: "Room Type",
    submit: "Add Calculation",
    noAssignments: "No available assignments",
  },
  th: {
    addAreacal: "เพิ่มการคำนวณพื้นที่",
    locationName: "ชื่อสถานที่",
    width: "ความกว้าง",
    height: "ความสูง",
    airConditionersNeeded: "จำนวนเครื่องปรับอากาศที่ต้องการ",
    roomType: "ประเภทห้อง",
    submit: "เพิ่มการคำนวณ",
    noAssignments: "ไม่มีงานที่สามารถเลือกได้",
  },
};

const AddAreacal = () => {
  const [formData, setFormData] = useState({
    assignment_id: "",
    location_name: "",
    width: "",
    height: "",
    air_conditioners_needed: "",
    room_type_id: "1",
  });

  const [assignments, setAssignments] = useState([]);
  const [areaCalculations, setAreaCalculations] = useState([]); // State for area calculations
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(1);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
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

  // Fetch area calculations
  const fetchAreaCalculations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/area_cal-paging`, {
        params: { page: 1, limit: 1000 }, // Fetch all area calculations (adjust limit as needed)
      });
      setAreaCalculations(response.data.data);
    } catch (error) {
      console.error("Error fetching area calculations:", error);
    }
  };

  // Fetch assignments and filter out duplicates and those already in area_cal
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Fetch area calculations first
        await fetchAreaCalculations();

        // Fetch assignments
        const response = await axios.get(`${apiUrl}/appointments`);

        // Remove duplicates based on task_id
        const uniqueAssignments = response.data.reduce((acc, current) => {
          const existing = acc.find((item) => item.task_id === current.task_id);
          if (!existing) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Filter out assignments that are already in area_cal
        const usedAssignmentIds = areaCalculations.map((area) => area.assignment_id);
        const filteredAssignments = uniqueAssignments.filter(
          (assignment) => !usedAssignmentIds.includes(assignment.assignment_id)
        );

        console.log("Filtered Assignments:", filteredAssignments);
        setAssignments(filteredAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [apiUrl, areaCalculations]);

  // Fetch room types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/area-types`);
        setRoomTypes(response.data);
        if (response.data.length > 0) {
          setSelectedRoomType(response.data[0].room_type_id);
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
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
        room_type_id: selectedRoomType,
      });
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/adminLog`, {
        admin_id: user_id,
        action: `เพิ่มพื้นที่ใหม่โดยไม่คำนวณพื้นที่(ชื่อสถานที่): ${formData.location_name}`,
      });
      Swal.fire("Success", "Area calculation added successfully!", "success");
      navigate("/dashboard/area-cal/content");
    } catch (error) {
      Swal.fire("Error", "Failed to add area calculation", "error");
      console.error("Error adding area calculation:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-6 mx-auto bg-white rounded-lg shadow-md my-5">
        <div className="flex w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{translations[language].addAreacal}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <select
            name="assignment_id"
            className="input input-bordered w-full mb-2"
            value={formData.assignment_id}
            onChange={handleChange}
            required
          >
            <option value="">{translations[language].selectAssignment || "Select Assignment ID"}</option>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <option key={assignment.assignment_id} value={assignment.assignment_id}>
                  {assignment.assignment_id}. {assignment.description}
                </option>
              ))
            ) : (
              <option disabled>{translations[language].noAssignments}</option>
            )}
          </select>
          <input
            type="text"
            name="location_name"
            placeholder={translations[language].locationName}
            className="input input-bordered w-full mb-2"
            value={formData.location_name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="width"
            placeholder={translations[language].width}
            className="input input-bordered w-full mb-2"
            value={formData.width}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="height"
            placeholder={translations[language].height}
            className="input input-bordered w-full mb-2"
            value={formData.height}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="air_conditioners_needed"
            placeholder={translations[language].airConditionersNeeded}
            className="input input-bordered w-full mb-2"
            value={formData.air_conditioners_needed}
            onChange={handleChange}
            required
          />
          <select
            id="room-type"
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="select-air input input-bordered w-full mb-2"
            required
          >
            {roomTypes.map((roomType, index) => (
              <option key={index + 1} value={roomType.id}>
                {index + 1}. {roomType.room_name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn bg-blue text-white w-full hover:bg-blue">
            {translations[language].submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAreacal;