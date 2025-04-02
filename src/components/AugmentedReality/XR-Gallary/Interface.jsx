import React, { forwardRef, useState, useEffect } from "react";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import "./Interface.css";
import useModelsStore from "../stores/modelStore";
import axios from "axios";
import ImageUpload from "../ImageUpload";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Navigate, useNavigate } from "react-router-dom";
import useXRStore from "../stores/useXRStore";

const translations = {
  en: {
    menuOpen: "☰ Menu",
    menuClose: "✖ Close",
    selectModel: "Select Model:",
    totalModels: "Total Models:",
    air5Ton: "Air 5 Ton",
    air10Ton: "Air 10 Ton",
    air20Ton: "Air 20 Ton",
    selectAppointment: "Select Appointment:",
    locationName: "Location Name:",
    selectRoomType: "Select Room Type:",
    widthOptional: "Width (Optional):",
    heightOptional: "Height (Optional):",
    saveCalculation: "Save Calculation",
    uploadImage: "Upload Image",
    backToDashboard: "Back to Dashboard",
    rotateLeft: "Rotate Left",
    rotateRight: "Rotate Right",
    removeSelected: "Remove Selected",
    clearAllModels: "Clear All Models",
    startAnimation: "Start Animation",
    stopAnimation: "Stop Animation",
    noAppointments: "No available appointments",
    selectAppointment: "Select an appointment",
  },
  th: {
    menuOpen: "☰ เมนู",
    menuClose: "✖ ปิด",
    selectModel: "เลือกโมเดล:",
    totalModels: "จำนวนโมเดลทั้งหมด:",
    air5Ton: "แอร์ 5 ตัน",
    air10Ton: "แอร์ 10 ตัน",
    air20Ton: "แอร์ 20 ตัน",
    selectAppointment: "เลือกการนัดหมาย:",
    locationName: "ชื่อสถานที่:",
    selectRoomType: "เลือกประเภทห้อง:",
    widthOptional: "ความกว้าง (ตัวเลือก):",
    heightOptional: "ความยาว (ตัวเลือก):",
    saveCalculation: "บันทึกการคำนวณ",
    uploadImage: "อัปโหลดรูปภาพ",
    backToDashboard: "กลับไปยังแดชบอร์ด",
    rotateLeft: "หมุนซ้าย",
    rotateRight: "หมุนขวา",
    removeSelected: "ลบโมเดลที่เลือกไว้",
    clearAllModels: "ลบโมเดลทั้งหมด",
    startAnimation: "เริ่มการแสดงผลความเย็น",
    stopAnimation: "หยุดการแสดงผลความเย็น",
    noAppointments: "ไม่มีงานที่สามารถเลือกได้",
    selectAppointment: "เลือกงาน",
  },
};

