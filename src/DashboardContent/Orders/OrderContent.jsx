import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const OrderContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchOrders();
  }, [page]); // Fetch orders when page changes

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/orders`, {
        params: {
          limit: 10, // กำหนดจำนวนรายการต่อหน้า
          page: page, // ส่งหมายเลขหน้า
        },
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages); // ตั้งค่า totalPages
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: "Failed to load orders.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
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
        const response = await axios.delete(`${apiUrl}/v1/orders/${orderId}`);
        if (response.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Order has been deleted.',
            icon: 'success'
          });
          setOrders(orders.filter((order) => order.id !== orderId));
        } else {
          throw new Error('Failed to delete order.');
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

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="table p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Link to="/dashboard/orders/add">
          <button className="btn bg-blue text-white hover:bg-blue">Add Order</button>
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className='sticky-top bg-gray-200'>
          <tr>
            <th className="border p-2 text-center">Order ID</th>
            <th className="border p-2 text-center">User</th>
            <th className="border p-2 text-center">Total Amount</th>
            <th className="border p-2 text-center">Order Date</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2 text-center">{order.id}</td>
                <td className="border p-2 text-center">{order.firstname} {order.lastname}</td>
                <td className="border p-2 text-center">{order.total_price}</td>
                <td className="border p-2 text-center">{new Date(order.created_at).toLocaleString()}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {/* <Link to={`/dashboard/orders/edit/${order.id}`}>
                      <button className="btn btn-success text-white">Edit</button>
                    </Link> */}
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="btn btn-error text-white"
                    >
                      Cancel
                    </button>
                    <Link to={`/dashboard/orders/details/${order.id}`}>
                    <button className="btn btn-success  text-white">View Details</button>
                  </Link>
                  </div>
                </td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border border-gray-300 p-4">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
  <p 
    onClick={handlePreviousPage} 
    className={`cursor-pointer ${page === 1 ? 'text-gray-400' : 'text-black'}`} 
    style={{ pointerEvents: page === 1 ? 'none' : 'auto' }}
  >
    Previous
  </p>
  <span>Page {page} of {totalPages}</span>
  <p 
    onClick={handleNextPage} 
    className={`cursor-pointer ${page === totalPages ? 'text-gray-400' : 'text-black'}`} 
    style={{ pointerEvents: page === totalPages ? 'none' : 'auto' }}
  >
    Next
  </p>
</div>

    </div>
  );
};

export default OrderContent;
