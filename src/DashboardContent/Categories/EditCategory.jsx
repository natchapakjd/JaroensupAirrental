import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";
// Translation strings for localization
const translations = {
  en: {
    heading: "Edit Category",
    nameLabel: "Name",
    descriptionLabel: "Description",
    updateButton: "Update Category",
    successTitle: "Category updated successfully",
    errorTitle: "Error",
    errorMessage: "Failed to update category.",
    fetchError: "Failed to fetch category data.",
  },
  th: {
    heading: "แก้ไขหมวดหมู่",
    nameLabel: "ชื่อ",
    descriptionLabel: "คำอธิบาย",
    updateButton: "อัพเดตหมวดหมู่",
    successTitle: "อัพเดตหมวดหมู่สำเร็จ",
    errorTitle: "ข้อผิดพลาด",
    errorMessage: "ไม่สามารถอัพเดตหมวดหมู่ได้",
    fetchError: "ไม่สามารถดึงข้อมูลหมวดหมู่ได้",
  },
};

const EditCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get the categoryId from the URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;
  // Get the language from localStorage, defaulting to 'en'
  const language = localStorage.getItem("language") || "en";
  const t = translations[language]; // Get the translation for the selected language

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/category/${categoryId}`
        );
        setFormData({
          name: response.data.name,
          description: response.data.description,
        });
      } catch (error) {
        Swal.fire({
          title: t.errorTitle,
          text: t.fetchError,
          icon: "error",
        });
      }
    };

    fetchCategory();
  }, [categoryId]);

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
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/category/${categoryId}`,
        formData
      );
      if (response.status === 200) {
        Swal.fire({
          title: t.successTitle,
          icon: "success",
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
              className="block text-gray-700 font-medium mb-2"
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
              className="block text-gray-700 font-medium mb-2"
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
            className="text-white bg-blue hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {t.updateButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
