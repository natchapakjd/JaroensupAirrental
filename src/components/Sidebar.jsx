import React from "react";
import { AiFillDashboard } from "react-icons/ai";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = () => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    decodedToken();
  });

  const decodedToken = () => {
    const decodeToken = jwtDecode(token);
    setRole(decodeToken.role);
  };
  const handleLogout = () => {
    if (token) {
      cookies.remove("authToken", { path: "/" });
      navigate("/login");
    }
  };
  return (
    <div>
      <aside className="w-64 h-screen sticky top-0 border font-inter ">
        <div className="relative">
          <p className="text-xl font-semibold mt-8 ml-10 mr-26 mb-9 ">
            Jaroensup
          </p>
          <hr className="w-4/5 mx-auto" />
          <div className="flex flex-col  w-full text-gray">
          <ul className="flex flex-col  pt-10 w-full">
            <li className="mb-8 hover:bg-blue hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 hover:text-white">
              <a className="text-base pl-10">
                  Dashboard
              </a>
            </li>

            <li className="mb-8 hover:bg-blue hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 hover:text-white">
            <a className="text-base pl-10">
                  Users
              </a>
            </li>


            <li className="mb-8 hover:bg-blue hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 hover:text-white">
            <a className="text-base pl-10">
                  Tasks
              </a>
            </li>


            <li className="mb-8 hover:bg-blue hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 hover:text-white">
            <a className="text-base pl-10">
                  Categories
              </a>
            </li>

          </ul>

{/* 
            {role == "admin" ? (
              <ul className="flex flex-col ml-10 mb-16">
                <li className="mb-8">
                  <a className="text-base  ">
                    <div className="flex">WareHouse</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   ">
                    <div className="flex">Product</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   ">
                    <div className="flex">Profile</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   ">
                    <div className="flex">Report</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   ">
                    <div className="flex">Guide Book</div>
                  </a>
                </li>
              </ul>
            ) : null} */}

            <ul className="flex flex-col ml-10">
              {/* <li className="mb-8">
                <a className="text-base   ">
                  <div className="flex">Setting</div>
                </a>
              </li> */}
              <li className="mb-8" onClick={handleLogout}>
                <a className="text-base   ">
                  <div className="flex">Logout</div>
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
