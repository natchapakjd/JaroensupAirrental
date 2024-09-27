import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const PaymentContent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleDelete = async (paymentId, type) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/payment/${paymentId}`);
        if (response.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: `${type === 'task' ? 'Task' : 'Order'} payment has been deleted.`,
            icon: 'success'
          });
          setPayments(payments.filter((payment) => payment.payment_id !== paymentId));
        } else {
          throw new Error('Failed to delete payment.');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Filter payments based on task_id and order_id
  const taskPayments = payments.filter(payment => payment.task_id);
  const orderPayments = payments.filter(payment => payment.order_id);

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      {/* Task Payments Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Task Payments</h2>
          <Link to="/dashboard/payments/add">
            <button className="btn bg-blue text-white hover:bg-blue">Create Payment</button>
          </Link>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Payment ID</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Task ID</th>
              <th className="border border-gray-300 p-2">Payment Method</th>
              <th className="border border-gray-300 p-2">Payment Date</th>
              <th className="border border-gray-300 p-2">Slip Images</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {taskPayments.length > 0 ? (
              taskPayments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td className="border border-gray-300 p-2">{payment.payment_id}</td>
                  <td className="border border-gray-300 p-2">{payment.amount}</td>
                  <td className="border border-gray-300 p-2">{payment.user_id}</td>
                  <td className="border border-gray-300 p-2">{payment.task_id}</td>
                  <td className="border border-gray-300 p-2">{payment.method_id}</td>
                  <td className="border border-gray-300 p-2">{new Date(payment.payment_date).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">
                    {payment.slip_images ? (
                      <img src={`${apiUrl}${payment.slip_images}`} alt="Slip" className="w-16 h-16 object-cover" />
                    ) : (
                      <p>No Image</p>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">{payment.status_id}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center gap-2">
                      <Link to={`/dashboard/payments/edit/${payment.payment_id}`}>
                        <button className="btn btn-success text-white">Edit</button>
                      </Link>
                      <button onClick={() => handleDelete(payment.payment_id, 'task')} className="btn btn-error text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border border-gray-300 p-4">No task payments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Payments</h2>
        
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Payment ID</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Payment Method</th>
              <th className="border border-gray-300 p-2">Payment Date</th>
              <th className="border border-gray-300 p-2">Slip Images</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orderPayments.length > 0 ? (
              orderPayments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td className="border border-gray-300 p-2">{payment.payment_id}</td>
                  <td className="border border-gray-300 p-2">{payment.amount}</td>
                  <td className="border border-gray-300 p-2">{payment.user_id}</td>
                  <td className="border border-gray-300 p-2">{payment.order_id}</td>
                  <td className="border border-gray-300 p-2">{payment.method_id}</td>
                  <td className="border border-gray-300 p-2">{new Date(payment.payment_date).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">
                    {payment.slip_images ? (
                      <img src={`${apiUrl}${payment.slip_images}`} alt="Slip" className="w-16 h-16 object-cover" />
                    ) : (
                      <p>No Image</p>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">{payment.status_id}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center gap-2">
                      <Link to={`/dashboard/payments/edit/${payment.payment_id}`}>
                        <button className="btn btn-success text-white">Edit</button>
                      </Link>
                      <button onClick={() => handleDelete(payment.payment_id, 'order')} className="btn btn-error text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border border-gray-300 p-4">No order payments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentContent
