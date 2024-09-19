import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    gender: '',
    date_of_birth: '',
  });
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false); // Added submit loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const formData = new FormData();
      Object.keys(user).forEach(key => formData.append(key, user[key]));
      if (profileImage) formData.append('profile_image', profileImage);

      await axios.put(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/dashboard/user/${userId}`);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md font-inter">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
            readOnly
          />
        </div>
        {/* Profile Image */}
        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture:</label>
          <input
            type="file"
            name="profile_image"
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700">First Name:</label>
          <input
            type="text"
            name="firstname"
            value={user.firstname}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700">Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700">Gender:</label>
          <select
            name="gender"
            value={user.gender}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={user.date_of_birth}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue text-white hover:bg-blue py-2 px-4 rounded ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={submitLoading}
        >
          {submitLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
