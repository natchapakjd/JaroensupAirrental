import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

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
    product_type_id: "",
    product_image: null,
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem("language")||'th');

  // Translation object
  const translation = {
    en: {
      title: "Edit Product",
      name: "Name",
      description: "Description",
      price: "Price",
      stock_quantity: "Stock Quantity",
      brand: "Brand",
      category: "Category",
      warehouse: "Warehouse",
      product_type: "Product Type",
      product_image: "Product Image",
      submit: "Submit",
      selectOption: "Select",
      successMessage: "Product updated successfully",
      errorMessage: "Error",
    },
    th: {
      title: "แก้ไขผลิตภัณฑ์",
      name: "ชื่อ",
      description: "คำอธิบาย",
      price: "ราคา",
      stock_quantity: "จำนวนสินค้า",
      brand: "แบรนด์",
      category: "ประเภทสินค้า",
      warehouse: "คลังสินค้า",
      product_type: "ประเภทผลิตภัณฑ์",
      product_image: "รูปผลิตภัณฑ์",
      submit: "ส่งข้อมูล",
      selectOption: "เลือก",
      successMessage: "อัปเดตผลิตภัณฑ์สำเร็จ",
      errorMessage: "ข้อผิดพลาด",
    },
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/product/${productId}`
        );
        setFormData({
          ...response.data[0],
          product_image: null, // Reset image input
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchDropdownData = async () => {
      try {
        const [brandRes, categoryRes, warehouseRes, productTypeRes] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_SERVER_URL}/brands`),
            axios.get(`${import.meta.env.VITE_SERVER_URL}/categories`),
            axios.get(`${import.meta.env.VITE_SERVER_URL}/warehouses`),
            axios.get(`${import.meta.env.VITE_SERVER_URL}/product-type`),
          ]);
        setBrands(brandRes.data);
        setCategories(categoryRes.data);
        setWarehouses(warehouseRes.data);
        setProductTypes(productTypeRes.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchProduct();
    fetchDropdownData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
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
          title: translation[currentLanguage].successMessage,
          icon: "success",
        });
        navigate("/dashboard/products");
      } else {
        throw new Error("Failed to update product.");
      }
    } catch (error) {
      Swal.fire({
        title: translation[currentLanguage].errorMessage,
        text: error.response.data.error,
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto h-full">
      <h1 className="text-2xl font-semibold mb-6">{translation[currentLanguage].title}</h1>
      <form onSubmit={handleSubmit} className="text-sm font-medium">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            {translation[currentLanguage].name}:
          </label>
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
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].description}:
          </label>
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
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
            {translation[currentLanguage].price}:
          </label>
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
          <label
            htmlFor="stock_quantity"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].stock_quantity}:
          </label>
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
          <label
            htmlFor="brand_id"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].brand}:
          </label>
          <select
            id="brand_id"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[currentLanguage].selectOption}</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="category_id"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].category}:
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[currentLanguage].selectOption}</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="warehouse_id"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].warehouse}:
          </label>
          <select
            id="warehouse_id"
            name="warehouse_id"
            value={formData.warehouse_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[currentLanguage].selectOption}</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                {warehouse.location}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="product_type_id"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].product_type}:
          </label>
          <select
            id="product_type_id"
            name="product_type_id"
            value={formData.product_type_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">{translation[currentLanguage].selectOption}</option>
            {productTypes.map((type) => (
              <option key={type.product_type_id} value={type.product_type_id}>
                {type.product_type_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="product_image"
            className="block text-gray-700 font-medium mb-2"
          >
            {translation[currentLanguage].product_image}:
          </label>
          <input
            type="file"
            id="product_image"
            name="product_image"
            onChange={handleChange}
            className="file-input file-input-bordered w-full h-10"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {translation[currentLanguage].submit}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
