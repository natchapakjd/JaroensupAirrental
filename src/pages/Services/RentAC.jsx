import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Searchbox from "../../components/Searchbox";

const icon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RentAC = () => {
  const { taskTypeId } = useParams();
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    description: "",
    task_type_id: "",
    address: "",
    appointment_date: "",
    latitude: "",
    longitude: "",
    rental_start_date: "",
    rental_end_date: "",
  });
  const [products, setProducts] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [profile, setProfile] = useState();
  const [showMap, setShowMap] = useState(false); // ✅ ควบคุมการแสดงแผนที่

  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tasktypes`
        );
        setTaskTypes(response.data);
      } catch (error) {
        console.error("Error fetching task types:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchProducts(), fetchTaskTypes()]);
      setLoading(false);
    };

    fetchProfile();
    fetchData();
  }, []);

  useEffect(() => {
    if (taskTypeId) {
      setFormData((prevData) => ({
        ...prevData,
        task_type_id: taskTypeId,
      }));
    }
    fetchProfile();
  }, [taskTypeId]);

  const filteredTaskTypes = taskTypes.filter(
    (taskType) =>
      taskType.type_name === "งานเช่าเครื่องปรับอากาศ" ||
      taskType.type_name === "งานซ่อมบำรุงเครื่องปรับอากาศ"
  );

  const handleLocationSelect = (lat, lon, displayName) => {
    setSelectedLocation({ lat, lng: lon });
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lon,
      address: displayName,
    });
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
      );
      if (response.status === 200) {
        const data = response.data;
        setProfile(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const sendMessage = async () => {
    if (!profile) return;

    const messageResponse = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "U9cb564155dddeaa549d97a8747eed534",
          message: `แจ้งเตือนจากระบบ:\n\nคุณ ${profile.firstname} ${profile.lastname} ได้แจ้งงานเช่าเครื่องปรับอากาศ เข้ามาในระบบเรียบร้อยแล้ว.\n\nกรุณาตรวจสอบและดำเนินการตามความเหมาะสม.\n\nขอบคุณที่เลือกใช้บริการของเรา!`,
        }),
      }
    );

    if (!messageResponse.ok) throw new Error("Failed to send message");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const rentalStartDate = formData.appointment_date.split("T")[0];

      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        ...formData,
        rental_start_date: rentalStartDate,
        user_id: userId,
        latitude: selectedLocation ? formData.latitude : "",  // ✅ ถ้าไม่ได้เลือกแผนที่จะไม่ส่งค่า
        longitude: selectedLocation ? formData.longitude : "",
      });

      Swal.fire({
        title: "สำเร็จ!",
        text: "แบบฟอร์มถูกส่งเรียบร้อยแล้ว",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setFormData({
          user_id: "",
          description: "",
          task_type_id: taskTypeId || "",
          address: "",
          appointment_date: "",
          rental_end_date: "",
        });
        setSelectedLocation(null);
        setShowMap(false);
        navigate("/history");
      });
    } catch (error) {
      console.error("Error creating task:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถส่งแบบฟอร์มได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4 mx-2">แบบฟอร์มแจ้งบริการ</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
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
                {filteredTaskTypes.map((taskType) => (
                  <option
                    key={taskType.task_type_id}
                    value={taskType.task_type_id}
                  >
                    {taskType.type_name}
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
              <label className="block text-gray-700">Rental Start Date</label>
              <input
                type="datetime-local"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)} // Prevent past dates
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Rental End Date</label>
              <input
                type="date"
                name="rental_end_date"
                value={formData.rental_end_date}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 10)} // Prevent past dates
                required
                className="input input-bordered w-full"
              />
            </div>

             {/* 🔥 ปุ่มเลือกแผนที่ */}
             <div className="mb-4">
              <p
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="cursor-pointer underline text-right"
              >
                {showMap ? "ซ่อนแผนที่ ❌" : "เลือกตำแหน่งบนแผนที่"}
              </p>
            </div>

                {showMap && (<MapContainer
              center={[13.7563, 100.5018]}
              zoom={10}
              style={{ height: "400px", width: "100%", maxHeight: "400px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedLocation && (
                <Marker position={selectedLocation} icon={icon}>
                  <Popup>
                    Location: {selectedLocation.lat}, {selectedLocation.lng}
                  </Popup>
                </Marker>
              )}
              <MapClick /> {/* Include MapClick to handle click events */}
              <div className="absolute top-0 left-12 z-[1000]">
                <Searchbox onSelectLocation={handleLocationSelect} />
              </div>
            </MapContainer>)}
            

            <button
              type="submit"
              className="btn bg-blue hover:bg-blue text-white my-5 w-full"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default RentAC;
