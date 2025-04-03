import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { workExperiences } from "./WorkExperience";
import BackButton from "../../components/BackButton";

const WorkExperienceDetails = () => {
  const { expId } = useParams(); // ดึง id จาก URL
  const experience = workExperiences.find((exp) => exp.id === Number(expId)); // ค้นหางานที่ตรงกับ id
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  if (!experience) {
    return (
      <div className="text-center mt-20 text-red-600">
        <h1 className="text-3xl font-bold">ไม่พบข้อมูลงาน</h1>
      </div>
    );
  }

  const { images, companyName, projectTitle, description } = experience;

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
                  src={image}
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={closeFullScreen}>
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
