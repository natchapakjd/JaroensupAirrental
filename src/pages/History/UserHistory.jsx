import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { MdOutlineStar } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const UserHistory = () => {
  const token = useAuth();
  const [taskHistory, setTaskHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [taskPage, setTaskPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [paymentHistory, setPaymentHistory] = useState({}); // Store payment info
  const user_id = token.user.id;
  const navigate = useNavigate(); // Initialize navigate

  // Fetch user data (task history, order history, and payment info)
  const fetchUserData = async (taskPage, orderPage) => {
    try {
      // Fetch task history
      const taskResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/task-paging/${user_id}&page=${taskPage}&limit=10`
      );
      setTaskHistory(taskResponse.data.tasks);
      setTotalTasks(taskResponse.data.totalTasks);
      console.log(taskResponse)
      // Fetch order history
      const orderResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/v1/orders/${user_id}?page=${orderPage}&limit=10`
      );
      setOrderHistory(orderResponse.data.orders);
      setTotalOrders(orderResponse.data.totalCount);

      // Fetch payment history
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


  const handlePayment = (paymentId) => {
    navigate(`/payment/${paymentId}`); // Navigate to the review page
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
                  .filter((task) => task.task_type_id === 1) // Filter tasks with task_type_id = 1
                  .map((task) => (
                    <tr key={task.task_id}>
                      <td>{task.task_id}</td>
                      <td>{task.task_type_id}</td>
                      <td>{task.description}</td>
                      <td>{task.address}</td>
                      <td>{task.status_id}</td>
                      <td>
                        {new Date(task.appointment_date).toLocaleString()}
                      </td>
                      <td>{new Date(task.created_at).toLocaleString()}</td>
                      <td>
                        <button onClick={() => handleTaskDetail(task.task_id)}>
                          View details
                        </button>
                        {task.status_id === 2 && (
                          <>
                            <button
                              onClick={() => handleReview(task.task_id)}
                              className="ml-5 text-blue-600"
                            >
                              <div className="flex pt-1 mt-1 ">
                                <MdOutlineStar className="text-yellow-400" />
                                Rate and Review
                              </div>
                            </button>

                          </>
                        )}
                        {paymentHistory[task.task_id] && (
                          <>
                            <button
                              onClick={() => handlePayment(task.task_id)}
                              className="ml-5 text-blue-600"
                            >
                              <div className="flex pt-1 mt-1 ">
                                แนปสลิป
                              </div>
                            </button>

                          </>
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

          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleTaskPageChange(-1)}
              disabled={taskPage === 1}
            >
              Previous
            </button>
            <span>
              Page {taskPage} of {Math.ceil(totalTasks / 10)}
            </span>
            <button
              onClick={() => handleTaskPageChange(1)}
              disabled={taskPage >= Math.ceil(totalTasks / 10)}
            >
              Next
            </button>
          </div>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
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
