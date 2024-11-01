import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditPayment = () => {
  const { paymentId } = useParams(); // Get payment ID from URL parameters
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(""); // Date string in datetime format
  const [slipImages, setSlipImages] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("pending");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]); // New state for statuses
  const [paymentMethods, setPaymentMethods] = useState([]); // New state for payment methods

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

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
          axios.get(`${apiUrl}/payment/${paymentId}`), // Fetch payment details
          axios.get(`${apiUrl}/users`),
          axios.get(`${apiUrl}/tasks`),
          axios.get(`${apiUrl}/v3/orders`),
          axios.get(`${apiUrl}/statuses`), // Fetch statuses
          axios.get(`${apiUrl}/payment-methods`), // Fetch payment methods
        ]);

        const paymentData = paymentResponse.data[0];
        setAmount(paymentData.amount);
        setUserId(paymentData.user_id);
        setTaskId(paymentData.task_id || ""); // Default to empty if null
        setPaymentMethod(paymentData.payment_method);
        setPaymentDate(
          paymentData.payment_date
            ? paymentData.payment_date.substring(0, 16)
            : ""
        ); // Format for datetime-local
        setOrderId(paymentData.order_id || ""); // Default to empty if null
        setStatus(paymentData.status);
        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setOrders(ordersResponse.data);
        setStatuses(statusesResponse.data); // Store fetched statuses
        setPaymentMethods(paymentMethodsResponse.data); // Store fetched payment methods
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

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("user_id", userId);
    formData.append("task_id", taskId);
    formData.append("method_id", paymentMethod);
    formData.append("payment_date", paymentDate); // Send as datetime string
    if (slipImages) {
      formData.append("slip_images", slipImages);
    }
    formData.append("order_id", orderId);
    formData.append("status_id", status);

    try {
      await axios.put(`${apiUrl}/payments/${paymentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Payment updated successfully",
        icon: "success",
      });
      navigate("/dashboard/payments");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="p-8 font-inter">
      <h2 className="text-2xl font-semibold mb-4">Edit Payment</h2>
      <form onSubmit={handleSubmit}>
        {taskId && (
          <div className="mb-4">
            <label className="block mb-2">Task ID</label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="input w-full"
              required
            >
              <option value="">Select Task</option>
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
            <label className="block mb-2">Order ID</label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="input w-full"
              required
            >
              <option value="">Select Order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">User ID</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input w-full"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.user_id}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="input w-full"
            required
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method.method_id} value={method.method_id}>
                {method.method_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Payment Date</label>
          <input
            type="datetime-local"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Slip Images</label>
          <input
            type="file"
            onChange={(e) => setSlipImages(e.target.files[0])}
            className="input w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input w-full"
            required
          >
            <option value="">Select Status</option>
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
        <button type="submit" className="btn bg-blue text-white">
          Update Payment
        </button>
      </form>
    </div>
  );
};

export default EditPayment;
