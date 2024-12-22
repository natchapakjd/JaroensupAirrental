import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

const CategoryContent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // page state
  const [totalPages, setTotalPages] = useState(1); // total pages state
  const [rowsPerPage] = useState(10); // set the number of rows per page

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/categories-paging`, 
          {
            params: { page: currentPage, limit: rowsPerPage } // pass pagination params
          }
        );
        setCategories(response.data.data); // get categories data
        setTotalPages(response.data.totalPages); // get total pages for pagination
      } catch (err) {
        setError("Failed to fetch categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, rowsPerPage]); // fetch categories whenever currentPage changes

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
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/category/${id}`);
        setCategories(
          categories.filter((category) => category.category_id !== id)
        );
        Swal.fire("Deleted!", "Your category has been deleted.", "success");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to delete category.", "error");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link to="/dashboard/categories/add">
          <button className="btn bg-blue text-white hover:bg-blue-700">
            Add Category
          </button>
        </Link>
      </div>
      {categories.length === 0 ? (
        <p>No categories available</p>
      ) : (
        <>
          <table className="table w-full border-collapse border border-gray-300 text-center">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">ID</th>
                <th className="border p-2 text-center">Name</th>
                <th className="border p-2 text-center">Description</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.category_id}>
                  <td className="border p-2 text-center">
                    {category.category_id}
                  </td>
                  <td className="border p-2 text-center">{category.name}</td>
                  <td className="border p-2 text-center">
                    {category.description}
                  </td>
                  <td className="border p-2 text-center">
                    <Link
                      to={`/dashboard/categories/edit/${category.category_id}`}
                    >
                      <button className="btn btn-success text-white mr-2">
                        Edit
                      </button>
                    </Link>
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

export default CategoryContent;
