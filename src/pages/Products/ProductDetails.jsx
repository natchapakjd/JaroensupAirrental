import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  en: {
    price: "Price",
    brand: "Brand",
    category: "Category",
    stockQuantity: "Stock Quantity",
    addToCart: "Add to Cart",
  },
  th: {
    price: "ราคา",
    brand: "ยี่ห้อ",
    category: "หมวดหมู่",
    stockQuantity: "จำนวนสินค้าในสต็อก",
    addToCart: "เพิ่มลงตะกร้า",
  },
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
    fetchProductImageById();

    // Watch for language changes in localStorage
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [id, language]);

  const fetchProductImageById = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product-image/${id}`);
      setImage(response.data.product_image);
    } catch (error) {
      console.error("Error fetching product image:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product/${id}`);
      setProduct(response.data[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!product) return <Loading />;

  const handleAddToCart = () => {
    navigate('/add-to-cart', { state: { product } });
  };

  const t = translations[language]; // Shortcut for current translations

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6 flex flex-wrap">
            <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center mb-6">
              {product.image_url && (
                <img
                  src={`${product.image_url}`}
                  alt={product.name}
                  className="w-full max-w-md h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
            <div className="flex-grow w-full md:w-1/2 text-left mb-12 md:pl-6">
              <div className="flex w-full my-2">
                <BackButtonEdit />
                <h1 className="text-4xl font-bold text-gray-800 mx-1">
                  {product.name}
                </h1>
              </div>

              <p className="text-lg text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                {t.price}: {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t.brand}: {product.brand_name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t.category}: {product.category_name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t.stockQuantity}: {product.stock_quantity}
              </p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue text-white py-2 px-4 rounded hover:bg-blue transition duration-200"
                >
                  {t.addToCart}
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;