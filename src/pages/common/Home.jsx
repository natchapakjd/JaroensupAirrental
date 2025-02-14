import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const translations = {
  th: {
    revolutionize: "ปฏิวัติ",
    acRental: "การเช่าแอร์",
    withUs: "กับพวกเรา",
    enhanceEfficiency:
      "เพิ่มประสิทธิภาพการทำงานของคุณด้วย ระบบเช่าแอร์ที่ตอบโจทย์ ความต้องการของคุณ",
    tryNow: "ลองเลย →",
  },
  en: {
    revolutionize: "Revolutionize",
    acRental: "Air Conditioning Rental",
    withUs: "with Us",
    enhanceEfficiency:
      "Enhance your efficiency with an air rental system tailored to your needs.",
    tryNow: "Try Now →",
  },
};

const Home = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    // ✅ ฟังค์ชั่นนี้จะทำงานเมื่อ localStorage เปลี่ยน
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="relative isolate overflow-hidden bg-gray-900 font-prompt">
          <div className="mt-[-50px] flex h-screen items-center justify-center">
            <div className="max-w-full flex-shrink-0 px-4 text-center lg:mx-0 lg:max-w-3xl lg:pt-8">
              <h1 className="mt-10 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                {translations[language].revolutionize}{" "}
                <span className="text-sky-500">
                  {translations[language].acRental}
                </span>{" "}
                {translations[language].withUs}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
                {translations[language].enhanceEfficiency}
              </p>
              <div className="mt-5 flex items-center justify-center gap-x-6">
                <a
                  href="/register"
                  className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  rel="noreferrer"
                >
                  {translations[language].tryNow}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
