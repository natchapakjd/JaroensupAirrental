import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ProductImage from "../ImagesComponent/ProductImage";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <main className="flex-grow">
          <section className="container mx-auto p-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Our Products
              </h1>
              <p className="text-lg text-gray-600">
                Explore our wide range of products designed to meet your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  {product.product_image ? (
                    <ProductImage
                      productId={product.product_id}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <p>No image</p>
                  )}
                  {/* <img 
                    src={product.imageUrl || "https://via.placeholder.com/300"} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  /> */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {product.description ||
                        "A brief description of the product goes here. It should give the user an idea of what the product is about."}
                    </p>
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
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
