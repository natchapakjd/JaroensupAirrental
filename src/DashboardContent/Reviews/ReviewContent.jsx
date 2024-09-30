import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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
                <td className="border border-gray-300 p-2">{new Date(review.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border border-gray-300 p-4">No reviews available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewContent;
