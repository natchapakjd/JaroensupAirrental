import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Loading from '../../components/Loading';

const WarehouseContent = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10); // You can set this to any number you want

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/warehouses-paging`,
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setWarehouses(response.data.data);
        setTotalPages(response.data.totalPages); // Set totalPages from response
      } catch (err) {
        setError('Failed to fetch warehouses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, [currentPage, rowsPerPage]); // Re-fetch when page changes

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
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/warehouse/${id}`);
        setWarehouses(warehouses.filter(warehouse => warehouse.warehouse_id !== id));
        Swal.fire('Deleted!', 'Your warehouse has been deleted.', 'success');
      }
    } catch (err) {
      Swal.fire('Error!', 'Failed to delete warehouse.', 'error');
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Warehouses</h1>
        <Link to="/dashboard/warehouses/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            Add Warehouse
          </button>
        </Link>
      </div>
      {warehouses.length === 0 ? (
        <p>No warehouses available</p>
      ) : (
        <table className="table w-full border-collapse border border-gray-300 text-center font-inter">
          <thead className="sticky-top bg-gray-200">
            <tr>
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Location</th>
              <th className="border p-2 text-center">Capacity</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map(warehouse => (
              <tr key={warehouse.warehouse_id}>
                <td className="border p-2 text-center">{warehouse.warehouse_id}</td>
                <td className="border p-2 text-center">{warehouse.location}</td>
                <td className="border p-2 text-center">{warehouse.capacity}</td>
                <td className="border p-2 text-center">
                  <Link to={`/dashboard/warehouses/edit/${warehouse.warehouse_id}`}>
                    <button className="btn btn-success text-white mr-2">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(warehouse.warehouse_id)}
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
<div className="flex justify-between mt-4">
        <p
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        >
          Previous
        </p>
        <span className="flex items-center justify-center">
          Page {currentPage} of {totalPages}
        </span>
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default WarehouseContent;
