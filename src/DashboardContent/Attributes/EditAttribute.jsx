import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';

const EditAttribute = () => {
  const navigate = useNavigate();
  const { attributeId } = useParams();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/attribute/${attributeId}`);
        if (response.status === 200) {
          setName(response.data.name);
          setIsLoadingData(false);
        }
      } catch (error) {
        Swal.fire('Error!', 'Failed to load attribute data.', 'error');
      }
    };

    fetchAttribute();
  }, [attributeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/attribute/${attributeId}`, { name });
      if (response.status === 200) {
        Swal.fire('Success!', 'Attribute updated successfully.', 'success');
        setTimeout(() => {
          navigate('/dashboard/attributes');
        }, 800);
      } else {
        throw new Error('Failed to update attribute.');
      }
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto max-w-md mt-5">
      <h1 className="text-2xl font-semibold mb-6 ">Edit Attribute</h1>
      {isLoadingData ? (
        <Loading/>
      ) : (
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
          <button
            type="submit"
            className={`btn bg-blue text-white hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Attribute'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditAttribute;
