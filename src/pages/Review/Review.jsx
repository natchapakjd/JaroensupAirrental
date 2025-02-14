import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineStar } from "react-icons/md";

// 🔥 แปลภาษา
const translations = {
  th: {
    submitReview: "ให้คะแนนรีวิว",
    rating: "คะแนน",
    comment: "ความคิดเห็น",
    submit: "ส่งรีวิว",
    success: "สำเร็จ!",
    successMessage: "รีวิวของคุณถูกส่งเรียบร้อยแล้ว",
    error: "เกิดข้อผิดพลาด",
    errorMessage: "ไม่สามารถส่งรีวิวได้",
    alreadyReviewed: "คุณได้ทำการรีวิวงานนี้แล้ว",
    yourReview: "รีวิวของคุณ",
    loading: "กำลังโหลด...",
  },
  en: {
    submitReview: "Submit Your Review",
    rating: "Rating",
    comment: "Comment",
    submit: "Submit Review",
    success: "Success!",
    successMessage: "Your review has been submitted successfully",
    error: "Oops...",
    errorMessage: "Failed to submit review",
    alreadyReviewed: "You have already submitted a review for this task.",
    yourReview: "Your Review",
    loading: "Loading...",
  },
};

const Review = () => {
  const { taskId } = useParams();
  const user = useAuth();
  const user_id = user.user.id;
  const navigate = useNavigate();

  const [tech_id, setTechId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  // ✅ อัปเดตภาษาแบบ real-time
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

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
      setLoading(false);
    }
  }, [tech_id, existingReview]);

  // ✅ ทำให้รีวิวอัปเดตแบบ real-time
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/review/${taskId}/${user_id}`)
        .then((response) => {
          if (response.data) {
            setExistingReview(response.data);
          }
        })
        .catch((error) => console.error("Error fetching review:", error));
    }, 5000); // ดึงข้อมูลทุก 5 วินาที

    return () => clearInterval(interval);
  }, [taskId, user_id]);

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

      await Swal.fire({
        icon: "success",
        title: translations[language].success,
        text: translations[language].successMessage,
      });

      navigate("/history");
    } catch (error) {
      console.error("Error submitting review:", error);

      await Swal.fire({
        icon: "error",
        title: translations[language].error,
        text: translations[language].errorMessage,
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-4 border-blue-500"></div>
          <p className="ml-4">{translations[language].loading}</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10 font-prompt">
        <h2 className="text-2xl font-bold mb-4">
          {translations[language].submitReview}
        </h2>
        {existingReview ? (
          <div className="bg-white text-gray-800 p-4 my-5 rounded-lg shadow-md">
            <strong className="block font-semibold">
              {translations[language].alreadyReviewed}
            </strong>
            <p className="mt-2">{translations[language].yourReview}:</p>
            <p className="italic">{existingReview.comment}</p>
            <p className="font-bold flex items-center">
              {translations[language].rating}: {existingReview.rating}
              <MdOutlineStar className="text-yellow-400 ml-1" />
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input type="hidden" id="tech_id" value={tech_id} readOnly />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="rating">
                {translations[language].rating}:
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
                {translations[language].comment}:
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
              {translations[language].submit}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Review;
