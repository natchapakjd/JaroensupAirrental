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
      <aside className="w-64 h-screen sticky top-0 border bg-gray-100 text-black">
        <div className="relative">
          <p className="text-xl font-bold mt-8 ml-10 mr-26 mb-14 ">Jaroensup</p>
          <div className="flex flex-col  w-full ">
            <ul className="flex flex-col  ml-10 mb-16">
              <li className="mb-8 ">
                <a className="text-base font-semibold"></a>
              </li>

              <li className="mb-8">
                <a className="text-base font-semibold">
                  <div className="flex">
                    {/* <AiFillDashboard classNameName="mt-1" />  */}Dashboard
                  </div>
                </a>
              </li>

              <li className="mb-8">
                <a className="text-base   font-semibold"> Users</a>
              </li>
              <li className="mb-8">
                <a className="text-base  font-semibold">
                  <div className="flex">Tasks</div>
                </a>
              </li>
              <li className="mb-8">
                <a className="text-base   font-semibold">
                  <div className="flex">Categories</div>
                </a>
              </li>
            </ul>

            {role == "admin" ? (
              <ul className="flex flex-col ml-10 mb-16">
                <li className="mb-8">
                  <a className="text-base  font-semibold">
                    <div className="flex">WareHouse</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   font-semibold">
                    <div className="flex">Product</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   font-semibold">
                    <div className="flex">Profile</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   font-semibold">
                    <div className="flex">Report</div>
                  </a>
                </li>
                <li className="mb-8">
                  <a className="text-base   font-semibold">
                    <div className="flex">Guide Book</div>
                  </a>
                </li>
              </ul>
            ) : null}

            <ul className="flex flex-col ml-10">
              <li className="mb-8">
                <a className="text-base   font-semibold">
                  <div className="flex">Setting</div>
                </a>
              </li>
              <li className="mb-8" onClick={handleLogout}>
                <a className="text-base   font-semibold">
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
