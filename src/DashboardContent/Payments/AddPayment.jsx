import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import BackButtonEdit from "../../components/BackButtonEdit";

const AddPayment = () => {
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [slipImages, setSlipImages] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState("pending");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectionMode, setSelectionMode] = useState("task");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;
  // Translations object for English (en) and Thai (th)
  const translations = {
    en: {
      title: "Add Payment",
      selectMode: "Select Mode",
      task: "Task",
      order: "Order",
      taskId: "Task ID",
      orderId: "Order ID",
      userId: "User ID",
      amount: "Amount",
      paymentMethod: "Payment Method",
      paymentDate: "Payment Date",
      status: "Status",
      slipImages: "Slip Images",
      addPayment: "Add Payment",
      selectOption: "Select",
      noUsers: "No users available",
      noTasks: "No tasks available",
      noOrders: "No orders available",
      noStatuses: "No statuses available",
      error: "Error",
      paymentAdded: "Payment added successfully",
    },
    th: {
      title: "เพิ่มการชำระเงิน",
      selectMode: "เลือกโหมด",
      task: "งานเช่า",
      order: "คำสั่งซื้อ",
      taskId: "รหัสงาน",
      orderId: "รหัสคำสั่งซื้อ",
      userId: "รหัสผู้ใช้",
      amount: "จำนวนเงิน",
      paymentMethod: "วิธีการชำระเงิน",
      paymentDate: "วันที่ชำระเงิน",
      status: "สถานะ",
      slipImages: "รูปภาพใบเสร็จ",
      addPayment: "เพิ่มการชำระเงิน",
      selectOption: "เลือก",
      noUsers: "ไม่มีผู้ใช้",
      noTasks: "ไม่มีงาน",
      noOrders: "ไม่มีคำสั่งซื้อ",
      noStatuses: "ไม่มีสถานะ",
      error: "ข้อผิดพลาด",
      paymentAdded: "เพิ่มการชำระเงินสำเร็จ",
    },
  };

  const language = localStorage.getItem("language") || "en"; // Default to 'en' if not set
  const t = translations[language];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          tasksResponse,
          ordersResponse,
          statusesResponse,
          paymentMethodsResponse,
        ] = await Promise.all([
          axios.get(`${apiUrl}/users`),
          axios.get(`${apiUrl}/tasks`),
          axios.get(`${apiUrl}/v3/orders`),
          axios.get(`${apiUrl}/statuses`),
          axios.get(`${apiUrl}/payment-methods`),
        ]);
        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setOrders(ordersResponse.data);
        setStatuses(statusesResponse.data);
        setPaymentMethods(paymentMethodsResponse.data);
      } catch (error) {
        Swal.fire({
          title: t.error,
          text: error.message,
          icon: "error",
        });
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("user_id", userId);
    formData.append("method_id", paymentMethod);
    formData.append("payment_date", paymentDate);
    if (slipImages) {
      formData.append("slip_images", slipImages);
    }
    formData.append("order_id", selectionMode === "order" ? orderId : null);
    formData.append("task_id", selectionMode === "task" ? taskId : null);
    formData.append("status_id", status);

    try {
      const response = await axios.post(`${apiUrl}/payments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      // 🔹 เรียก API บันทึก Log
      await axios.post(`${apiUrl}/adminLog`, {
        admin_id: user_id, // สมมติว่า userId คือ admin ที่ทำรายการ
        action: `สร้างการชำระเงินให้งาน : ${
          response.data.payment_id || "unknown"
        }`,
      });

      Swal.fire({
        title: t.paymentAdded,
        icon: "success",
      });
      navigate("/dashboard/payments");
    } catch (error) {
      console.error("Error submitting payment:", error);

      Swal.fire({
        title: t.error,
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 font-prompt rounded-lg shadow-lg">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.title} </h1>
        </div>

        <form onSubmit={handleSubmit} className="text-sm font-medium">
          <div className="mb-4">
            <label className="block mb-2">{t.selectMode}</label>
            <select
              value={selectionMode}
              onChange={(e) => setSelectionMode(e.target.value)}
              className="input w-full border-gray-300"
            >
              <option value="task">{t.task}</option>
              {/* <option value="order">{t.order}</option> */}
            </select>
          </div>
          {selectionMode === "task" && (
            <div className="mb-4">
              <label className="block mb-2">{t.taskId}</label>
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="input w-full border border-gray-300"
                required
              >
                <option value="">{t.selectOption}</option>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <option key={index + 1} value={task.task_id}>
                      {index + 1}. {task.description}
                    </option>
                  ))
                ) : (
                  <option value="">{t.noTasks}</option>
                )}
              </select>
            </div>
          )}
          {selectionMode === "order" && (
            <div className="mb-4">
              <label className="block mb-2">{t.orderId}</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input w-full border border-gray-300"
                required
              >
                <option value="">{t.selectOption}</option>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.id}
                    </option>
                  ))
                ) : (
                  <option value="">{t.noOrders}</option>
                )}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2">{t.userId}</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input w-full border-gray-300"
              required
            >
              <option value="">{t.selectOption}</option>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <option key={index + 1} value={user.user_id}>
                    {index + 1}. {user.firstname} {user.lastname}
                  </option>
                ))
              ) : (
                <option value="">{t.noUsers}</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">{t.amount}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full border-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">{t.paymentMethod}</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input w-full border-gray-300"
              required
            >
              <option value="">{t.selectOption}</option>
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <option key={method.method_id} value={method.method_id}>
                    {method.method_name}
                  </option>
                ))
              ) : (
                <option value="">{t.noUsers}</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">{t.paymentDate}</label>
            <input
              type="datetime-local"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="input w-full border-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">{t.status}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input w-full border-gray-300"
            >
              <option value="">{t.selectOption}</option>
              {statuses.length > 0 ? (
                statuses.map((statusOption) => (
                  <option
                    key={statusOption.status_id}
                    value={statusOption.status_id}
                  >
                    {statusOption.status_name}
                  </option>
                ))
              ) : (
                <option value="">{t.noStatuses}</option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">{t.slipImages}</label>
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
            {t.addPayment}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
