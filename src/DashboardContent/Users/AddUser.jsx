import React, { useState, useEffect } from 'react';
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
    gender_id: '', // Changed from 'gender' to 'gender_id'
    password: '',
    date_of_birth: '',
    role_id: '', 
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]); // State for genders

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/roles`);
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch roles.',
          icon: 'error',
        });
      }
    };

    fetchRoles();
  }, []);

  // Fetch genders from API
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/genders`);
        setGenders(response.data);
      } catch (error) {
        console.error('Error fetching genders:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch genders.',
          icon: 'error',
        });
      }
    };

    fetchGenders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    if (profileImage) form.append('profile_image', profileImage);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials : true
      });

      if (response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'User added successfully.',
          icon: 'success',
        });
        setFormData({
          username: '',
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          age: '',
          address: '',
          gender_id: '', // Reset gender_id
          password: '',
          date_of_birth: '',
          role_id: '',
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
    } finally {
      setLoading(false);
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
            pattern="^[a-zA-Z0-9_-]{3,20}$"
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
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
            pattern="^\d{10}$"
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
            min="18"
            max="100"
            title="Age must be between 18 and 100."
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
            name="gender_id"
            value={formData.gender_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            {genders.map((gender) => (
              <option key={gender.gender_id} value={gender.gender_id}>
                {gender.gender_name}
              </option>
            ))}
          </select>
        </div>
        {/* Password */}

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
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role:</label>
          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image:</label>
          <input
            type="file"
            name="profile_image"
            onChange={handleFileChange}
            className=" file-input file-input-bordered w-full h-10"          />
        </div>
        <button
          type="submit"
          className={`bg-blue text-white hover:bg-blue py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
