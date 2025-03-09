import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import BackButtonEdit from "../../components/BackButtonEdit";
const translations = {
  en: {
    title: "Edit Payment",
    taskLabel: "Task ID",
    orderLabel: "Order ID",
    amountLabel: "Amount",
    userLabel: "User ID",
    paymentMethodLabel: "Payment Method",
    paymentDateLabel: "Payment Date",
    slipImagesLabel: "Slip Images",
    statusLabel: "Status",
    submitButton: "Update Payment",
    selectOption: "Select",
  },
  th: {
    title: "แก้ไขการชำระเงิน",
    taskLabel: "รหัสงาน",
    orderLabel: "รหัสคำสั่งซื้อ",
    amountLabel: "จำนวนเงิน",
    userLabel: "รหัสผู้ใช้",
    paymentMethodLabel: "วิธีการชำระเงิน",
    paymentDateLabel: "วันที่ชำระเงิน",
    slipImagesLabel: "รูปภาพสลิป",
    statusLabel: "สถานะ",
    submitButton: "อัปเดตการชำระเงิน",
    selectOption: "เลือก",
  },
  // Add more languages here as needed
};
const EditPayment = () => {
  const { paymentId } = useParams();
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [slipImages, setSlipImages] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("pending");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;
  const [originalData, setOriginalData] = useState(null); // เก็บค่าข้อมูลเดิม

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  // Get the selected language from localStorage
  const language = localStorage.getItem("language") || "en"; // Default to 'en' if not set
  const t = translations[language]; // Get the translations for the selected language

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          paymentResponse,
          usersResponse,
          tasksResponse,
          ordersResponse,
          statusesResponse,
          paymentMethodsResponse,
        ] = await Promise.all([
          axios.get(`${apiUrl}/payment-payment/${paymentId}`),
          axios.get(`${apiUrl}/users`),
          axios.get(`${apiUrl}/tasks`),
          axios.get(`${apiUrl}/v3/orders`),
          axios.get(`${apiUrl}/statuses`),
          axios.get(`${apiUrl}/payment-methods`),
        ]);

        const paymentData = paymentResponse.data[0];
        setAmount(paymentData.amount);
        setUserId(paymentData.user_id);
        setTaskId(paymentData.task_id || "");
        setPaymentMethod(paymentData.payment_method);
        setPaymentDate(
          paymentData.payment_date
            ? paymentData.payment_date.substring(0, 16)
            : ""
        );
        setOrderId(paymentData.order_id || "");
        setStatus(paymentData.status);
        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setOrders(ordersResponse.data);
        setStatuses(statusesResponse.data);
        setPaymentMethods(paymentMethodsResponse.data);
        setOriginalData(paymentData); // บันทึกข้อมูลเดิม
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    };

    fetchData();
  }, [paymentId, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      amount,
      user_id: userId,
      task_id: taskId,
      method_id: paymentMethod,
      order_id: orderId,
      status_id: status,
    };

    if (slipImages) {
      updatedData.slip_images = slipImages;
    }

    try {
      await axios.put(`${apiUrl}/payments/${paymentId}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ตรวจสอบข้อมูลที่เปลี่ยนแปลง
      let changes = [];
      let changedFields = {};

      Object.keys(updatedData).forEach((key) => {
        if (originalData && originalData[key] !== updatedData[key]) {
          changes.push(`${key}: ${originalData[key]} -> ${updatedData[key]}`);
          changedFields[key] = {
            old: originalData[key],
            new: updatedData[key],
          };
        }
      });

      // ถ้ามีการเปลี่ยนแปลง ให้เพิ่ม log
      if (changes.length > 0) {
        const action = `แก้ไขการชำระเงินไอดี ${paymentId}: ${changes.join(
          ", "
        )}`;
        await axios.post(`${apiUrl}/adminLog`, {
          admin_id: user_id,
          action: action,
        });
      }

      Swal.fire({ title: "อัปเดตการชำระเงินสำเร็จ", icon: "success" });
      navigate("/dashboard/payments");
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto p-8">
      <div className="p-8 font-prompt  rounded-lg shadow-lg">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.title} </h1>
        </div>
        <form onSubmit={handleSubmit} className="text-md">
          {taskId && (
            <div className="mb-4">
              <label className="block mb-2">{t.taskLabel}</label>
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="input w-full border border-gray-300"
                disabled
                required
              >
                <option value="">{t.selectOption}</option>
                {tasks.map((task) => (
                  <option key={task.task_id} value={task.task_id}>
                    {task.task_id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {orderId && (
            <div className="mb-4">
              <label className="block mb-2">{t.orderLabel}</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input w-full border border-gray-300"
                required
              >
                <option value="">{t.selectOption}</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">{t.amountLabel}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full border border-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">{t.userLabel}</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input w-full border border-gray-300"
              required
            >
              <option value="">{t.selectOption}</option>
              {users.map((user, index) => (
                <option key={index + 1} value={user.user_id}>
                  {index + 1}. {user.firstname} {user.lastname}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">{t.paymentMethodLabel}</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input w-full border border-gray-300"
              required
            >
              <option value="">{t.selectOption}</option>
              {paymentMethods.map((method) => (
                <option key={method.method_id} value={method.method_id}>
                  {method.method_name}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mb-4">
        <label className="block mb-2">{t.paymentDateLabel}</label>
        <input type="datetime-local" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="input w-full border border-gray-300" required />
      </div> */}

          <div className="mb-4">
            <label className="block mb-2">{t.statusLabel}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input w-full border border-gray-300"
              required
            >
              <option value="">{t.selectOption}</option>
              {statuses.map((statusOption) => (
                <option
                  key={statusOption.status_id}
                  value={statusOption.status_id}
                >
                  {statusOption.status_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">{t.slipImagesLabel}</label>
            <input
              type="file"
              onChange={(e) => setSlipImages(e.target.files[0])}
              className="file-input file-input-bordered w-full h-10"
            />
          </div>

          <button
            type="submit"
            className="btn bg-blue text-white hover:bg-blue"
          >
            {t.submitButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;
