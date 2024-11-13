import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
const BorrowProductTable = () => {
  const [borrowingData, setBorrowingData] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const techId = decodedToken.id;
  const role = decodedToken.role;

  useEffect(() => {
    fetchBorrowingData(techId);
  }, [borrowingData]);

  const fetchBorrowingData = async (techId) => {
    try {
      if (role === 3) {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/equipment-borrowings`
        );
        setBorrowingData(response.data);
      } else if (role === 2) {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/equipment-borrowing/${techId}`
        );
        setBorrowingData(response.data);
      }
    } catch (error) {
      console.error("Error fetching borrowing data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load borrowing data.",
        icon: "error",
      });
    }
  };

  const handleReturn = async (taskId) => {
    try {
      // Check the status of the task
      const statusResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/approve/${taskId}`
      );

      const statusId = statusResponse.data.status_id; // Assuming your API returns the status_id

      // Check if the status_id is 4 (approved)
      if (statusId !== 4) {
        Swal.fire({
          title: "Not Approved",
          text: "The equipment return has not been approved yet.",
          icon: "warning",
        });
        return;
      }

      // If approved, proceed to return the equipment
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/equipment-borrowing/return/${taskId}`
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Equipment returned successfully",
          icon: "success",
        });
        fetchBorrowingData(); // Refresh data after returning equipment
      } else {
        throw new Error("Failed to return equipment.");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleApprove = async (taskId) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/equipment-borrowing/approve/${taskId}`
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Equipment returned successfully",
          icon: "success",
        });
        fetchBorrowingData(); // Refresh data after returning equipment
      } else {
        throw new Error("Failed to return equipment.");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleCancel = async (borrowing_id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_URL
        }/equipment-borrowing/${borrowing_id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Task Canceled",
          text: "The task has been marked as canceled.",
          icon: "success",
        });
        fetchBorrowingData(techId); // Refresh data after canceling
      } else {
        throw new Error("Failed to cancel the task.");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };
  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mt-8">Borrowed Equipment List</h2>
        {role === 3 ? (
          <Link to="/dashboard/borrows/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              Create borrowing task
            </button>
          </Link>
        ) : null}
      </div>

      <table className="table w-full border-collapse border border-gray-300">
        <thead className="sticky-top bg-gray-200">
          <tr>
            <th className="border p-2 text-center">Borrowing ID</th>
            <th className="border p-2 text-center">Technician Name</th>
            <th className="border p-2 text-center">Product Name</th>
            <th className="border p-2 text-center">Borrow Date</th>
            <th className="border p-2 text-center">Return Date</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Task Type</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {borrowingData.length > 0 ? (
            borrowingData.map((item) => (
              <tr key={item.borrowing_id}>
                <td className="border p-2 text-center">
                  {item.borrowing_id}
                </td>
                <td className="border p-2 text-center">{item.firstname} {item.lastname}</td>
                <td className="border p-2 text-center">
                  {item.product_name}
                </td>
                <td className="border p-2 text-center">
                  {new Date(item.borrow_date).toLocaleString()}
                </td>
                <td className="border p-2 text-center">
                  {item.return_date
                    ? new Date(item.return_date).toLocaleString()
                    : "Not Returned"}
                </td>
                <td className="border p-2 text-center">{item.status_name}</td>
                <td className="border p-2 text-center">{item.task_desc}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {role === 2 && item.status_id === 4? (
                      <button
                        onClick={() => handleReturn(item.task_id)}
                        className="btn btn-error text-white"
                      >
                        Return
                      </button>
                    ) : null}
                    {role === 3 && item.status_id !== 2? (
                      <button
                        onClick={() => handleReturn(item.task_id)}
                        className="btn bg-blue text-white hover:bg-blue"
                      >
                        Return
                      </button>
                    ) : null}

                    {role === 3 && item.status_id !== 4 && item.status_id !== 2?(
                      <button
                        onClick={() => handleApprove(item.task_id)}
                        className="btn btn-success text-white"
                      >
                        Approve
                      </button>
                    ) : null}
                    {role === 3 ? (
                      <button
                        onClick={() => handleCancel(item.task_id)}
                        className="btn btn-error text-white"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border border-gray-300 p-4">
                No borrowing data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowProductTable;
