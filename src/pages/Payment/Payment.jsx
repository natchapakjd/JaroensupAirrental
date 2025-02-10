import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';  // Import SweetAlert2
import QRCode from "../../assets/images/IMG_0896.png";

const Payment = () => {
  // Extract paymentId from the URL
  const { paymentId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order
  const [newSlipImage, setNewSlipImage] = useState(null); // Store new slip image

  useEffect(() => {
    // Fetch orders created by the admin
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/payment-task/${paymentId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [paymentId]); // Depend on paymentId to fetch the relevant data

  // Handle image upload (when the user selects a new file)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSlipImage(file);
    }
  };

  // Handle form submission to update the payment slip image
  const handleSubmit = async (orderId) => {
    if (!newSlipImage) {
      // Use Swal instead of alert
      Swal.fire({
        title: 'Error!',
        text: 'Please select a slip image to upload.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    formData.append('slip_image', newSlipImage);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/payments/${paymentId}/slip_image`, // Correct endpoint with paymentId
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Success notification with SweetAlert
      Swal.fire({
        title: 'Success!',
        text: 'Slip image updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setSelectedOrder(null); // Deselect order after submission
      setNewSlipImage(null); // Clear file input
    } catch (error) {
      console.error('Error updating slip image:', error);

      // Error notification with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update slip image.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Admin Payment Management</h2>

        <div className="mb-8 text-center">
          <h3 className="text-xl font-semibold mb-4">QR Code for Payment</h3>
          <div className="flex justify-center">
            <img 
              src={QRCode}
              alt="Payment QR Code" 
              className="w-60 h-60"
            />
          </div>
        </div>
        {/* Display orders fetched from the server */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Orders</h3>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Slip Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.payment_id}>
                    <td>{order.payment_id}</td>
                    <td>{order.amount}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      {order.image_url ? (
                        <img
                          src={order.image_url}
                          alt="Slip"
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <span>No slip uploaded</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(order.payment_id)}
                        className="btn bg-blue hover:bg-blue text-white"
                      >
                        Upload/Change Slip
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="mt-5">
            <h3 className="text-xl font-semibold mb-2">Upload/Change Payment Slip</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(selectedOrder); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="slip_image">
                  Select Payment Slip Image
                </label>
                <input
                  type="file"
                  id="slip_image"
                  name="slip_image"
                  onChange={handleImageUpload}
                  className=" file-input file-input-bordered w-full h-10"                />
              </div>

              <button type="submit" className="btn bg-blue hover:bg-blue text-white">
                Upload Slip
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Payment;
