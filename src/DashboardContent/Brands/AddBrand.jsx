import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";
const translations = {
  en: {
    heading: "Add New Brand",
    nameLabel: "Name",
    descriptionLabel: "Description",
    addButton: "Add Brand",
    addingButton: "Adding...",
    successMessage: "Brand added successfully.",
    errorMessage: "Failed to add brand.",
  },
  th: {
    heading: "เพิ่มแบรนด์ใหม่",
    nameLabel: "ชื่อแบรนด์",
    descriptionLabel: "คำอธิบาย",
    addButton: "เพิ่มแบรนด์",
    addingButton: "กำลังเพิ่ม...",
    successMessage: "เพิ่มแบรนด์เรียบร้อยแล้ว.",
    errorMessage: "ไม่สามารถเพิ่มแบรนด์ได้.",
  },
};

const AddBrand = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const language = localStorage.getItem("language") || "en";
  const t = translations[language]; // Get the translation for the selected language
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/brands`,
        {
          name,
          description,
        }
      );
      if (response.status === 201) {
        Swal.fire("Success!", "Brand added successfully.", "success");
        navigate("/dashboard/brands"); // Redirect to the brands list page
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to add brand.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto  mt-5 h-full">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.heading} </h1>
        </div>
        <form onSubmit={handleSubmit} className="text-md">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-md  text-gray-700"
            >
              {t.nameLabel}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-md  text-gray-700"
            >
              {t.descriptionLabel}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-md"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn bg-blue text-white hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? t.addingButton : t.addButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
