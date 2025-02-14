  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import Cookies from "universal-cookie";
  import { jwtDecode } from "jwt-decode";
  import Loading from "./Loading";

  const translations = {
    th: {
      hello: "สวัสดี",
      haveNiceDay: "ขอให้เป็นวันที่ดี",
      profile: "โปรไฟล์",
      changePassword: "เปลี่ยนรหัสผ่าน",
      notification: "การแจ้งเตือน",
      logout: "ออกจากระบบ",
    },
    en: {
      hello: "Hello",
      haveNiceDay: "Have a nice day",
      profile: "Profile",
      changePassword: "Change password",
      notification: "Notification",
      logout: "Logout",
    },
  };

  const Header = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
    const token = cookies.get("authToken");
    let id = null;

    try {
      const decodeToken = jwtDecode(token);
      id = decodeToken.id;
    } catch (err) {
      console.error("Error decoding token:", err);
    }

    useEffect(() => {
      if (id) fetchUserByID(id);
    }, [id]);

    useEffect(() => {
      const interval = setInterval(() => {
        const currentLanguage = localStorage.getItem("language") || "th";
        if (currentLanguage !== language) {
          setLanguage(currentLanguage);
        }
      }, 100); 
    
      return () => clearInterval(interval);
    }, [language]);
    

    const fetchUserByID = async (userId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);
        if (response.status === 200) setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = () => {
      cookies.remove("authToken", { path: "/" });
      navigate("/login");
    };

    if (loading) return <Loading />;

    return (
      <div className={`grid grid-cols-2 px-2 py-2 border-none font-prompt ${user?.role === 2 ? "bg-blue" : "bg-success"}`}>
        <div>
          <p className="text-xl ml-11 font-semibold text-white">
            {translations[language].hello}, {user ? user.firstname : "Admin"}
          </p>
          <p className="text-sm text-white ml-11 font-normal">{translations[language].haveNiceDay}</p>
        </div>
        <div className="flex justify-end items-center px-2">
          <div className="border border-l-6 h-full bg-gray-600 mr-6"></div>
          <img
            className="h-12 w-12 bg-gray-500 border border-none rounded-full inline-block mr-5"
            alt="Admin Avatar"
            src={user?.image_url || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
          />
          <div className="relative">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn bg-white flex items-center">
                <div>
                  <p className="text-base">{user ? user.firstname : "Admin"}</p>
                  <p className="text-xs">{user ? user.lastname : "Admin"}</p>
                </div>
                <svg className="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 9.586l3.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-48 border border-gray-300 mt-2 z-50">
                <li><a href="/dashboard/profile" className="hover:bg-gray-100 p-2 rounded">{translations[language].profile}</a></li>
                <li><a href="/dashboard/change-password" className="hover:bg-gray-100 p-2 rounded">{translations[language].changePassword}</a></li>
                <li><a href="/settings" className="hover:bg-gray-100 p-2 rounded">{translations[language].notification}</a></li>
                <li><a className="hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={handleLogout}>{translations[language].logout}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Header;
