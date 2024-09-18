import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || []; 

  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = token ? jwtDecode(token) : null;
  const user_id = decodedToken ? decodedToken.id : null;

  const handleCheckout = async () => {
    console.log("Proceeding to checkout with items:", cartItems);
    console.log(user_id)
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, items: cartItems }), 
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log("Order submitted successfully:", result);
      navigate('/history'); 
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const handleContinueShopping = () => {
    navigate('/product'); 
  };

  if (cartItems.length === 0) return <p>ไม่มีสินค้าที่จะชำระเงิน</p>;

  const itemCounts = cartItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity; 
    return acc;
  }, {});

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
                    <div className="self-center">
                      <span className="text-lg font-bold text-gray-900">Quantity: {quantity}</span>
                    </div>
                  </div>
                );
              })}
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
