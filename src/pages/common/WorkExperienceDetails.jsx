import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackButton from "../../components/BackButton";
import axios from "axios";
import Loading from "../../components/Loading";

const translations = {
  th: {
    notFound: "ไม่พบข้อมูลงาน",
    loading: "กำลังโหลดข้อมูล...",
    error: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
  },
  en: {
    notFound: "Work experience not found",
    loading: "Loading data...",
    error: "Failed to load data",
  },
};

const WorkExperienceDetails = () => {
  const { expId } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const language = localStorage.getItem("language") || "th";

  useEffect(() => {
    const fetchWorkExperience = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/work_exps/${expId}`);
        setExperience(response.data);
        setLoading(false);
      } catch (err) {
        setError(translations[language].error);
        setLoading(false);
      }
    };
    fetchWorkExperience();
  }, [expId, apiUrl, language]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-20 text-red-600 font-prompt">{error}</div>;
  if (!experience) {
    return (
      <div className="text-center mt-20 text-red-600 font-prompt">
        <h1 className="text-3xl font-bold">{translations[language].notFound}</h1>
      </div>
    );
  }

  const { images, companyName } = experience;

  const openFullScreen = (image) => {
    setFullScreenImage(image);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setFullScreenImage(null);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-8 font-prompt">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-start mb-4">
            <BackButton />
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image || "https://via.placeholder.com/300"}
                  alt={`Image ${index + 1} of ${companyName}`}
                  className="w-full h-64 object-cover rounded cursor-pointer"
                  onClick={() => openFullScreen(image)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeFullScreen}
        >
          <img
            src={fullScreenImage}
            alt="Full Screen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <Footer />
    </>
  );
};

export default WorkExperienceDetails;