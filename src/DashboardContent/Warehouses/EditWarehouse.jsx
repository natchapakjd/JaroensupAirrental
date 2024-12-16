import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const EditWarehouse = () => {
  const { warehouseId } = useParams(); // Get the warehouse ID from the URL parameters
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/warehouse/${warehouseId}`);
        const { location, capacity } = response.data;
        setLocation(location);
        setCapacity(capacity);
      } catch (err) {
        Swal.fire('Error!', 'Failed to fetch warehouse details.', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [warehouseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/warehouse/${warehouseId}`, {
        name,
        location,
        capacity: parseInt(capacity, 10),
      });
      if (response.status === 200) {
        Swal.fire('Success!', 'Warehouse updated successfully.', 'success');
        navigate('/dashboard/warehouses'); // Redirect to the warehouses list page
      }
    } catch (err) {
      Swal.fire('Error!', 'Failed to update warehouse.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto  max-w-md mt-5">
      <h1 className="text-2xl font-semibold mb-6">Edit Warehouse</h1>
      {loading ? (
        <Loading/>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              min="0"
              step="1"
            />
          </div>
          <button
            type="submit"
            className={`btn bg-blue text-white hover:bg-blue ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Warehouse'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditWarehouse;
