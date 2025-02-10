import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
const apiUrl = import.meta.env.VITE_SERVER_URL;

const AreacalContent = () => {
  const [areaCalculations, setAreaCalculations] = useState([]);
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAreaCalculations(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchAreaCalculations = async (page, limit) => {
    try {
      const response = await axios.get(`${apiUrl}/area_cal-paging`, {
        params: { page, limit },
      });
      setAreaCalculations(response.data.data);
      setTotalPages(response.data.total.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching area calculations:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) {
    return <Loading />;
  }

  const handleDelete = async (calculationId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/area_cal/${calculationId}`);
        Swal.fire("Deleted!", "The record has been deleted.", "success");
        
        // Refresh the list after deletion
        fetchAreaCalculations(currentPage, pageSize);
        
      } catch (error) {
        console.error("Error deleting area calculation:", error);
        Swal.fire("Error!", "Failed to delete the record.", "error");
      }
    }
  };
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 font-inter">
        <h2 className="text-2xl font-bold mb-4">Area Calculations</h2>
        <Link to="/dashboard/area-cal/add">
          <button className="btn bg-blue text-white hover:bg-blue">
            Add Areacal
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
      <table className="table w-full border-collapse border border-gray-300">
  <thead className="sticky-top bg-gray-200">
    <tr>
      <th className="border p-2 text-center">ID</th>
      <th className="border p-2 text-center">Assignment ID</th>
      <th className="border p-2 text-center">Location Name</th>
      <th className="border p-2 text-center">Width</th>
      <th className="border p-2 text-center">Height</th>
      <th className="border p-2 text-center">Air Conditioners Needed</th>
      <th className="border p-2 text-center">Area Type</th>
      <th className="border p-2 text-center">5 Ton Used</th>
      <th className="border p-2 text-center">10 Ton Used</th>
      <th className="border p-2 text-center">20 Ton Used</th>
      <th className="border p-2 text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="text-center">
    {areaCalculations.map((calculation) => (
      <tr key={calculation.calculation_id}>
        <td className="border p-2 text-center">{calculation.calculation_id}</td>
        <td className="border p-2 text-center">{calculation.assignment_id}</td>
        <td className="border p-2 text-center">{calculation.location_name}</td>
        <td className="border p-2 text-center">{calculation.width}</td>
        <td className="border p-2 text-center">{calculation.height}</td>
        <td className="border p-2 text-center">{calculation.air_conditioners_needed}</td>
        <td className="border p-2 text-center">{calculation.area_type}</td>
        <td className="border p-2 text-center text-blue-600 font-bold">
          {calculation.air_5ton_used}
        </td>
        <td className="border p-2 text-center text-green-600 font-bold">
          {calculation.air_10ton_used}
        </td>
        <td className="border p-2 text-center text-red-600 font-bold">
          {calculation.air_20ton_used}
        </td>
        <td>
          <button
            onClick={() =>
              navigate(
                `/dashboard/area-cal/edit/${calculation.calculation_id}`
              )
            }
            className="btn  btn-success mr-2 text-white"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(calculation.calculation_id)}
            className="btn  btn-error text-white"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
        <div className="flex justify-between mt-4">
          <p
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </p>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </p>
        </div>
        {/* <div className="mt-4">
          <label>
            Items per page:
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="ml-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div> */}
      </div>
    </div>
  );
};

export default AreacalContent;