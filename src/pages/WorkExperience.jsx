import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
            {/* Example Work Experience Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Company Project"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Company Name
                </h2>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Project Title
                </h3>
                <p className="text-gray-600">
                  A brief description of the project or work experience.
                  Highlight the key achievements and the impact made.
                </p>
              </div>
            </div>

            {/* Add more work experience cards as needed */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Company Project"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Company Name
                </h2>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Project Title
                </h3>
                <p className="text-gray-600">
                  A brief description of the project or work experience.
                  Highlight the key achievements and the impact made.
                </p>
              </div>
            </div>

            {/* Add more work experience cards as needed */}
          </section>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default WorkExperience;
