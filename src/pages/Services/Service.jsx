import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";

// ✅ Object สำหรับแปลภาษา
const translations = {
  th: {
    title: "บริการของเรา",
    noService: "ไม่มีบริการที่เกี่ยวข้อง",
    noRental: "ไม่มีบริการให้เช่าหรือซื้อสินค้า",
    details: "ดูรายละเอียดเพิ่มเติม",
  },
  en: {
    title: "Our Services",
    noService: "No related services",
    noRental: "No available rental or purchase services",
    details: "View Details",
  },
};

const Service = () => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tasktypes`
        );
        setTaskTypes(response.data);
      } catch (error) {
        console.error("Error fetching task types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskTypes();
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const filteredTaskTypes = taskTypes
  .filter((taskType) =>
    taskType.type_name === "งานเช่าเครื่องปรับอากาศ" ||
    taskType.type_name === "ขายสินค้า" ||
    taskType.type_name === "งานซ่อมบำรุงเครื่องปรับอากาศ" ||
    taskType.type_name === "งานเช่าและล้างเครื่องปรับอากาศ"
  )
  .map((taskType) => {
    if (taskType.type_name === "งานเช่าเครื่องปรับอากาศ") {
      taskType.type_name = "งานเช่าและล้างเครื่องปรับอากาศ";
      taskType.description = "เช่าและล้างเครื่องปรับอากาศ พร้อมติดตั้ง";

    }
    return taskType;
  });


  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-6">
            {translations[language].title}
          </h1>
          {loading ? (
            <Loading />
          ) : taskTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTaskTypes.length > 0 ? (
                filteredTaskTypes.map((taskType) => (
                  <div
                    key={taskType.task_type_id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                  >
                    <img
                      src={
                        taskType.image_url ||
                        "https://inwfile.com/s-ck/woh7eq.jpg"
                      }
                      alt={taskType.type_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {taskType.type_name}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {taskType.description}
                      </p>
                      <div className="flex justify-end">
                        <Link
                          to={
                            taskType.type_name === "ขายสินค้า"
                              ? "/product"
                              : `/service/rental/${taskType.task_type_id}`
                          }
                          className="bg-blue text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                        >
                          {translations[language].details}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">{translations[language].noRental}</p>
              )}
            </div>
          ) : (
            <p className="text-center">{translations[language].noService}</p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Service;
