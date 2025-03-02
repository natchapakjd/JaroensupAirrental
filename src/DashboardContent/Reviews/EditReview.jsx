import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import BackButtonEdit from "../../components/BackButtonEdit";

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuth();
  const [review, setReview] = useState({
    task_id: "",
    tech_id: "",
    user_id: user.user.id,
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  ); // Default to stored language or English

  const translations = {
    en: {
      pageTitle: "Edit Review",
      taskLabel: "Task ID:",
      techLabel: "Technician ID:",
      ratingLabel: "Rating:",
      commentLabel: "Comment:",
      updateButton: "Update Review",
      loading: "Loading...",
      errorLoading: "Failed to load review.",
      successUpdate: "Updated!",
      errorUpdate: "Failed to update review.",
    },
    th: {
      pageTitle: "แก้ไขรีวิว",
      taskLabel: "รหัสงาน:",
      techLabel: "รหัสช่าง:",
      ratingLabel: "คะแนน:",
      commentLabel: "ความคิดเห็น:",
      updateButton: "อัปเดตรีวิว",
      loading: "กำลังโหลด...",
      errorLoading: "โหลดรีวิวไม่สำเร็จ",
      successUpdate: "อัปเดตแล้ว!",
      errorUpdate: "อัปเดตรีวิวไม่สำเร็จ",
    },
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/review/${id}`
        );
        setReview(response.data);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          title: "Error",
          text: translations[language].errorLoading,
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

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage); // Persist language choice
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/review/${id}`,
        review
      );
      await Swal.fire({
        icon: "success",
        title: translations[language].successUpdate,
        text: response.data.message,
      });
      navigate("/reviews");
    } catch (err) {
      console.error("Error updating review:", err);
      await Swal.fire({
        title: "Error",
        text: translations[language].errorUpdate,
        icon: "error",
      });
    }
  };

  if (loading)
    return <div className="text-center">{translations[language].loading}</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {" "}
            {translations[language].pageTitle}
          </h1>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="task_id">
            {translations[language].taskLabel}
          </label>
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
          <label className="block mb-2" htmlFor="tech_id">
            {translations[language].techLabel}
          </label>
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
          <label className="block mb-2" htmlFor="rating">
            {translations[language].ratingLabel}
          </label>
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
          <label className="block mb-2" htmlFor="comment">
            {translations[language].commentLabel}
          </label>
          <textarea
            id="comment"
            name="comment"
            value={review.comment}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className="btn bg-blue text-white hover:bg-blue-600"
        >
          {translations[language].updateButton}
        </button>
      </form>
    </div>
  );
};

export default EditReview;
