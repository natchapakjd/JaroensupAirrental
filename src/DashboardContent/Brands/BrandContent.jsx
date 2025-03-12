import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Import Link for navigation
import Loading from "../../components/Loading";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const BrandContent = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]); // Add filtered brands state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10); // You can set this to any number you want
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;
  // Placeholder for language toggle
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  ); // Assuming default language is English

  // Add language-specific strings
  const translations = {
    en: {
      brands: "Brands",
      addBrand: "Add Brand",
      search: "Search by brand name...",
      noBrands: "No brands available",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure?",
      confirmText: "You won't be able to revert this!",
      confirmButtonText: "Yes, delete it!",
      successMessage: "Deleted!",
      successText: "Your brand has been deleted.",
      paginationPrev: "Previous",
      paginationNext: "Next",
      page: "Page",
      of: "of",
    },
    th: {
      brands: "แบรนด์",
      addBrand: "เพิ่มแบรนด์",
      search: "ค้นหาตามชื่อแบรนด์...",
      noBrands: "ไม่มีแบรนด์ที่มีอยู่",
      edit: "แก้ไข",
      delete: "ลบ",
      confirmDelete: "คุณแน่ใจหรือไม่?",
      confirmText: "คุณจะไม่สามารถย้อนกลับได้!",
      confirmButtonText: "ใช่, ลบเลย!",
      successMessage: "ลบแล้ว!",
      successText: "แบรนด์ของคุณถูกลบแล้ว",
      paginationPrev: "ก่อนหน้า",
      paginationNext: "ถัดไป",
      page: "หน้า",
      of: "จาก",
    },
  };

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/brands-paging`,
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setBrands(response.data.data);
        setFilteredBrands(response.data.data); // Initialize filtered brands with all brands
        setTotalPages(response.data.total.totalPages);
      } catch (err) {
        setError("Failed to fetch brands.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [currentPage, rowsPerPage]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: translations[language].confirmDelete,
        text: translations[language].confirmText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: translations[language].confirmButtonText,
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/brand/${id}`);
        setBrands(brands.filter((brand) => brand.brand_id !== id));
        setFilteredBrands(
          filteredBrands.filter((brand) => brand.brand_id !== id)
        ); // Update filtered brands
        Swal.fire(
          translations[language].successMessage,
          translations[language].successText,
          "success"
        );
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to delete brand.", "error");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent going out of bounds
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredBrands(
      brands.filter(
        (brand) => brand.name.toLowerCase().includes(term) // Filter brands by name
      )
    );
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full font-prompt">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {translations[language].brands}
          </h1>
          <Link to="/dashboard/brands/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              {translations[language].addBrand}
            </button>
          </Link>
        </div>

        {/* Search Box */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={translations[language].search}
            className="input input-bordered w-full"
          />
        </div>

        {filteredBrands.length === 0 ? (
          <p>{translations[language].noBrands}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse border border-gray-300 text-center font-prompt">
                <thead className="sticky-top bg-gray-200">
                  <tr>
                    <th className="border p-2 text-center">ID</th>
                    <th className="border p-2 text-center">Name</th>
                    <th className="border p-2 text-center">Description</th>
                    <th className="border p-2 text-center">
                      {translations[language].actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrands.map((brand, index) => (
                    <tr key={index + 1}>
                      <td className="border p-2 text-center">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="border p-2 text-center">{brand.name}</td>
                      <td className="border p-2 text-center">
                        {brand.description}
                      </td>
                      <td className="border p-2 text-center">
                        <Link
                          to={`/dashboard/brands/edit/${brand.brand_id}`}
                          className="btn btn-success text-white mr-2"
                        >
                          {translations[language].edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(brand.brand_id)}
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
            <div className="flex justify-between mt-4">
              <p
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-gray-400" : "text-black"
                }`}
              >
                {translations[language].paginationPrev}
              </p>
              <span className="flex items-center justify-center">
                {translations[language].page} {currentPage}{" "}
                {translations[language].of} {totalPages}
              </span>
              <p
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-gray-400" : "text-black"
                }`}
              >
                {translations[language].paginationNext}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandContent;
