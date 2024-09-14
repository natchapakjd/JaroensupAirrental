import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    gender: '',
    password: '',
    date_of_birth: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    if (profileImage) form.append('profile_image', profileImage);

    try {
      const response = await axios.post('http://localhost:3000/user', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'User added successfully.',
          icon: 'success',
        });
        // Clear form after successful submission
        setFormData({
          username: '',
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          age: '',
          address: '',
          gender: '',
          password: '',
          date_of_birth: '',
        });
        setProfileImage(null);
      } else {
        throw new Error('Failed to add user.');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong. Please try again.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image:</label>
          <input
            type="file"
            name="profile_image"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue text-white hover:bg-blue py-2 px-4 rounded"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
