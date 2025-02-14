import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
const apiUrl = import.meta.env.VITE_SERVER_URL;

const translations = {
  en: {
    areaCalculations: "Area Calculations",
    addAreacal: "Add Areacal",
    id: "ID",
    assignmentId: "Assignment ID",
    locationName: "Location Name",
    width: "Width",
    height: "Height",
    airConditionersNeeded: "Air Conditioners Needed",
    areaType: "Area Type",
    air5TonUsed: "5 Ton Used",
    air10TonUsed: "10 Ton Used",
    air20TonUsed: "20 Ton Used",
    actions: "Actions",
    viewDetails: "View Details",
    edit: "Edit",
    delete: "Delete",
    page: "Page",
    previous: "Previous",
    next: "Next",
    of: "of",
    confirmDelete: "Are you sure?",
    confirmDeleteText: "This action cannot be undone!",
    deleteSuccess: "Deleted!",
    deleteSuccessText: "The record has been deleted.",
    deleteError: "Error!",
    deleteErrorText: "Failed to delete the record.",
  },
  th: {
    areaCalculations: "การคำนวณพื้นที่",
    addAreacal: "เพิ่มการคำนวณพื้นที่",
    id: "รหัส",
    assignmentId: "รหัสงาน",
    locationName: "ชื่อสถานที่",
    width: "ความกว้าง",
    height: "ความสูง",
    airConditionersNeeded: "จำนวนเครื่องปรับอากาศที่ต้องการ",
    areaType: "ประเภทพื้นที่",
    air5TonUsed: "ใช้ 5 ตัน",
    air10TonUsed: "ใช้ 10 ตัน",
    air20TonUsed: "ใช้ 20 ตัน",
    actions: "การดำเนินการ",
    viewDetails: "ดูรายละเอียด",
    edit: "แก้ไข",
    delete: "ลบ",
    page: "หน้า",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    of: "จาก",
    confirmDelete: "คุณแน่ใจหรือไม่?",
    confirmDeleteText: "การดำเนินการนี้ไม่สามารถยกเลิกได้!",
    deleteSuccess: "ลบแล้ว!",
    deleteSuccessText: "บันทึกถูกลบแล้ว",
    deleteError: "ข้อผิดพลาด!",
    deleteErrorText: "ไม่สามารถลบบันทึกได้",
  },
};

const AreacalContent = () => {
  const [areaCalculations, setAreaCalculations] = useState([]);
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

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
      title: translations[language].confirmDelete,
      text: translations[language].confirmDeleteText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: translations[language].delete,
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/area_cal/${calculationId}`);
        Swal.fire({
          title: translations[language].deleteSuccess,
          text: translations[language].deleteSuccessText,
          icon: "success",
        });
        fetchAreaCalculations(currentPage, pageSize);
      } catch (error) {
        console.error("Error deleting area calculation:", error);
        Swal.fire({
          title: translations[language].deleteError,
          text: translations[language].deleteErrorText,
          icon: "error",
        });
      }
    }
  };
  

  return (
  <div className="p-4">
    <div className="flex justify-between items-center mb-4 font-prompt">
      <h2 className="text-2xl font-bold mb-4">{translations[language].areaCalculations}</h2>
      <Link to="/dashboard/area-cal/add">
        <button className="btn bg-blue text-white hover:bg-blue">
          {translations[language].addAreacal}
        </button>
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="table w-full border-collapse border border-gray-300">
        <thead className="sticky-top bg-gray-200">
          <tr>
            <th className="border p-2 text-center">{translations[language].id}</th>
            <th className="border p-2 text-center">{translations[language].assignmentId}</th>
            <th className="border p-2 text-center">{translations[language].locationName}</th>
            <th className="border p-2 text-center">{translations[language].width}</th>
            <th className="border p-2 text-center">{translations[language].height}</th>
            <th className="border p-2 text-center">{translations[language].airConditionersNeeded}</th>
            <th className="border p-2 text-center">{translations[language].areaType}</th>
            <th className="border p-2 text-center">{translations[language].air5TonUsed}</th>
            <th className="border p-2 text-center">{translations[language].air10TonUsed}</th>
            <th className="border p-2 text-center">{translations[language].air20TonUsed}</th>
            <th className="border p-2 text-center">{translations[language].actions}</th>
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
              <td className="border p-2 text-center">{calculation.room_type_name}</td>
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
                      `/dashboard/area-cal/details/${calculation.calculation_id}`
                    )
                  }
                  className="btn bg-blue mr-2 text-white hover:bg-blue"
                >
                  {translations[language].viewDetails}
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/area-cal/edit/${calculation.calculation_id}`
                    )
                  }
                  className="btn btn-success mr-2 text-white"
                >
                  {translations[language].edit}
                </button>
                <button
                  onClick={() => handleDelete(calculation.calculation_id)}
                  className="btn btn-error text-white"
                >
                  {translations[language].delete}
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
          className={`cursor-pointer ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
        >
          {translations[language].previous}
        </p>
        <span className="flex items-center justify-center">
          {translations[language].page} {currentPage} {translations[language].of} {totalPages}
        </span>
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        >
          {translations[language].next}
        </p>
      </div>
    </div>
  </div>
);
};

export default AreacalContent;