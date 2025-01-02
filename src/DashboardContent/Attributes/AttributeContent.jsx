import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AttributeContent = () => {
  const [attributes, setAttributes] = useState([]);
  const [filteredAttributes, setFilteredAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  // Fetch attributes whenever currentPage changes
  useEffect(() => {
    fetchAttributes();
  }, [currentPage]);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/attributes-paging`,
        {
          params: { page: currentPage, limit: rowsPerPage },
        }
      );
      setTotalPages(response.data.total.totalPages);
      const { data } = response.data;
      const sortedAttributes = data.sort((a, b) => a.attribute_id - b.attribute_id);
      setAttributes(sortedAttributes);
      setFilteredAttributes(sortedAttributes); // Initialize filteredAttributes
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
          fetchAttributes(); // Refetch attributes after deletion
        } else {
          throw new Error('Failed to delete attribute.');
        }
      }
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAttributes(
      attributes.filter((attribute) =>
        attribute.name.toLowerCase().includes(term)
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Attributes</h1>
        <Link to="/dashboard/attributes/add">
          <button className="btn bg-blue text-white hover:bg-blue">Add Attribute</button>
        </Link>
      </div>

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by attribute name..."
          className="input input-bordered w-full"
        />
      </div>

      {filteredAttributes.length === 0 ? (
        <p>No attributes available</p>
      ) : (
        <>
          <table className="table w-full border-collapse border border-gray-300 text-center">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">ID</th>
                <th className="border p-2 text-center">Name</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributes.map(attribute => (
                <tr key={attribute.attribute_id}>
                  <td className="border p-2 text-center">{attribute.attribute_id}</td>
                  <td className="border p-2 text-center">{attribute.name}</td>
                  <td className="border p-2 text-center">
                    <Link
                      to={`/dashboard/attributes/edit/${attribute.attribute_id}`}
                      className="btn btn-success text-white mr-2"
                    >
                      Edit
                    </Link>
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

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <p
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`cursor-pointer ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
              style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
            >
              Previous
            </p>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <p
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
              style={{ pointerEvents: currentPage === totalPages ? "none" : "auto" }}
            >
              Next
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AttributeContent;
