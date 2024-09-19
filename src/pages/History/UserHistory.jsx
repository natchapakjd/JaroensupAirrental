import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Footer from "../../components/Footer";

const UserHistory = () => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [date, setDate] = useState("");
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const taskResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tasks?id=${user_id}`
        );
        setTaskHistory(taskResponse.data);

        const orderResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/orders/${user_id}`
        );
        setOrderHistory(orderResponse.data[0].items);
        setDate(new Date(orderResponse.data[0].created_at).toLocaleString());
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    };

    fetchUserData();
  }, [user_id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">User Task and Order History</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Task History</h3>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Description</th>
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
                    <td>{task.description}</td>
                    <td><div className="badge badge-accent text-white">{task.status}</div></td>
                    <td>{new Date(task.appointment_date).toLocaleString()}</td>
                    <td>{new Date(task.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No task history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                orderHistory.map((order, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td> 
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>{order.total_price}</td>
                    <td>{date}</td>
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserHistory;
