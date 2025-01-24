import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { workExperiences } from "./WorkExperience";

const WorkExperienceDetails = () => {
  const { expId } = useParams(); // ดึง id จาก URL
  const experience = workExperiences.find((exp) => exp.id === Number(expId)); // ค้นหางานที่ตรงกับ id

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
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* ตรวจสอบจำนวนรูปใน images */}
            {images.length === 1 ? (
              <img
                src={images[0]}
                alt={`Image of ${companyName}`}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1} of ${companyName}`}
                    className="w-full h-64 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {companyName}
              </h1>
              <h2 className="text-2xl font-medium text-gray-700 mb-4">
                {projectTitle}
              </h2>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WorkExperienceDetails;
