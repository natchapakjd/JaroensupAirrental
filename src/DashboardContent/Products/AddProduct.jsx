import React, { useState } from "react";
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
    product_image: null,
  });

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
        setTimeout(() => {
          navigate('/dashboard/products'); 
        }, 800);

      } else {
        throw new Error("Failed to add product.");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
        <div className="p-8 rounded-lg shadow-lg w-full  mx-auto font-inter">
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
              class="text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
    </>
  );
};

export default AddProduct;
