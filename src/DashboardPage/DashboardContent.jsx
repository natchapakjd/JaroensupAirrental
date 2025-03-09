import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "../components/Loading";

const DashboardContent = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalBorrowing, setTotalBorrowing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState(null);

  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const id = decodeToken.id;
  const role = decodeToken.role;

  // Translation object
  const translation = {
    en: {
      welcomeMessage: "Welcome Back, {name}!",
      overview: "Here's a quick overview of your dashboard.",
      totalProducts: "Total Products",
      totalOrders: "Total Orders",
      totalRevenue: "Total Revenue",
      manageProducts: "Manage Products",
      viewOrders: "View Orders",
      viewAnalytics: "View Analytics",
      recentActivity: "Recent Activity",
      noRecentActivity: "No recent activity",
      taskType: "Task Type",
      status: "Status",
      seeAllProduct: "View and manage all your products.",
      seeAllRecentOrders: "See all recent orders and their status.",
      seeAllAnalysis: "Analyze sales and performance data.",
      totalBorrowingProduct: "จำนวนอุปกรณ์ที่ยืมทั้งหมด",
      totalTask: "จำนวนงานทั้งหมด",
    },
    th: {
      welcomeMessage: "ยินดีต้อนรับกลับ, {name}!",
      overview: "นี่คือภาพรวมโดยย่อของแดชบอร์ดของคุณ",
      totalProducts: "ผลิตภัณฑ์ทั้งหมด",
      totalOrders: "จำนวนคำสั่งซื้อ",
      totalRevenue: "รายได้รวม",
      manageProducts: "จัดการผลิตภัณฑ์",
      viewOrders: "ดูคำสั่งซื้อ",
      viewAnalytics: "ดูข้อมูลเชิงลึก",
      recentActivity: "กิจกรรมล่าสุด",
      noRecentActivity: "ไม่มีการทำกิจกรรมล่าสุด",
      taskType: "ประเภทงาน",
      status: "สถานะ",
      seeAllProduct: "ดูและจัดการสินค้าทั้งหมด",
      seeAllRecentOrders: "ดูคำสั่งซื้อล่าสุดและสถานะของพวกมัน",
      seeAllAnalysis: "วิเคราะห์ข้อมูลการขายและประสิทธิภาพ",
      totalBorrowingProduct: "Total Borrowing Product",
      totalTask: "Total Task",
    },
    // You can add more languages here.
  };

  // Fetch the language from localStorage (default to 'en')
  const language = localStorage.getItem("language") || "en";
  const t = translation[language] || translation["en"]; // fallback to 'en' if language not found

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ดึงข้อมูลจำนวนสินค้าทั้งหมด
        const productResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products/count`
        );
  
        // ดึงข้อมูลจำนวนคำสั่งซื้อทั้งหมด
        const orderResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/v2/orders/count`
        );
  
        // ดึงข้อมูลรายได้รวม
        const revenueResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/payments-sum/total`
        );
  
        // ถ้า role == 2 ให้ fetch ข้อมูล task และ borrowing
        if (role === 2) {
          try {
            const taskResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/tasks/count/${id}`
            );
            setTotalTasks(taskResponse.data.total_tasks || 0);
          } catch (error) {
            console.error("Error fetching tasks count:", error);
            setTotalTasks(0);
          }
        
          try {
            const borrowResponse = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/user-borrowing-counts/${id}`
            );
            setTotalBorrowing(borrowResponse.data.borrow_count || 0);
          } catch (error) {
            console.error("Error fetching borrow count:", error);
            setTotalBorrowing(0);
          }
        }
  
        // อัปเดต state
        setTotalProducts(productResponse.data.count || 0);
        setTotalOrders(orderResponse.data.totalOrders || 0);
        setTotalRevenue(revenueResponse.data.total_amount || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    const fetchRecentActivity = async () => {
      try {
        let activityResponse;
  
        if (role === 2) {
          // ถ้าเป็น Role 2 ให้ดึงเฉพาะงานของ user
          activityResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/tasks/top3/${id}`
          );
        } else if (role === 3) {
          // ถ้าเป็น Role 3 ให้ดึงงานทั้งหมด
          activityResponse = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/tasks/top3`
          );
        }
  
        setRecentActivity(activityResponse.data.tasks || []);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };
  
    const fetchUserByID = async (userId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
        );
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };
  
    if (id) {
      fetchUserByID(id);
      fetchDashboardData();
      fetchRecentActivity();
    }
  }, [id, role]);
  

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-prompt">
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          {t.welcomeMessage.replace(
            "{name}",
            user ? `${user.firstname} ${user.lastname}` : "User"
          )}
        </h1>
        <p className="text-gray-500 mt-2">{t.overview}</p>
      </div>

      {/* Stats Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all hover:scale-105 hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold">{t.totalProducts}</h2>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>
          <div className="bg-white text-custom p-4 rounded-full">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all hover:scale-105 hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold">
              {role === 2 ? <>Total Borrowing Product</> : <>{t.totalOrders}</>}
            </h2>
            <p className="text-3xl font-bold">
              {role === 2 ? totalBorrowing : totalOrders}
            </p>
          </div>
          <div className="bg-white text-green-600 p-4 rounded-full">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all hover:scale-105 hover:shadow-2xl">
          <div>
            <h2 className="text-xl font-semibold">
              {role === 2 ? <>Total Task</> : <>{t.totalRevenue}</>}
            </h2>
            <p className="text-3xl font-bold">
              {role === 2 ? totalTasks : totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white text-red-600 p-4 rounded-full">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {t.quickLinks}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/dashboard/products"
            className="bg-blue text-white p-4 rounded-lg shadow-lg text-center transition-all hover:bg-blue hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold">{t.manageProducts}</h3>
            <p className="mt-2">{t.seeAllProduct}</p>
          </Link>
          <Link
            to={role === 2 ? "/dashboard/borrows" : "/dashboard/orders"}
            className="bg-green-600 text-white p-4 rounded-lg shadow-lg text-center transition-all hover:bg-green-700 hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold">
              {role === 2 ? "Manage Borrowing Product" : t.viewOrders}
            </h3>
            <p className="mt-2">
              {role === 2 ? "See all your Borrowing product." : t.seeAllProduct}
            </p>
          </Link>

          <Link
            to={role === 2 ? "/dashboard/tasks" : "/dashboard/analytics"}
            className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg text-center transition-all hover:bg-yellow-600 hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold">
              {role === 2 ? "Manage Task" : t.viewAnalytics}
            </h3>
            <p className="mt-2">
              {role === 2 ? "View and manage your tasks." : t.seeAllProduct}
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {t.recentActivity}
        </h2>
        <ul className="divide-y divide-gray-200">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <li
                key={index}
                className="py-4 flex items-center gap-4 hover:bg-gray-50 rounded-lg p-3 transition"
              >
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 text-lg">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.taskType}: {activity.task_type_id}
                    <span className="text-blue-600 font-medium">
                      {activity.type_name}
                    </span>{" "}
                    | {t.status}:
                    <span
                      className={`font-medium ${
                        activity.status_id === 1
                          ? "text-yellow-500"
                          : activity.status_id === 2
                            ? "text-green-500"
                            : "text-red-500"
                      }`}
                    >
                      {activity.status_name}
                    </span>
                  </p>
                  <Link
                    to={
                      activity.task_type_id === 11
                        ? `/dashboard/borrows/details/${activity.task_id}`
                        : `/dashboard/tasks/${activity.task_id}`
                    }
                    className="text-blue-500 hover:underline mt-2 inline-block"
                  >
                    ดูรายละเอียดงาน
                  </Link>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center py-4">
              {t.noRecentActivity}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
