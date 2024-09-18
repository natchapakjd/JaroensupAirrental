import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RentAC = () => {
  const { taskTypeId } = useParams();
  const [formData, setFormData] = useState({
    user_id: "",
    description: "",
    task_type_id: "",
    product_id: "",
    quantity_used: "",
    address: "",
    appointment_date: "",
    latitude: "",
    longitude: "",
  });

  const [products, setProducts] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id; // Set user_id here

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tasktypes");
        setTaskTypes(response.data);
      } catch (error) {
        console.error("Error fetching task types:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchProducts(), fetchTaskTypes()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (taskTypeId) {
      setFormData(prevData => ({
        ...prevData,
        task_type_id: taskTypeId,
      }));
    }
  }, [taskTypeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const MapClick = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation(e.latlng);
        setFormData({
          ...formData,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/tasks", {
        ...formData,
        user_id, 
      });
      console.log("Task created:", response.data);
      setFormData({
        user_id: "",
        description: "",
        task_type_id: taskTypeId || "",
        product_id: "",
        quantity_used: "",
        address: "",
        appointment_date: "",
        latitude: "",
        longitude: "",
      });
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 mx-2">แบบฟอร์มแจ้งบริการ</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
             <div className="mb-4">
              <label className="block text-gray-700">Task Type</label>
              <select
                name="task_type_id"
                value={formData.task_type_id}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="">เลือกประเภทงาน</option>
                {taskTypes.map((taskType) => (
                  <option key={taskType.task_type_id} value={taskType.task_type_id}>
                    {taskType.type_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Product</label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="">เลือกผลิตภัณฑ์</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>
           
            
            <div className="mb-4">
              <label className="block text-gray-700">Quantity Used</label>
              <input
                type="number"
                name="quantity_used"
                value={formData.quantity_used}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Appointment Date</label>
              <input
                type="datetime-local"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <MapContainer center={[13.7563, 100.5018]} zoom={10} style={{ height: "400px", width: "100%", maxHeight: "400px" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClick />
              {selectedLocation && (
                <Marker position={selectedLocation} icon={icon}>
                  <Popup>
                    Location: {selectedLocation.lat}, {selectedLocation.lng}
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            <button type="submit" className="btn bg-blue hover:bg-blue text-white my-5 w-full">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default RentAC;
