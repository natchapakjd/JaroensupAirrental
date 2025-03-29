import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Searchbox from "../../components/Searchbox";
import BackButtonEdit from "../../components/BackButtonEdit";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const translations = {
  en: {
    taskType: "Task Type",
    description: "Description",
    status: "Status",
    rentalStartDate: "Rental Start Date",
    rentalEndDate: "Rental End Date",
    address: "Address",
    quantityUsed: "Quantity Used",
    user: "User",
    selectLocation: "Select Location on the Map 📍",
    hideMap: "Hide Map ❌",
    saveTask: "Save Task",
  },
  th: {
    taskType: "ประเภทงาน",
    description: "คำอธิบาย",
    status: "สถานะ",
    rentalStartDate: "วันที่เริ่มเช่า",
    rentalEndDate: "วันที่สิ้นสุดการเช่า",
    address: "ที่อยู่",
    quantityUsed: "จำนวนที่ใช้",
    user: "ผู้ใช้",
    selectLocation: "เลือกตำแหน่งบนแผนที่ 📍",
    hideMap: "ซ่อนแผนที่ ❌",
    saveTask: "บันทึกงาน",
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

const EditTask = () => {
  const { taskId } = useParams(); // Get the task ID from the URL
  const [taskTypeId, setTaskTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [address, setAddress] = useState("");
  const [quantityUsed, setQuantityUsed] = useState("");
  // const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [statusId, setStatusId] = useState(""); // Changed to statusId
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [taskTypes, setTaskTypes] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [total, setTotal] = useState(0);
  // const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]); // Add statuses state
  let addressFromSearchBox = "";
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable
  const language = localStorage.getItem("language") || "en"; // Default to English
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;

  useEffect(() => {
    // ถ้า finishDate น้อยกว่า startDate ให้ล้างค่า finishDate
    if (finishDate && finishDate < startDate) {
      setFinishDate("");
    }
  }, [startDate]);

  useEffect(() => {
    // Fetch task types

    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/taskTypes`);

        const filteredTaskTypes = response.data.filter(
          (task) => task.task_type_id === 1 || task.task_type_id === 12
        );

        setTaskTypes(filteredTaskTypes);
      } catch (error) {
        console.error("Error fetching task types:", error);
      }
    };
    // // Fetch products
    // const fetchProducts = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/products`);
    //     setProducts(response.data);
    //   } catch (error) {
    //     console.error("Error fetching products:", error);
    //   }
    // };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch statuses
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/statuses`); // Assuming this endpoint provides statuses
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    // Fetch task data
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${apiUrl}/task/${taskId}`);
        const task = response.data;
        setTaskTypeId(task.task_type_id);
        setDescription(task.description);
        setAppointmentDate(task.appointment_date);
        setAddress(task.address);
        // setQuantityUsed(task.quantity_used);
        // setProductId(task.product_id);
        setUserId(task.user_id);
        setLatitude(task.latitude);
        setLongitude(task.longitude);
        setStatusId(task.status_id); // Change to statusId
        setStartDate(task.rental_start_date);
        setFinishDate(task.rental_end_date);
        // setTotal(task.total)
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTaskTypes();
    // fetchProducts();
    fetchUsers();
    fetchStatuses(); // Fetch statuses
    fetchTask();
  }, [taskId]);

  const toggleMap = () => {
    if (showMap) {
      setLatitude(null);
      setLongitude(null);
    }
    setShowMap(!showMap);
  };
  const handleLocationSelect = (lat, lon, displayName) => {
    setAddress(displayName);
    setLatitude(lat);
    setLongitude(lon);
    console.log(lat,lon,displayName)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${apiUrl}/task/${taskId}`, {
        task_type_id: taskTypeId,
        description,
        appointment_date: appointmentDate,
        address: address,
        // quantity_used: quantityUsed,
        // product_id: productId,
        user_id: userId,
        latitude: latitude,
        longitude: longitude,
        status_id: statusId, // Use statusId in the request
        rental_start_date: startDate,
        rental_end_date: finishDate,
        // total
      });

      await axios.post(`${apiUrl}/task-log`, {
        task_id: response.data.task_id,
        user_id: userId,
        action: "แก้ไขงาน",
      });

      if (response.status === 200) {
        navigate("/dashboard/tasks");
       
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translations[language].taskType}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              {translations[language].taskType}
            </label>
            <select
              value={taskTypeId}
              onChange={(e) => setTaskTypeId(e.target.value)}
              className="input input-bordered p-2 w-full"
              required
            >
              <option value="">Select Task Type</option>
              {taskTypes.map((taskType, index) => (
                <option
                  key={taskType.task_type_id}
                  value={taskType.task_type_id}
                >
                  {index + 1}. {taskType.type_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">{translations[language].user}</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input input-bordered p-2 w-full"
            >
              <option value="">Select User</option>
              {users.map((user, index) => (
                <option key={index + 1} value={user.user_id}>
                  {index + 1}. {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">
              {translations[language].description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input input-bordered p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              {translations[language].status}
            </label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="input input-bordered p-2 w-full"
              required
            >
              <option value="">Select Status</option>
              {statuses.map((status, index) => (
                <option key={index + 1} value={status.status_id}>
                  {index + 1}. {status.status_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">
              {translations[language].rentalStartDate}
            </label>
            <input
              type="datetime-local"
              name="appointment_date"
              value={appointmentDate}
              onChange={(e) => {
                const fullDate = e.target.value;
                setAppointmentDate(fullDate);
                setStartDate(fullDate.split("T")[0]); // ดึงเฉพาะวันที่
              }}
              min={new Date().toISOString().slice(0, 16)} // ป้องกันเลือกวันที่ผ่านมา
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block mb-2">
              {translations[language].rentalEndDate}
            </label>
            <input
              type="date"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              className="border p-2 w-full"
              min={startDate || new Date().toISOString().split("T")[0]} // กำหนด min เป็น startDate ถ้ามีค่า
            />
          </div>
          <div>
            <label className="block mb-2">
              {translations[language].address}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input input-bordered p-2 w-full"
            />
          </div>
          {/* <div>
            <label className="block mb-2">
              {translations[language].quantityUsed}
            </label>
            <input
              type="number"
              value={quantityUsed}
              onChange={(e) => setQuantityUsed(e.target.value)}
              className="border p-2 w-full"
            />
          </div> */}

          {/* <div>
            <label className="block mb-2">Total Price</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="input input-bordered p-2 w-full"
            />
          </div> */}
          <div className="mb-4">
            <p
              type="button"
              onClick={toggleMap}
              className="cursor-pointer underline text-right text-xl mt-2"
            >
              {showMap
                ? translations[language].hideMap
                : translations[language].selectLocation}
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
            className="bg-blue text-white py-2 px-4 rounded"
          >
            {translations[language].saveTask}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
