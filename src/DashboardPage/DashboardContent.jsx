import React from 'react';
import { Link } from 'react-router-dom';

const DashboardContent = () => {
  return (
    <div className="p-8 bg-white min-h-screen font-inter">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Admin!</h1>
        <p className="text-gray-600 mt-2">Here is a quick overview of your dashboard.</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Products</h2>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
          </div>
          <div className="bg-blue text-white p-4 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
            <p className="text-2xl font-bold text-gray-900">567</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-2xl font-bold text-gray-900">$12,345</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/dashboard/products" className="bg-blue text-white p-4 rounded-lg shadow-lg text-center hover:bg-blue">
            <h3 className="text-xl font-semibold">Manage Products</h3>
            <p className="mt-2">View and manage all your products.</p>
          </Link>
          <Link to="/dashboard/orders" className="bg-green-500 text-white p-4 rounded-lg shadow-lg text-center hover:bg-green-600">
            <h3 className="text-xl font-semibold">View Orders</h3>
            <p className="mt-2">See all recent orders and their status.</p>
          </Link>
          <Link to="/dashboard/analytics" className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg text-center hover:bg-yellow-600">
            <h3 className="text-xl font-semibold">View Analytics</h3>
            <p className="mt-2">Analyze sales and performance data.</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul>
          <li className="border-b border-gray-200 py-2">
            <p className="font-semibold text-gray-700">New Order #12345</p>
            <p className="text-gray-600">Placed on September 15, 2024</p>
          </li>
          <li className="border-b border-gray-200 py-2">
            <p className="font-semibold text-gray-700">Product XYZ Updated</p>
            <p className="text-gray-600">Updated on September 14, 2024</p>
          </li>
          <li className="border-b border-gray-200 py-2">
            <p className="font-semibold text-gray-700">New Product Added</p>
            <p className="text-gray-600">Added on September 13, 2024</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
