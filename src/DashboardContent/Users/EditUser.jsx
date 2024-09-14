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
  const [profileImage, setProfileImage] = useState(null); // Updated state name

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}`);
        setUser(response.data[0]);
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
    setProfileImage(e.target.files[0]); // Updated state name
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Append user data
      Object.keys(user).forEach(key => formData.append(key, user[key]));
      // Append profile image if available
      if (profileImage) {
        formData.append('profile_image', profileImage); // Corrected key to match backend
      }
      await axios.put(`http://localhost:3000/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/dashboard/user/${userId}`);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md font-inter">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit}>
        {/* Other input fields remain the same */}
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            readOnly
          />
        </div>
        {/* Updated file upload field */}
        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture:</label>
          <input
            type="file"
            name="profile_image" // Updated name attribute to match backend
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Other input fields remain the same */}
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
          className="bg-blue text-white hover:bg-blue py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUser;
