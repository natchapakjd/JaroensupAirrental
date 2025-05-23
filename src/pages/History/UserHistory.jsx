import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { MdOutlineStar } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import Swal from "sweetalert2"; // Ensure Swal is imported
import Loading from "../../components/Loading";
import BookingPdf from "./BookingPdf";
import OrderReceipt from "./OrderReceipt";

const translations = {
  th: {
    userHistory: "ประวัติการใช้งาน",
    taskHistory: "ประวัติการแจ้งงาน",
    orderHistory: "ประวัติการสั่งซื้อ",
    taskId: "รหัสงาน",
    taskType: "ประเภทงาน",
    description: "รายละเอียด",
    address: "ที่อยู่",
    status: "สถานะ",
    appointmentDate: "วันที่นัดหมาย",
    createdAt: "วันที่สร้าง",
    details: "รายละเอียด",
    viewDetails: "ดูรายละเอียด",
    actions: "การดำเนินการ",
    review: "ให้คะแนนรีวิว",
    attachSlip: "แนบสลิป",
    noSlip: "ไม่มีสลิปแนบ",
    cancelTask: "ยกเลิกงาน",
    cancelOrder: "ยกเลิกออเดอร์",
    markDone: "เสร็จสิ้น",
    noTask: "ไม่พบประวัติแจ้งงาน",
    orderId: "รหัสคำสั่งซื้อ",
    totalPrice: "ราคารวม",
    orderDate: "วันที่สั่งซื้อ",
    noOrder: "ไม่พบประวัติการสั่งซื้อ",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    page: "หน้า",
    of: "จาก",
    file: "ไฟล์",
    completeTaskConfirm:
      "คุณแน่ใจหรือไม่ว่าต้องการทำเครื่องหมายว่างานนี้เสร็จสมบูรณ์?",
    deleteTaskConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?",
    statusAll: "สถานะทั้งหมด",
    statusPending: "รอดำเนินการ",
    statusActive: "กำลังดำเนินการ",
    statusApproved: "อนุมัติแล้ว",
    statusCompleted: "เสร็จสิ้น",
    name: "ชื่อ-สกุล",
  },
  en: {
    userHistory: "User Task and Order History",
    taskHistory: "Task History",
    orderHistory: "Order History",
    taskId: "Task ID",
    taskType: "Task Type",
    description: "Description",
    address: "Address",
    status: "Status",
    appointmentDate: "Appointment Date",
    createdAt: "Created At",
    details: "Details",
    viewDetails: "View Details",
    actions: "Actions",
    review: "Give Review",
    attachSlip: "Attach Slip",
    noSlip: "No slip attached",
    cancelTask: "Cancel Task",
    cancelOrder: "Cancel Order",
    markDone: "Mark as Done",
    noTask: "No task history found.",
    orderId: "Order ID",
    totalPrice: "Total Price",
    orderDate: "Order Date",
    noOrder: "No order history found.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    completeTaskConfirm:
      "Are you sure you want to mark this task as completed?",
    deleteTaskConfirm: "Are you sure you want to delete this task?",
    file: "File",
    statusAll: "All Status",
    statusPending: "Pending",
    statusActive: "Active",
    statusApproved: "Approved",
    statusCompleted: "Completed",
    name: "Name",
  },
};

