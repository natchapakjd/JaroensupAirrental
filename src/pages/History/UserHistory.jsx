import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Footer from "../../components/Footer";

const UserHistory = () => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [taskPage, setTaskPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;

  const fetchUserData = async (taskPage, orderPage) => {
    try {
      // Fetch task history
      const taskResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/task-paging?id=${user_id}&page=${taskPage}&limit=10`
      );
      setTaskHistory(taskResponse.data.tasks);
      setTotalTasks(taskResponse.data.totalTasks);

      // Fetch order history
      const orderResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${user_id}?page=${orderPage}&limit=10`
      );
      setOrderHistory(orderResponse.data.orders);
      setTotalOrders(orderResponse.data.totalItems);
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
              </tr>
            </thead>
            <tbody>
              {taskHistory.length > 0 ? (
                taskHistory.map((task) => (
                  <tr key={task.task_id}>
                    <td>{task.task_id}</td>
                    <td>{task.task_type_id}</td>
                    <td>{task.description}</td>
                    <td>{task.address}</td>
                    <td>
                      <div className="badge badge-accent text-white">{task.status}</div>
                    </td>
                    <td>{new Date(task.appointment_date).toLocaleString()}</td>
                    <td>{new Date(task.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No task history found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button onClick={() => handleTaskPageChange(-1)} disabled={taskPage === 1}>
              Previous
            </button>
            <span>Page {taskPage} of {Math.ceil(totalTasks / 10)}</span>
            <button onClick={() => handleTaskPageChange(1)} disabled={taskPage >= Math.ceil(totalTasks / 10)}>
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
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  order.items.map((item, index) => (
                    <tr key={item.product_id}>
                      {index === 0 ? (
                        <td rowSpan={order.items.length}>{order.order_id}</td>
                      ) : null}
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.total_price.toFixed(2)}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No order history found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button onClick={() => handleOrderPageChange(-1)} disabled={orderPage === 1}>
              Previous
            </button>
            <span>Page {orderPage} of {Math.ceil(totalOrders / 10)}</span>
            <button onClick={() => handleOrderPageChange(1)} disabled={orderPage >= Math.ceil(totalOrders / 10)}>
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
