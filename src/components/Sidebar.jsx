import React from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const [role, setRole] = useState("");

  useEffect(() => {
    decodedToken();
  });
  const isActive = (path) => {
    const location = useLocation();
    return location.pathname.startsWith(path);
  };
  const decodedToken = () => {
    const decodeToken = jwtDecode(token);
    setRole(decodeToken.role);
  };

  return (
    <div>
      <aside className="w-64 h-screen sticky top-0 border font-inter ">
        <div className="relative ">
          <p className="text-xl font-semibold mt-8 ml-10 mr-26 mb-9 ">
            Jaroensup
          </p>
          <hr className="w-4/5 mx-auto" />
          <div className="flex flex-col  w-full text-gray ">
            <ul className="flex flex-col  pt-10 w-full">
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/home")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/home">
                  Dashboard
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/user")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/user">
                  Users
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/products")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/products">
                  Products
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/tasks")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/tasks">
                  Tasks
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/categories")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/categories">
                  Categories
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/brands")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/brands">
                  Brands
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/attributes")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/attributes">
                  Attributes
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/warehouses")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/warehouses">
                  Warehouses
                </a>
              </li>
            </ul>

            <ul>
              <li
                className={`mb-10 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/settings")
                    ? "bg-gray-300 text-gray-800 mx-5 px-4 py-3 rounded-lg"
                    : "bg-gray-100 text-gray-600 mx-5 px-4 py-3 rounded-lg"
                }`}
              >
                <a className="text-base pl-10" href="/dashboard/settings">
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
