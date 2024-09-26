// src/pages/Settings.js
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Settings = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Navigate to line-profile page
  const goToLineProfile = () => {
    navigate("/line-profile");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 font-prompt">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-lg font-bold">อนุญาตให้ส่งข้อความแจ้งเตือนผ่าน LINE หรือไม่?</h2>
          <div className="flex justify-center mt-4">
            <button
              onClick={goToLineProfile}
              className="btn bg-success text-white hover:bg-success"
            >
              อนุญาต
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
