import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/categories', formData);
      if (response.status === 201) {
        Swal.fire({
          title: 'Category added successfully',
          icon: 'success',
        });
        setFormData({
          name: "",
          description: ""
        });
        setTimeout(() => {
          navigate('/dashboard/categories');
        }, 800);
      } else {
        throw new Error('Failed to add category.');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-screen" >
      <h1 className="text-2xl font-semibold mb-6">Add New Category</h1>
      <div></div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Add Category
        </button>
      </form>

    </div>
  );
};

export default AddCategory;
