import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BackButtonEdit from "../../components/BackButtonEdit";

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
    noTask: "ไม่พบรายการงาน",
    type_name: "ประเภทงาน",
    images: "รูปภาพ",
    phone: "เบอร์ติดต่อ",
    price: "ราคารวม",
    organization_name: "ชื่อองค์กร",
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
    type_name: "Task Type",
    images: "Images",
    phone: "Phone",
    price: "Price",
    organization_name: "Organization Name",
  },
};

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [images, setImages] = useState([]); // To store images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image for popup
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
  const MySwal = withReactContent(Swal);

  const showImagePopup = (imageUrl) => {
    MySwal.fire({
      imageUrl: imageUrl,
      imageAlt: "Task Image",
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-lg shadow-lg",
      },
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch task details and images
  useEffect(() => {
    fetchTaskDetails();
    fetchTaskImages();
  }, [taskId]);

  // Fetch task details
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

  // Fetch task images
  const fetchTaskImages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task_images/${taskId}`);
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching task images:", error);
      setError("Failed to load task images.");
    }
  };

  // Close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!task) return <p>{translations[language].noTask}</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-2 my-10 font-prompt md:mx-auto">
        <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
          <div className="flex justify-between">
            <div className="flex w-full my-2">
              <BackButtonEdit />
              <h1 className="text-2xl font-semibold mx-2">
                {translations[language].taskDetails}: {task.title}
              </h1>
            </div>
            <Link to={`/task/edit-img/${taskId}`}>
              <button className="btn bg-blue hover:bg-blue text-white">
                แก้ไขรูปภาพ
              </button>
            </Link>
          </div>
          <div className="mb-4">
            {task.task_id && (
              <p>
                <strong>{translations[language].taskId}:</strong> {task.task_id}
              </p>
            )}
            {task.organization_name && (
              <p>
                <strong>{translations[language].organization_name}:</strong> {task.organization_name}
              </p>
            )}
            {task.user_id && (
              <p>
                <strong>{translations[language].orderedBy}:</strong>{" "}
                {task.firstname} {task.lastname}
              </p>
            )}
            {task.phone && (
              <p>
                <strong>{translations[language].phone}:</strong> {task.phone}
              </p>
            )}
            {task.description && (
              <p>
                <strong>{translations[language].description}:</strong>{" "}
                {task.description}
              </p>
            )}
            {task.type_name && (
              <p>
                <strong>{translations[language].type_name}:</strong>{" "}
                {task.type_name}
              </p>
            )}

            {task.status_id && (
              <p>
                <strong>{translations[language].status}:</strong>{" "}
                {task.status_name}
              </p>
            )}
            {task.appointment_date && (
              <p>
                <strong>{translations[language].startDate}:</strong>{" "}
                {new Date(task.appointment_date).toLocaleString()}
              </p>
            )}
            {task.rental_end_date && (
              <p>
                <strong>{translations[language].endDate}:</strong>{" "}
                {new Date(task.rental_end_date).toLocaleDateString()}
              </p>
            )}
            {task.address && (
              <p>
                <strong>{translations[language].location}:</strong>{" "}
                {task.address}
              </p>
            )}
            {task.total !== 0 && (
              <p>
                <strong>{translations[language].price}:</strong> {task.price}
              </p>
            )}
          </div>

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

          {images.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg mb-6 font-semibold">
                {translations[language].images}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div
                    key={image.image_id}
                    className="relative group overflow-hidden rounded-lg shadow-xl cursor-pointer"
                    onClick={() => showImagePopup(image.image_url)}
                  >
                    <img
                      src={image.image_url}
                      alt={`task image ${image.image_id}`}
                      className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center">
                      <span className="text-white text-xl font-semibold">
                        {translations[language].images}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TaskDetails;
