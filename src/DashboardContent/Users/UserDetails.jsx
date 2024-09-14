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
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{user.username}'s Details</h1>
      <div>
        <div>
            {user.profile_image? <UserImage userId={user.user_id}/>:null}
        </div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>First Name:</strong> {user.firstname}</p>
        <p><strong>Last Name:</strong> {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserDetails;
