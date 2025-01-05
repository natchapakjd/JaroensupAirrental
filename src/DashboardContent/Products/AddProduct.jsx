import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    brand_id: "",
    category_id: "",
    warehouse_id: "",
    product_type_id: "",  // Add this line
    product_image: null,
    model_file: null,  // Add state for .gltf file
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);  // Add state for product types

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchWarehouses();
    fetchProductTypes();  // Fetch product types on component mount
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch brands.",
        icon: "error",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch categories.",
        icon: "error",
      });
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/warehouses`);
      setWarehouses(response.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch warehouses.",
        icon: "error",
      });
    }
  };

  const fetchProductTypes = async () => {  // Function to fetch product types
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product-type`);
      setProductTypes(response.data);
    } catch (error) {
      console.error("Error fetching product types:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch product types.",
        icon: "error",
      });
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
      product_type_id: "",  // Reset product type on clear
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
        `${import.meta.env.VITE_SERVER_URL}/products`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Product added successfully",
          icon: "success",
        });
        clearFormData();
        setTimeout(() => {
          navigate('/dashboard/products'); 
        }, 800);
      } else {
        throw new Error("Failed to add product.");
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "Error",
        text: error.response.data.error,
        icon: "error",
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="text-sm font-medium">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="stock_quantity" className="block text-gray-700 font-medium mb-2">Stock Quantity:</label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="brand_id" className="block text-gray-700 font-medium mb-2">Brand:</label>
          <select
            id="brand_id"
            name="brand_id"
            value={formData.brand_id}
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
        </div>
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2">Category:</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
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
        </div>
        <div className="mb-4">
          <label htmlFor="warehouse_id" className="block text-gray-700 font-medium mb-2">Warehouse:</label>
          <select
            id="warehouse_id"
            name="warehouse_id"
            value={formData.warehouse_id}
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
        </div>
        <div className="mb-4">
          <label htmlFor="product_type_id" className="block text-gray-700 font-medium mb-2">Product Type:</label>
          <select
            id="product_type_id"
            name="product_type_id"
            value={formData.product_type_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Product Type</option>
            {productTypes.map((productType) => (
              <option key={productType.product_type_id} value={productType.product_type_id}>
                {productType.product_type_name}  {/* Assuming type_name is the field for product type name */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="product_image" className="block text-gray-700 font-medium mb-2">Product Image:</label>
          <input
            type="file"
            id="product_image"
            name="product_image"
            onChange={handleChange}
            className=" file-input file-input-bordered w-full h-10"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
