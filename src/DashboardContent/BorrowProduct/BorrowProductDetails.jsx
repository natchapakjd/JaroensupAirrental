import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const translations = {
  en: {
    borrowingDetails: "Borrowing Details",
    userInformation: "User Information",
    taskInformation: "Task Information",
    borrowingInformation: "Borrowing Information",
    additionalInformation: "Additional Information",
    borrowedProducts: "Borrowed Products",
    userId: "User ID",
    name: "Name",
    taskId: "Task ID",
    description: "Description",
    status: "Status",
    borrowingId: "Borrowing ID",
    productName: "Product Name",
    borrowDate: "Borrow Date",
    returnDate: "Return Date",
    remarks: "Remarks",
    noProductsBorrowed: "No products borrowed",
    taskNotFound: "Task details not found. The task may have been canceled.",
    taskIdMissing: "Task ID is missing. Please check again.",
    completeTaskConfirm: "Are you sure you want to mark this task as completed?",
    deleteTaskConfirm: "Are you sure you want to delete this task?",
    image: "Images",
    editImage: "Edit Image",
    uploadNewImage: "Upload New Image",
    save: "Save",
    cancel: "Cancel",
  },
  th: {
    borrowingDetails: "รายละเอียดการยืม",
    userInformation: "ข้อมูลผู้ใช้",
    taskInformation: "ข้อมูลงาน",
    borrowingInformation: "ข้อมูลการยืม",
    additionalInformation: "ข้อมูลเพิ่มเติม",
    borrowedProducts: "ผลิตภัณฑ์ที่ยืม",
    userId: "รหัสผู้ใช้",
    name: "ชื่อ",
    taskId: "รหัสงาน",
    description: "รายละเอียด",
    status: "สถานะ",
    borrowingId: "รหัสการยืม",
    productName: "ชื่อผลิตภัณฑ์",
    borrowDate: "วันที่ยืม",
    returnDate: "วันที่คืน",
    remarks: "หมายเหตุ",
    noProductsBorrowed: "ไม่มีผลิตภัณฑ์ที่ยืม",
    taskNotFound: "ไม่พบข้อมูลการยืมนี้ ข้อมูลอาจถูกยกเลิกไปแล้ว",
    taskIdMissing: "รหัสงานหายไป กรุณาตรวจสอบอีกครั้ง",
    completeTaskConfirm: "คุณแน่ใจหรือไม่ว่าต้องการทำเครื่องหมายว่างานนี้เสร็จสมบูรณ์?",
    deleteTaskConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?",
    image: "รูปภาพแนบ",
    editImage: "แก้ไขรูปภาพ",
    uploadNewImage: "อัปโหลดรูปภาพใหม่",
    save: "บันทึก",
    cancel: "ยกเลิก",
  },
};

const BorrowProductDetails = () => {
  const { task_id } = useParams();
  const [borrowingData, setBorrowingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const techId = decodedToken.id;
  const role = decodedToken.role;

  useEffect(() => {
    if (task_id) {
      fetchBorrowingDetails();
    } else {
      setError(translations[language].taskIdMissing);
      setLoading(false);
    }
  }, [task_id]);

  const updateIdCardImage = async (taskId, newImageFile) => {
    const formData = new FormData();
    formData.append("id_card_image", newImageFile);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/v2/equipment-borrowing/update-image/${taskId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Image updated:", response.data);
      setBorrowingData((prev) => ({
        ...prev,
        image_url: response.data.image_url,
      }));
      Swal.fire({
        title: "Success",
        text: translations[language].uploadNewImage + " completed",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating image:", error.response?.data || error);
      Swal.fire({
        title: "Error",
        text: translations[language].uploadNewImage + " failed",
        icon: "error",
      });
    }
  };

  const fetchBorrowingDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/v4/equipment-borrowing/id/${task_id}`
      );
      if (!response.data || Object.keys(response.data).length === 0) {
        setBorrowingData(null);
      } else {
        setBorrowingData(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError(translations[language].taskNotFound);
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (role !== 3) {
      return; // Do nothing if role is not 3
    }

    Swal.fire({
      title: translations[language].editImage,
      html: `
        <input type="file" id="newImage" accept="image/*" class="file-input file-input-bordered w-full h-10"/>
      `,
      showCancelButton: true,
      confirmButtonText: translations[language].save,
      cancelButtonText: translations[language].cancel,
      preConfirm: () => {
        const fileInput = document.getElementById("newImage");
        const file = fileInput.files[0];
        if (!file) {
          Swal.showValidationMessage("Please select an image file");
          return false;
        }
        return file;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        updateIdCardImage(task_id, result.value);
      }
    });
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <BackButton />
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">{error}</h1>
          <p className="text-gray-600">
            {translations[language].taskIdMissing} {task_id}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <BackButton />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {translations[language].borrowingDetails}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {translations[language].userInformation}
            </h2>
            <p className="text-gray-700">
              <strong>{translations[language].userId}:</strong> {borrowingData.user_id}
            </p>
            <p className="text-gray-700">
              <strong>{translations[language].name}:</strong> {borrowingData.firstname}{" "}
              {borrowingData.lastname}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {translations[language].taskInformation}
            </h2>
            <p className="text-gray-700">
              <strong>{translations[language].taskId}:</strong> {borrowingData.task_id}
            </p>
            <p className="text-gray-700">
              <strong>{translations[language].description}:</strong> {borrowingData.task_desc}
            </p>
            <p className="text-gray-700">
              <strong>{translations[language].status}:</strong>{" "}
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {borrowingData.status_name}
              </span>
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {translations[language].borrowingInformation}
            </h2>
            <p className="text-gray-700">
              <strong>{translations[language].borrowingId}:</strong> {borrowingData.borrowing_id}
            </p>
            <p className="text-gray-700">
              <strong>{translations[language].productName}:</strong> {borrowingData.product_name}
            </p>
            <p className="text-gray-700">
              <strong>{translations[language].borrowDate}:</strong>{" "}
              {new Date(borrowingData.borrow_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <strong>{translations[language].returnDate}:</strong>{" "}
              {new Date(borrowingData.return_date).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {translations[language].additionalInformation}
            </h2>
            <p className="text-gray-700">
              <strong>{translations[language].image}</strong>
            </p>
            {borrowingData.image_url && (
              <div className="mt-2">
                <img
                  src={borrowingData.image_url}
                  alt="Borrowing Remark Image"
                  className={`max-w-full h-auto rounded-lg shadow-md ${role === 3 ? "cursor-pointer" : ""}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg"; // Optional fallback image
                  }}
                  onClick={role === 3 ? handleImageClick : null} // Only enable click for role 3
                />
              </div>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {translations[language].borrowedProducts}
            </h2>
            {borrowingData.products && borrowingData.products.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700">
                {borrowingData.products.map((product, index) => (
                  <li key={index}>
                    {product.product_name} (Quantity: {product.quantity})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">{translations[language].noProductsBorrowed}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowProductDetails;