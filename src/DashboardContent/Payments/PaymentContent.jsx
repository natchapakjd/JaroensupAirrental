import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

const PaymentContent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [statusFilter, setStatusFilter] = useState(""); // For dropdown filter
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/payments`);
      setPayments(response.data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: "Failed to load payments.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/payments/${paymentId}/status`,
        {
          status_id: 2, // Approve status
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Approved!",
          text: "Payment status has been updated to Approved.",
          icon: "success",
        });

        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.payment_id === paymentId
              ? { ...payment, status_id: 2 }
              : payment
          )
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update payment status.",
        icon: "error",
      });
    }
  };

  const handleDelete = async (paymentId, type) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/payment/${paymentId}`);
        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: `${
              type === "task" ? "Task" : "Order"
            } payment has been deleted.`,
            icon: "success",
          });
          setPayments(
            payments.filter((payment) => payment.payment_id !== paymentId)
          );
        } else {
          throw new Error("Failed to delete payment.");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.task_desc?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || payment.status_id === Number(statusFilter);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold ">Payment List</h2>
            <div className="flex justify-end mb-4">
        <Link to="/dashboard/payments/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            Create Payment
          </button>
        </Link>
      </div>
</div>
     

      <div className="mb-4 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by user or task..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
        <select
          className="select select-bordered w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="1">Pending</option>
          <option value="2">Approved</option>
          <option value="3">Rejected</option>
        </select>
      </div>

      {/* Task Payments Table */}
      <table className="table w-full border-collapse border border-gray-300">
        <thead className="sticky-top bg-gray-200">
          <tr>
            <th className="border p-2 text-center">Payment ID</th>
            <th className="border p-2 text-center">User</th>
            <th className="border p-2 text-center">Task</th>
            <th className="border p-2 text-center">Amount</th>
            <th className="border p-2 text-center">Payment Method</th>
            <th className="border p-2 text-center">Payment DateTime</th>
            <th className="border p-2 text-center">Slip Images</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <tr key={payment.payment_id}>
                <td className="border p-2 text-center">{payment.payment_id}</td>
                <td className="border p-2 text-center">
                  {payment.firstname} {payment.lastname}
                </td>
                <td className="border p-2 text-center">{payment.task_desc}</td>
                <td className="border p-2 text-center">{payment.amount}</td>
                <td className="border p-2 text-center">
                  {payment.method_name}
                </td>
                <td className="border p-2 text-center">
                  {new Date(payment.created_at).toLocaleString()}
                </td>
                <td className="border p-2 text-center">
                  {payment.image_url ? (
                    <img
                      src={`${payment.image_url}`}
                      alt="Slip"
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
                <td className="border p-2 text-center">
                  {payment.status_name}
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(payment.payment_id)}
                      className="btn bg-blue hover:bg-blue text-white"
                    >
                      Approve
                    </button>
                    <Link to={`/dashboard/payments/edit/${payment.payment_id}`}>
                      <button className="btn btn-success text-white">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(payment.payment_id, "task")}
                      className="btn btn-error text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="border border-gray-300 p-4">
                No task payments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentContent;
