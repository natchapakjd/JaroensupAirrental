import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const translations = {
  th: {
    orderDetails: "รายละเอียดคำสั่งซื้อ",
    orderId: "รหัสคำสั่งซื้อ",
    orderDate: "วันที่สั่งซื้อ",
    productId: "รหัสสินค้า",
    productName: "ชื่อสินค้า",
    quantity: "จำนวน",
    totalPrice: "ราคารวม",
    noOrder: "ไม่มีรายละเอียดคำสั่งซื้อ",
    refresh: "รีเฟรช",
    paymentSlip: "สลิปการชำระเงิน:",
    editImage: "แก้ไขรูปภาพ",
    uploadNewImage: "อัปโหลดรูปภาพใหม่",
    save: "บันทึก",
    cancel: "ยกเลิก",
  },
  en: {
    orderDetails: "Order Details",
    orderId: "Order ID",
    orderDate: "Order Date",
    productId: "Product ID",
    productName: "Product Name",
    quantity: "Quantity",
    totalPrice: "Total Price",
    noOrder: "No order details available.",
    refresh: "Refresh",
    paymentSlip: "Payment Slip:",
    editImage: "Edit Image",
    uploadNewImage: "Upload New Image",
    save: "Save",
    cancel: "Cancel",
  },
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = token ? jwtDecode(token) : {};
  const role = decodedToken.role;

  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/v2/orders?orderId=${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: "Failed to load order details.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSlipImage = async (paymentId, newImageFile) => {
    const formData = new FormData();
    formData.append("slip_image", newImageFile);
    console.log(paymentId)
    try {
      const response = await axios.put(
        `${apiUrl}/payments/${paymentId}/slip_image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Image updated:", response.data);
      setOrder((prev) => ({
        ...prev,
        image_url: response.data.image_url || prev.image_url, // Update image_url if returned
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

  const handleImageClick = () => {
    if (role !== 3) {
      return; // Do nothing if role is not 3
    }
    console.log(order)
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
        updateSlipImage(order.task_id, result.value); // Assuming order_id is used as paymentId
      }
    });
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between items-center">
          <div className="flex w-full my-2">
            <BackButtonEdit />
            <h1 className="text-2xl font-semibold mx-2">
              {translations[language].orderDetails}
            </h1>
          </div>
          <button
            onClick={fetchOrderDetails}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {translations[language].refresh}
          </button>
        </div>

        {order ? (
          <div>
            <div className="mb-4">
              <h3 className="font-bold">
                {translations[language].orderId}: {order.order_id}
              </h3>
              <p>
                {translations[language].orderDate}:{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            {order.image_url && (
              <div className="mt-4">
                <h4 className="font-semibold">
                  {translations[language].paymentSlip}
                </h4>
                <img
                  src={order.image_url}
                  alt="Payment Slip"
                  className={`max-w-xs mt-2 rounded-lg shadow-md ${role === 3 ? "cursor-pointer" : ""}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg"; // Optional: fallback image
                  }}
                  onClick={role === 3 ? handleImageClick : null} // Only enable click for role 3
                />
              </div>
            )}
            <h4 className="font-semibold mb-2">Items:</h4>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">
                    {translations[language].productId}
                  </th>
                  <th className="border border-gray-300 p-2">
                    {translations[language].productName}
                  </th>
                  <th className="border border-gray-300 p-2">
                    {translations[language].quantity}
                  </th>
                  <th className="border border-gray-300 p-2">
                    {translations[language].totalPrice}
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item.product_name}</td>
                    <td className="border border-gray-300 p-2">{item.quantity}</td>
                    <td className="border border-gray-300 p-2">{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>{translations[language].noOrder}</div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;