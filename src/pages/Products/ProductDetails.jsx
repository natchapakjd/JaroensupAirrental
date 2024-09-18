import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const navigate = useNavigate(); // ใช้ useNavigate

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/product/${id}`);
      setProduct(response.data[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!product) return <p>Loading...</p>;

  const handleAddToCart = () => {
    navigate('/add-to-cart', { state: { product } }); 
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6">
            <div className="flex justify-center mb-6">
              {product.product_image && (
                <img
                  src={product.product_image}
                  alt={product.name}
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                Price: ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Brand ID: {product.brand_id}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Category ID: {product.category_id}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Stock Quantity: {product.stock_quantity}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAddToCart}
                className="mt-4 bg-blue text-white py-2 px-4 rounded hover:bg-blue transition duration-200"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetails;
