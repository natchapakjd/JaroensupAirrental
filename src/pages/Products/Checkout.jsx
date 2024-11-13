import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const initialCartItems = location.state?.cartItems || [];
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [profile, setProfile] = useState();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    fetchProfile();
    fetchPaymentMethods(); // Fetch payment methods when the component mounts
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
      );
      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/payment-methods`
      );
      if (response.status === 200) {
        setPaymentMethods(response.data); // Set payment methods in the state
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!profile) return;
    const messageResponse = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/send-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "U9cb564155dddeaa549d97a8747eed534",
          message: `แจ้งเตือนจากระบบ:คุณ ${profile.firstname} ${profile.lastname}!\n\nได้สั่งซื้อสินค้าของคุณ\n\nกรุณาตรวจสอบและดำเนินการตามความเหมาะสม.\n\nขอบคุณที่เลือกใช้บริการของเรา!\n\nขอให้คุณมีวันที่ดี!`,
        }),
      }
    );

    if (!messageResponse.ok) throw new Error("Failed to send message");
  };

  const formatDateTimeForInput = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours());

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleCheckout = async () => {
    const totalPrice = cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);

    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการชำระเงิน",
      text: `คุณต้องการชำระเงินเป็นจำนวนเงิน ${totalPrice} บาทหรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    });

    if (isConfirmed) {
      const orderDetails = {
        user_id: userId,
        items: cartItems.map((item) => ({
          name: item.name,
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          total_price: (item.price * item.quantity).toFixed(2),
        })),
        total_price: totalPrice,
      };

      try {
        const orderResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/v2/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderDetails),
          }
        );

        if (!orderResponse.ok) throw new Error("Failed to create order");

        const orderResult = await orderResponse.json();

        const paymentDetails = {
          amount: totalPrice,
          user_id: userId,
          order_id: 'null',
          method_id: selectedPaymentMethod, // Use selected payment method
          payment_date: formatDateTimeForInput(new Date()),
          status_id: 1, 
          task_id: orderResult.taskId || null,
        };

        const paymentResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/payments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentDetails),
          }
        );

        if (!paymentResponse.ok) throw new Error("Failed to create payment");

        Swal.fire({
          title: "สำเร็จ!",
          text: "การชำระเงินของคุณได้รับการบันทึกแล้ว",
          icon: "success",
          timer: 500,
          showConfirmButton: false,
        }).then(() => {
          sendMessage();
          navigate("/history");
        });
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถดำเนินการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
        });
      }
    }
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter((item) => item.product_id !== productId));
  };

  const handleContinueShopping = () => {
    navigate("/product");
  };

  const itemCounts = cartItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {});

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
              ตรวจสอบรายการสินค้า
            </h1>
            <div className="bg-white shadow-md rounded-lg p-6">
              {Object.entries(itemCounts).map(([name, quantity]) => {
                const item = cartItems.find((i) => i.name === name);
                return (
                  <div
                    key={name}
                    className="flex justify-between mb-4 border-b pb-2"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{name}</h2>
                      <p className="text-gray-600">
                        Price: ${item.price.toFixed(2)}
                      </p>
                      <p className="text-gray-500">
                        Stock: {item.stock_quantity}
                      </p>
                    </div>
                    <div className="self-center flex items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Quantity: {quantity}
                      </span>
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

              {/* Payment Method Selection */}
              <div className="mb-4">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  วิธีการชำระเงิน
                </label>
                <select
                  id="paymentMethod"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  <option value="">เลือกวิธีการชำระเงิน</option>
                  {paymentMethods.map((method) => (
                    <option key={method.method_id} value={method.method_id}>
                      {method.method_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total: {totalPrice}
                  </h3>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleContinueShopping}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue transition duration-200"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Checkout;
