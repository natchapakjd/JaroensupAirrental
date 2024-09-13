import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 text-gray-800 font-prompt">
        {/* Contact Header */}
        <div className="bg-blue-600 h-20 mb-8">
          <p className="text-black text-3xl py-6 text-center font-semibold">Contact Us</p>
        </div>

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
            <h2 className="text-2xl font-bold mb-4">บริษัท เจริญทรัพย์ จำกัด</h2>
            <p className="text-lg mb-2">เลขที่ 425 ถ.นาคนิวาศ แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230</p>
            <h3 className="text-xl font-semibold mb-2">ช่องทางการติดต่อ</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>โทรศัพท์: 085-907-7726</li>
              <li>อีเมล: contact@example.com</li>
              <li>เว็บไซต์: <a href="https://www.example.com" className="text-blue-500 hover:underline">www.example.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
