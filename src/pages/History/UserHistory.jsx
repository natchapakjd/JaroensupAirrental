import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { MdOutlineStar } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
const UserHistory = () => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [taskPage, setTaskPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [paymentHistory, setPaymentHistory] = useState({}); // Store payment info
  const navigate = useNavigate(); // Initialize navigate
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const user_id = decodeToken.id;

  const fetchUserData = async (taskPage, orderPage) => {
    try {
      const taskResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/task-paging/${user_id}?page=${taskPage}&limit=100`
      );

      // Filter tasks by task_type_id after fetching
      const filteredTasks = taskResponse.data.tasks.filter(
        (task) => task.task_type_id === 1
      );

      setTaskHistory(filteredTasks);
      setTotalTasks(filteredTasks.length); // Set totalTasks based on filtered tasks

      const orderResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/v1/orders/${user_id}?page=${orderPage}&limit=100`
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
    navigate(`/task/${taskId}`); // Navigate to task details page
  };

  const handleOrderDetail = (orderId) => {
    navigate(`/order-history/${orderId}`); // Navigate to order details page
  };

  const handleReview = (taskId) => {
    navigate(`/review/${taskId}`); // Navigate to the review page
  };

  const handlePaymentSlip = (orderId) => {
    navigate(`/payment/${orderId}`); // Navigate to the payment slip upload/view page
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4">User Task and Order History</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Task History</h3>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task Type</th>
                <th>Description</th>
                <th>Address</th>
                <th>Status</th>
                <th>Appointment Date</th>
                <th>Created At</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {taskHistory.length > 0 ? (
                taskHistory
                  .filter((task) => task.task_type_id === 1)
                  .map((task) => (
                    <tr key={task.task_id}>
                      <td>{task.task_id}</td>
                      <td>{task.type_name}</td>
                      <td>{task.description}</td>
                      <td>{task.address}</td>
                      <td>{task.status_name}</td>
                      <td>
                        {new Date(task.appointment_date).toLocaleString()}
                      </td>
                      <td>{new Date(task.created_at).toLocaleString()}</td>
                      <td>
                        {task.status_id === 2 && (
                          <button
                            onClick={() => handleReview(task.task_id)}
                            className="ml-5 text-blue-600"
                          >
                            <div className="flex pt-1 mt-1">
                              <MdOutlineStar className="text-yellow-400" />
                              Rate and Review
                            </div>
                          </button>
                        )}
                        {paymentHistory[task.task_id] && (
                          <button
                            onClick={() => handlePaymentSlip(task.task_id)}
                            className="ml-5 text-blue-600"
                          >
                            <div className="flex pt-1 mt-1">แนบสลิป</div>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
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
            Previous
          </button>
          <span>
            Page {taskPage} of {Math.ceil(totalTasks / 10) || 1}{" "}
            {/* Prevent division by zero */}
          </span>
          <button
            onClick={() => handleTaskPageChange(1)}
            disabled={taskPage >= Math.ceil(totalTasks / 10)}
          >
            Next
          </button>
        </div>

        <div className="mb-5">
          <h3 className="text-xl font-semibold mb-2">Order History</h3>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Details</th>
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
                      <button onClick={() => handleOrderDetail(order.id)}>
                        View details
                      </button>
                      {}
                      {paymentHistory[order.task_id] && (
                        <button
                          onClick={() => handlePaymentSlip(order.task_id)}
                          className="ml-5 text-blue-600"
                        >
                          <div className="flex pt-1 mt-1">แนบสลิป</div>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No order history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleOrderPageChange(-1)}
              disabled={orderPage === 1}
            >
              Previous
            </button>
            <span>
              Page {orderPage} of {Math.ceil(totalOrders / 10)}
            </span>
            <button
              onClick={() => handleOrderPageChange(1)}
              disabled={orderPage >= Math.ceil(totalOrders / 10)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserHistory;
