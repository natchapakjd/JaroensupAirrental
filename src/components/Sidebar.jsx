import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import {
  MdManageAccounts,
  MdSpaceDashboard,
  MdAddShoppingCart,
  MdTask,
  MdPayments,
  MdEngineering,
  MdPieChart,
  MdCategory,
  MdBrandingWatermark,
  MdEditAttributes,
  MdWarehouse,
  MdRateReview,
  MdCalculate,
  MdHistory,
  MdOutlineSettings,
  MdOutlineMenu,
} from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { IoReorderFour } from "react-icons/io5";

const Sidebar = () => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const [role, setRole] = useState("");
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCloseSidebar, setIsCloseSidebar] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const translations = {
    en: {
      dashboard: "Dashboard",
      tasks: "Tasks",
      borrowing: "Borrowing",
      products: "Products",
      orders: "Orders",
      users: "Users",
      payments: "Payments",
      applicants: "Applicants",
      analytics: "Analytics",
      categories: "Categories",
      brands: "Brands",
      attributes: "Attributes",
      warehouses: "Warehouses",
      reviews: "Reviews",
      areaCalculation: "Area Calculation",
      historyLog: "History Log",
      settings: "Settings",
      jaroensup: "Jaroensup",
    },
    th: {
      dashboard: "แดชบอร์ด",
      tasks: "งานเช่า",
      borrowing: "การยืม",
      products: "สินค้า",
      orders: "คำสั่งซื้อ",
      users: "ผู้ใช้งาน",
      payments: "การชำระเงิน",
      applicants: "ผู้สมัคร",
      analytics: "การวิเคราะห์",
      categories: "หมวดหมู่",
      brands: "แบรนด์",
      attributes: "คุณลักษณะ",
      warehouses: "คลังสินค้า",
      reviews: "การรีวิว",
      areaCalculation: "การคำนวณพื้นที่",
      historyLog: "ประวัติการดำเนินการ",
      settings: "การตั้งค่า",
      jaroensup: "เจริญทรัพย์",
    },
  };

  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    handleResize(); // เรียกใช้ฟังก์ชันตอนโหลดครั้งแรก
  
    // ฟังค์ชันสำหรับ Event Listener เวลาเปลี่ยนขนาดหน้าจอ
    window.addEventListener("resize", handleResize);
  
    // ลบ Event Listener เมื่อ Component ถูกทำลาย
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedLanguage = localStorage.getItem("language") || "en";
      if (storedLanguage !== currentLanguage) {
        setCurrentLanguage(storedLanguage); // Update to the new language from localStorage
      }
    }, 500);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentLanguage]); // This effect runs whenever the currentLanguage state changes

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
    }
  }, []);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleResize = () => {
    if (window.innerWidth >= 968) {
      setIsSidebarOpen(true); // ถ้าหน้าจอเกิน 968px ให้เปิด Sidebar
    } else {
      setIsSidebarOpen(false); // ถ้าหน้าจอเล็กกว่า 968px ให้ปิด Sidebar
    }
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      // Start fading out
      setIsFadingOut(true);
      // Wait for fade-out duration before closing
      setTimeout(() => {
        setIsSidebarOpen(false);
        setIsFadingOut(false); // Reset fading state
      }, 300); // Match the duration of Tailwind transition
    } else {
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebarArrow = () => {
    setIsCloseSidebar(!isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-16 left-5 z-10 bg-blue text-white p-3 rounded-full lg:hidden"
        >
          <MdOutlineMenu className="text-xl" />
        </button>
      )}

      <aside
        className={`w-64 h-full sticky top-8 border font-prompt min-h-screen transition-all duration-300 
    ${isSidebarOpen ? "block" : "hidden"} 
    ${isSidebarOpen && !isFadingOut ? "opacity-100" : "opacity-0"}`}
      >
        <div className="relative">
          <div className="flex justify-between">
            <p className="text-xl font-semibold mt-8 ml-10 mr-26 mb-9">
              {translations[currentLanguage].jaroensup}
            </p>
            <div className="flex items-center mx-2">
              <FaArrowRight
                onClick={toggleSidebarArrow}
                className="cursor-pointer lg:hidden"
              />
            </div>
          </div>

          <hr className="w-4/5 mx-auto" />
          <div className="flex flex-col w-full text-gray sticky">
            <ul className="flex flex-col pt-10 w-full">
              <li
                className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                  isActive("/dashboard/home")
                    ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                    : null
                }`}
              >
                <a
                  className="text-base pl-10 flex gap-1"
                  href="/dashboard/home"
                >
                  <MdSpaceDashboard className="mt-1" />{" "}
                  {translations[currentLanguage].dashboard}
                </a>
              </li>

              {role === 3 && (
                <>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/tasks")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/tasks"
                    >
                      <MdTask className="mt-1" />{" "}
                      {translations[currentLanguage].tasks}
                    </a>
                  </li>

                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/borrows")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/borrows"
                    >
                      <MdTask className="mt-1" />{" "}
                      {translations[currentLanguage].borrowing}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/products")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/products"
                    >
                      <MdAddShoppingCart className="mt-1" />{" "}
                      {translations[currentLanguage].products}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/orders")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/orders"
                    >
                      <IoReorderFour className="mt-1" />{" "}
                      {translations[currentLanguage].orders}
                    </a>
                  </li>

                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/user")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/user"
                    >
                      <MdManageAccounts className="mt-1" />{" "}
                      {translations[currentLanguage].users}
                    </a>
                  </li>

                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/payments")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/payments"
                    >
                      <MdPayments className="mt-1" />{" "}
                      {translations[currentLanguage].payments}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/applicants")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/applicants"
                    >
                      <MdEngineering className="mt-1" />{" "}
                      {translations[currentLanguage].applicants}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/analytics")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/analytics"
                    >
                      <MdPieChart className="mt-1" />{" "}
                      {translations[currentLanguage].analytics}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/categories")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/categories"
                    >
                      <MdCategory className="mt-1" />{" "}
                      {translations[currentLanguage].categories}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/brands")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/brands"
                    >
                      <MdBrandingWatermark className="mt-1" />{" "}
                      {translations[currentLanguage].brands}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/attributes")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/attributes"
                    >
                      <MdEditAttributes className="mt-1" />{" "}
                      {translations[currentLanguage].attributes}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/warehouses")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/warehouses"
                    >
                      <MdWarehouse className="mt-1" />{" "}
                      {translations[currentLanguage].warehouses}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/reviews")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/reviews"
                    >
                      <MdRateReview className="mt-1" />{" "}
                      {translations[currentLanguage].reviews}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/area-cal")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/area-cal"
                    >
                      <MdCalculate className="mt-1" />{" "}
                      {translations[currentLanguage].areaCalculation}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/history-log")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/history-log"
                    >
                      <MdHistory className="mt-1" />{" "}
                      {translations[currentLanguage].historyLog}
                    </a>
                  </li>
                  
                  {/* <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/settings")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/settings"
                    >
                      <MdOutlineSettings className="mt-1" />{" "}
                      {translations[currentLanguage].settings}
                    </a>
                  </li> */}
                </>
              )}

              {role === 2 && (
                <>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/tasks")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/tasks"
                    >
                      <MdTask className="mt-1" />{" "}
                      {translations[currentLanguage].tasks}
                    </a>
                  </li>

                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/borrows")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/borrows"
                    >
                      <MdTask className="mt-1" />{" "}
                      {translations[currentLanguage].borrowing}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/products")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/products"
                    >
                      <MdAddShoppingCart className="mt-1" />{" "}
                      {translations[currentLanguage].products}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/reviews")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/reviews"
                    >
                      <MdRateReview className="mt-1" />{" "}
                      {translations[currentLanguage].reviews}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/area-cal")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/area-cal"
                    >
                      <MdCalculate className="mt-1" />{" "}
                      {translations[currentLanguage].areaCalculation}
                    </a>
                  </li>
                  <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/history-log")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/history-log"
                    >
                      <MdHistory className="mt-1" />{" "}
                      {translations[currentLanguage].historyLog}
                    </a>
                  </li>
                  
                  {/* <li
                    className={`mb-5 hover:rounded-lg hover:py-3 hover:px-4 transition-all duration-300 hover:mx-5 ${
                      isActive("/dashboard/settings")
                        ? "bg-blue text-white mx-5 px-4 py-3 rounded-lg"
                        : null
                    }`}
                  >
                    <a
                      className="text-base pl-10 flex gap-1"
                      href="/dashboard/settings"
                    >
                      <MdOutlineSettings className="mt-1" />{" "}
                      {translations[currentLanguage].settings}
                    </a>
                  </li> */}
                </>
              )}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
