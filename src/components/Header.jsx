import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = cookies.get("authToken");


  const handleLogout = () => {
    if (token) {
      cookies.remove("authToken", { path: "/" });
      navigate("/login");
    }
  };

  useEffect(() => {
    if (token) {
      const decodeToken = jwtDecode(token)
      fetchUserByID(decodeToken.id);
    }
  }, [token]);

  const fetchUserByID = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Error fetching user image:", err);
      setUser(null); // Reset user state on error
    }
  };

  return (
    <div className="grid grid-cols-2 px-2 py-2 border-none font-inter bg-gray-100">
      <div>
        <p className="text-xl ml-11 font-semibold">Hello, {user ? user.firstname : 'admin'}</p>
        <p className="text-sm text-gray-600 ml-11 font-normal">Have a nice day</p>
      </div>
      <div className="flex justify-end items-center px-2">
        <div className="border border-l-6 h-full bg-gray-600 mr-6"></div>
        <img
          className="h-12 w-12 bg-gray-500 border rounded-full inline-block mr-5"
          alt="Admin Avatar"
          src={user && user.image_url ? user.image_url : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
        />
        <div className="relative">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn bg-white flex items-center">
              <div>
                <p className="text-base ">{user ? user.firstname  : 'admin'}</p>
                <p className="text-xs ">{user ? user.lastname  : 'admin'}</p>
              </div>
              <svg
                className="h-5 w-5 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 9.586l3.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-white rounded-box w-48 border border-gray-300 mt-2 z-50"
            >
              <li>
                <a href="/dashboard/profile" className="hover:bg-gray-100 p-2 rounded">
                  Profile
                </a>
              </li>
              <li>
                <a href="/dashboard/change-password" className="hover:bg-gray-100 p-2 rounded">
                  Change password
                </a>
              </li>
              <li>
                <a href="/line-profile" className="hover:bg-gray-100 p-2 rounded">
                  Notification
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-100 p-2 rounded" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
