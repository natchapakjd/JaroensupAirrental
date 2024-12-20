import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineStar } from "react-icons/md";

const Review = () => {
  const { taskId } = useParams();
  const user = useAuth();
  const user_id = user.user.id;
  const navigate = useNavigate();

  const [tech_id, setTechId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/appointment/${taskId}`
        );
        setTechId(response.data[0].tech_id);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    const fetchExistingReview = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/review/${taskId}/${user_id}`
        );
        if (response.data) {
          setExistingReview(response.data);
        }
      } catch (error) {
        console.error("Error fetching existing review:", error);
      }
    };

    fetchTaskDetails();
    fetchExistingReview();
  }, [taskId, user_id]);

  useEffect(() => {
    if (tech_id && existingReview !== null) {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [tech_id, existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/review`,
        {
          task_id: taskId,
          tech_id,
          user_id,
          rating,
          comment,
        }
      );

      // Show success message using SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
      });

      navigate("/history"); // Navigate back to user history or another page
    } catch (error) {
      console.error("Error submitting review:", error);

      // Show error message using SweetAlert2
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit review",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar/>
        <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-4 border-blue-500"></div>
      </div>
      </>
      
    ); // Show loading spinner while waiting for data
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>
        {existingReview ? (
          <div className=" bg-white text-gray-800 p-4 my-5 rounded-lg shadow-md">
            <strong className="block font-semibold">
              You have already submitted a review for this task.
            </strong>
            <p className="mt-2">Your Review:</p>
            <p className="italic">{existingReview.comment}</p>
            <p className="font-bold flex items-center">
              Rating: {existingReview.rating}
              <MdOutlineStar className="text-yellow-400 ml-1" />
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="tech_id">
                Technician ID:
              </label>
              <input
                type="hidden" // Use hidden input for tech_id
                id="tech_id"
                value={tech_id}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="rating">
                Rating:
              </label>
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
              <label className="block mb-2" htmlFor="comment">
                Comment:
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="textarea textarea-bordered w-full"
              />
            </div>
            <button
              type="submit"
              className="btn bg-blue text-white hover:bg-blue"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Review;
