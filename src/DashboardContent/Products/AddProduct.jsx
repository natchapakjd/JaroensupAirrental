import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate(); 

  // Translation object for localization
  const translation = {
    en: {
      title: "Add New Product",
      name: "Name:",
      description: "Description:",
      price: "Price:",
      stock_quantity: "Stock Quantity:",
      brand: "Brand:",
      category: "Category:",
      warehouse: "Warehouse:",
      product_type: "Product Type:",
      product_image: "Product Image:",
      submit: "Submit",
      selectBrand: "Select Brand",
      selectCategory: "Select Category",
      selectWarehouse: "Select Warehouse",
      selectProductType: "Select Product Type",
      errorFetching: "Failed to fetch data.",
      productAdded: "Product added successfully",
      error: "Error",
    },
    th: {
      title: "เพิ่มสินค้าผลิตภัณฑ์ใหม่",
      name: "ชื่อ:",
      description: "คำอธิบาย:",
      price: "ราคา:",
      stock_quantity: "จำนวนในสต็อก:",
      brand: "แบรนด์:",
      category: "หมวดหมู่:",
      warehouse: "คลังสินค้า:",
      product_type: "ประเภทสินค้า:",
      product_image: "รูปภาพสินค้า:",
      submit: "ส่งข้อมูล",
      selectBrand: "เลือกแบรนด์",
      selectCategory: "เลือกหมวดหมู่",
      selectWarehouse: "เลือกคลังสินค้า",
      selectProductType: "เลือกประเภทสินค้า",
      errorFetching: "ไม่สามารถดึงข้อมูลได้",
      productAdded: "เพิ่มสินค้าสำเร็จ",
      error: "ข้อผิดพลาด",
    }
  };

  // Set the default language to English (can be switched dynamically based on user's preference)
  const [language, setLanguage] = useState(localStorage.getItem('language')||'th');

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    brand_id: "",
    category_id: "",
    warehouse_id: "",
    product_type_id: "",  
    product_image: null,
    model_file: null,
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchWarehouses();
    fetchProductTypes();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({
        title: translation[language].error,
        text: translation[language].errorFetching,
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
        title: translation[language].error,
        text: translation[language].errorFetching,
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
        title: translation[language].error,
        text: translation[language].errorFetching,
        icon: "error",
      });
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product-type`);
      setProductTypes(response.data);
    } catch (error) {
      console.error("Error fetching product types:", error);
      Swal.fire({
        title: translation[language].error,
        text: translation[language].errorFetching,
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
      product_type_id: "",  
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
          title: translation[language].productAdded,
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
        title: translation[language].error,
        text: error.response?.data?.error || "An unknown error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
      <h1 className="text-2xl font-semibold mb-6">{translation[language].title}</h1>
      <form onSubmit={handleSubmit} className="text-sm font-medium">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">{translation[language].name}</label>
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
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">{translation[language].description}</label>
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
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">{translation[language].price}</label>
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
          <label htmlFor="stock_quantity" className="block text-gray-700 font-medium mb-2">{translation[language].stock_quantity}</label>
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
          <label htmlFor="brand_id" className="block text-gray-700 font-medium mb-2">{translation[language].brand}</label>
          <select
            id="brand_id"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[language].selectBrand}</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2">{translation[language].category}</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[language].selectCategory}</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="warehouse_id" className="block text-gray-700 font-medium mb-2">{translation[language].warehouse}</label>
          <select
            id="warehouse_id"
            name="warehouse_id"
            value={formData.warehouse_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[language].selectWarehouse}</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                {warehouse.location}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="product_type_id" className="block text-gray-700 font-medium mb-2">{translation[language].product_type}</label>
          <select
            id="product_type_id"
            name="product_type_id"
            value={formData.product_type_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[language].selectProductType}</option>
            {productTypes.map((productType) => (
              <option key={productType.product_type_id} value={productType.product_type_id}>
                {productType.product_type_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="product_image" className="block text-gray-700 font-medium mb-2">{translation[language].product_image}</label>
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
          {translation[language].submit}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
