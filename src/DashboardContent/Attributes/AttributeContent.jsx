import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AttributeContent = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/attributes`);
      const sortedAttributes = response.data.sort((a, b) => a.attribute_id - b.attribute_id);
      setAttributes(sortedAttributes);
    } catch (error) {
      setError('Failed to fetch attributes.');
      console.error('Error fetching attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attributeId) => {
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
        const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/attribute/${attributeId}`);
        if (response.status === 200) {
          Swal.fire('Deleted!', 'Attribute has been deleted.', 'success');
          fetchAttributes();
        } else {
          throw new Error('Failed to delete attribute.');
        }
      }
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Attributes</h1>
        <Link to="/dashboard/attribute/add">
          <button className="btn bg-blue text-white hover:bg-blue">Add Attribute</button>
        </Link>
      </div>
      <table className="w-full border-collapse border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map(attribute => (
            <tr key={attribute.attribute_id}>
              <td className="border border-gray-300 p-2">{attribute.attribute_id}</td>
              <td className="border border-gray-300 p-2">{attribute.name}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleDelete(attribute.attribute_id)}
                  className="btn btn-error text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeContent;
