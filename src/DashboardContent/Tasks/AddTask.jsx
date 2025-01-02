import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Searchbox from "../../components/Searchbox";

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

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable

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
  }, [address]);

  const handleLocationSelect = (lat, lon, displayName) => {
    setAddress(displayName);
    setLatitude(lat);
    setLongitude(lon);
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
        latitude,
        longitude,
      });

      if (response.status === 201) {
        await axios.post(`${apiUrl}/task-log`, {
          task_id: response.data.task_id,
          user_id: userId,
          action: "เพิ่มงาน",
        });

        navigate("/dashboard/tasks");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter">
      <h2 className="text-2xl mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y- text-sm font-medium">
        <div>
          <label className="block mb-2">Task Type</label>
          <select
            value={taskTypeId}
            onChange={(e) => setTaskTypeId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Task Type</option>
            {taskTypes.map((taskType) => (
              <option key={taskType.task_type_id} value={taskType.task_type_id}>
                {taskType.type_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Rental Start Date</label>
          <input
            type="datetime-local"
            name="appointment_date"
            value={appointmentDate}
            onChange={(e) => {
              const fullDate = e.target.value;
              setAppointmentDate(fullDate);
              setRentalStartDate(fullDate.split("T")[0]); // Extract date part only
            }}
            min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-gray-700">Rental End Date</label>
          <input
            type="date"
            name="rental_end_date"
            value={rentalEndDate}
            onChange={(e) => setRentalEndDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block mb-2">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Quantity Used</label>
          <input
            type="number"
            value={quantityUsed}
            onChange={(e) => setQuantityUsed(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <input
          type="hidden"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="hidden"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
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
        <button type="submit" className="btn bg-blue text-white hover:bg-blue">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
