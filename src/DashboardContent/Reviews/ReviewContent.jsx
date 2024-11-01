import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import Swal from "sweetalert2";

const ReviewContent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${apiUrl}/reviews`);
        setReviews(response.data);
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
  }, []);

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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Review ID</th>
            <th className="border border-gray-300 p-2">User ID</th>
            <th className="border border-gray-300 p-2">Tech ID</th>
            <th className="border border-gray-300 p-2">Comment</th>
            <th className="border border-gray-300 p-2">Rating</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review.review_id}>
                <td className="border border-gray-300 p-2">{review.review_id}</td>
                <td className="border border-gray-300 p-2">{review.user_id}</td>
                <td className="border border-gray-300 p-2">{review.tech_id}</td>
                <td className="border border-gray-300 p-2">{review.comment}</td>
                <td className="border border-gray-300 p-2">{review.rating}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(review.created_at).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2">
                  <Link
                    to={`/dashboard/reviews/${review.review_id}`} // Link to the edit page
                    className="btn bg-blue hover:bg-blue text-white mr-2"
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
    </div>
  );
};

export default ReviewContent;
