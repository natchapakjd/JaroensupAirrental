import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';
const OrderDetails = () => {
  const { orderId } = useParams(); // Get the orderId from URL params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v2/orders?orderId=${orderId}`);
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load order details.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>

      <Link to={`/dashboard/orders/edit/${orderId}`}>
        <button className="btn bg-blue text-white hover:bg-blue px-6 py-2 rounded-md">
          Edit Order
        </button>
      </Link>
      </div>
      {order ? (
        <div>
          <div className="mb-4">
            <h3 className="font-bold">Order ID: {order.order_id}</h3>
            <p>User: {order.firstname} {order.lastname}</p>
            <p>Order Date: {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <h4 className="font-semibold mb-2">Items:</h4>
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Product ID</th>
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.product_id}>
                  <td className="border border-gray-300 p-2">{item.product_id}</td>
                  <td className="border border-gray-300 p-2">{item.product_name}</td>
                  <td className="border border-gray-300 p-2">{item.quantity}</td>
                  <td className="border border-gray-300 p-2">{item.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
  
        </div>
      ) : (
        <div>No order details available.</div>
      )}
    </div>
  );
};

export default OrderDetails;
