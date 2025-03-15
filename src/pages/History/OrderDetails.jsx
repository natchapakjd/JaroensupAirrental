import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Loading from '../../components/Loading';
import BackButtonEdit from '../../components/BackButtonEdit';

// 🔥 แปลภาษา
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
    paymentSlip: "สลิปการชำระเงิน:", // Added payment slip translation
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
    paymentSlip: "Payment Slip:", // Added payment slip translation
  },
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  // ✅ ฟัง event `storage` เพื่ออัปเดตภาษา realtime
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ โหลดข้อมูลเมื่อ `orderId` เปลี่ยน
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

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full font-prompt">
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
                    className="max-w-xs mt-2 rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg"; // Optional: fallback image
                    }}
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
                {order.items.map((item,index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      {index+1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.total_price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>{translations[language].noOrder}</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
