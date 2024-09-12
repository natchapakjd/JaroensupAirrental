import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductImage from "../ImagesComponent/ProductImage";
import Swal from "sweetalert2";

const ProductContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    brand_id: "",
    category_id: "",
    warehouse_id: "",
    product_image: null,
  });

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const clearFormData = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      brand_id: "",
      category_id: "",
      warehouse_id: "",
      product_image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/products",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "เพิ่มสินค้าสำเร็จ",
          icon: "success",
        });
        clearFormData();
        fetchProducts();
      } else {
        throw new Error("Failed to add product.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div className="mb-4" key={key}>
            <label
              htmlFor={key}
              className="block text-gray-700 font-medium mb-2 capitalize"
            >
              {key.replace("_", " ")}:
            </label>
            {key === "description" ? (
              <textarea
                id={key}
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            ) : key === "product_image" ? (
              <input
                type="file"
                id={key}
                name={key}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <input
                type={key === "price" ? "number" : "text"}
                id={key}
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
                step={key === "price" ? "0.01" : undefined}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="btn btn-success w-full bg-blue-500 text-black p-2 rounded-lg hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>

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
          </tr>
        </thead>
        <tbody>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductContent;
