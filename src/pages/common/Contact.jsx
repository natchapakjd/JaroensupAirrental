import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const translations = {
  th: {
    contactUs: "ติดต่อเรา",
    description: "สำรวจโครงการและประสบการณ์สำคัญที่เรามีร่วมกับบริษัทต่าง ๆ",
    companyName: "บริษัท เจริญทรัพย์ จำกัด",
    address: "เลขที่ 425 ถ.นาคนิวาศ แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230",
    contactInfo: "ช่องทางการติดต่อ",
    phone: "โทรศัพท์",
    email: "อีเมล",
    website: "เว็บไซต์",
  },
  en: {
    contactUs: "Contact Us",
    description: "Explore some of the significant projects and experiences we've had with various companies.",
    companyName: "Jaroensup Co., Ltd.",
    address: "425 Nak Niwat Rd, Lat Phrao, Bangkok 10230",
    contactInfo: "Contact Information",
    phone: "Phone",
    email: "Email",
    website: "Website",
  },
};

const Contact = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

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
      <div className="bg-gray-100 text-gray-800 font-prompt py-8">
        {/* Contact Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-prompt">
            {translations[language].contactUs}
          </h1>
          <p className="text-lg text-gray-600">{translations[language].description}</p>
        </header>

        {/* Google Maps */}
        <div className="container mx-auto px-4 mb-8">
          <iframe
            className="w-full h-80 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.357660721919!2d100.61009159999999!3d13.8175492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d836665efc7%3A0x6b2d16caaa5a845c!2s425%20Nak%20Niwat%20Rd%2C%20Khwaeng%20Lat%20Phrao%2C%20Khet%20Lat%20Phrao%2C%20Krung%20Thep%20Maha%20Nakhon%2010230!5e0!3m2!1sen!2sth!4v1726233305868!5m2!1sen!2sth"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Information */}
        <div className="container mx-auto px-4 pb-5">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{translations[language].companyName}</h2>
            <p className="text-lg mb-2">{translations[language].address}</p>
            <h3 className="text-xl font-semibold mb-2">{translations[language].contactInfo}</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>
                {translations[language].phone}: 086-975-0664
              </li>
              <li>
                {translations[language].email}: contact@example.com
              </li>
              <li>
                {translations[language].website}:{" "}
                <a href="https://www.example.com" className="text-blue-500 hover:underline">
                  www.example.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
