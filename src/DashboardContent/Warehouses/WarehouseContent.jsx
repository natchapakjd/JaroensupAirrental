import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Import Link for navigation
import Loading from "../../components/Loading";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const translations = {
  th: {
    warehouses: "คลังสินค้า",
    addWarehouse: "เพิ่มคลังสินค้า",
    searchPlaceholder: "ค้นหาตามที่ตั้งหรือความจุ...",
    noWarehouses: "ไม่มีคลังสินค้า",
    id: "รหัส",
    location: "ที่ตั้ง",
    capacity: "จำนวนแอร์ทั้งหมดที่มี",
    actions: "การกระทำ",
    edit: "แก้ไข",
    delete: "ลบ",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    page: "หน้า",
    of: "จาก",
    deleteConfirm: "คุณแน่ใจหรือไม่?",
    deleteText: "คุณจะไม่สามารถย้อนกลับได้!",
    deleteSuccess: "ลบเรียบร้อย!",
    deleteFail: "ลบไม่สำเร็จ",
    air_5ton: "จำนวนแอร์ 5 ตันที่มี",
    air_10ton: "จำนวนแอร์ 10 ตันที่มี",
    air_20ton: "จำนวนแอร์ 20 ตันที่มี",
  },
  en: {
    warehouses: "Warehouses",
    addWarehouse: "Add Warehouse",
    searchPlaceholder: "Search by location or capacity...",
    noWarehouses: "No warehouses available",
    id: "ID",
    location: "Location",
    capacity: "Aircontioner Quantity",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    deleteConfirm: "Are you sure?",
    deleteText: "You won't be able to revert this!",
    deleteSuccess: "Deleted!",
    deleteFail: "Failed to delete warehouse.",
    air_5ton: "Quantity of available 5-ton air conditioners!",
    air_10ton: "Quantity of available 10-ton air conditioners!",
    air_20ton: "Quantity of available 20-ton air conditioners!"
  },
};
const WarehouseContent = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]); // State for filtered warehouses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/warehouses-paging`,
          {
            params: { page: currentPage, limit: rowsPerPage },
          }
        );
        setWarehouses(response.data.data);
        setTotalPages(response.data.totalPages);
        setFilteredWarehouses(response.data.data); // Initialize filtered warehouses
      } catch (err) {
        setError("Failed to fetch warehouses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, [currentPage, rowsPerPage]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/warehouse/${id}`
        );
        setWarehouses(
          warehouses.filter((warehouse) => warehouse.warehouse_id !== id)
        );
        setFilteredWarehouses(
          filteredWarehouses.filter(
            (warehouse) => warehouse.warehouse_id !== id
          )
        );
        Swal.fire("Deleted!", "Your warehouse has been deleted.", "success");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to delete warehouse.", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredWarehouses(
      warehouses.filter(
        (warehouse) =>
          warehouse.location.toLowerCase().includes(term) ||
          warehouse.capacity.toString().includes(term) // Optional: Include capacity in search
      )
    );
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {translations[language].warehouses}
          </h1>
          <Link to="/dashboard/warehouses/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              {translations[language].addWarehouse}
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

        {filteredWarehouses.length === 0 ? (
          <p>{translations[language].noWarehouses}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border-collapse border border-gray-300 text-center font-prompt">
              <thead className="sticky-top bg-gray-200">
                <tr>
                  <th>{translations[language].id}</th>
                  <th>{translations[language].location}</th>
                  <th>{translations[language].capacity}</th>
                  <th>{translations[language].air_5ton}</th>
                  <th>{translations[language].air_10ton}</th>
                  <th>{translations[language].air_20ton}</th>
                  <th>{translations[language].actions}</th>

                </tr>
              </thead>
              <tbody>
                {filteredWarehouses.map((warehouse, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2 text-center">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="border p-2 text-center">
                      {warehouse.location}
                    </td>
                    <td className="border p-2 text-center">
                      {warehouse.capacity}
                    </td>
                    <td className="border p-2 text-center text-blue-600 font-bold">
                      {warehouse.air_5_ton? warehouse.air_5_ton : 0}
                    </td>
                    <td className="border p-2 text-center text-green-600 font-bold">
                      {warehouse.air_10_ton ? warehouse.air_10_ton : 0}
                    </td>
                    <td className="border p-2 text-center text-red-600 font-bold">
                      {warehouse.air_20_ton ? warehouse.air_20_ton : 0}
                    </td>
                    <td className="border p-2 text-center">
                      <Link
                        to={`/dashboard/warehouses/edit/${warehouse.warehouse_id}`}
                      >
                        <button className="btn btn-success text-white mr-2">
                          {translations[language].edit}
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(warehouse.warehouse_id)}
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
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <p
            onClick={() => {
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            className={`cursor-pointer ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
          >
            {translations[language].previous}
          </p>
          <span className="flex items-center justify-center">
            {translations[language].page} {currentPage}{" "}
            {translations[language].of} {totalPages}
          </span>
          <p
            onClick={() => {
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            className={`cursor-pointer ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
          >
            {translations[language].next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarehouseContent;
