import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

// Translation strings for localization
const translations = {
  en: {
    heading: "Categories",
    addButton: "Add Category",
    searchPlaceholder: "Search by category name...",
    noCategories: "No categories available",
    id: "ID",
    name: "Name",
    description: "Description",
    actions: "Actions",
    editButton: "Edit",
    deleteButton: "Delete",
    deleteConfirmation: "Are you sure?",
    deleteWarning: "You won't be able to revert this!",
    deleteSuccess: "Your category has been deleted.",
    deleteError: "Failed to delete category.",
    loadError: "Failed to fetch categories.",
    previous: "previous",
    next: "next",
    page: "page",
    of: "of",
  },
  th: {
    heading: "หมวดหมู่",
    addButton: "เพิ่มหมวดหมู่",
    searchPlaceholder: "ค้นหาตามชื่อหมวดหมู่...",
    noCategories: "ไม่มีหมวดหมู่",
    id: "รหัส",
    name: "ชื่อ",
    description: "คำอธิบาย",
    actions: "การกระทำ",
    editButton: "แก้ไข",
    deleteButton: "ลบ",
    deleteConfirmation: "คุณแน่ใจหรือไม่?",
    deleteWarning: "คุณจะไม่สามารถกู้คืนข้อมูลได้!",
    deleteSuccess: "หมวดหมู่ของคุณได้ถูกลบแล้ว",
    deleteError: "ไม่สามารถลบหมวดหมู่ได้",
    loadError: "ไม่สามารถโหลดหมวดหมู่ได้",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    page: "หน้า",
    of: "จาก",
  }
};

const CategoryContent = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Get the language from localStorage, defaulting to 'en'
  const language = localStorage.getItem("language") || "en";
  const t = translations[language]; // Get the translation for the selected language

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/categories-paging`,
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(t.loadError);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, rowsPerPage, t.loadError]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: t.deleteConfirmation,
        text: t.deleteWarning,
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
        setFilteredCategories(
          filteredCategories.filter((category) => category.category_id !== id)
        );
        Swal.fire("Deleted!", t.deleteSuccess, "success");
      }
    } catch (err) {
      Swal.fire("Error!", t.deleteError, "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(term)
      )
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen font-prompt">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t.heading}</h1>
        <Link to="/dashboard/categories/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            {t.addButton}
          </button>
        </Link>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={t.searchPlaceholder}
          className="input input-bordered w-full"
        />
      </div>
      {filteredCategories.length === 0 ? (
        <p>{t.noCategories}</p>
      ) : (
        <>
          <table className="table w-full border-collapse border border-gray-300 text-center">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">{t.id}</th>
                <th className="border p-2 text-center">{t.name}</th>
                <th className="border p-2 text-center">{t.description}</th>
                <th className="border p-2 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr key={index + 1}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{category.name}</td>
                  <td className="border p-2 text-center">
                    {category.description}
                  </td>
                  <td className="border p-2 text-center">
                    <Link
                      to={`/dashboard/categories/edit/${category.category_id}`}
                    >
                      <button className="btn btn-success text-white mr-2">
                        {t.editButton}
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      className="btn btn-error text-white"
                    >
                      {t.deleteButton}
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
              className={`cursor-pointer ${
                currentPage === 1 ? "text-gray-400" : "text-black"
              }`}
            >
              {t.previous}
            </p>
            <span className="flex items-center justify-center">
              {t.page} {currentPage} {t.of} {totalPages}
            </span>
            <p
              onClick={() => handlePageChange(currentPage + 1)}
              className={`cursor-pointer ${
                currentPage === totalPages ? "text-gray-400" : "text-black"
              }`}
            >
              {t.next}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryContent;
