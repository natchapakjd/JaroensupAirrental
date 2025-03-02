import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";

const ApplicantContent = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Fetch language from localStorage
  const language = localStorage.getItem("language") || "en"; // Default to 'en' if no language is set

  const translations = {
    en: {
      title: "Applicants List",
      addApplicant: "Add Applicant",
      searchPlaceholder: "Search by Firstname or Lastname",
      filterStatus: "Filter by Status",
      filterPending: "Pending",
      filterHiring: "Hiring",
      noApplicantsFound: "No applicants found",
      accept: "Accept",
      sendEmail: "Send Email",
      viewDetails: "View details",
      reject: "Reject",
      previous: "Previous",
      next: "Next",
      confirmDelete: "Are you sure you want to delete this applicant?",
      confirmAccept: "Are you sure you want to accept this applicant?",
      deleteSuccess: "Applicant deleted successfully!",
      acceptSuccess: "Applicant accepted and email sent!",
      errorOccurred: "An error occurred!",
      of: "of",
      page: "page",
      // Table headers
      headerApplicantID: "Applicant ID",
      headerFirstname: "Firstname",
      headerLastname: "Lastname",
      headerDob: "Date of Birth",
      headerEmail: "Email",
      headerPosition: "Position Applied",
      headerStatus: "Status",
      headerApplicantDate: "Applicant Date",
      headerNote: "Note",
      headerAction: "Action",
    },
    th: {
      title: "รายชื่อผู้สมัคร",
      addApplicant: "เพิ่มผู้สมัคร",
      searchPlaceholder: "ค้นหาตามชื่อหรือนามสกุล",
      filterStatus: "กรองตามสถานะ",
      filterPending: "รอดำเนินการ",
      filterHiring: "กำลังพิจารณา",
      noApplicantsFound: "ไม่พบผู้สมัคร",
      accept: "ยอมรับ",
      sendEmail: "ส่งอีเมล",
      viewDetails: "ดูรายละเอียด",
      reject: "ปฏิเสธ",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      confirmDelete: "คุณแน่ใจหรือว่าต้องการลบผู้สมัครนี้?",
      confirmAccept: "คุณแน่ใจหรือว่าต้องการยอมรับผู้สมัครนี้?",
      deleteSuccess: "ลบผู้สมัครสำเร็จ!",
      acceptSuccess: "ยอมรับผู้สมัครและส่งอีเมลสำเร็จ!",
      errorOccurred: "เกิดข้อผิดพลาด!",
      of: "จาก",
      page: "หน้า",
      // Table headers
      headerApplicantID: "รหัสผู้สมัคร",
      headerFirstname: "ชื่อ",
      headerLastname: "นามสกุล",
      headerDob: "วันเกิด",
      headerEmail: "อีเมล",
      headerPosition: "ตำแหน่งที่สมัคร",
      headerStatus: "สถานะ",
      headerApplicantDate: "วันที่สมัคร",
      headerNote: "หมายเหตุ",
      headerAction: "การกระทำ",
    },
  };

  const t = translations[language]; // Get the current translations

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/applicants-paging`,
          {
            params: { page: currentPage, pageSize },
          }
        );
        setApplicants(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (err) {
        setError("Cannot load applicants data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [currentPage, pageSize]); // Re-fetch when page or pageSize changes

  useEffect(() => {
    const filtered = applicants.filter((applicant) => {
      const matchesSearch =
        applicant.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        applicant.last_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "" || applicant.status_id.toString() === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredApplicants(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize)); // Update total pages based on filtered data
  }, [searchQuery, filterStatus, applicants, pageSize]);

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: t.confirmDelete,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/applicants/${id}`
        );
        if (response.status === 200) {
          Swal.fire({
            title: t.deleteSuccess,
            icon: "success",
          });
          setApplicants(
            applicants.filter((applicant) => applicant.applicant_id !== id)
          );
        } else {
          throw new Error("Unable to delete applicant");
        }
      } catch (error) {
        Swal.fire({
          title: t.errorOccurred,
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const handleAccept = async (id) => {
    const confirmation = await Swal.fire({
      title: t.confirmAccept,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
      cancelButtonText: "No, Cancel",
    });

    if (confirmation.isConfirmed) {
      try {
        const acceptResponse = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/applicants/accept/${id}`
        );
        if (acceptResponse.status === 200) {
          const emailResponse = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/applicant-congratulations/${id}`
          );
          if (emailResponse.status === 200) {
            Swal.fire({
              title: t.acceptSuccess,
              icon: "success",
            });
          } else {
            throw new Error("Unable to send email");
          }
        }
      } catch (error) {
        Swal.fire({
          title: t.errorOccurred,
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/applicants/${id}`);
  };

  const handleSendEmail = (id) => {
    navigate(`/dashboard/applicants/sending-email/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-8">
      {" "}
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mt-8 mb-5">{t.title}</h2>
          <Link to="/dashboard/applicants/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              {t.addApplicant}
            </button>
          </Link>
        </div>
        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input input-bordered w-full md:w-1/3"
          >
            <option value="">{t.filterStatus}</option>
            <option value="1">{t.filterPending}</option>
            <option value="7">{t.filterHiring}</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300 font-prompt">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">
                  {translations[language].headerApplicantID}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerFirstname}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerLastname}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerDob}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerEmail}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerPosition}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerStatus}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerApplicantDate}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerNote}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].headerAction}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredApplicants.length > 0 ? (
                filteredApplicants
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((applicant, index) => (
                    <tr key={index + 1}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {applicant.first_name}
                      </td>
                      <td className="border p-2 text-center">
                        {applicant.last_name}
                      </td>
                      <td className="border p-2 text-center">
                        {new Date(applicant.date_of_birth).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {applicant.email}
                      </td>
                      <td className="border p-2 text-center">
                        {applicant.position_applied}
                      </td>
                      <td className="border p-2 text-center">
                        {applicant.status_name}
                      </td>
                      <td className="border p-2 text-center">
                        {new Date(
                          applicant.application_date
                        ).toLocaleDateString("en-GB")}
                      </td>
                      <td className="border p-2 text-center">
                        {applicant.notes || "No notes"}
                      </td>
                      <td className="border p-2 text-center">
                        {applicant.status_id === 1 && (
                          <button
                            className="btn btn-success text-white mr-2"
                            onClick={() => handleAccept(applicant.applicant_id)}
                          >
                            {t.accept}
                          </button>
                        )}
                        {applicant.status_id === 7 && (
                          <button
                            className="btn btn-success text-white mr-2"
                            onClick={() =>
                              handleSendEmail(applicant.applicant_id)
                            }
                          >
                            {t.sendEmail}
                          </button>
                        )}
                        <button
                          className="btn bg-blue hover:bg-blue text-white"
                          onClick={() =>
                            handleViewDetails(applicant.applicant_id)
                          }
                        >
                          {t.viewDetails}
                        </button>

                        <button
                          className="btn btn-error text-white ml-2"
                          onClick={() => handleDelete(applicant.applicant_id)}
                        >
                          {t.reject}
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="9" className="border border-gray-300 p-4">
                    {t.noApplicantsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {t.previous}
          </p>
          <span>{`${t.page}
${currentPage} ${t.of} ${totalPages}`}</span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
          >
            {t.next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantContent;
