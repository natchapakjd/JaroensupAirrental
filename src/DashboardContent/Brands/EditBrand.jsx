import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";
// Translation strings for localization
const translations = {
  en: {
    heading: "Edit Brand",
    nameLabel: "Name",
    descriptionLabel: "Description",
    updateButton: "Update Brand",
    updatingButton: "Updating...",
    successMessage: "Brand updated successfully.",
    errorMessage: "Failed to update brand.",
    loadErrorMessage: "Failed to load brand details.",
  },
  th: {
    heading: "แก้ไขแบรนด์",
    nameLabel: "ชื่อแบรนด์",
    descriptionLabel: "คำอธิบาย",
    updateButton: "อัปเดตแบรนด์",
    updatingButton: "กำลังอัปเดต...",
    successMessage: "อัปเดตแบรนด์เรียบร้อยแล้ว.",
    errorMessage: "ไม่สามารถอัปเดตแบรนด์ได้.",
    loadErrorMessage: "ไม่สามารถโหลดรายละเอียดแบรนด์ได้.",
  },
};

const EditBrand = () => {
  const { brandId } = useParams(); // Get brand ID from the URL
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;
  // Get the language from localStorage, defaulting to 'en'
  const language = localStorage.getItem("language") || "en";
  const t = translations[language]; // Get the translation for the selected language

  useEffect(() => {
    // Fetch the brand details when the component loads
    const fetchBrand = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/brand/${brandId}`
        );
        const brand = response.data;
        setName(brand.name);
        setDescription(brand.description);
      } catch (error) {
        Swal.fire("Error!", t.loadErrorMessage, "error");
      }
    };
    fetchBrand();
  }, [brandId, t.loadErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/brand/${brandId}`, {
        name,
        description,
      });
      Swal.fire("Success!", t.successMessage, "success");
      navigate("/dashboard/brands"); // Redirect to the brand list
    } catch (error) {
      Swal.fire("Error!", t.errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full mt-5">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.heading} </h1>
        </div>
        <form onSubmit={handleSubmit} className="text-md ">
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
            {loading ? t.updatingButton : t.updateButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;
