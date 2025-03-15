import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../../context/CartContext";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  th: {
    checkoutTitle: "ตรวจสอบรายการสินค้า",
    addressWarning:
      "⚠️ โปรดตรวจสอบและกรอกที่อยู่ให้ถูกต้อง เนื่องจากบริการจัดส่งของเราจะดำเนินการตามข้อมูลที่อยู่ในโปรไฟล์ของคุณ",
    paymentMethod: "วิธีการชำระเงิน",
    selectPaymentMethod: "เลือกวิธีการชำระเงิน",
    total: "รวม:",
    continueShopping: "ช้อปต่อ",
    checkout: "ชำระเงิน",
    confirmPayment: "ยืนยันการชำระเงิน",
    confirmPaymentText: "คุณต้องการชำระเงินเป็นจำนวนเงิน {totalPrice} บาทหรือไม่?",
    confirmYes: "ใช่",
    confirmCancel: "ยกเลิก",
    successTitle: "สำเร็จ!",
    successText: "การชำระเงินของคุณได้รับการบันทึกแล้ว",
    errorTitle: "เกิดข้อผิดพลาด!",
    errorText: "ไม่สามารถดำเนินการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
    outOfStockTitle: "สินค้าเกินจำนวนที่มีในสต็อก!",
    outOfStockText: "สินค้าต่อไปนี้มีจำนวนไม่พอ:\n{message}",
    profileIncomplete: "กรุณากรอกชื่อและนามสกุลในโปรไฟล์ก่อนดำเนินการ",
    goToProfile: "ไปที่การตั้งค่าโปรไฟล์",
  },
  en: {
    checkoutTitle: "Checkout",
    addressWarning:
      "⚠️ Please verify and fill in your address correctly as our delivery service will proceed based on the information in your profile.",
    paymentMethod: "Payment Method",
    selectPaymentMethod: "Select Payment Method",
    total: "Total:",
    continueShopping: "Continue Shopping",
    checkout: "Checkout",
    confirmPayment: "Confirm Payment",
    confirmPaymentText: "Do you want to proceed with the payment of {totalPrice} THB?",
    confirmYes: "Yes",
    confirmCancel: "Cancel",
    successTitle: "Success!",
    successText: "Your payment has been recorded.",
    errorTitle: "Error!",
    errorText: "Unable to process the payment. Please try again.",
    outOfStockTitle: "Out of Stock!",
    outOfStockText: "The following items are out of stock:\n{message}",
    profileIncomplete: "Please fill in your first name and last name in your profile before proceeding",
    goToProfile: "Go to Profile Settings",
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [profile, setProfile] = useState();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "th";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [language]);

  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    return translation;
  };

  useEffect(() => {
    fetchProfile();
    fetchPaymentMethods();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);
      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (err) {
      console.log(err);
      setProfile(null); // Set to null on error
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/payment-methods`);
      if (response.status === 200) {
        setPaymentMethods(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = async () => {
    // Check if profile is loaded and firstname/lastname are present
    if (!profile || !profile.firstname || !profile.lastname || !profile.address) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: t("profileIncomplete"),
        icon: "warning",
        confirmButtonText: t("goToProfile"),
      }).then(() => {
        navigate("/profile-setting");
      });
      return;
    }

    const outOfStockItems = cartItems.filter((item) => item.quantity > item.stock_quantity);

    if (outOfStockItems.length > 0) {
      const message = outOfStockItems
        .map((item) => `${item.name}: Only ${item.stock_quantity} available`)
        .join("\n");
      Swal.fire({
        title: t("outOfStockTitle"),
        text: t("outOfStockText", { message }),
        icon: "warning",
      });
      return;
    }

    const totalPrice = cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);

    const { isConfirmed } = await Swal.fire({
      title: t("confirmPayment"),
      text: t("confirmPaymentText", { totalPrice }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("confirmYes"),
      cancelButtonText: t("confirmCancel"),
    });

    if (!isConfirmed) return;

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
      const orderResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/v2/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      if (!orderResponse.ok) throw new Error("Failed to create order");

      const orderResult = await orderResponse.json();

      const paymentDetails = {
        amount: totalPrice,
        user_id: userId,
        order_id: "null",
        method_id: selectedPaymentMethod,
        payment_date: new Date().toISOString(),
        status_id: 1,
        task_id: orderResult.taskId || null,
      };

      const paymentResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });

      if (!paymentResponse.ok) throw new Error("Failed to create payment");

      Swal.fire({
        title: t("successTitle"),
        text: t("successText"),
        icon: "success",
        timer: 500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/history");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: t("errorTitle"),
        text: t("errorText"),
        icon: "error",
      });
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleContinueShopping = () => {
    navigate("/product");
  };

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6">
            <div className="flex w-full my-2 justify-center">
              <BackButtonEdit />
              <h1 className="text-4xl font-bold text-gray-800 mx-1 text-center">
                {t("checkoutTitle")}
              </h1>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex justify-between mb-4 border-b pb-2">
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                    <p className="text-gray-500">Stock: {item.stock_quantity}</p>
                  </div>
                  <div className="self-center flex items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Quantity: {item.quantity}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="ml-4 text-red-600 hover:text-red-800 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md mb-4">
                {t("addressWarning")}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("paymentMethod")}
                </label>
                <select
                  id="paymentMethod"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={selectedPaymentMethod || ""}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  <option value="">{t("selectPaymentMethod")}</option>
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
                    {t("total")} {totalPrice}
                  </h3>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleContinueShopping}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    {t("continueShopping")}
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue transition duration-200"
                    disabled={!selectedPaymentMethod || cartItems.length === 0}
                  >
                    {t("checkout")}
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