import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditBrand = () => {
  const { brandId } = useParams(); // Get brand ID from the URL
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the brand details when the component loads
    const fetchBrand = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/brand/${brandId}`);
        const brand = response.data;
        setName(brand.name);
        setDescription(brand.description);
      } catch (error) {
        Swal.fire('Error!', 'Failed to load brand details.', 'error');
      }
    };
    fetchBrand();
  }, [brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/brand/${brandId}`, {
        name,
        description,
      });
      Swal.fire('Success!', 'Brand updated successfully.', 'success');
      navigate('/dashboard/brands'); // Redirect to the brand list
    } catch (error) {
      Swal.fire('Error!', 'Failed to update brand.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto max-w-md mt-5">
      <h1 className="text-2xl font-semibold mb-6">Edit Brand</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className={`btn bg-blue text-white hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Brand'}
        </button>
      </form>
    </div>
  );
};

export default EditBrand;
