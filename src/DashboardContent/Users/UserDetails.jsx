import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserImage from "../../ImagesComponent/UserImage";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}`);
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{user.username}'s Details</h1>
      <div className="flex items-center mb-6">
        {user.profile_image ? (
          <div className="w-24 h-24 mr-6 ">
            <UserImage userId={user.user_id} className="w-full h-full object-cover rounded-full" />
          </div>
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
        <p className="text-lg font-medium text-gray-700"><strong>Date of Birth:</strong> {user.date_of_birth}</p>
        <p className="text-lg font-medium text-gray-700"><strong>Role:</strong> {user.role}</p>
        <p className="text-lg font-medium text-gray-700"><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserDetails;
