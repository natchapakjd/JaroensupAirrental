import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import Swal from "sweetalert2";

const translations = {
  en: {
    title: "Work Experiences",
    add: "Add Work Experience",
    company: "Company Name",
    project: "Project Title",
    images: "Images",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    confirmDeleteTitle: "Are you sure?",
    confirmDeleteText: "This item will be permanently deleted!",
    deleteSuccessTitle: "Deleted!",
    deleteSuccessText: "The work experience has been deleted.",
    noData: "No work experiences found.",
    id: "ID",
  },
  th: {
    title: "รายการผลงาน",
    add: "เพิ่มผลงาน",
    company: "ชื่อบริษัท",
    project: "ชื่อโปรเจกต์",
    images: "จำนวนรูป",
    actions: "การดำเนินการ",
    edit: "แก้ไข",
    delete: "ลบ",
    confirmDeleteTitle: "คุณแน่ใจหรือไม่?",
    confirmDeleteText: "รายการนี้จะถูกลบอย่างถาวร!",
    deleteSuccessTitle: "ลบแล้ว!",
    deleteSuccessText: "ลบผลงานเรียบร้อยแล้ว.",
    noData: "ไม่พบข้อมูลผลงาน",
    id: "รหัสงาน",
  },
};

const WorkExpContent = () => {
  const [workExps, setWorkExps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  const api_url = import.meta.env.VITE_SERVER_URL;

  const fetchWorkExperiences = async () => {
    try {
      const res = await axios.get(`${api_url}/work_exps`);
      setWorkExps(res.data);
    } catch (error) {
      console.error("Error fetching work experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: translations[language].confirmDeleteTitle,
      text: translations[language].confirmDeleteText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: translations[language].delete,
    });
  
    if (confirm.isConfirmed) {
      try {
        // เรียก API ลบทั้ง work experience และ images
        await axios.delete(`${api_url}/work_exps/${id}`);
        setWorkExps((prev) => prev.filter((item) => item.id !== id));
  
        await Swal.fire({
          icon: "success",
          title: translations[language].deleteSuccessTitle,
          text: translations[language].deleteSuccessText,
        });
      } catch (error) {
        console.error("Error deleting:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while deleting the work experience.",
        });
      }
    }
  };
  

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-8 font-prompt">
      <div className="p-8 rounded-lg shadow-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">
            {translations[language].title}
          </h1>
          <Link
            to="/dashboard/workexperiences/add"
            className="btn bg-blue text-white hover:bg-blue"
          >
            {translations[language].add}
          </Link>
        </div>

        {workExps.length === 0 ? (
          <div className="text-center text-gray-500">
            {translations[language].noData}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border-collapse border border-gray-300">
              <thead className="sticky-top bg-gray-200">
                <tr>
                  <th className="border p-2 text-center">
                    {translations[language].id}
                  </th>
                  <th className="border p-2 text-center">
                    {translations[language].company}
                  </th>
                  <th className="border p-2 text-center">
                    {translations[language].project}
                  </th>
                  <th className="border p-2 text-center">
                    {translations[language].images}
                  </th>
                  <th className="border p-2 text-center">
                    {translations[language].actions}
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {workExps.map((exp, index) => (
                  <tr key={exp.id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{exp.company_name}</td>
                    <td className="border p-2">{exp.project_title}</td>
                    <td className="border p-2">{exp.images?.length || 0}</td>
                    <td className="border p-2">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Link
                          to={`/dashboard/workexperiences/details/${exp.id}`}
                          className="btn btn-sm bg-blue text-white hover:bg-blue"
                        >
                          {language === "th" ? "ดูรายละเอียด" : "Details"}
                        </Link>
                        <Link
                          to={`/dashboard/workexperiences/edit/${exp.id}`}
                          className="btn btn-sm btn-success text-white"
                        >
                          {translations[language].edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          {translations[language].delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkExpContent;
