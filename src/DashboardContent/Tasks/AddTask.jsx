import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Searchbox from "../../components/Searchbox";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  en: {
    addTaskTitle: "Add New Task",
    taskType: "Task Type",
    user: "User",
    description: "Description",
    rentalStartDate: "Rental Start Date",
    rentalEndDate: "Rental End Date",
    address: "Address",
    quantityUsed: "Quantity Used",
    selectTaskType: "Select Task Type",
    selectUser: "Select User",
    showMap: "Show Map 📍",
    hideMap: "Hide Map ❌",
    addTaskButton: "Add Task",
  },
  th: {
    addTaskTitle: "เพิ่มงานใหม่",
    taskType: "ประเภทงาน",
    user: "ผู้ใช้",
    description: "รายละเอียด",
    rentalStartDate: "วันที่เริ่มเช่า",
    rentalEndDate: "วันที่สิ้นสุดการเช่า",
    address: "ที่อยู่",
    quantityUsed: "จำนวนที่ใช้",
    selectTaskType: "เลือกประเภทงาน",
    selectUser: "เลือกผู้ใช้",
    showMap: "เลือกตำแหน่งบนแผนที่ 📍",
    hideMap: "ซ่อนแผนที่ ❌",
    addTaskButton: "เพิ่มงาน",
  },
};

const MapClickHandler = ({ setLatitude, setLongitude }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLatitude(lat);
      setLongitude(lng);
    },
  });
  return null;
};

const AddTask = () => {
  const [taskTypeId, setTaskTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [rentalEndDate, setRentalEndDate] = useState(""); // New state
  const [address, setAddress] = useState("");
  const [quantityUsed, setQuantityUsed] = useState("");
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [taskTypes, setTaskTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentalStartDate, setRentalStartDate] = useState("");
  const [showMap, setShowMap] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable
  const currentLanguage = localStorage.getItem("language") || "en";
  const t = translations[currentLanguage];

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/taskTypes`);
        setTaskTypes(response.data);
      } catch (error) {
        console.error("Error fetching task types:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTaskTypes();
    fetchProducts();
    fetchUsers();
  }, []);

  const handleLocationSelect = (lat, lon, displayName) => {
    setAddress(displayName);
    setLatitude(lat);
    setLongitude(lon);
  };

  const toggleMap = () => {
    if (showMap) {
      // 🔥 ถ้าปิดแผนที่ให้ล้างค่า latitude, longitude
      setLatitude(null);
      setLongitude(null);
    }
    setShowMap(!showMap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/tasks`, {
        task_type_id: taskTypeId,
        description,
        appointment_date: appointmentDate,
        rental_start_date: rentalStartDate, // Include rental_start_date
        rental_end_date: rentalEndDate,
        address,
        quantity_used: quantityUsed,
        user_id: userId,
        latitude: latitude, // ✅ ถ้าไม่เลือกแผนที่จะให้เป็น ""
        longitude: longitude,
      });

      if (response.status === 201) {
        await axios.post(`${apiUrl}/task-log`, {
          task_id: response.data.task_id,
          user_id: userId,
          action: "สั่งงานเช่า",
        });

        navigate("/dashboard/tasks");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.addTaskTitle}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
          <div>
            <label className="block mb-2">{t.taskType}</label>
            <select
              value={taskTypeId}
              onChange={(e) => setTaskTypeId(e.target.value)}
              className="border p-2 w-full"
              required
            >
              <option value="">{t.selectTaskType}</option>
              {taskTypes.map((taskType, index) => (
                <option key={index + 1} value={taskType.task_type_id}>
                  {index + 1}. {taskType.type_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">{t.user}</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">{t.selectUser}</option>
              {users.map((user, index) => (
                <option key={index + 1} value={user.user_id}>
                  {index + 1}. {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">{t.description}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2">{t.rentalStartDate}</label>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => {
                const fullDate = e.target.value;
                setAppointmentDate(fullDate);
                setRentalStartDate(fullDate.split("T")[0]);
              }}
              min={new Date().toISOString().slice(0, 16)}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-2">{t.rentalEndDate}</label>
            <input
              type="date"
              value={rentalEndDate}
              onChange={(e) => setRentalEndDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-2">{t.address}</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">{t.quantityUsed}</label>
            <input
              type="number"
              value={quantityUsed}
              onChange={(e) => setQuantityUsed(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <p
              type="button"
              onClick={toggleMap}
              className="cursor-pointer underline text-right text-xl mt-2"
            >
              {showMap ? t.hideMap : t.showMap}
            </p>
          </div>

          {showMap && (
            <div className="my-4">
              <MapContainer
                center={[13.7563, 100.5018]} // Default center (Bangkok)
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                />
                {latitude && longitude && (
                  <Marker position={[latitude, longitude]} />
                )}
                <div className="absolute top-0 left-12 z-[1000]">
                  <Searchbox onSelectLocation={handleLocationSelect} />
                </div>
              </MapContainer>
            </div>
          )}
          <button
            type="submit"
            className="btn bg-blue text-white hover:bg-blue"
          >
            {t.addTaskButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
