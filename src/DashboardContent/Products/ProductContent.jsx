import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductImage from "../../ImagesComponent/ProductImage";

const ProductContent = () => {
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
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mt-8 mb-4">Product List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Stock Quantity</th>
            <th className="border border-gray-300 p-2">Brand ID</th>
            <th className="border border-gray-300 p-2">Category ID</th>
            <th className="border border-gray-300 p-2">Warehouse ID</th>
            <th className="border border-gray-300 p-2">Product Image</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center ">
          {products.map((product) => (
            <tr key={product.product_id}>
              <td className="border border-gray-300 p-2">
                {product.product_id}
              </td>
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2">
                {product.description}
              </td>
              <td className="border border-gray-300 p-2">{product.price}</td>
              <td className="border border-gray-300 p-2">
                {product.stock_quantity}
              </td>
              <td className="border border-gray-300 p-2">{product.brand_id}</td>
              <td className="border border-gray-300 p-2">
                {product.category_id}
              </td>
              <td className="border border-gray-300 p-2">
                {product.warehouse_id}
              </td>
              <td className="border border-gray-300 p-2">
                {product.product_image ? (
                  <ProductImage productId={product.product_id} />
                ) : (
                  <p>No image</p>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex justify-between gap-5 p-3">
                  <button className="btn bg-blue text-white hover:bg-blue">
                    Add
                  </button>
                  <button className="btn btn-success text-white">Delete</button>
                  <button className="btn btn-error text-white">Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductContent;
