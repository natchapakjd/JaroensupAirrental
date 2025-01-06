import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Navbar = () => {
  const cookies = new Cookies();
  const [isToggle, setIsToggle] = useState(false);
  const [userId, setUserId] = useState();
  const [image, setImage] = useState(null); // Start as null
  const token = cookies.get("authToken");
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsToggle(!isToggle);
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      fetchUserByID(decodedToken.id);
    }
  }, [token]);

  const handleLogout = () => {
    cookies.remove("authToken", { path: "/" });
    navigate("/login");
  };

  const fetchUserByID = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
      );
      if (response.status === 200) {
        setImage(response.data.image_url);
      }
    } catch (err) {
      console.error("Error fetching user image:", err);
      setImage(null);
    }
  };

  return (
    <nav>
      <div className="navbar bg-white text-black font-prompt ">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex="0"
              role="button"
              className="btn btn-ghost lg:hidden"
              onClick={toggleNavbar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {isToggle && (
              <ul
                tabIndex="0"
                className="menu menu-sm dropdown-content bg-white text-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/">หน้าหลัก</Link>
                </li>
                <li>
                  <Link to="/product">สินค้า</Link>
                </li>
                <li>
                  <Link to="/services">บริการของเรา</Link>
                </li>
                <li>
                  <Link to="/experience">ผลงานของเรา</Link>
                </li>
                <li>
                    <Link to="/register-tech">ร่วมงานกับเรา</Link>
                  </li>
                <li>
                  <Link to="/contact">ติดต่อเรา</Link>
                </li>
                <li>
                  <Link to="/test-xr-gallary">AR Feature</Link>
                </li>
              </ul>
            )}
          </div>
          <a className="btn btn-ghost text-xl">Jaroensup</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">หน้าหลัก</Link>
            </li>
            <li>
              <Link to="/product">สินค้า</Link>
            </li>
            <li className="z-40">
              <a href="/services">บริการของเรา</a>
            </li>
            <li>
              <Link to="/experience">ผลงานของเรา</Link>
            </li>
            <li>
              <Link to="/register-tech">ร่วมงานกับเรา</Link>
            </li>
            <li>
              <Link to="/contact">ติดต่อเรา</Link>
            </li>
            <li>
                  <Link to="/test-xr-gallary">AR Feature</Link>
                </li>
          </ul>
        </div>
        <div className="navbar-end ">
          <li className="list-none ">
            {!token && (
              <Link to="/login" className="text-sm md:text-base">
                สมัครสมาชิก/เข้าสู่ระบบ
              </Link>
            )}
          </li>
          {token && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={toggleNavbar}
              >
                <div className="w-10 rounded-full">
                  {image ? (
                    <img alt="User Avatar" src={`${image}`} />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">?</span>{" "}
                      {/* Fallback UI */}
                    </div>
                  )}
                </div>
              </div>
              {isToggle && (
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow bg-white text-black"
                >
                  <li>
                    <a className="justify-between" href="/profile-setting">
                      โปรไฟล์
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a href="/history">ประวัติ</a>
                  </li>
                  <li>
                    <a href="/change-password">เปลี่ยนรหัสผ่าน</a>
                  </li>
                  <li>
                    <a href="/settings">การแจ้งเตือน</a>
                  </li>
                  <li>
                    <a onClick={handleLogout}>ออกจากระบบ</a>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
