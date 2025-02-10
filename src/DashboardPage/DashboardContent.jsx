import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/Loading';

const DashboardContent = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  const cookies = new Cookies();
  const [user, setUser] = useState(null);
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const id = decodeToken.id;
  const role = decodeToken.role;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const productResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products/count`);
        const orderResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/v2/orders/count`);
        const revenueResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/payments-sum/total`);
        setTotalProducts(productResponse.data.count || 0);
        setTotalOrders(orderResponse.data.totalOrders || 0);
        setTotalRevenue(revenueResponse.data.total_amount || 0);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }


    };

    const fetchRecentActivity = async () => {
      try {
        const activityResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/tasks/top3`
        );
        setRecentActivity(activityResponse.data.tasks || []);
        console.log("Recent Activity Data:", activityResponse.data.tasks);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };
    
    fetchRecentActivity();
    fetchUserByID(id);
    fetchDashboardData();
  },[]);

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
  
  if(loading){
    return <Loading/>
  }
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome Back, {user ? `${user.firstname} ${user.lastname}` : 'User'}!
        </h1>
        <p className="text-gray-500 mt-2">Here's a quick overview of your dashboard.</p>
      </div>

        <div>
          {/* Stats Overview Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all hover:scale-105 hover:shadow-2xl">
              <div>
                <h2 className="text-xl font-semibold">Total Products</h2>
                <p className="text-3xl font-bold">{totalProducts}</p>
              </div>
              <div className="bg-white text-custom p-4 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all hover:scale-105 hover:shadow-2xl">
              <div>
                <h2 className="text-xl font-semibold">Total Orders</h2>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </div>
              <div className="bg-white text-green-600 p-4 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-all hover:scale-105 hover:shadow-2xl">
              <div>
                <h2 className="text-xl font-semibold">Total Revenue</h2>
                <p className="text-3xl font-bold">{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white text-red-600 p-4 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/dashboard/products" className="bg-blue text-white p-4 rounded-lg shadow-lg text-center transition-all hover:bg-blue hover:shadow-xl">
                <h3 className="text-xl font-semibold">Manage Products</h3>
                <p className="mt-2">View and manage all your products.</p>
              </Link>
              <Link to="/dashboard/orders" className="bg-green-600 text-white p-4 rounded-lg shadow-lg text-center transition-all hover:bg-green-700 hover:shadow-xl">
                <h3 className="text-xl font-semibold">View Orders</h3>
                <p className="mt-2">See all recent orders and their status.</p>
              </Link>
              <Link to="/dashboard/analytics" className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg text-center transition-all hover:bg-yellow-600 hover:shadow-xl">
                <h3 className="text-xl font-semibold">View Analytics</h3>
                <p className="mt-2">Analyze sales and performance data.</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity Section */}
           <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
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
              Task Type:{activity.task_type_id}
              <span className="text-blue-600 font-medium">
                {activity.type_name}
              </span>{" "}
              | Status:{activity.status_id}
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
          </div>
        </li>
      ))
    ) : (
      <li className="text-gray-500 text-center py-4">No recent activity</li>
    )}
  </ul>
      </div>
        </div>
    </div>
  );
};

export default DashboardContent;
