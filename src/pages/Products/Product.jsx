import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import Loading from "../../components/Loading";

const translations = {
  th: {
    ourProducts: "สินค้าของเรา",
    exploreProducts: "สำรวจสินค้าหลากหลายที่ออกแบบมาเพื่อตอบโจทย์ของคุณ",
    viewDetails: "ดูรายละเอียด",
    noImage: "ไม่มีรูปภาพ",
  },
  en: {
    ourProducts: "Our Products",
    exploreProducts:
      "Explore our wide range of products designed to meet your needs.",
    viewDetails: "View Details",
    noImage: "No Image",
  },
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  const filteredProducts = products.filter(
    (product) => product.product_type_id === 3
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {translations[language].ourProducts}
              </h1>
              <p className="text-lg text-gray-600">
                {translations[language].exploreProducts}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  {product.image_url ? (
                    <img
                      src={`${product.image_url}`}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      {translations[language].noImage}
                    </p>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {product.description ||
                        "A brief description of the product goes here."}
                    </p>
                    <div className="flex justify-end mt-4">
                      <Link
                        to={`/product/${product.product_id}`}
                        className="bg-blue text-white py-2 px-4 rounded hover:bg-blue"
                      >
                        {translations[language].viewDetails}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Product;
