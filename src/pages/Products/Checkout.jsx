import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'; 
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCartItems = location.state?.cartItems || [];
  const [cartItems, setCartItems] = useState(initialCartItems); // Manage cart items state
  const user = useAuth();
  const user_id = user ? user.user.id : null;

  const handleCheckout = async () => {
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    
    // Show confirmation dialog
    const { isConfirmed } = await Swal.fire({
      title: 'ยืนยันการชำระเงิน',
      text: `คุณต้องการชำระเงินเป็นจำนวนเงิน ${totalPrice} บาทหรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    });
    
    if (isConfirmed) {
      console.log("Proceeding to checkout with items:", cartItems);
      console.log(user_id);
  
      const orderDetails = {
        user_id,
        items: cartItems.map(item => ({
          name: item.name,
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          total_price: (item.price * item.quantity).toFixed(2)
        })),
        total_price: totalPrice
      };
  
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/v2/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderDetails),
        });
  
        if (!response.ok) throw new Error('Network response was not ok');
  
        const result = await response.json();
        console.log("Order submitted successfully:", result);
  
        console.log(cartItems)
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'ออเดอร์ของคุณได้ถูกบันทึกแล้ว',
          icon: 'success',
          timer: 500,
          showConfirmButton: false
        }).then(() => {
          navigate('/history'); 
        });
  
      } catch (error) {
        console.error("Error submitting order:", error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถส่งคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
        });
      }
    }
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.product_id !== productId));
  };

  const handleContinueShopping = () => {
    navigate('/product'); 
  };


  const itemCounts = cartItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity; 
    return acc;
  }, {});

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">ตรวจสอบรายการสินค้า</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
              {Object.entries(itemCounts).map(([name, quantity]) => {
                const item = cartItems.find(i => i.name === name);
                return (
                  <div key={name} className="flex justify-between mb-4 border-b pb-2">
                    <div>
                      <h2 className="text-lg font-semibold">{name}</h2>
                      <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                      <p className="text-gray-500">Stock: {item.stock_quantity}</p>
                    </div>
                    <div className="self-center flex items-center">
                      <span className="text-lg font-bold text-gray-900">Quantity: {quantity}</span>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="ml-4 text-red-600 hover:text-red-800 transition duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between mt-4 font-bold">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCheckout}
                className="bg-blue text-white py-2 px-4 rounded hover:bg-blue transition duration-200"
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleContinueShopping}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
              >
                เลือกสินค้าต่อ
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;
