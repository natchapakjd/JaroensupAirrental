import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  th: {
    addToCart: "เพิ่มลงตะกร้า",
    confirmAdd: "คุณต้องการเพิ่ม {productName} ลงในตะกร้าหรือไม่?",
    price: "ราคา:",
    total: "รวม:",
    quantity: "จำนวน:",
    confirmButton: "ยืนยันการเพิ่ม",
    errorNoProduct: "ไม่พบข้อมูลสินค้า",
    warningQuantity: "กรุณาเลือกจำนวนสินค้าที่ต้องการเพิ่ม",
    warningStock: "คุณสามารถเพิ่มสินค้าได้สูงสุด {remainingStock} ชิ้น (ในตะกร้ามีแล้ว {cartQuantity} ชิ้น)",
    confirmTitle: "ยืนยันการเพิ่มสินค้า",
    confirmText: "คุณต้องการเพิ่ม {productName} จำนวน {quantity} ชิ้น ลงในตะกร้าหรือไม่?",
    confirmYes: "ใช่, เพิ่ม!",
    confirmCancel: "ยกเลิก",
  },
  en: {
    addToCart: "Add to Cart",
    confirmAdd: "Do you want to add {productName} to your cart?",
    price: "Price:",
    total: "Total:",
    quantity: "Quantity:",
    confirmButton: "Confirm Add",
    errorNoProduct: "No product found",
    warningQuantity: "Please select the quantity you want to add",
    warningStock: "You can add up to {remainingStock} items (already {cartQuantity} in cart)",
    confirmTitle: "Confirm Add to Cart",
    confirmText: "Do you want to add {productName} with quantity {quantity} to your cart?",
    confirmYes: "Yes, add!",
    confirmCancel: "Cancel",
  },
};

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);
  const stockQuantity = product?.stock_quantity || 0;
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

  const existingItem = cartItems.find((item) => item.product_id === product?.product_id);
  const cartQuantity = existingItem ? existingItem.quantity : 0;
  const remainingStock = stockQuantity - cartQuantity;

  const handleConfirm = () => {
    if (!product) {
      Swal.fire(t("errorNoProduct"), "", "error");
      return;
    }

    if (quantity <= 0) {
      Swal.fire(t("warningQuantity"), "", "warning");
      return;
    }

    if (quantity > remainingStock) {
      Swal.fire(
        t("warningStock", { remainingStock, cartQuantity }),
        "",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: t("confirmTitle"),
      text: t("confirmText", { productName: product.name, quantity }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirmYes"),
      cancelButtonText: t("confirmCancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        addToCart(product, quantity);
        setQuantity(1);
        navigate("/checkout");
      }
    });
  };

  if (!product) return <p>{t("errorNoProduct")}</p>;

  const totalPrice = (product.price * quantity).toFixed(2);

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= remainingStock) {
      setQuantity(value);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6 text-center">
            <div className="flex w-full my-2 justify-center">
              <BackButtonEdit />
              <h1 className="text-4xl font-bold text-gray-800 mx-1">
                {t("addToCart")}
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              {t("confirmAdd", { productName: product.name })}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              {t("price")} {product.price.toFixed(2)}
            </p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              {t("total")} {totalPrice}
            </p>
            <div className="mt-4">
              <label className="text-lg text-gray-600" htmlFor="quantity">
                {t("quantity")}
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={remainingStock}
                onChange={handleQuantityChange}
                className="border rounded p-2 w-20 text-center"
              />
              <p className="text-red-500 mt-2">
                {quantity > remainingStock &&
                  t("warningStock", { remainingStock, cartQuantity })}
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleConfirm}
                className={`bg-blue text-white py-2 px-4 rounded hover:bg-blue transition duration-200 ${
                  quantity > remainingStock ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={quantity > remainingStock}
              >
                {t("confirmButton")}
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AddToCart;