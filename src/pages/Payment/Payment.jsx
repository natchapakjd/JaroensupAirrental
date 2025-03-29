import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2"; // Import SweetAlert2
import QRCode from "../../assets/images/Payment/QR.png";
import BackButtonEdit from "../../components/BackButtonEdit";
const translations = {
  en: {
    payment_management: "Admin Payment Management",
    qr_code_for_payment: "QR Code for Payment",
    orders: "Orders",
    order_id: "Order ID",
    total_price: "Total Price",
    order_date: "Order Date",
    slip_image: "Slip Image",
    action: "Action",
    no_slip_uploaded: "No slip uploaded",
    upload_change_slip: "Upload/Change Slip",
    select_payment_slip_image: "Select Payment Slip Image",
    upload_slip: "Upload Slip",
    no_orders_found: "No orders found.",
    error_select_slip: "Please select a slip image to upload.",
    success_slip_updated: "Slip image updated successfully!",
    error_update_slip: "Failed to update slip image.",
  },
  th: {
    payment_management: "การจัดการการชำระเงินของผู้ดูแลระบบ",
    qr_code_for_payment: "รหัส QR สำหรับการชำระเงิน",
    orders: "คำสั่งซื้อ",
    order_id: "หมายเลขคำสั่งซื้อ",
    total_price: "ราคารวม",
    order_date: "วันที่คำสั่งซื้อ",
    slip_image: "ภาพใบเสร็จ",
    action: "การดำเนินการ",
    no_slip_uploaded: "ยังไม่มีการอัปโหลดใบเสร็จ",
    upload_change_slip: "อัปโหลด/เปลี่ยนใบเสร็จ",
    select_payment_slip_image: "เลือกภาพใบเสร็จการชำระเงิน",
    upload_slip: "อัปโหลดใบเสร็จ",
    no_orders_found: "ไม่พบคำสั่งซื้อ",
    error_select_slip: "โปรดเลือกภาพใบเสร็จเพื่ออัปโหลด",
    success_slip_updated: "อัปเดตภาพใบเสร็จสำเร็จ!",
    error_update_slip: "ไม่สามารถอัปเดตภาพใบเสร็จได้",
  },
};

const Payment = () => {
  // Extract paymentId from the URL
  const { paymentId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order
  const [newSlipImage, setNewSlipImage] = useState(null); // Store new slip image
  const [language, setLanguage] = useState(
    localStorage.getItem("language")|| "th"
  );
  const t = translations[language];

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
    // Fetch orders created by the admin
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/payment-task/${paymentId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [paymentId]); // Depend on paymentId to fetch the relevant data

  // Handle image upload (when the user selects a new file)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSlipImage(file);
    }
  };

  // Handle form submission to update the payment slip image
  const handleSubmit = async (orderId) => {
    if (!newSlipImage) {
      // Use Swal instead of alert
      Swal.fire({
        title: t.error_select_slip,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("slip_image", newSlipImage);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/payments/${paymentId}/slip_image`, // Correct endpoint with paymentId
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Success notification with SweetAlert
      Swal.fire({
        title: t.success_slip_updated,
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedOrder(null); // Deselect order after submission
      setNewSlipImage(null); // Clear file input
    } catch (error) {
      console.error("Error updating slip image:", error);

      // Error notification with SweetAlert
      Swal.fire({
        title: t.error_update_slip,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <div className="flex w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {t.payment_management}
          </h1>
        </div>
        <div className="mb-8 text-center">
          <h3 className="text-xl font-semibold mb-4">
            {t.qr_code_for_payment}
          </h3>
          <div className="flex justify-center flex-col">
            <div className="flex justify-center item-center">
              {" "}
              <img
                src={QRCode}
                alt="Payment QR Code"
                className="w-60 h-60 my-2"
              />
            </div>

            <h3 className="text-xl my-2">Promptpay นาย ชัชวาลย์ แตงเจริญ</h3>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.orders}</h3>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>{t.order_id}</th>
                <th>{t.total_price}</th>
                <th>{t.order_date}</th>
                <th>{t.slip_image}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.payment_id}>
                    <td>{order.payment_id}</td>
                    <td>{order.amount}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      {order.image_url ? (
                        <img
                          src={order.image_url}
                          alt="Slip"
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <span>{t.no_slip_uploaded}</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(order.payment_id)}
                        className="btn bg-blue hover:bg-blue text-white"
                      >
                        {t.upload_change_slip}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {t.no_orders_found}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="mt-5">
            <h3 className="text-xl font-semibold mb-2">
              {t.upload_change_slip}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(selectedOrder);
              }}
            >
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="slip_image"
                >
                  {t.select_payment_slip_image}
                </label>
                <input
                  type="file"
                  id="slip_image"
                  name="slip_image"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full h-10"
                />
              </div>

              <button
                type="submit"
                className="btn bg-blue hover:bg-blue text-white"
              >
                {t.upload_slip}
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Payment;
