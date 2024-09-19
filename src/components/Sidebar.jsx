import React from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { MdSupervisedUserCircle } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";
import { MdTask } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { MdEngineering } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { MdBrandingWatermark } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { MdWarehouse } from "react-icons/md";
import { MdEditAttributes } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdCalculate } from "react-icons/md";
import { MdPieChart } from "react-icons/md";
import { MdOutlineListAlt } from "react-icons/md";


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
      <aside className="w-64 h-full sticky top-0 border font-inter ">
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
                <a className="text-base pl-10 flex gap-1" href="/dashboard/home">
                  <MdSpaceDashboard className="mt-1"/> Dashboard
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/user")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex  gap-1" href="/dashboard/user">
                 <MdSupervisedUserCircle className="mt-1"/> Users
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/products")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/products">
                  <MdAddShoppingCart className="mt-1"/> Products
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/tasks")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/tasks">
                  <MdTask className="mt-1"/> Tasks
                </a>
              </li>
              
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/orders")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/orders">
                  <MdOutlineListAlt className="mt-1"/> Orders
                </a>
              </li>
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/payments")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/payments">
                <MdPayments  className="mt-1"/>
                Payments
                </a>
              </li>
                
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/applicants")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/applicants">
                  <MdEngineering className="mt-1"/>Applicants
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/analytics")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/analytics">
                  <MdPieChart className="mt-1"/>Analytics
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/categories")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/categories">
                  <MdCategory className="mt-1"/> Categories
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/brands")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/brands">
                  <MdBrandingWatermark className="mt-1"/> Brands
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/attributes")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/attributes">
                  <MdEditAttributes className="mt-1"/>Attributes
                </a>
              </li>

              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/warehouses")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/warehouses">
                 <MdWarehouse className="mt-1"/> Warehouses
                </a>
              </li>
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/reviews")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/reviews">
                <MdRateReview className="mt-1"/>
                Reviews
                </a>
              </li>
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/augmented-reality")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/augmented-reality">
                <MdCalculate className="mt-1"/>
                Area calculation
                </a>
              </li>
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/history-log")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/history-log">
                <MdHistory className="mt-1"/>
                History Log
                </a>
              </li>
            </ul>

           

            <ul className="mt-48">
              <li
                className={`mb-10 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/settings")
                    ? "bg-gray-300 text-gray-800 mx-5 px-4 py-3 rounded-lg"
                    : "bg-gray-100 text-gray-600 mx-5 px-4 py-3 rounded-lg"
                }`}
              >
                <a className="text-base pl-10 flex gap-1" href="/dashboard/settings">
                 <MdOutlineSettings className="mt-1"/> Settings
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
