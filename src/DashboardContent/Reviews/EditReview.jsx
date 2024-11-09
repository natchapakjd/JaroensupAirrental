import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext'; // Adjust the import based on your Auth context path

const EditReview = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const navigate = useNavigate();
  const user = useAuth(); // Get user data for authorization
  const [review, setReview] = useState({
    task_id: '',
    tech_id: '',
    user_id: user.user.id, // Assuming user ID is from context
    rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch the existing review details
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/review/${id}`);
        setReview(response.data);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          title: "Error",
          text: "Failed to load review.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/review/${id}`, review);
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: response.data.message,
      });
      navigate("/reviews"); // Redirect to reviews list or any other page
    } catch (err) {
      console.error("Error updating review:", err);
      await Swal.fire({
        title: "Error",
        text: "Failed to update review.",
        icon: "error",
      });
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="task_id">Task ID:</label>
          <input
            type="text"
            id="task_id"
            name="task_id"
            value={review.task_id}
            onChange={handleChange}
            required
            disabled
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="tech_id">Technician ID:</label>
          <input
            type="text"
            id="tech_id"
            name="tech_id"
            value={review.tech_id}
            onChange={handleChange}
            required
            disabled
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={review.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            value={review.comment}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <button type="submit" className="btn bg-blue text-white hover:bg-blue-600">
          Update Review
        </button>
      </form>
    </div>
  );
};

export default EditReview;
