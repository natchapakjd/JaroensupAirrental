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
  const [images, setImages] = useState([]);
  const [hasAreaCalculation, setHasAreaCalculation] = useState(false);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const language = localStorage.getItem("language") || "en";
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchTaskDetails(),
          fetchTaskImages(),
          fetchAreaCalculation(),
        ]);
      } catch (err) {
        setError(translations[language].failedToLoad);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/${taskId}`);
      let taskData = response.data;

      const rentalResponse = await axios.get(`${apiUrl}/rentals`);
      const rentalData = rentalResponse.data.rentalData;

      if (Array.isArray(rentalData)) {
        taskData = {
          ...taskData,
          rentalDetails: rentalData.filter(
            (rental) => rental.task_id === taskData.task_id
          ),
        };
      } else {
        console.error("Rental data is not in expected format:", rentalData);
      }

      setTask(taskData);
    } catch (error) {
      console.error("Error fetching task details:", error);
      throw error;
    }
  };

  const fetchTaskImages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task_images/${taskId}`);
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching task images:", error);
    }
  };

  const fetchAreaCalculation = async () => {
    try {
      const response = await axios.get(`${apiUrl}/area_cal/by-task/${taskId}`);
      setHasAreaCalculation(response.data.length > 0);
    } catch (error) {
      console.error("Error fetching area calculation:", error);
      setHasAreaCalculation(false);
    }
  };

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
      price: "Total Price",
      phone: "Phone",
      organizationName: "Organization Name",
      technicians: "Technicians",
      techId: "Technician ID",
      techName: "Technician Name",
      viewInstallationDetails: "View Installation Details",
      editImages: "Edit Images",
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
      price: "ราคารวม",
      phone: "เบอร์ติดต่อ",
      organizationName: "ชื่อองค์กร",
      technicians: "ช่างที่รับผิดชอบ",
      techId: "รหัสช่าง",
      techName: "ชื่อช่าง",
      viewInstallationDetails: "ดูรายละเอียดการติดตั้ง",
      editImages: "แก้ไขรูปภาพ",
    },
  };

  const t = translations[language];

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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <BackButtonEdit />
            <h1 className="text-2xl font-semibold mx-2">
              {t.taskDetails}: {task.title}
            </h1>
          </div>
          <div className="flex gap-2">
            {hasAreaCalculation && (
              <Link to={`/dashboard/tasks/installationDetails/${taskId}`}>
                <button className="btn btn-primary text-white">
                  {t.viewInstallationDetails}
                </button>
              </Link>
            )}
            <Link to={`/dashboard/tasks/add-image/${taskId}`}>
              <button className="btn bg-blue hover:bg-blue text-white">
                {t.editImages}
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-4">
          {task.task_id && (
            <p>
              <strong>{t.id}:</strong> {task.task_id}
            </p>
          )}
          {task.organization_name && (
            <p>
              <strong>{t.organizationName}:</strong> {task.organization_name}
            </p>
          )}
          {task.user_id && (
            <p>
              <strong>{t.name}:</strong> {task.user_firstname}{" "}
              {task.user_lastname}
            </p>
          )}
          {task.phone && (
            <p>
              <strong>{t.phone}:</strong> {task.phone}
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
                      ? "bg-red-100 text-red-800"
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
                new Date(task.appointment_date).getTime() + 6 * 60 * 60 * 1000
              ).toLocaleString("en-GB", {
                timeZone: "Europe/London",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // Use 24-hour format
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
          {task.total !== 0 && task.total !== null && (
            <p>
              <strong>{t.price}:</strong> {task.total}
            </p>
          )}
        </div>

        {task.technicians && task.technicians.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg mb-4 font-semibold">{t.technicians}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg mb-4">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">{t.techId}</th>
                    <th className="py-3 px-6 text-left">{t.techName}</th>
                  </tr>
                </thead>
                <tbody>
                  {task.technicians.map((technician, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-center">{index + 1}</td>
                      <td className="py-3 px-6">
                        {technician.firstname} {technician.lastname}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {task.rentalDetails && task.rentalDetails.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg mb-4 font-semibold">รายละเอียดการเช่า</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg mb-4">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">รหัสสินค้า</th>
                    <th className="py-3 px-6 text-left">ชื่ออุปกรณ์</th>
                    <th className="py-3 px-6 text-left">จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {task.rentalDetails.map((rental, index) => {
                    if (
                      rental.product_name === "Unknown Product" &&
                      rental.total_quantity_used === 0
                    ) {
                      return null;
                    }
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-6 text-center">
                          {rental.product_id}
                        </td>
                        <td className="py-3 px-6">
                          {rental.product_name || "-"}
                        </td>
                        <td className="py-3 px-6">
                          {rental.total_quantity_used}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {task.latitude && task.longitude && (
          <div className="mt-8">
            <p className="text-lg mb-4 font-semibold">ตำแหน่งที่ตั้ง</p>
            <MapContainer
              center={[task.latitude, task.longitude]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[task.latitude, task.longitude]}>
                <Popup>{task.description}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg mb-6 font-semibold">{t.images}</h3>
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
                      {t.images}
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
