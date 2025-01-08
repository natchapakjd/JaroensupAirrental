import React from "react";
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
import { Link } from "react-router-dom";

export const workExperiences = [
  {
    id: 1,
    images: [imgSrc1, imgSrc2],
    companyName: "Address Name 1",
    projectTitle: "Project Title 1",
    description:
      "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
  {
    id: 2,
    images: [imgSrc3],
    companyName: "Address Name 2",
    projectTitle: "Project Title 2",
    description:
      "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
  {
    id: 3,
    images: [imgSrc4],
    companyName: "Address Name 3",
    projectTitle: "Project Title 3",
    description:
      "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
  {
    id: 4,
    images: [imgSrc5, imgSrc6, imgSrc7],
    companyName: "Address Name 4",
    projectTitle: "Project Title 4",
    description:
      "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
  {
    id: 5,
    images: [imgSrc8, imgSrc9, imgSrc10, imgSrc11],
    companyName: "Address Name 4",
    projectTitle: "Project Title 4",
    description:
      "A brief description of the project or work experience. Highlight the key achievements and the impact made.",
  },
];

const WorkExperience = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-prompt">
              ผลงานเก่าของเรา
            </h1>
            <p className="text-lg text-gray-600">
              Explore some of the significant projects and experiences we've had
              with various companies.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workExperiences.map(
              ({ id, images, companyName, projectTitle, description }) => (
                <div
                  key={id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <img
                    src={images[0]}
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
                    <p className="text-gray-600 mb-4">
                      {description.substring(0, 100)}...
                    </p>
                    <div className="flex justify-end">
                      <Link
                        to={`/experience/${id}`}
                        className="btn bg-blue hover:bg-blue text-white "
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WorkExperience;
