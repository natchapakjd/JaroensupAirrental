import React from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (token) {
      cookies.remove("authToken", { path: "/" });
      navigate("/login");
    }
  };
  return (
    <div>
      <div className="grid grid-cols-2 px-2 py-2 border-none font-inter bg-gray-100">
        <div>
          <p className="text-xl ml-11 font-semibold">Hello, admin</p>
          <p className="text-sm text-gray-600 ml-11 font-normal">
            Have a nice day
          </p>
        </div>
        <div className="flex justify-end items-center px-2">
          <div className="border border-l-6 h-full bg-gray-600 mr-6"></div>
          <img
            className="h-12 w-12 bg-gray-500 border rounded-full inline-block mr-5"
            alt="Admin Avatar"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
          <div className="relative">
            {/* Dropdown Menu */}
            <div className="dropdown dropdown-end ">
              <label tabIndex={0} className="btn bg-white flex items-center">
                <div>
                  <p className="text-base font-semibold">admin admin</p>
                  <p className="text-xs font-normal">admin</p>
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
                className="dropdown-content menu p-2 shadow bg-white rounded-box w-48 border border-gray-300 mt-2"
              >
                <li>
                  <a href="/profile" className="hover:bg-gray-100 p-2 rounded">
                    Profile
                  </a>
                </li>
                {/* <li>
                  <a href="/settings" className="hover:bg-gray-100 p-2 rounded">
                    Settings
                  </a>
                </li> */}
                <li>
                  <a
                    className="hover:bg-gray-100 p-2 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
