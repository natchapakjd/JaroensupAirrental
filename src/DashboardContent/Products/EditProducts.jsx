import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate(); 
  const { productId } = useParams(); 

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    brand_id: "",
    category_id: "",
    warehouse_id: "",
    product_type_id: "", // Add this line
    product_image: null,
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]); // Add this line

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product/${productId}`);
        setFormData({
          ...response.data[0],
          product_image: null 
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/brands`);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/warehouses`);
        setWarehouses(response.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    const fetchProductTypes = async () => { // Add this function
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product-type`);
        setProductTypes(response.data);
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchProduct();
    fetchBrands();
    fetchCategories();
    fetchWarehouses();
    fetchProductTypes(); // Add this line to fetch product types
  }, [productId]);

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
      product_type_id: "", // Add this line
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
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/product/${productId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Product updated successfully",
          icon: "success",
        });
        clearFormData();
        setTimeout(() => {
          navigate('/dashboard/products'); 
        }, 800);
      } else {
        throw new Error("Failed to update product.");
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
    <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto h-full">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => {
          // Skip rendering if key is 'image_url'
          if (key === "image_url") {
            return null; // Do not render an input for image_url
          }

          return (
            <div className="mb-4" key={key}>
              <label
                htmlFor={key}
                className="block text-gray-700 font-medium mb-2 capitalize"
              >
                {key.replace("_", " ")}:
              </label>
              {key === "product_id" ? (
                <textarea
                  id={key}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  disabled
                /> ) :
              key === "description" ? (
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
                  className="w-full p-2 rounded-lg"
                />
              ) : key === "brand_id" ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              ) : key === "category_id" ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : key === "warehouse_id" ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                      {warehouse.location}
                    </option>
                  ))}
                </select>
              ) : key === "product_type_id" ? ( // Add dropdown for product_type
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Product Type</option>
                  {productTypes.map((productType) => (
                    <option key={productType.product_type_id} value={productType.product_type_id}>
                      {productType.product_type_name}
                    </option>
                  ))}
                </select>
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
          );
        })}
        <button
          type="submit"
          className="text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
