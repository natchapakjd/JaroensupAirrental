import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from 'date-fns'; // Added date-fns for date formatting

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);
        setUser(response.data[0] || response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Please try again later.");
      }
    };

    fetchUser();
  }, [userId]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className=" mx-auto p-8 bg-white   h-screen ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{user.username}'s Details</h1>
      <div className="flex items-center mb-6">
        {user.image_url ? (
          <img
            src={`${user.image_url}`}
            alt={`${user.username}'s profile`}
            className="w-24 h-24 rounded-full mr-6"
          />
        ) : (
          <div className="w-24 h-24 mr-6 bg-gray-300 rounded-full"></div>
        )}
        <div>
          <p className="text-lg font-medium text-gray-700"><strong>Username:</strong> {user.username}</p>
          <p className="text-lg font-medium text-gray-700"><strong>First Name:</strong> {user.firstname}</p>
          <p className="text-lg font-medium text-gray-700"><strong>Last Name:</strong> {user.lastname}</p>
          <p className="text-lg font-medium text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg font-medium text-gray-700"><strong>Phone:</strong> {user.phone}</p>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-medium text-gray-700"><strong>Age:</strong> {user.age}</p>
        <p className="text-lg font-medium text-gray-700"><strong>Address:</strong> {user.address}</p>
        <p className="text-lg font-medium text-gray-700"><strong>Gender:</strong> {user.gender}</p>
        <p className="text-lg font-medium text-gray-700"><strong>Date of Birth:</strong> {format(new Date(user.date_of_birth), 'MM/dd/yyyy')}</p> {/* Improved date formatting */}
        <p className="text-lg font-medium text-gray-700"><strong>Role:</strong> {user.role}</p>
        <p className="text-lg font-medium text-gray-700"><strong>Created At:</strong> {format(new Date(user.created_at), 'MM/dd/yyyy')}</p> {/* Improved date formatting */}
      </div>
    </div>
  );
};

export default UserDetails;
