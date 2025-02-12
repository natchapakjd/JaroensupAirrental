import React, { forwardRef, useState, useEffect } from "react";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import "./Interface.css";
import useModelsStore from "../stores/modelStore";
import axios from "axios";

const Interface = forwardRef(({ props }, ref) => {
  const {
    animations,
    animationIndex,
    setAnimationIndex,
    currentModelName,
    setCurrentModelName,
  } = useCharacterAnimations();

  const {
    rotateSelectedModel,
    selectedModel,
    setModels,
    removeModelById,
    isAnimating,
    toggleAnimation,
    models,
  } = useModelsStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [roomType, setRoomType] = useState("750"); // ค่าพื้นฐานของ area_type
  const [width, setWidth] = useState(""); // Optional Width
  const [height, setHeight] = useState(""); // Optional Height

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/appointments`)
      .then((response) => {
        const data = response.data;
        setAppointments(data);
        if (data.length > 0) {
          setSelectedAppointment(data[0].assignment_id);
        }
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, []);

  // 📌 นับจำนวนโมเดลทั้งหมดที่ถูกวาง
  const totalModels = models.length;

  // 📌 นับจำนวนแต่ละชนิดของแอร์ที่วาง
  const modelCounts = models.reduce((acc, model) => {
    acc[model.modelName] = (acc[model.modelName] || 0) + 1;
    return acc;
  }, {});

  // 📌 ฟังก์ชันส่งข้อมูลไปยัง API
  const saveCalculation = () => {
    const payload = {
      assignment_id: selectedAppointment,
      location_name: locationName,
      width: width || 10, // ใช้ค่า default ถ้าไม่กรอก
      height: height || 10, // ใช้ค่า default ถ้าไม่กรอก
      air_conditioners_needed: totalModels,
      area_type: roomType, // ✅ ใช้ค่าจาก roomType
      air_5ton_used: modelCounts["air5tonCC"] || 0,
      air_10ton_used: modelCounts["air10tonCC"] || 0,
      air_20ton_used: modelCounts["air20tonCC"] || 0,
      grid_pattern: models,
    };

    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/area_cal`, payload)
      .then((response) => {
        alert("Saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving calculation:", error);
        alert("Failed to save data");
      });
  };

  const clearModels = () => {
    setModels([]); // ล้างโมเดลทั้งหมด
  };

  return (
    <div id="overlay-content" ref={ref}>
      <div className="dom-container">
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖ Close" : "☰ Menu"}
        </button>

        {isMenuOpen && (
          <div className="popup-menu">
            {/* 🔥 ส่วนเลือกโมเดล */}
            <div className="dropdown-ar-container">
              <label className="dropdown-ar label">Select Model:</label>
              <select
                className="dropdown-ar"
                value={currentModelName}
                onChange={(e) => setCurrentModelName(e.target.value)}
              >
                <option value="air5tonCC">Air 5 Ton CC</option>
                <option value="air10tonCC">Air 10 Ton CC</option>
                <option value="air20tonCC">Air 20 Ton CC</option>
              </select>
            </div>

            {/* 📌 ส่วนแสดงจำนวนโมเดล */}
            <div className="model-count-container">
              <h3>Total Models: {totalModels}</h3>
              <p>Air 5 Ton: {modelCounts["air5tonCC"] || 0}</p>
              <p>Air 10 Ton: {modelCounts["air10tonCC"] || 0}</p>
              <p>Air 20 Ton: {modelCounts["air20tonCC"] || 0}</p>
            </div>

            <div className="button-container">
              {animations.map((animation, index) => (
                <button
                  key={animation}
                  className={`button ${
                    index === animationIndex ? "active" : ""
                  }`}
                  onClick={() => setAnimationIndex(index)}
                >
                  {animation
                    .split("_")
                    .map(
                      (partOfName) =>
                        partOfName[0].toUpperCase() + partOfName.substring(1)
                    )
                    .join(" ")}
                </button>
              ))}

              <button
                className="button"
                onClick={() => rotateSelectedModel(-Math.PI / 8)}
                disabled={!selectedModel}
              >
                Rotate Left
              </button>
              <button
                className="button"
                onClick={() => rotateSelectedModel(Math.PI / 8)}
                disabled={!selectedModel}
              >
                Rotate Right
              </button>
              <button
                className="button"
                onClick={() => removeModelById(selectedModel)}
                disabled={!selectedModel}
              >
                Remove Selected
              </button>
              <button className="button" onClick={clearModels}>
                Clear All Models
              </button>

              <button className="button" onClick={toggleAnimation}>
                {isAnimating ? "Stop Animation" : "Start Animation"}
              </button>
            </div>
            {/* 📌 Grid Container */}
            <div className="grid-container">
              {/* 🔥 Dropdown เลือก Appointment */}
              <div className="dropdown-ar-container">
                <label className="dropdown-ar-label">Select Appointment:</label>
                <select
                  className="dropdown-ar"
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                >
                  {appointments.map((appointment) => (
                    <option
                      key={appointment.assignment_id}
                      value={appointment.assignment_id}
                    >
                      {appointment.assignment_id} - {appointment.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔥 Input location_name */}
              <div className="input-container">
                <label className="input-label">Location Name:</label>
                <input
                  type="text"
                  className="input-field"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Enter location name"
                />
              </div>

              {/* 🔥 Dropdown เลือก Room Type */}
              <div className="dropdown-container-ar">
                <label className="dropdown-ar-label">Select Room Type:</label>
                <select
                  className="dropdown-ar"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
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
              </div>

              {/* 📌 Input Optional Width */}
              <div className="input-container">
                <label className="input-label">Width (Optional):</label>
                <input
                  type="number"
                  className="input-field"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Enter width"
                />
              </div>

              {/* 📌 Input Optional Height */}
              <div className="input-container">
                <label className="input-label">Height (Optional):</label>
                <input
                  type="number"
                  className="input-field"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height"
                />
              </div>
               {/* 📌 ปุ่มเซฟ */}
           
            </div>
            <div className="button-container-right">
              <button className="button save-button" onClick={saveCalculation}>
                Save Calculation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Interface;