const UserHistory = () => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [taskPage, setTaskPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [paymentHistory, setPaymentHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusFilterOrder, setStatusFilterOrder] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [orderSearchTerm, setOrderSearchTerm] = useState(""); // New search term for orders
  const [appointmentData, setAppointmentData] = useState();
  const [rentals, setRentals] = useState();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const user_id = decodeToken.id;
  const [language, setLanguage] = useState("th"); // ✅ เพิ่ม state ภาษา

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "th";
    setLanguage(savedLanguage);

    // ✅ ทำให้เปลี่ยนภาษาทันทีที่ localStorage เปลี่ยน
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredTasks = taskHistory.filter((task) => {
    return (
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? task.status_name === statusFilter : true)
      // (reviewFilter ? task.reviewed.toString() === reviewFilter : true)
    );
  });

  const filteredOrders = orderHistory.filter((order) => {
    return (
      (order.order_id.toString().includes(orderSearchTerm.toLowerCase()) ||
        order.status_name
          .toLowerCase()
          .includes(orderSearchTerm.toLowerCase())) &&
      (statusFilterOrder ? order.status_name === statusFilterOrder : true)
    );
  });

  const fetchUserData = async (taskPage, orderPage) => {
    try {
      // Fetch task history
      const taskResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/task-paging/${user_id}?page=${taskPage}&limit=10`
      );
      const filteredTasks = taskResponse.data.tasks.filter(
        (task) => task.task_type_id === 1 || task.task_type_id === 12
      );
      setTaskHistory(filteredTasks);
      setTotalTasks(taskResponse.data.totalTasks);
      // Fetch order history
      const orderResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/v1/orders/${user_id}?page=${orderPage}&limit=10`
      );

      const orders = orderResponse.data.orders.map((order) => ({
        ...order,
        items: order.items || [],
      }));

      setOrderHistory(orders);

      setTotalOrders(orderResponse.data.totalOrders);

      // Fetch payment history
      const paymentResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/payments/${user_id}`
      );
      const payments = paymentResponse.data.reduce((acc, payment) => {
        acc[payment.task_id] = payment;
        return acc;
      }, {});
      setPaymentHistory(payments);

      // Fetch rentals data
      const rentalResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/rentals`
      );

      // Access rentalData array
      const rentalData = rentalResponse.data.rentalData;

      if (Array.isArray(rentalData)) {
        // If rentalData is an array, we can safely use .filter() to get all rentals for a task
        setRentals(rentalData);

        // Combine rentals with tasks based on task_id
        const tasksWithRentals = filteredTasks.map((task) => {
          // Filter all rentals related to the task_id
          const rentalsForTask = rentalData.filter(
            (rental) => rental.task_id === task.task_id
          );
          return {
            ...task,
            rentalDetails: rentalsForTask.length > 0 ? rentalsForTask : null, // Add all rentals for this task or null if no rentals found
          };
        });
        setTaskHistory(tasksWithRentals);
        console.log(tasksWithRentals);
      } else {
        // Handle case where rentalData is not an array
        console.error("Rental data is not in expected format:", rentalData);
      }

      // Fetch appointment data
      const appointmentResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/appointments`
      );
      const appointments = appointmentResponse.data.reduce(
        (acc, appointment) => {
          acc[appointment.task_id] = appointment;
          return acc;
        },
        {}
      );
      setAppointmentData(appointments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  };

  useEffect(() => {
    fetchUserData(taskPage, orderPage);
  }, [taskPage, orderPage, user_id]);

  const handleTaskPageChange = (direction) => {
    setTaskPage((prev) => Math.max(1, prev + direction));
  };

  const handleOrderPageChange = (direction) => {
    setOrderPage((prev) => Math.max(1, prev + direction));
  };

  const handleTaskDetail = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleOrderDetail = (orderId) => {
    navigate(`/order-history/${orderId}`);
  };

  const handleReview = (taskId) => {
    if (appointmentData[taskId]) {
      navigate(`/review/${taskId}`);
    } else {
      Swal.fire({
        title: "No Assignment",
        text: "This task has not been assigned yet.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };
  const handlePaymentSlip = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      // Show confirmation dialog before proceeding
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "This task will be marked as completed.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, mark as completed!",
        cancelButtonText: "Cancel",
      });

      if (confirmation.isConfirmed) {
        const result = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/task/update-status/${taskId}`
        );
        // After updating the task, fetch user data again to refresh the task list
        fetchUserData(taskPage, orderPage);

        // Display success message with Swal
        Swal.fire({
          title: "Task marked as completed.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error completing task:", error);

      // Display error message with Swal
      Swal.fire({
        title: "Failed to mark task as completed.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      // Show confirmation dialog before proceeding
      const confirmation = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "งานนี้จะถูกลบถาวรและไม่สามารถกู้คืนได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/task-log`, {
        task_id: taskId,
        user_id: user_id, // ระบุ user ที่ทำการลบ
        action: `ยกเลิกบริการงานเช่า(หมายเลข): ${taskId} `,
      });

      if (confirmation.isConfirmed) {
        const result = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/v2/task/${taskId}`
        );

        // After deleting, fetch user data again to refresh the task list
        fetchUserData(taskPage, orderPage);

        // Display success message with Swal
        Swal.fire({
          title: "ลบงานสำเร็จ!",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);

      // Display error message with Swal
      Swal.fire({
        title: "ไม่สามารถลบงานได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Show confirmation dialog before proceeding
      const confirmation = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "ออเดอร์นี้จะถูกลบถาวรและไม่สามารถกู้คืนได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (confirmation.isConfirmed) {
        const result = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/v1/orders/${orderId}`
        );

        // After deleting, fetch user data again to refresh the task list
        fetchUserData(taskPage, orderPage);

        // Display success message with Swal
        Swal.fire({
          title: "ลบออเดอร์สำเร็จ!",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);

      // Display error message with Swal
      Swal.fire({
        title: "ไม่สามารถลบงานได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Navbar />
      <div className="container mx-2 my-10 font-prompt md:mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {translations[language].userHistory}
        </h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">
            {translations[language].taskHistory}
          </h3>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="ค้นหางาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">{translations[language].statusAll}</option>
              <option value="pending">
                {translations[language].statusPending}
              </option>
              <option value="active">
                {translations[language].statusActive}
              </option>
              <option value="approve">
                {translations[language].statusApproved}
              </option>
              <option value="completed">
                {translations[language].statusCompleted}
              </option>
            </select>
            {/* <select
          value={reviewFilter}
          onChange={(e) => setReviewFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">ทั้งหมด</option>
          <option value="true">รีวิวแล้ว</option>
          <option value="false">ยังไม่รีวิว</option>
        </select> */}
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{translations[language].taskId}</th>
                  <th>{translations[language].name}</th>
                  <th>{translations[language].taskType}</th>
                  {/* <th>{translations[language].description}</th> */}
                  <th>{translations[language].address}</th>
                  <th>{translations[language].status}</th>
                  <th>{translations[language].appointmentDate}</th>
                  <th>{translations[language].createdAt}</th>
                  <th>{translations[language].details}</th>
                  <th>{translations[language].actions}</th>
                  <th>{translations[language].file}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <tr key={index + 1}>
                      <td>{(taskPage - 1) * 10 + index + 1}</td>{" "}
                      <td>
                        {task.firstname} {task.lastname}
                      </td>
                      <td>{task.type_name}</td>
                      <td>{task.address}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded ${
                            task.status_name === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : task.status_name === "active"
                                ? "bg-red-100 text-red-800"
                                : task.status_name === "approve"
                                  ? "bg-green-100 text-green-800"
                                  : task.status_name === "completed"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {task.status_name}
                        </span>
                      </td>
                      <td>
                        <td>
                          <td>
                            {new Date(
                              new Date(task.appointment_date).getTime() +
                                +6 * 60 * 60 * 1000
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
                          </td>
                        </td>
                      </td>
                      <td>
                        {new Date(
                          new Date(task.created_at).getTime() +
                            7 * 60 * 60 * 1000
                        ).toLocaleString("en-TH", {
                          timeZone: "Asia/Bangkok",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleTaskDetail(task.task_id)}
                          className="text-blue-500 hover:underline"
                        >
                          {translations[language].details}
                        </button>
                      </td>
                      <td>
                        {appointmentData[task.task_id] &&
                          task.status_id === 2 && (
                            <button
                              onClick={() => handleReview(task.task_id)}
                              className="ml-5 text-blue-600"
                            >
                              <div className="flex pt-1 mt-1">
                                <MdOutlineStar className="text-yellow-400" />
                                {translations[language].review}
                              </div>
                            </button>
                          )}
                        {paymentHistory[task.task_id] && (
                          <button
                            onClick={() => handlePaymentSlip(task.task_id)}
                            className="ml-5 text-blue-600"
                          >
                            <div className="flex pt-1 mt-1">
                              {" "}
                              {translations[language].attachSlip}
                            </div>
                          </button>
                        )}
                        {task.status_id !== 2 &&
                          task.status_id !== 4 &&
                          task.status_id !== 5 && ( // If task is in progress
                            <button
                              onClick={() => handleDeleteTask(task.task_id)} // Add delete button
                              className="ml-5 text-red-600"
                            >
                              {translations[language].cancelTask}
                            </button>
                          )}
                        {task.status_id === 5 && ( // If task is in progress
                          <button
                            onClick={() => handleCompleteTask(task.task_id)} // Mark task as completed
                            className="ml-5 text-green-600"
                          >
                            {translations[language].markDone}
                          </button>
                        )}
                      </td>
                      <td>
                        {task.status_id !== 1 && task.task_type_id === 1 && (
                          <BookingPdf task={task} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No task history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleTaskPageChange(-1)}
            disabled={taskPage === 1}
          >
            {translations[language].previous}
          </button>
          <span>
            {translations[language].page} {taskPage} {translations[language].of}{" "}
            {Math.ceil(totalTasks / 10)}
          </span>
          <button
            onClick={() => handleTaskPageChange(1)}
            disabled={taskPage >= Math.ceil(totalTasks / 10)}
          >
            {translations[language].next}
          </button>
        </div>

        <div className="mb-5">
          <h3 className="text-xl font-semibold mb-2">
            {translations[language].orderHistory}
          </h3>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search order history"
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilterOrder(e.target.value)}
              className="border p-2 rounded"
            >
              <option value=""> {translations[language].statusAll}</option>
              <option value="pending">
                {translations[language].statusPending}
              </option>
              <option value="completed">
                {translations[language].statusCompleted}
              </option>{" "}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{translations[language].orderId}</th>
                  {/* <th>{translations[language].totalPrice}</th> */}
                  <th>{translations[language].orderDate}</th>
                  <th>{translations[language].status}</th>
                  <th>{translations[language].details}</th>
                  <th>{translations[language].actions}</th>
                  <th>{translations[language].file}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={index + 1}>
                      <td>{(orderPage - 1) * 10 + index + 1}</td>
                      {/* <td>{order.total_price.toFixed(2)}</td> */}
                      <td>
                        {new Date(
                          new Date(order.created_at).getTime() +
                            7 * 60 * 60 * 1000
                        ).toLocaleString("th-TH", {
                          timeZone: "Asia/Bangkok",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
                        })}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded ${
                            order.status_name === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status_name === "active"
                                ? "bg-red-100 text-red-800"
                                : order.status_name === "approve"
                                  ? "bg-green-100 text-green-800"
                                  : order.status_name === "completed"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {order.status_name}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOrderDetail(order.order_id)}
                          className="hover:underline text-blue-500"
                        >
                          {translations[language].details}
                        </button>
                      </td>
                      <td>
                        {paymentHistory[order.task_id] ? (
                          <button
                            onClick={() => handlePaymentSlip(order.task_id)}
                            className="ml-5 text-blue-600"
                          >
                            <div className="flex pt-1 mt-1">
                              {translations[language].attachSlip}
                            </div>
                          </button>
                        ) : (
                          <span className="text-gray-400">
                            {translations[language].noSlip}
                          </span>
                        )}
                        {order.status_id === 1 && (
                          <button
                            onClick={() => handleDeleteOrder(order.order_id)} // Add delete button
                            className="ml-5 text-red-600"
                          >
                            {translations[language].cancelOrder}
                          </button>
                        )}
                      </td>
                      <td>
                        {" "}
                        {order.status_id !== 1 && (
                          <OrderReceipt order={order} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      {translations[language].noOrder}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleOrderPageChange(-1)}
              disabled={orderPage === 1}
            >
              {translations[language].previous}
            </button>
            <span>
              {translations[language].page} {orderPage}{" "}
              {translations[language].of} {Math.ceil(totalOrders / 10)}
            </span>
            <button
              onClick={() => handleOrderPageChange(1)}
              disabled={orderPage >= Math.ceil(totalOrders / 10)}
            >
              {translations[language].next}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserHistory;
