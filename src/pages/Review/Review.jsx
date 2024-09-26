import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const Review = () => {
  const { taskId } = useParams(); 
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;
  const navigate = useNavigate();

  const [tech_id, setTechId] = useState(''); 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingReview, setExistingReview] = useState(null); // State to store existing review

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/appointment/${taskId}`);
        setTechId(response.data[0].tech_id);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    const fetchExistingReview = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/review/${taskId}/${user_id}`);
        if (response.data) {
          setExistingReview(response.data); // Set existing review if found
        }
      } catch (error) {
        console.error("Error fetching existing review:", error);
      }
    };

    fetchTaskDetails();
    fetchExistingReview();
  }, [taskId, user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/review`, {
        task_id: taskId,
        tech_id,
        user_id,
        rating,
        comment,
      });
      
      // Show success message using SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
      });

      navigate('/history'); // Navigate back to user history or another page
    } catch (error) {
      console.error("Error submitting review:", error);
      
      // Show error message using SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to submit review',
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>
        {existingReview ? (
          <div className="alert alert-warning my-5">
            <strong>You have already submitted a review for this task.</strong>
            <p>Your Review: {existingReview.comment} - Rating: {existingReview.rating}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="tech_id">Technician ID:</label>
              <input
                type="text"
                id="tech_id"
                value={tech_id}
                onChange={(e) => setTechId(e.target.value)}
                required
                className="input input-bordered w-full"
                readOnly // Make it read-only since it’s auto-populated
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="rating">Rating:</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
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
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="textarea textarea-bordered w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Review;
