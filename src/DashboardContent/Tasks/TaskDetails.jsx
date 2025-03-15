import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use environment variable
  const [images, setImages] = useState([]); // To store images
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image for popup
  const [rentals, setRentals] = useState([]);

  // Determine language from localStorage
  const language = localStorage.getItem("language") || "en";
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchTaskDetails();
    fetchTaskImages();
  }, [taskId]);

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
      images: "Images",
      type_name: "Task type",
      price : "Total Price",
      phone : "Phone",
      organizationName: "Organization Name"
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
      name: "ชื่อผู้สั่งงาน",
      noTaskFound: "ไม่พบงาน",
      failedToLoad: "ไม่สามารถโหลดรายละเอียดงานได้",
      images: "รูปภาพ",
      type_name: "ประเภทงาน",
      price : "ราคารวม",
      phone : "เบอร์ติดต่อ",
      organizationName: "ชื่อองค์กร"
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      // Fetch task details
      const response = await axios.get(`${apiUrl}/task/${taskId}`);
      let taskData = response.data;

      // Fetch rentals data
      const rentalResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/rentals`
      );
      const rentalData = rentalResponse.data.rentalData;

      if (Array.isArray(rentalData)) {
        // รวม rentals เข้าไปใน taskData โดย task_id ต้องตรงกัน
        taskData = {
          ...taskData,
          rentalDetails: rentalData.filter(
            (rental) => rental.task_id === taskData.task_id
          ),
        };
      } else {
        console.error("Rental data is not in expected format:", rentalData);
      }

      // Set updated task data
      setTask(taskData);
      console.log(taskData);
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
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between">
          <div className="flex w-full my-2">
            <BackButtonEdit />
            <h1 className="text-2xl font-semibold mx-2">
              {t.taskDetails}: {task.title}
            </h1>
          </div>

          <Link to={`/dashboard/tasks/add-image/${taskId}`}>
            <button className="btn bg-blue hover:bg-blue text-white">
              แก้ไขรูปภาพ
            </button>
          </Link>
        </div>

        <div className="mb-4">
          {task.task_id && (
            <p>
              <strong>{t.id}:</strong> {task.task_id}
            </p>
          )}
           {task.organization_name && (
            <p>
              <strong>{t.organization_name}:</strong> {task.organization_name}
            </p>
          )}
           {task.user_id && (
            <p>
              <strong>{t.name}:</strong> {task.firstname} {task.lastname}
            </p>
          )}
           {task.phone && (
              <p>
                <strong>{t.phone}:</strong>{" "}
                {task.phone}
              </p>
            )}
          {task.description && (
            <p>
              <strong>{t.description}:</strong> {task.description}
            </p>
          )}
          {task.type_name && (
            <p>
              <strong>{t.type_name}:</strong> {task.type_name}
            </p>
          )}
          {task.status_id && (
            <p>
              <strong>{t.status}:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  task.status_name === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : task.status_name === "active"
                      ? "bg-blue-100 text-blue-800"
                      : task.status_name === "approve"
                        ? "bg-green-100 text-green-800"
                        : task.status_name === "hiring"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-200 text-gray-600"
                }`}
              >
                {task.status_name}
              </span>
            </p>
          )}
          {task.appointment_date && (
            <p>
              <strong>{t.startDate}:</strong>{" "}
              {new Date(
                new Date(task.appointment_date).getTime() + 7 * 60 * 60 * 1000
              ).toLocaleString("th-TH", {
                timeZone: "Asia/Bangkok",
              })}
            </p>
          )}
          {task.rental_end_date && (
            <p>
              <strong>{t.finishDate}:</strong>{" "}
              {new Date(
                new Date(task.rental_end_date).getTime() + 7 * 60 * 60 * 1000
              ).toLocaleDateString("th-TH", {
                timeZone: "Asia/Bangkok",
              })}
            </p>
          )}

          {task.address && (
            <p>
              <strong>{t.address}:</strong> {task.address}
            </p>
          )}
           {task.total !== 0 && (
              <p>
                <strong>{translations[language].price}:</strong>{" "}
                {task.price}
              </p>
            )}
        </div>
        {/* Rental Details Table */}
        {task.rentalDetails && task.rentalDetails.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg mb-4 font-semibold">รายละเอียดการเช่า</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg mb-4">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">รหัสสินค้า</th>
                    <th className="py-3 px-6 text-left">ชื่ออุปกรณ์</th>
                    <th className="py-3 px-6 text-left">จำนวน</th>
                    <th className="py-3 px-6 text-left">วันที่เริ่มต้น</th>
                    <th className="py-3 px-6 text-left">วันที่สิ้นสุด</th>
                  </tr>
                </thead>
                <tbody>
                  {task.rentalDetails.map((rental, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100 "
                    >
                      <td className="py-3 px-6 text-center">{index + 1}</td>
                      <td className="py-3 px-6">
                        {rental.product_name || "-"}
                      </td>
                      <td className="py-3 px-6">
                        {rental.total_quantity_used}
                      </td>
                      <td className="py-3 px-6">
                        {rental.rental_start_date
                          ? new Date(
                              rental.rental_start_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-6">
                        {rental.rental_end_date
                          ? new Date(
                              rental.rental_end_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {task.latitude && task.longitude && (
          <p>
            <strong>ตำแหน่งที่ตั้ง</strong>
          </p>
        )}
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
  );
};

export default TaskDetails;
