import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { MdOutlineStar } from "react-icons/md";
const translations = {
  en: {
    title: "Reviews",
    addReview: "Add Review",
    searchPlaceholder: "Search by comment, rating, user, or technician...",
    reviewID: "Review ID",
    user: "User",
    tech: "Tech",
    comment: "Comment",
    rating: "Rating",
    date: "Date",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    noReviews: "No reviews available",
    previous: "Previous",
    next: "Next",
    confirmDeleteTitle: "Are you sure?",
    confirmDeleteText: "This review will be permanently deleted!",
    deleteSuccessTitle: "Deleted!",
    deleteSuccessText: "The review has been deleted successfully.",
    deleteError: "Failed to delete review.",
    loadError: "Failed to load reviews.",
    of: "of",
    page: "page",
  },
  th: {
    title: "รีวิว",
    addReview: "เพิ่มรีวิว",
    searchPlaceholder: "ค้นหาโดยความคิดเห็น คะแนน ผู้ใช้ หรือช่าง...",
    reviewID: "รหัสรีวิว",
    user: "ผู้ใช้",
    tech: "ช่าง",
    comment: "ความคิดเห็น",
    rating: "คะแนน",
    date: "วันที่",
    actions: "การดำเนินการ",
    edit: "แก้ไข",
    delete: "ลบ",
    noReviews: "ไม่มีรีวิว",
    confirmDeleteTitle: "คุณแน่ใจหรือไม่?",
    confirmDeleteText: "รีวิวนี้จะถูกลบอย่างถาวร!",
    deleteSuccessTitle: "ลบแล้ว!",
    deleteSuccessText: "รีวิวถูกลบเรียบร้อยแล้ว.",
    deleteError: "ลบรีวิวไม่สำเร็จ.",
    loadError: "โหลดรีวิวล้มเหลว.",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    of: "จาก",
    page: "หน้า",
  },
};

const ReviewContent = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]); // State for filtered reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const role = decodeToken.role;
  const techId = decodeToken.technicianId;

  const pageSize = 10;
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let response;

        if (role == 2) {
          // ถ้าเป็น Technician (role == 2) ให้ส่ง techId ไปที่ API
          response = await axios.get(`${apiUrl}/reviews-paging`, {
            params: { page: currentPage, pageSize, tech_id: techId },
          });
        } else {
          // ถ้าไม่ใช่ Technician ให้ดึงรีวิวทั้งหมด
          response = await axios.get(`${apiUrl}/reviews-paging`, {
            params: { page: currentPage, pageSize },
          });
        }

        setReviews(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
        setFilteredReviews(response.data.data); // Initialize filtered reviews
      } catch (err) {
        setError(err.message);
        Swal.fire({
          title: translations[language].title,
          text: translations[language].loadError,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, language]);

  const handleDelete = async (reviewId) => {
    const confirmDelete = await Swal.fire({
      title: translations[language].confirmDeleteTitle,
      text: translations[language].confirmDeleteText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: translations[language].delete,
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
          title: translations[language].deleteSuccessTitle,
          text: translations[language].deleteSuccessText,
        });
      } catch (err) {
        console.error("Error deleting review:", err);
        await Swal.fire({
          title: translations[language].title,
          text: translations[language].deleteError,
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
    <div className="container mx-auto p-8">
      {" "}
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {translations[language].title}
          </h1>
          {role !== 2 && (
            <Link
              to="/dashboard/reviews/add"
              className="btn bg-blue text-white hover:bg-blue"
            >
              {translations[language].addReview}
            </Link>
          )}
        </div>

        {/* Search Box */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={translations[language].searchPlaceholder}
            className="input input-bordered w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">
                  {translations[language].reviewID}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].user}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].tech}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].comment}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].rating}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].date}
                </th>
                {role !== 2 && (
                  <th className="border p-2 text-center">
                    {translations[language].actions}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">
                      {review.member_firstname} {review.member_lastname}
                    </td>
                    <td className="border p-2 text-center">
                      {review.tech_firstname} {review.tech_lastname}
                    </td>
                    <td className="border p-2 text-center">{review.comment}</td>
                    <td className="border p-2 text-center  place-items-center">
                      <div className="flex">
                        {review.rating}
                        <MdOutlineStar className="text-yellow-400 pb-1  text-xl" />
                      </div>
                    </td>

                    <td className="border p-2 text-center">
                      {new Date(review.created_at).toLocaleString()}
                    </td>
                    {role !== 2 && (
                      <td className="border p-2 text-center">
                        <Link
                          to={`/dashboard/reviews/${review.review_id}`}
                          className="btn btn-success text-white mr-2"
                        >
                          {translations[language].edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(review.review_id)}
                          className="btn btn-error text-white"
                        >
                          {translations[language].delete}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border border-gray-300 p-4">
                    {translations[language].noReviews}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <p
            onClick={() => handlePageChange(currentPage - 1)}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
          >
            {translations[language].previous}
          </p>
          <span>
            {translations[language].page} {currentPage}{" "}
            {translations[language].of} {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
          >
            {translations[language].next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewContent;
