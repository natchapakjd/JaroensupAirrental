// src/components/LineProfile.js
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/Loading";

// 🔥 แปลภาษา
const translations = {
  th: {
    hello: "สวัสดี",
    uid: "รหัสผู้ใช้",
    lineNotification: "การตั้งค่าการแจ้งเตือน LINE",
    enabled: "เปิดการแจ้งเตือน",
    disabled: "ปิดการแจ้งเตือน",
    logout: "ออกจากระบบ",
  },
  en: {
    hello: "Hello",
    uid: "UID",
    lineNotification: "LINE Notification Settings",
    enabled: "Notifications Enabled",
    disabled: "Notifications Disabled",
    logout: "Logout",
  },
};

const LineProfile = () => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const id = decodeToken.id;

  const [profile, setProfile] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    JSON.parse(localStorage.getItem("notificationsEnabled")) || false
  );
  const [userId, setUserId] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("language") ||'th');

  const navigate = useNavigate();

  useEffect(() => {
    setUserId(id);
    login();
    // ✅ โหลดค่าภาษาเมื่อเข้าเว็บ
    const savedLanguage = localStorage.getItem("language") || "th";
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    // ✅ ฟัง `localStorage` event ถ้ามีการเปลี่ยนค่าก็อัปเดต `notificationsEnabled` และภาษา
    const handleStorageChange = () => {
      setNotificationsEnabled(
        JSON.parse(localStorage.getItem("notificationsEnabled")) || false
      );
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async () => {
    try {
      await liff.init({ liffId: "2005859640-eRy005zg" });
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await liff.logout();
    setProfile(null);
    if (isDashboard) {
      navigate("/dashboard/home");
    } else {
      navigate("/settings");
    }
  };

  const toggleNotifications = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    localStorage.setItem("notificationsEnabled", JSON.stringify(newStatus));

    const lineToken = profile.userId;
    await updateLineToken(userId, newStatus ? lineToken : null);
  };

  const updateLineToken = async (userId, lineToken) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/line-token/${userId}`,
        {
          lineToken: lineToken,
        }
      );
    } catch (error) {
      console.error("Error updating line token:", error.response.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update LINE token!",
      });
    }
  };

  // ตรวจสอบว่าอยู่ที่หน้า dashboard หรือไม่
  const isDashboard = window.location.pathname.startsWith("/dashboard");

  return (
    <div>
      {!isDashboard && <Navbar />}
      <div className="container mx-auto p-6 font-prompt">
        {profile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="w-40 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-center mb-2">
              {translations[language].hello}, {profile.displayName}
            </h2>
            <div className="text-center mb-4">
              {translations[language].uid}: {profile.userId}
            </div>

            <div className="mt-6 flex justify-between">
              <h3 className="text-lg font-semibold mt-6">
                {translations[language].lineNotification}
              </h3>
              <div className="flex items-center justify-center mt-2">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                  className="toggle toggle-primary mr-2"
                />
                <label className="label">
                  {notificationsEnabled
                    ? translations[language].enabled
                    : translations[language].disabled}
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={logout}
                className="btn bg-blue text-white hover:bg-blue"
              >
                {translations[language].logout}
              </button>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default LineProfile;
