import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  // const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]); // Add statuses state
  let addressFromSearchBox  = ""
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable

  useEffect(() => {
    // Fetch task types
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/taskTypes`);
        setTaskTypes(response.data);
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
        setQuantityUsed(task.quantity_used);
        // setProductId(task.product_id);
        setUserId(task.user_id);
        setLatitude(task.latitude);
        setLongitude(task.longitude);
        setStatusId(task.status_id); // Change to statusId
        setStartDate(task.start_date);
        setFinishDate(task.finish_date);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTaskTypes();
    // fetchProducts();
    fetchUsers();
    fetchStatuses(); // Fetch statuses
    fetchTask();
  }, [taskId,address]);


  const handleLocationSelect = (lat, lon, displayName) => {
    setAddress(displayName);
    setLatitude(lat);
    setLongitude(lon);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${apiUrl}/task/${taskId}`, {
        task_type_id: taskTypeId,
        description,
        appointment_date: appointmentDate,
        address,
        quantity_used: quantityUsed,
        // product_id: productId,
        user_id: userId,
        latitude,
        longitude,
        status_id: statusId, // Use statusId in the request
        rental_start_date: startDate,
        rental_end_date: finishDate,
      });

      if (response.status === 200) {
        navigate("/dashboard/tasks");
        await axios.post(`${apiUrl}/taskLog`, {
          task_id: taskId,
          user_id: userId,
          action: "Updated Task",
          created_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter">
      <h2 className="text-2xl mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Status</label>
          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)} // Change to statusId
            className="border p-2 w-full"
            required
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option key={status.status_id} value={status.status_id}>
                {status.status_name}
              </option>
            ))}
          </select>
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
              setStartDate(fullDate.split("T")[0]); // Extract date part only
            }}
            min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Rental End Date</label>
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            className="border p-2 w-full"
            min={new Date().toISOString().split('T')[0]} // Ensure correct format for "date"

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
        {/* <div>
          <label className="block mb-2">Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.name}
              </option>
            ))}
          </select>
        </div> */}
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
                {user.firstname} - {user.lastname}
              </option>
            ))}
          </select>
        </div>
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
        <button type="submit" className="bg-blue text-white py-2 px-4 rounded">
          Save Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