const MySwal = withReactContent(Swal);

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
  const [roomType, setRoomType] = useState(1); // ค่าพื้นฐานของ area_type
  const [roomTypes, setRoomTypes] = useState([]); // 📌 เก็บค่าห้องจาก API
  const [width, setWidth] = useState(""); // Optional Width
  const [height, setHeight] = useState(""); // Optional Height
  const [areaCals, setAreaCals] = useState([]);
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  ); // Default to Thai

  const { isPresenting } = useXRStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch area_cals
        const areaCalsResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/area_cals`);
        setAreaCals(areaCalsResponse.data);

        // Fetch appointments
        const appointmentsResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/appointments`);
        const appointmentsData = appointmentsResponse.data;

        // Filter appointments to exclude those already in area_cals
        const usedAssignmentIds = areaCalsResponse.data.map((area) => area.assignment_id);
        const filteredAppointments = appointmentsData.filter(
          (appointment) => !usedAssignmentIds.includes(appointment.assignment_id)
        );

        setAppointments(filteredAppointments);
        if (filteredAppointments.length > 0) {
          setSelectedAppointment(filteredAppointments[0].assignment_id);
        } else {
          setSelectedAppointment(null);
          Swal.fire("Info", translations[language].noAppointments, "info");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to fetch data", "error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/area-types`)
      .then((response) => {
        setRoomTypes(response.data);
        if (response.data.length > 0) {
          setRoomType(response.data[0].id); // ตั้งค่าห้องเริ่มต้น
        }
      })
      .catch((error) => {
        console.error("Error fetching room types:", error);
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
      room_type_id: roomType, // ✅ ใช้ค่าจาก roomType
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

  const openImageUploadPopup = (selectedAppointment) => {
    if (!isPresenting) {
      if (!selectedAppointment) {
        alert("กรุณาเลือก Appointment ก่อนอัปโหลดภาพ!");
        return;
      }

      MySwal.fire({
        title: "อัปโหลดรูปภาพ",
        html: <ImageUpload areaCalculationId={selectedAppointment} />,
        showConfirmButton: false, // ซ่อนปุ่ม OK เพราะอัปโหลดเสร็จเอง
        width: "50%",
      });
    } else {
      alert("โปรดกลับไปหน้าหลัก AR ก่อนอัพโหลดรูปภาพ");
    }
  };

  return (
    <div id="overlay-content" ref={ref}>
      <div className="dom-container">
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen
            ? translations[language].menuClose
            : translations[language].menuOpen}
        </button>

        {isMenuOpen && (
          <div className="popup-menu">
            {/* 🔥 ส่วนเลือกโมเดล */}
            <div className="dropdown-ar-container text-white">
              {translations[language].selectModel}
              <select
                className="dropdown-ar"
                value={currentModelName}
                onChange={(e) => setCurrentModelName(e.target.value)}
              >
                <option value="air5tonCC">
                  {translations[language].air5Ton}
                </option>
                <option value="air10tonCC">
                  {translations[language].air10Ton}
                </option>
                <option value="air20tonCC">
                  {translations[language].air20Ton}
                </option>
              </select>
            </div>

            {/* 📌 ส่วนแสดงจำนวนโมเดล */}
            <div className="model-count-container">
              <h3>
                {translations[language].totalModels} {totalModels}
              </h3>
              <p>
                {translations[language].air5Ton}:{" "}
                {modelCounts["air5tonCC"] || 0}
              </p>
              <p>
                {translations[language].air10Ton}:{" "}
                {modelCounts["air10tonCC"] || 0}
              </p>
              <p>
                {translations[language].air20Ton}:{" "}
                {modelCounts["air20tonCC"] || 0}
              </p>
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
                {translations[language].rotateLeft}
              </button>
              <button
                className="button"
                onClick={() => rotateSelectedModel(Math.PI / 8)}
                disabled={!selectedModel}
              >
                {translations[language].rotateRight}
              </button>
              <button
                className="button"
                onClick={() => removeModelById(selectedModel)}
                disabled={!selectedModel}
              >
                {translations[language].removeSelected}
              </button>
              <button className="button" onClick={clearModels}>
                {translations[language].clearAllModels}
              </button>

              <button className="button" onClick={toggleAnimation}>
                {isAnimating
                  ? translations[language].stopAnimation
                  : translations[language].startAnimation}
              </button>
            </div>
            {/* 📌 Grid Container */}
            <div className="grid-container">
              {/* 🔥 Dropdown เลือก Appointment */}
              <div className="dropdown-ar-container">
                <label className="dropdown-ar-label">
                  {translations[language].selectAppointment}
                </label>
                <select
                  className="dropdown-ar"
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                >
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <option
                        key={appointment.assignment_id}
                        value={appointment.assignment_id}
                      >
                        {appointment.assignment_id} - {appointment.description}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      ไม่มีข้อมูล
                    </option>
                  )}
                </select>
              </div>

              {/* 🔥 Input location_name */}
              <div className="input-container">
                <label className="input-label">
                  {translations[language].locationName}
                </label>
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
                <label className="dropdown-ar-label">
                  {translations[language].selectRoomType}
                </label>
                <select
                  className="dropdown-ar"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.room_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 📌 Input Optional Width */}
              <div className="input-container">
                <label className="input-label">
                  {translations[language].widthOptional}
                </label>
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
                <label className="input-label">
                  {translations[language].heightOptional}
                </label>
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
            <div className="button-container-right gap-5">
              {!isPresenting && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => navigate("/dashboard/area-cal")}
                    className="btn bg-gray-500 text-white hover:bg-gray-500"
                  >
                    {translations[language].backToDashboard}
                  </button>
                </div>
              )}

              <div className="flex justify-between gap-2">
                <button
                  className="button save-button"
                  onClick={() => openImageUploadPopup(selectedAppointment)}
                >
                  {translations[language].uploadImage}
                </button>
                <button
                  className="button save-button"
                  onClick={saveCalculation}
                >
                  {translations[language].saveCalculation}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Interface;
