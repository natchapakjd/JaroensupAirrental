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
    completeTaskConfirm: "คุณแน่ใจหรือไม่ว่าต้องการทำเครื่องหมายว่างานนี้เสร็จสมบูรณ์?",
    deleteTaskConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?",
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
    completeTaskConfirm: "Are you sure you want to mark this task as completed?",
    deleteTaskConfirm: "Are you sure you want to delete this task?",
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
  const [loading,setLoading] = useState(true);
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


  const fetchUserData = async (taskPage, orderPage) => {
    try {
      const taskResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/task-paging/${user_id}?page=${taskPage}&limit=100`
      );
      const filteredTasks = taskResponse.data.tasks.filter(
        (task) => task.task_type_id === 1
      );
      setTaskHistory(filteredTasks);
      setTotalTasks(filteredTasks.length); 

      const orderResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/v1/orders/${user_id}?page=${orderPage}&limit=100`
      );
      setOrderHistory(orderResponse.data.orders);
      setTotalOrders(orderResponse.data.totalCount);

      const paymentResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/payments/${user_id}`
      );
      const payments = paymentResponse.data.reduce((acc, payment) => {
        acc[payment.task_id] = payment;
        return acc;
      }, {});
      setPaymentHistory(payments);
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
    navigate(`/review/${taskId}`);
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
        console.log(result);
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
        title: "Are you sure?",
        text: "This task will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });
  
      if (confirmation.isConfirmed) {
        const result = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/v2/task/${taskId}`);
        // After deleting, fetch user data again to refresh the task list
        fetchUserData(taskPage, orderPage);
  
        // Display success message with Swal
        Swal.fire({
          title: "Task deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
  
      // Display error message with Swal
      Swal.fire({
        title: "Failed to delete task.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  if(loading){
    return <Loading/>
  }
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
      <h2 className="text-2xl font-bold mb-4">{translations[language].userHistory}</h2>

        <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{translations[language].taskHistory}</h3>
        <table className="table table-zebra w-full">
            <thead>
              <tr>
              <th>{translations[language].taskId}</th>
                <th>{translations[language].taskType}</th>
                <th>{translations[language].description}</th>
                <th>{translations[language].address}</th>
                <th>{translations[language].status}</th>
                <th>{translations[language].appointmentDate}</th>
                <th>{translations[language].createdAt}</th>
                <th>{translations[language].details}</th>
                <th>{translations[language].actions}</th>
              </tr>
            </thead>
            <tbody>
              {taskHistory.length > 0 ? (
                taskHistory.map((task,index) => (
                  <tr key={index+1}>
                     <td>{index+1}</td>
                    <td>{task.type_name}</td>
                    <td>{task.description}</td>
                    <td>{task.address}</td>
                    <td>{task.status_name}</td>
                    <td>{new Date(task.appointment_date).toLocaleString()}</td>
                    <td>{new Date(task.created_at).toLocaleString()}</td>
                    <td> <button onClick={() => handleTaskDetail(task.task_id)} className="text-blue-500 hover:underline">
                    {translations[language].details}
                    </button></td>
                    <td>
                      {task.status_id === 2 && (
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
                          <div className="flex pt-1 mt-1">                            {translations[language].attachSlip}
                          </div>
                        </button>
                      )}
                                            {task.status_id !== 2 && ( // If task is in progress

                      <button
                        onClick={() => handleDeleteTask(task.task_id)} // Add delete button
                        className="ml-5 text-red-600"
                      >
                            {translations[language].cancelTask}
                            </button>
                                            )}
                      {task.status_id === 1 && ( // If task is in progress
                      <button
                        onClick={() => handleCompleteTask(task.task_id)} // Mark task as completed
                        className="ml-5 text-green-600"
                      >
                          {translations[language].markDone}
                          </button>

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
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleTaskPageChange(-1)}
            disabled={taskPage === 1}
          >
          {translations[language].previous}

          </button>
          <span>
          {translations[language].page} {taskPage} {translations[language].of} {Math.ceil(totalTasks / 10) || 1} 
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
<table className="table table-zebra w-full">
  <thead>
    <tr>
      <th>{translations[language].orderId}</th>
      <th>{translations[language].totalPrice}</th>
      <th>{translations[language].orderDate}</th>
      <th>{translations[language].details}</th>
      <th>{translations[language].actions}</th>
    </tr>
  </thead>
  <tbody>
    {orderHistory.length > 0 ? (
      orderHistory.map((order) => (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.total_price.toFixed(2)}</td>
          <td>{new Date(order.created_at).toLocaleString()}</td>
          <td>
            <button
              onClick={() => handleOrderDetail(order.id)}
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

<div className="flex justify-between mt-4">
  <p
    onClick={() => handleOrderPageChange(-1)}
    disabled={orderPage === 1}
   
  >
    {translations[language].previous}
  </p>
  <span>
    {translations[language].page} {orderPage} {translations[language].of} {Math.ceil(totalOrders / 10)}
  </span>
  <p
    onClick={() => handleOrderPageChange(1)}
    disabled={orderPage >= Math.ceil(totalOrders / 10)}
    
  >
    {translations[language].next}
  </p>
</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserHistory;
