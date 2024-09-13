import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imgSrc1 from "../assets/images/IMG_0848.jpg";
import imgSrc2 from "../assets/images/IMG_0849.jpg";

const workExperiences = [
  {
    id: 1,
    imgSrc: imgSrc1,
    companyName: "Company Name 1",
    projectTitle: "Project Title 1",
    description: "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
  {
    id: 2,
    imgSrc: imgSrc2,
    companyName: "Company Name 2",
    projectTitle: "Project Title 2",
    description: "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
];

const WorkExperience = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Our Work Experience
            </h1>
            <p className="text-lg text-gray-600">
              Explore some of the significant projects and experiences we've had
              with various companies.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workExperiences.map(({ id, imgSrc, companyName, projectTitle, description }) => (
              <div key={id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={imgSrc}
                  alt={companyName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {companyName}
                  </h2>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {projectTitle}
                  </h3>
                  <p className="text-gray-600">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WorkExperience;
