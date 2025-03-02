import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
// Translation object for multiple languages
const translations = {
  en: {
    title: "Attributes",
    addAttribute: "Add Attribute",
    searchPlaceholder: "Search by attribute name...",
    attributeID: "ID",
    name: "Name",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    noAttributes: "No attributes available",
    confirmDeleteTitle: "Are you sure?",
    confirmDeleteText: "You won't be able to revert this!",
    deleteSuccessTitle: "Deleted!",
    deleteSuccessText: "Attribute has been deleted.",
    deleteError: "Error deleting attribute.",
    loadError: "Failed to fetch attributes.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  th: {
    title: "คุณลักษณะ",
    addAttribute: "เพิ่มคุณลักษณะ",
    searchPlaceholder: "ค้นหาด้วยชื่อคุณลักษณะ...",
    attributeID: "รหัส",
    name: "ชื่อ",
    actions: "การดำเนินการ",
    edit: "แก้ไข",
    delete: "ลบ",
    noAttributes: "ไม่มีคุณลักษณะ",
    confirmDeleteTitle: "คุณแน่ใจหรือไม่?",
    confirmDeleteText: "คุณจะไม่สามารถย้อนกลับได้!",
    deleteSuccessTitle: "ลบแล้ว!",
    deleteSuccessText: "คุณลักษณะถูกลบแล้ว.",
    deleteError: "ลบคุณลักษณะไม่สำเร็จ.",
    loadError: "โหลดคุณลักษณะล้มเหลว.",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    page: "หน้า",
    of: "จาก",
  },
};

const AttributeContent = () => {
  const [attributes, setAttributes] = useState([]);
  const [filteredAttributes, setFilteredAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;

  // Fetch attributes whenever currentPage changes
  useEffect(() => {
    fetchAttributes();
  }, [currentPage]);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/attributes-paging`,
        {
          params: { page: currentPage, limit: rowsPerPage },
        }
      );
      setTotalPages(response.data.total.totalPages);
      const { data } = response.data;
      const sortedAttributes = data.sort(
        (a, b) => a.attribute_id - b.attribute_id
      );
      setAttributes(sortedAttributes);
      setFilteredAttributes(sortedAttributes); // Initialize filteredAttributes
    } catch (error) {
      setError(translations[language].loadError);
      console.error("Error fetching attributes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attributeId) => {
    try {
      const result = await Swal.fire({
        title: translations[language].confirmDeleteTitle,
        text: translations[language].confirmDeleteText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: translations[language].delete,
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/attribute/${attributeId}`
        );
        if (response.status === 200) {
          Swal.fire(
            translations[language].deleteSuccessTitle,
            translations[language].deleteSuccessText,
            "success"
          );
          fetchAttributes(); // Refetch attributes after deletion
        } else {
          throw new Error(translations[language].deleteError);
        }
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAttributes(
      attributes.filter((attribute) =>
        attribute.name.toLowerCase().includes(term)
      )
    );
  };

  if (loading) return <p>{translations[language].loadError}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {translations[language].title}
          </h1>
          <Link to="/dashboard/attributes/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              {translations[language].addAttribute}
            </button>
          </Link>
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

        {filteredAttributes.length === 0 ? (
          <p>{translations[language].noAttributes}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse border border-gray-300 text-center">
                <thead className="sticky-top bg-gray-200">
                  <tr>
                    <th className="border p-2 text-center">
                      {translations[language].attributeID}
                    </th>
                    <th className="border p-2 text-center">
                      {translations[language].name}
                    </th>
                    <th className="border p-2 text-center">
                      {translations[language].actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttributes.map((attribute, index) => (
                    <tr key={index + 1}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {attribute.name}
                      </td>
                      <td className="border p-2 text-center">
                        <Link
                          to={`/dashboard/attributes/edit/${attribute.attribute_id}`}
                          className="btn btn-success text-white mr-2"
                        >
                          {translations[language].edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(attribute.attribute_id)}
                          className="btn btn-error text-white"
                        >
                          {translations[language].delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <p
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`cursor-pointer ${
                  currentPage === 1 ? "text-gray-400" : "text-black"
                }`}
              >
                {translations[language].previous}
              </p>
              <span>
                {translations[language].page} {currentPage}{" "}
                {translations[language].of} {totalPages}
              </span>
              <p
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-gray-400" : "text-black"
                }`}
              >
                {translations[language].next}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttributeContent;
