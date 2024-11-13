import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Import Link for navigation

const BrandContent = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/brands`);
        setBrands(response.data);
      } catch (err) {
        setError('Failed to fetch brands.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/brand/${id}`);
        setBrands(brands.filter((brand) => brand.id !== id));
        Swal.fire('Deleted!', 'Your brand has been deleted.', 'success');
      }
    } catch (err) {
      Swal.fire('Error!', 'Failed to delete brand.', 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <Link to="/dashboard/brands/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            Add Brand
          </button>
        </Link>
      </div>
      {brands.length === 0 ? (
        <p>No brands available</p>
      ) : (
        <table className="table w-full border-collapse border border-gray-300 text-center font-inter">
          <thead className='sticky-top bg-gray-200'>
            <tr>
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Name</th>
              <th className="border p-2 text-center">Description</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.brand_id}>
                <td className="border p-2 text-center">{brand.brand_id}</td>
                <td className="border p-2 text-center">{brand.name}</td>
                <td className="border p-2 text-center">{brand.description}</td>
                <td className="border p-2 text-center">
                  <Link
                    to={`/dashboard/brands/edit/${brand.brand_id}`}
                    className="btn btn-success text-white mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(brand.brand_id)}
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

export default BrandContent;
