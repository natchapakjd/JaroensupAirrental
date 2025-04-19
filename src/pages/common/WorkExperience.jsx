import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

const translations = {
  th: {
    header: "ผลงานเก่าของเรา",
    subText: "สำรวจโครงการและประสบการณ์สำคัญที่เรามีร่วมกับบริษัทต่าง ๆ",
    details: "ดูรายละเอียด",
    loading: "กำลังโหลดข้อมูล...",
    error: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
  },
  en: {
    header: "Our Past Work",
    subText: "Explore some of the significant projects we've had with various companies.",
    details: "View Details",
    loading: "Loading data...",
    error: "Failed to load data",
  },
};

const WorkExperience = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/work_exps`);
        setWorkExperiences(response.data);
        setLoading(false);
      } catch (err) {
        setError(translations[language].error);
        setLoading(false);
      }
    };
    fetchWorkExperiences();
  }, [apiUrl, language]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };
    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-20 text-red-600 font-prompt">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-8 font-prompt">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {translations[language].header}
            </h1>
            <p className="text-lg text-gray-600">
              {translations[language].subText}
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workExperiences.map(({ id, images, companyName, projectTitle }) => (
              <div
                key={id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <img
                  src={images[0] || "https://via.placeholder.com/300"}
                  alt={companyName}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(images[0])}
                />
                <div className="p-2">
                  <div className="flex justify-end">
                    <Link
                      to={`/experience/${id}`}
                      className="btn bg-blue hover:bg-blue text-white px-4 py-2 rounded-lg"
                    >
                      {translations[language].details}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative bg-white p-4 rounded-lg shadow-lg">
                <button
                  className="absolute top-2 right-2 text-gray-800 text-2xl font-bold"
                  onClick={() => setSelectedImage(null)}
                >
                  &times;
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WorkExperience;  