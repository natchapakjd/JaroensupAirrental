import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const TaskDetails = () => {
  const { taskId } = useParams();  // ดึง taskId จาก URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL; // ใช้ตัวแปร environment

  // ดึงรายละเอียดของ task เมื่อ taskId เปลี่ยน
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  // ฟังก์ชันดึงข้อมูลจาก API
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

  // หากกำลังโหลดให้แสดงหน้า Loading
  if (loading) return <Loading />;

  // หากเกิดข้อผิดพลาดในการโหลดข้อมูล
  if (error) {
    return <p>{error}</p>;
  }

  // หากไม่พบ task
  if (!task) {
    return <p>No task found.</p>;
  }

  return (
  <>
  <Navbar/>
  <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-screen">
      <h2 className="text-xl mb-4">รายละเอียดงาน: {task.title}</h2>
      <div className="mb-4">
        {task.task_id && <p><strong>หมายเลขงาน:</strong> {task.task_id}</p>}
        {task.description && <p><strong>รายละเอียด:</strong> {task.description}</p>}
        {task.status_id && <p><strong>สถานะงาน:</strong> {task.status_name}</p>}
        {task.appointment_date && <p><strong>วันเริ่ม:</strong> {new Date(task.appointment_date).toLocaleString()}</p>}
        {task.rental_end_date && <p><strong>วันเสร็จสิ้น:</strong> {new Date(task.rental_end_date).toLocaleDateString()}</p>}
        {task.address && <p><strong>ตำแหน่งที่ตั้ง:</strong> {task.address}</p>}
        {task.quantity_used && <p><strong>จำนวนแอร์ที่ใช้:</strong> {task.quantity_used}</p>}
        {task.user_id && <p><strong>ชื่อผู้สั่งงาน:</strong> {task.firstname} {task.lastname}</p>}
      </div>

      {/* แผนที่ */}
      {task.latitude && task.longitude && (
        <MapContainer
          center={[task.latitude, task.longitude]} // ตั้งศูนย์แผนที่ที่ตำแหน่งของ task
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
    <Footer/>
  </>
    
  );
};

export default TaskDetails;
