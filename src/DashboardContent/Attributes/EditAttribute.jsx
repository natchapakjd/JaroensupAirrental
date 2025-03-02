import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButton from "../../components/BackButton";
import BackButtonEdit from "../../components/BackButtonEdit";
const EditAttribute = () => {
  const navigate = useNavigate();
  const { attributeId } = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;
  // Placeholder for language toggle
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  // Add language-specific strings
  const translations = {
    en: {
      editAttribute: "Edit Attribute",
      name: "Name",
      updateAttribute: "Update Attribute",
      updating: "Updating...",
      successMessage: "Attribute updated successfully.",
      errorMessage: "Failed to load attribute data.",
      buttonText: "Update Attribute",
    },
    th: {
      editAttribute: "แก้ไขคุณสมบัติ",
      name: "ชื่อ",
      updateAttribute: "อัปเดตคุณสมบัติ",
      updating: "กำลังอัปเดต...",
      successMessage: "อัปเดตคุณสมบัติสำเร็จ",
      errorMessage: "ไม่สามารถโหลดข้อมูลคุณสมบัติได้",
      buttonText: "อัปเดตคุณสมบัติ",
    },
  };

  // Fetch the attribute data
  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/attribute/${attributeId}`
        );
        if (response.status === 200) {
          setName(response.data.name);
          setIsLoadingData(false);
        }
      } catch (error) {
        Swal.fire("Error!", translations[language].errorMessage, "error");
      }
    };

    fetchAttribute();
  }, [attributeId, language]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/attribute/${attributeId}`,
        { name }
      );
      if (response.status === 200) {
        Swal.fire("Success!", translations[language].successMessage, "success");
        setTimeout(() => {
          navigate("/dashboard/attributes");
        }, 800);
      } else {
        throw new Error("Failed to update attribute.");
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full mt-5">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translations[language].editAttribute}
          </h1>
        </div>

        {isLoadingData ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="text-sm font-medium">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].name}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className={`btn bg-blue text-white hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading
                ? translations[language].updating
                : translations[language].buttonText}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditAttribute;
