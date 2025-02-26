import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";

const OrderDetailsLog = () => {
  const { taskId } = useParams(); // Get taskId from URL params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  const translations = {
    th: {
      orderDetailsTitle: "บันทึกคำสั่งซื้อ",
      orderId: "หมายเลขคำสั่งซื้อ:",
      user: "ผู้ใช้งาน:",
      orderDate: "วันที่คำสั่งซื้อ:",
      itemsTitle: "รายการสินค้า:",
      productId: "รหัสสินค้า",
      productName: "ชื่อสินค้า",
      quantity: "จำนวน",
      totalPrice: "ราคาทั้งหมด",
      errorLoading: "ไม่สามารถโหลดรายละเอียดคำสั่งซื้อได้.",
      noDetailsAvailable: "ไม่มีบันทึกคำสั่งซื้อ",
      editOrderButton: "แก้ไขคำสั่งซื้อ",
    },
    en: {
      orderDetailsTitle: "Order Log",
      orderId: "Order ID:",
      user: "User:",
      orderDate: "Order Date:",
      itemsTitle: "Items:",
      productId: "Product ID",
      productName: "Product Name",
      quantity: "Quantity",
      totalPrice: "Total Price",
      errorLoading: "Unable to load order log.",
      noDetailsAvailable: "No order log available.",
      editOrderButton: "Edit Order",
    },
  };

  useEffect(() => {
    fetchOrderLog();
  }, [taskId]);

  const fetchOrderLog = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v4/orders?taskId=${taskId}`);
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: translations[language].errorLoading,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {translations[language].orderDetailsTitle}
        </h2>
        <Link to={`/dashboard/orders/edit/${order.order_id}`}>
          <button className="btn bg-blue text-white hover:bg-blue px-6 py-2 rounded-md">
            {translations[language].editOrderButton}
          </button>
        </Link>
      </div>

      {order ? (
        <div>
          <div className="mb-4">
            <h3 className="font-bold">
              {translations[language].orderId} {order.order_id}
            </h3>
            <p>
              {translations[language].user} {order.firstname} {order.lastname}
            </p>
            <p>
              {translations[language].orderDate}{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <h4 className="font-semibold mb-2">
            {translations[language].itemsTitle}
          </h4>
          <table className="w-full border-collapse border border-gray-300 text-center">
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
            <tbody>
              {order.items.map((item) => (
                <tr key={item.product_id}>
                  <td className="border border-gray-300 p-2">
                    {item.product_id}
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
        <div>{translations[language].noDetailsAvailable}</div>
      )}
    </div>
  );
};

export default OrderDetailsLog;
