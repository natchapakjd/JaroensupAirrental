import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [image, setImage] = useState();

  useEffect(() => {
    fetchProductDetails();
    fetchProductImageById();
  }, [id]);

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

  if (!product) return <Loading/>;

  const handleAddToCart = () => {
    navigate('/add-to-cart', { state: { product } });
  };

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
                Price: {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Brand: {product.brand_name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Category: {product.category_name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Stock Quantity: {product.stock_quantity}
              </p>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleAddToCart}
                  className="bg-blue text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                  เพิ่มลงตะกร้า
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
