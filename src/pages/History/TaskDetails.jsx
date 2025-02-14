import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// 🔥 แปลภาษา
const translations = {
  th: {
    taskDetails: "รายละเอียดงาน",
    taskId: "หมายเลขงาน",
    description: "รายละเอียด",
    status: "สถานะงาน",
    startDate: "วันเริ่ม",
    endDate: "วันเสร็จสิ้น",
    location: "ตำแหน่งที่ตั้ง",
    quantityUsed: "จำนวนแอร์ที่ใช้",
    orderedBy: "ชื่อผู้สั่งงาน",
    noTask: "ไม่พบนายจ้างาน",
  },
  en: {
    taskDetails: "Task Details",
    taskId: "Task ID",
    description: "Description",
    status: "Task Status",
    startDate: "Start Date",
    endDate: "End Date",
    location: "Location",
    quantityUsed: "Air Conditioners Used",
    orderedBy: "Ordered By",
    noTask: "No task found.",
  },
};

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  // ✅ ฟัง event เปลี่ยน `localStorage` และอัปเดต `language` real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ดึงรายละเอียดของ task เมื่อ taskId เปลี่ยน
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!task) return <p>{translations[language].noTask}</p>;

  return (
    <>
      <Navbar />
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-screen">
        <h2 className="text-xl mb-4">
          {translations[language].taskDetails}: {task.title}
        </h2>
        <div className="mb-4">
          {task.task_id && (
            <p>
              <strong>{translations[language].taskId}:</strong> {task.task_id}
            </p>
          )}
          {task.description && (
            <p>
              <strong>{translations[language].description}:</strong> {task.description}
            </p>
          )}
          {task.status_id && (
            <p>
              <strong>{translations[language].status}:</strong> {task.status_name}
            </p>
          )}
          {task.appointment_date && (
            <p>
              <strong>{translations[language].startDate}:</strong> {new Date(task.appointment_date).toLocaleString()}
            </p>
          )}
          {task.rental_end_date && (
            <p>
              <strong>{translations[language].endDate}:</strong> {new Date(task.rental_end_date).toLocaleDateString()}
            </p>
          )}
          {task.address && (
            <p>
              <strong>{translations[language].location}:</strong> {task.address}
            </p>
          )}
          {task.quantity_used && (
            <p>
              <strong>{translations[language].quantityUsed}:</strong> {task.quantity_used}
            </p>
          )}
          {task.user_id && (
            <p>
              <strong>{translations[language].orderedBy}:</strong> {task.firstname} {task.lastname}
            </p>
          )}
        </div>

        {/* แผนที่ */}
        {task.latitude && task.longitude && (
          <MapContainer
            center={[task.latitude, task.longitude]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[task.latitude, task.longitude]}>
              <Popup>{task.title}</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TaskDetails;
