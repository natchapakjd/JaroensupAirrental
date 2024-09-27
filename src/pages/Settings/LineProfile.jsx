// src/components/LineProfile.js
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const LineProfile = () => {
  const [profile, setProfile] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("authToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
    login();
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
      console.log(error)
    }
  };

  const logout = async () => {
    await liff.logout();
    setProfile(null);
    if(isDashboard){
      navigate("/dashboard/home");
    }else{
      navigate("/settings");
    }
  };

  const toggleNotifications = async () => {
    setNotificationsEnabled(!notificationsEnabled);
    const lineToken = profile.userId;
    await updateLineToken(userId, lineToken);
  };

  const updateLineToken = async (userId, lineToken) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/line-token/${userId}`,
        {
          lineToken: !notificationsEnabled ? lineToken : null, // Send null if notifications are disabled
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
  const isDashboard = window.location.pathname.startsWith('/dashboard');

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
              Hello, {profile.displayName}
            </h2>
            <div className="text-center mb-4">UID: {profile.userId}</div>

            <div className="mt-6 flex justify-between">
              <h3 className="text-lg font-semibold mt-6">
                LINE Notification Settings
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
                    ? "Notifications Enabled"
                    : "Notifications Disabled"}
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={logout}
                className="btn bg-blue text-white hover:bg-blue"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">Loading...</div>
        )}
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default LineProfile;
