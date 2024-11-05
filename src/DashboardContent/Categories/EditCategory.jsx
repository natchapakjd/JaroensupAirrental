import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Get the category categoryId from the URL
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/category/${categoryId}`);
        setFormData({
          name: response.data.name,
          description: response.data.description
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch category data.',
          icon: 'error',
        });
      }
    };

    fetchCategory();
  }, [categoryId]);

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
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/category/${categoryId}`, formData);
      if (response.status === 200) {
        Swal.fire({
          title: 'Category updated successfully',
          icon: 'success',
        });
        setTimeout(() => {
          navigate('/dashboard/categories');
        }, 800);
      } else {
        throw new Error('Failed to update category.');
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
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-screen">
      <h1 className="text-2xl font-semibold mb-6">Edit Category</h1>
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
          className="text-white bg-blue hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
