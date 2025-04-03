import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import imgSrc1 from "../../assets/images/IMG_0848.jpg";
import imgSrc2 from "../../assets/images/IMG_0849.jpg";
import imgSrc3 from "../../assets/images/IMG_0850.jpg";
import imgSrc4 from "../../assets/images/IMG_0853.jpg";
import imgSrc5 from "../../assets/images/IMG_0889.png";
import imgSrc6 from "../../assets/images/IMG_0891.png";
import imgSrc7 from "../../assets/images/IMG_0892.png";
import imgSrc8 from "../../assets/images/IMG_0893.png";
import imgSrc9 from "../../assets/images/IMG_0894.png";
import imgSrc10 from "../../assets/images/IMG_0895.png";
import imgSrc11 from "../../assets/images/IMG_0896.png";
import imgSrc12 from "../../assets/images/1.jpg";
import imgSrc13 from "../../assets/images/2.jpg";
import imgSrc14 from "../../assets/images/3.jpg";
import imgSrc15 from "../../assets/images/4.jpg";
import imgSrc16 from "../../assets/images/5.jpg";
import imgSrc17 from "../../assets/images/6.jpg";
import imgSrc18 from "../../assets/images/7.jpg";
import imgSrc19 from "../../assets/images/8.jpg";
import imgSrc20 from "../../assets/images/9.jpg";
import imgSrc21 from "../../assets/images/10.jpg";
import imgSrc22 from "../../assets/images/11.jpg";
import imgSrc23 from "../../assets/images/12.jpg";
import imgSrc24 from "../../assets/images/13.jpg";
import imgSrc25 from "../../assets/images/14.jpg";
import imgSrc26 from "../../assets/images/15.jpg";
import imgSrc27 from "../../assets/images/16.jpg";
import imgSrc28 from "../../assets/images/17.jpg";
import imgSrc29 from "../../assets/images/18.jpg";
import imgSrc30 from "../../assets/images/19.jpg";

import { Link } from "react-router-dom";

export const workExperiences = [
  {
    id: 1,
    images: [imgSrc1, imgSrc2],
    companyName: "Address Name 1",
    projectTitle: "Project Title 1",
    description: "A brief description of the project or work experience.",
  },
  {
    id: 2,
    images: [imgSrc3],
    companyName: "Address Name 2",
    projectTitle: "Project Title 2",
    description: "A brief description of the project or work experience.",
  },
  {
    id: 3,
    images: [imgSrc4],
    companyName: "Address Name 3",
    projectTitle: "Project Title 3",
    description: "A brief description of the project or work experience.",
  },
  {
    id: 4,
    images: [imgSrc5, imgSrc6, imgSrc7],
    companyName: "Address Name 4",
    projectTitle: "Project Title 4",
    description: "A brief description of the project or work experience.",
  },
  {
    id: 5,
    images: [imgSrc8, imgSrc9, imgSrc10, imgSrc11],
    companyName: "Address Name 4",
    projectTitle: "Project Title 4",
    description: "A brief description of the project or work experience.",
  },
  {
    id: 6,
    images: [imgSrc12, imgSrc13, imgSrc14, imgSrc15,imgSrc16,imgSrc17,imgSrc18,imgSrc19,imgSrc20,imgSrc21,imgSrc22],
    companyName: "Address Name 5",
    projectTitle: "Project Title 5",
    description: "A brief description of the project or work experience.",
  },
  {
    id: 7,
    images: [imgSrc23, imgSrc24, imgSrc25, imgSrc26,imgSrc27,imgSrc28,imgSrc29,imgSrc30],
    companyName: "Address Name 6",
    projectTitle: "Project Title 6",
    description: "A brief description of the project or work experience.",
  },
];

const translations = {
  th: {
    header: "ผลงานเก่าของเรา",
    subText: "สำรวจโครงการและประสบการณ์สำคัญที่เรามีร่วมกับบริษัทต่าง ๆ",
    details: "ดูรายละเอียด",
  },
  en: {
    header: "Our Past Work",
    subText: "Explore some of the significant projects we've had with various companies.",
    details: "View Details",
  },
};

const WorkExperience = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };
    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

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
            {workExperiences.map(({ id, images, companyName, projectTitle, description }) => (
              <div
                key={id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* 📌 เมื่อกดรูปให้เปิด Popup */}
                <img
                  src={images[0]}
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

          {/* 📌 Popup แสดงภาพเมื่อกด */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative bg-white p-4 rounded-lg shadow-lg">
                <button
                  className="absolute top-0 right-0 text-gray-800 text-2xl"
                  onClick={() => setSelectedImage(null)}
                >
                 x
                </button>
                <img src={selectedImage} alt="Selected" className="max-w-full max-h-[80vh] rounded-lg" />
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
