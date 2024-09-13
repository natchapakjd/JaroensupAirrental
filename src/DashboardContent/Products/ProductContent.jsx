import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductImage from "../../ImagesComponent/ProductImage";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const ProductContent = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    console.log(products)
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/product/${productId}`);
      if (response.status === 200) {
        Swal.fire({
          title: "Product deleted successfully",
          icon: "success",
        });
        setProducts(products.filter(product => product.product_id !== productId));
      } else {
        throw new Error("Failed to delete product.");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto  font-inter">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mt-8">Product List</h2>
        <Link to="/dashboard/products/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            Add Product
          </button>
        </Link>
      </div>
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
        <tbody className="text-center">
          {products.map((product) => (
            <tr key={product.product_id}>
              <td className="border border-gray-300 p-2">{product.product_id}</td>
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2">{product.description}</td>
              <td className="border border-gray-300 p-2">{product.price}</td>
              <td className="border border-gray-300 p-2">{product.stock_quantity}</td>
              <td className="border border-gray-300 p-2">{product.brand_id}</td>
              <td className="border border-gray-300 p-2">{product.category_id}</td>
              <td className="border border-gray-300 p-2">{product.warehouse_id}</td>
              <td className="border border-gray-300 p-2">
                {product.product_image ? (
                  <ProductImage productId={product.product_id} />
                ) : (
                  <p>No image</p>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex justify-center gap-2">
                  <Link to={`/dashboard/products/edit/${product.product_id}`}>
                    <button className="btn btn-success text-white">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="btn btn-error text-white"
                  >
                    Delete
                  </button>
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
