import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../components/Loading";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use environment variable

  // Determine language from localStorage
  const language = localStorage.getItem("language") || "en";

  // Translation object
  const translations = {
    en: {
      taskDetails: "Task Details",
      id: "ID",
      description: "Description",
      status: "Status",
      startDate: "Start Date",
      finishDate: "Finish Date",
      address: "Address",
      quantityUsed: "Quantity Used",
      name: "Name",
      noTaskFound: "No task found.",
      failedToLoad: "Failed to load task details.",
    },
    th: {
      taskDetails: "รายละเอียดงาน",
      id: "รหัสงาน",
      description: "รายละเอียด",
      status: "สถานะ",
      startDate: "วันที่เริ่มต้น",
      finishDate: "วันที่สิ้นสุด",
      address: "ที่อยู่",
      quantityUsed: "จำนวนที่ใช้",
      name: "ชื่อ",
      noTaskFound: "ไม่พบงาน",
      failedToLoad: "ไม่สามารถโหลดรายละเอียดงานได้",
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError(t.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return <p>{error}</p>;
  }

  if (!task) {
    return <p>{t.noTaskFound}</p>;
  }

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-screen">
      <h2 className="text-2xl mb-4">
        {t.taskDetails}: {task.title}
      </h2>
      <div className="mb-4">
        {task.task_id && <p><strong>{t.id}:</strong> {task.task_id}</p>}
        {task.description && <p><strong>{t.description}:</strong> {task.description}</p>}
        {task.status_id && <p><strong>{t.status}:</strong> {task.status_name}</p>}
        {task.appointment_date && <p><strong>{t.startDate}:</strong> {new Date(task.appointment_date).toLocaleString()}</p>}
        {task.rental_end_date && <p><strong>{t.finishDate}:</strong> {new Date(task.rental_end_date).toLocaleDateString()}</p>}
        {task.address && <p><strong>{t.address}:</strong> {task.address}</p>}
        {task.quantity_used && <p><strong>{t.quantityUsed}:</strong> {task.quantity_used}</p>}
        {task.user_id && <p><strong>{t.name}:</strong> {task.firstname} {task.lastname}</p>}
      </div>

      {/* Map Section */}
      {task.latitude && task.longitude && (
        <MapContainer
          center={[task.latitude, task.longitude]} // Center the map on task's lat/long
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
  );
};

export default TaskDetails;
