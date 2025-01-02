import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Import Link for navigation
import Loading from "../../components/Loading";

const BrandContent = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]); // Add filtered brands state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10); // You can set this to any number you want
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/brands-paging`,
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setBrands(response.data.data);
        setFilteredBrands(response.data.data); // Initialize filtered brands with all brands
        setTotalPages(response.data.total.totalPages);
      } catch (err) {
        setError("Failed to fetch brands.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [currentPage, rowsPerPage]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/brand/${id}`);
        setBrands(brands.filter((brand) => brand.brand_id !== id));
        setFilteredBrands(filteredBrands.filter((brand) => brand.brand_id !== id)); // Update filtered brands
        Swal.fire("Deleted!", "Your brand has been deleted.", "success");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to delete brand.", "error");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent going out of bounds
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredBrands(
      brands.filter((brand) =>
        brand.name.toLowerCase().includes(term) // Filter brands by name
      )
    );
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <Link to="/dashboard/brands/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            Add Brand
          </button>
        </Link>
      </div>
      
      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by brand name..."
          className="input input-bordered w-full"
        />
      </div>

      {filteredBrands.length === 0 ? (
        <p>No brands available</p>
      ) : (
        <>
          <table className="table w-full border-collapse border border-gray-300 text-center font-inter">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">ID</th>
                <th className="border p-2 text-center">Name</th>
                <th className="border p-2 text-center">Description</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand.brand_id}>
                  <td className="border p-2 text-center">{brand.brand_id}</td>
                  <td className="border p-2 text-center">{brand.name}</td>
                  <td className="border p-2 text-center">
                    {brand.description}
                  </td>
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

          {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
};

export default BrandContent;
