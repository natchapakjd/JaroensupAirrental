import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";
// Translation strings for localization
const translations = {
  en: {
    heading: "Add New Category",
    nameLabel: "Name",
    descriptionLabel: "Description",
    addButton: "Add Category",
    successTitle: "Category added successfully",
    errorTitle: "Error",
    errorMessage: "Failed to add category.",
  },
  th: {
    heading: "เพิ่มหมวดหมู่ใหม่",
    nameLabel: "ชื่อ",
    descriptionLabel: "คำอธิบาย",
    addButton: "เพิ่มหมวดหมู่",
    successTitle: "เพิ่มหมวดหมู่สำเร็จ",
    errorTitle: "ข้อผิดพลาด",
    errorMessage: "ไม่สามารถเพิ่มหมวดหมู่ได้",
  },
};

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Get the language from localStorage, defaulting to 'en'
  const language = localStorage.getItem("language") || "en";
  const t = translations[language]; // Get the translation for the selected language
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/categories`,
        formData
      );
      if (response.status === 201) {
        Swal.fire({
          title: t.successTitle,
          icon: "success",
        });
        setFormData({
          name: "",
          description: "",
        });
        setTimeout(() => {
          navigate("/dashboard/categories");
        }, 800);
      } else {
        throw new Error(t.errorMessage);
      }
    } catch (error) {
      Swal.fire({
        title: t.errorTitle,
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt ">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.heading} </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700  mb-2"
            >
              {t.nameLabel}:
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
              className="block text-gray-700  mb-2"
            >
              {t.descriptionLabel}:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue  rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {t.addButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
