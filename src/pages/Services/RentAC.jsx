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

const translations = {
  th: {
    title: "แบบฟอร์มแจ้งบริการ",
    taskType: "ประเภทงาน",
    selectTaskType: "เลือกประเภทงาน",
    description: "รายละเอียด",
    address: "ที่อยู่",
    startDate: "วันที่เริ่ม",
    endDate: "วันที่สิ้นสุด",
    chooseLocation: "เลือกตำแหน่งบนแผนที่",
    hideMap: "ซ่อนแผนที่ ❌",
    submit: "ส่งข้อมูล",
    loading: "กำลังโหลด...",
    file: "รูปแบบสถานที่ (ตัวเลือก)",
    profileIncomplete: "กรุณากรอกชื่อและนามสกุลในโปรไฟล์ก่อนดำเนินการ",
    goToProfile: "ไปที่การตั้งค่าโปรไฟล์",
    organizationName: "ชื่อองค์กร", // ✅ เพิ่ม
  },
  en: {
    title: "Service Request Form",
    taskType: "Task Type",
    selectTaskType: "Select Task Type",
    description: "Description",
    address: "Address",
    startDate: "Start Date",
    endDate: "End Date",
    chooseLocation: "Select Location on Map",
    hideMap: "Hide Map ❌",
    submit: "Submit",
    loading: "Loading...",
    file: "Location format (optional)",
    profileIncomplete: "Please fill in your first name and last name in your profile before proceeding",
    goToProfile: "Go to Profile Settings",
    organizationName: "Organization Name", // ✅ เพิ่ม
  },
};

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
    organization_name: "", // ✅ เพิ่ม
  });
  const [products, setProducts] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [profile, setProfile] = useState();
  const [showMap, setShowMap] = useState(false); // ✅ ควบคุมการแสดงแผนที่
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a state for submission status

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "th";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [language]);

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

  const handleUpload = (e) => {
    setSelectedFiles([...e.target.files]); // เก็บไฟล์ทั้งหมดที่เลือก
  };

  const filteredTaskTypes = taskTypes.filter(
    (taskType) =>
      taskType.type_name === "งานเช่าเครื่องปรับอากาศ" ||
      taskType.type_name === "งานซ่อมบำรุงเครื่องปรับอากาศ" ||
      taskType.type_name === "ล้างเครื่่องปรับอากาศ"
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
          message: `แจ้งเตือนจากระบบ:\n\nคุณ ${profile.firstname} ${profile.lastname} ได้แจ้งงานเช่าเครื่องปรับอากาศ เข้ามาในระบบ.\n\nกรุณาตรวจสอบและดำเนินการตามความเหมาะสม.\n\nขอบคุณที่เลือกใช้บริการของเรา!`,
        }),
      }
    );

    if (!messageResponse.ok) throw new Error("Failed to send message");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent submission if already submitting

    setIsSubmitting(true); // Set submitting state to true
    // Check if firstname or lastname is empty
    if (!profile || !profile.firstname || !profile.lastname) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: translations[language].profileIncomplete,
        icon: "warning",
        confirmButtonText: translations[language].goToProfile,
      }).then(() => {
        navigate("/profile-setting");
      });
      setIsSubmitting(false);
      return;
    }
        try {
      const rentalStartDate = formData.appointment_date.split("T")[0];
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] && !Array.isArray(formData[key])) {
          data.append(key, formData[key]);
        }
      });

      selectedFiles.forEach((file) => {
        data.append("images", file); // Add images to the form data
      });

      data.append("quantity_used", 0);
      data.append("rental_start_date", rentalStartDate);

      const userId = decodedToken.id;
      if (userId) {
        data.append("user_id", userId); // Ensure user_id is correctly appended
      }

      // Send request
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/v2/tasks`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const taskId = response.data.task_id;

      // Create task log
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/task-log`, {
        task_id: taskId,
        user_id: userId,
        action: "สั่งงานเช่า",
      });
      sendMessage()
      // Success message
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
          organization_name: "", // ✅ รีเซ็ต
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
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };

  function getCurrentDateTimeInThailand() {
    const now = new Date();

    // Convert to Thailand time (UTC+7)
    const thailandTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    // Add one day to the Thailand time
    thailandTime.setDate(thailandTime.getDate() + 1);

    // ปรับเวลาให้เป็นเลขถ้วนๆ (ชั่วโมงเต็ม)
    thailandTime.setMinutes(0, 0, 0);

    // Format as a string for datetime-local input (yyyy-mm-ddThh:mm)
    return thailandTime.toISOString().slice(0, 16);
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4 mx-2">
          {translations[language].title}
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-gray-700">
                {translations[language].organizationName}
              </label> {/* ✅ เพิ่ม */}
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                {translations[language].taskType}
              </label>
              <select
                name="task_type_id"
                value={formData.task_type_id}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="">
                  {translations[language].selectTaskType}
                </option>
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
              <label className="block text-gray-700">
                {translations[language].description}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                {translations[language].address}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full "
              ></textarea>
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700">
                  {translations[language].startDate}
                </label>
                <input
                  type="datetime-local"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={getCurrentDateTimeInThailand()}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">
                  {translations[language].endDate}
                </label>
                <input
                  type="date"
                  name="rental_end_date"
                  value={formData.rental_end_date}
                  onChange={handleChange}
                  min={
                    formData.appointment_date
                      ? formData.appointment_date.slice(0, 10)
                      : new Date().toISOString().slice(0, 10)
                  }
                  required
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* 🔥 ปุ่มเลือกแผนที่ */}
            <div className="mb-4">
              <p
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="cursor-pointer underline text-right"
              >
                {showMap
                  ? `${translations[language].description} ❌`
                  : `${translations[language].chooseLocation}`}
              </p>
            </div>

            {showMap && (
              <MapContainer
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
              </MapContainer>
            )}
            <label className="block text-gray-700">
              {translations[language].file}
            </label>
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="block w-full text-sm text-gray-500 mt-4
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue hover:file:text-white"
            />

            <button
              type="submit"
              className="btn bg-blue hover:bg-blue text-white my-5 w-full"
            >
              {translations[language].submit}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default RentAC;
