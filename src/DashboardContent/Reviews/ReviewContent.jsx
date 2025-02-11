import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const ReviewContent = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]); // State for filtered reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const pageSize = 10;
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/reviews-paging`, {
          params: { page: currentPage, pageSize },
        });
        setReviews(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
        setFilteredReviews(response.data.data); // Initialize filtered reviews
      } catch (err) {
        setError(err.message);
        Swal.fire({
          title: "Error",
          text: "Failed to load reviews.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage]);

  const handleDelete = async (reviewId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/review/${reviewId}`, {
          withCredentials: true,
        });
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.review_id !== reviewId)
        );
        setFilteredReviews((prevReviews) =>
          prevReviews.filter((review) => review.review_id !== reviewId)
        );

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data.message,
        });
      } catch (err) {
        console.error("Error deleting review:", err);
        await Swal.fire({
          title: "Error",
          text: "Failed to delete review.",
          icon: "error",
        });
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredReviews(
      reviews.filter(
        (review) =>
          review.comment.toLowerCase().includes(term) || // Search by comment
          `${review.rating}`.includes(term) || // Search by rating
          `${review.member_firstname} ${review.member_lastname}`
            .toLowerCase()
            .includes(term) || // Search by user name
          `${review.tech_firstname} ${review.tech_lastname}`
            .toLowerCase()
            .includes(term) // Search by tech name
      )
    );
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <Link to="/dashboard/reviews/add" className="btn bg-blue text-white hover:bg-blue">
          Add Review
        </Link>
      </div>

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by comment, rating, user, or technician..."
          className="input input-bordered w-full"
        />
      </div>

      <table className="table w-full border-collapse border border-gray-300">
        <thead className="sticky-top bg-gray-200">
          <tr>
            <th className="border p-2 text-center">Review ID</th>
            <th className="border p-2 text-center">User</th>
            <th className="border p-2 text-center">Tech</th>
            <th className="border p-2 text-center">Comment</th>
            <th className="border p-2 text-center">Rating</th>
            <th className="border p-2 text-center">Date</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <tr key={review.review_id}>
                <td className="border p-2 text-center">{review.review_id}</td>
                <td className="border p-2 text-center">
                  {review.member_firstname} {review.member_lastname}
                </td>
                <td className="border p-2 text-center">
                  {review.tech_firstname} {review.tech_lastname}
                </td>
                <td className="border p-2 text-center">{review.comment}</td>
                <td className="border p-2 text-center">{review.rating}</td>
                <td className="border p-2 text-center">
                  {new Date(review.created_at).toLocaleString()}
                </td>
                <td className="border p-2 text-center">
                  <Link
                    to={`/dashboard/reviews/${review.review_id}`} // Link to the edit page
                    className="btn btn-success text-white mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(review.review_id)}
                    className="btn btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border border-gray-300 p-4">
                No reviews available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <p
          onClick={() => handlePageChange(currentPage - 1)}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        >
          Previous
        </p>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default ReviewContent;
