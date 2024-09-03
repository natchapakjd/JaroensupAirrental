import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";
// import Swal from "sweetalert2";
const Navbar = () => {
  const cookies = new Cookies();
  const [isToggle, setIsToggle] = useState(false);
  const token = cookies.get("authToken");
  const navigate = useNavigate();
  const toggleNavbar = () => {
    setIsToggle(!isToggle);
  };

  const handleLogout = () => {
    cookies.remove("authToken", { path: "/" });
    // Swal.fire({
    //   title: "ออกจากระบบสำเร็จ",
    //   icon: "success",
    // });
    navigate("/login");
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
            {isToggle ? (
              <ul
                tabIndex="0"
                className="menu menu-sm dropdown-content bg-white text-black rounded-box z-[1] mt-3 w-52 p-2 shadow "
              >
                <li>
                  <Link to="/">หน้าหลัก</Link>
                </li>
                <li>
                  <Link to="/product">สินค้า</Link>
                </li>
                <li>
                  <a>บริการของเรา</a>
                  <ul className="p-2">
                    <li>
                      <a>งานเช่า</a>
                    </li>
                    <li>
                      <a>งานซ่อมบำรุง</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/reward">ผลงานของเรา</Link>
                </li>
                <li>
                  <Link to="/contact">ติดต่อเรา</Link>
                </li>
              </ul>
            ) : null}
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
            <li className="z-40" >
              <details>
                <summary>บริการของเรา</summary>
                <ul className="p-2 bg-white text-black">
                  <li>
                    <a>งานเช่า</a>
                  </li>
                  <li>
                    <a>งานซ่อมบำรุง</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link to="/reward">ผลงานของเรา</Link>
            </li>
            <li>
              <Link to="/contact">ติดต่อเรา</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end ">
          <li className="list-none ">
            {!token ? (
              <Link to="/login" className="text-sm md:text-base">
                สมัครสมาชิก/เข้าสู่ระบบ
              </Link>
            ) : null}
          </li>
          {token ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={toggleNavbar}
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              {isToggle ? (
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow bg-white text-black"
                >
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
