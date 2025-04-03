import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { workExperiences } from "./WorkExperience";
import BackButton from "../../components/BackButton";

const WorkExperienceDetails = () => {
  const { expId } = useParams(); // ดึง id จาก URL
  const experience = workExperiences.find((exp) => exp.id === Number(expId)); // ค้นหางานที่ตรงกับ id
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!experience) {
    return (
      <div className="text-center mt-20 text-red-600">
        <h1 className="text-3xl font-bold">ไม่พบข้อมูลงาน</h1>
      </div>
    );
  }

  const { images, companyName, projectTitle, description } = experience;

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-8 font-prompt">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-start mb-4">
            <BackButton />
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            {images.length > 1 ? (
              <div className="relative">
                <img
                  src={images[currentImage]}
                  alt={`Image ${currentImage + 1} of ${companyName}`}
                  className="w-full h-96 object-cover rounded cursor-pointer"
                  onClick={() => setIsFullScreen(true)}
                />
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-4 h-4 rounded-full ${index === currentImage ? "bg-blue" : "bg-gray-300"}`}
                      onClick={() => setCurrentImage(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <img
                src={images[0]}
                alt={`Image of ${companyName}`}
                className="w-full h-96 object-cover rounded cursor-pointer"
                onClick={() => setIsFullScreen(true)}
              />
            )}
          </div>
        </div>
      </div>
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={() => setIsFullScreen(false)}>
          <img src={images[currentImage]} alt="Full Screen" className="max-w-full max-h-full" />
        </div>
      )}
      <Footer />
    </>
  );
};

export default WorkExperienceDetails;
