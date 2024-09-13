import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Import Link for navigation

const CategoryContent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categories]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/category/${id}`);
        setCategories(categories.filter(category => category.category_id !== id));
        Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
      }
    } catch (err) {
      Swal.fire('Error!', 'Failed to delete category.', 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link to="/dashboard/category/add">
          <button className="btn bg-blue text-white hover:bg-blue-700">
            Add Category
          </button>
        </Link>
      </div>
      {categories.length === 0 ? (
        <p>No categories available</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-center font-inter">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.category_id}>
                <td className="border border-gray-300 p-2">{category.category_id}</td>
                <td className="border border-gray-300 p-2">{category.name}</td>
                <td className="border border-gray-300 p-2">{category.description}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDelete(category.category_id)}
                    className="btn btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryContent;
