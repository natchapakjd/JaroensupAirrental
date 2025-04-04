import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const translations = {
  th: {
    adminLogs: "บันทึกการทำงานของระบบโดยรวม",
    taskLogs: "บันทึกการทำงานของงาน",
    logId: "รหัสบันทึก",
    adminId: "ชื่อแอดมิน",
    taskId: "รหัสงาน",
    userId: "รหัสผู้ใช้",
    action: "การกระทำ",
    date: "วันที่",
    noLogs: "ไม่มีบันทึก",
    page: "หน้า",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    errorFetch: "ไม่สามารถโหลดข้อมูลบันทึกได้",
    of: "จาก",
    details: "รายละเอียดงาน",
    task_type: "ประเภทงาน",
    role: "บทบาท",
    allRoles: "ทุกบทบาท",
  },
  en: {
    adminLogs: "System Logs Overall",
    taskLogs: "Task Logs",
    logId: "Log ID",
    adminId: "Admin Name",
    taskId: "Task ID",
    userId: "User ID",
    action: "Action",
    date: "Date",
    noLogs: "No logs available",
    page: "Page",
    previous: "Previous",
    next: "Next",
    errorFetch: "Failed to load logs.",
    of: "of",
    details: "details",
    task_type: "task type",
    role: "Role",
    allRoles: "All Roles",
  },
};

const HistoryLogContent = () => {
  const [adminLogs, setAdminLogs] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [adminTotalPages, setAdminTotalPages] = useState(0);
  const [taskTotalPages, setTaskTotalPages] = useState(0);
  const [adminCurrentPage, setAdminCurrentPage] = useState(1);
  const [taskCurrentPage, setTaskCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ค้นหาใน Task Logs
  const [statusFilter, setStatusFilter] = useState(""); // กรองประเภทงานใน Task Logs
  const [roleFilterTask, setRoleFilterTask] = useState(""); // กรอง role ใน Task Logs
  const [searchTermTable, setSearchTermTable] = useState(""); // ค้นหาใน Admin Logs
  const [roleFilterAdmin, setRoleFilterAdmin] = useState(""); // กรอง role ใน Admin Logs
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const logsPerPage = 10;
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const role = decodeToken.role;
  const techId = decodeToken.id;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "en";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  const fetchAdminLogs = async (page) => {
    try {
      const response = await axios.get(`${apiUrl}/adminLogs-paging`, {
        params: { page, limit: logsPerPage },
      });
      setAdminLogs(response.data.adminLogs);
      setAdminTotalPages(Math.ceil(response.data.total / logsPerPage));
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: translations[language].errorFetch,
        icon: "error",
      });
    }
  };

  const fetchTaskLogs = async (page) => {
    try {
      let response;
      if (role === 2) {
        response = await axios.get(`${apiUrl}/v2/task-log-paging/${techId}`, {
          params: { page, limit: logsPerPage },
        });
      } else {
        response = await axios.get(`${apiUrl}/task-log-paging`, {
          params: { page, limit: logsPerPage },
        });
      }
      setTaskLogs(response.data.taskLogs);
      setTaskTotalPages(Math.ceil(response.data.total / logsPerPage));
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error",
        text: translations[language].errorFetch,
        icon: "error",
      });
    }
  };

  // การกรอง Admin Logs
  const filteredAdminLogsTable = adminLogs.filter((log) => {
    const searchTermLower = searchTermTable.toLowerCase();
    const matchesSearch =
      (log.firstname?.toLowerCase().includes(searchTermLower) || "") ||
      (log.lastname?.toLowerCase().includes(searchTermLower) || "");
    const matchesRole = roleFilterAdmin
      ? log.role_name?.toLowerCase() === roleFilterAdmin.toLowerCase()
      : true;

    return matchesSearch && matchesRole;
  });

  // การกรอง Task Logs
  const filteredTaskLogs = taskLogs.filter((tl) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (tl.firstname?.toLowerCase().includes(searchTermLower) || "") ||
      (tl.lastname?.toLowerCase().includes(searchTermLower) || "") ||
      (tl.type_name?.toLowerCase().includes(searchTermLower) || "");
    const matchesStatus = statusFilter ? tl.type_name === statusFilter : true;
    const matchesRole = roleFilterTask
      ? tl.role_name?.toLowerCase() === roleFilterTask.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesRole;
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAdminLogs(adminCurrentPage),
      fetchTaskLogs(taskCurrentPage),
    ]).finally(() => setLoading(false));
  }, [adminCurrentPage, taskCurrentPage]);

  const handlePageChange = (setPage, currentPage, isNext, totalPages) => {
    const newPage = isNext ? currentPage + 1 : currentPage - 1;
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  const handleTaskDetails = (task_id, task_type_id) => {
    if (task_type_id === 11) {
      navigate(`/dashboard/borrows/details/${task_id}`);
    } else if (task_type_id === 9) {
      navigate(`/dashboard/orders/detail-log/${task_id}`);
    } else {
      navigate(`/dashboard/tasks/${task_id}`);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-full">
        {role === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {translations[language].adminLogs}
            </h2>
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="Search by firstname or lastname"
                value={searchTermTable}
                onChange={(e) => setSearchTermTable(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <select
                value={roleFilterAdmin}
                onChange={(e) => setRoleFilterAdmin(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">{translations[language].allRoles}</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse border border-gray-300 mb-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2 text-center">
                      {translations[language].logId}
                    </th>
                    <th className="border p-2 text-center">
                      {translations[language].adminId}
                    </th>
                    <th className="border p-2 text-center">
                      {translations[language].role}
                    </th>
                    <th className="border p-2 text-center">
                      {translations[language].action}
                    </th>
                    <th className="border p-2 text-center">
                      {translations[language].date}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredAdminLogsTable.length > 0 ? (
                    filteredAdminLogsTable.map((log, index) => (
                      <tr key={index + 1}>
                        <td className="border p-2">
                          {(adminCurrentPage - 1) * logsPerPage + index + 1}
                        </td>
                        <td className="border p-2">
                          {log.firstname} {log.lastname}
                        </td>
                        <td className="border p-2">
                          {log.role_name || "N/A"}
                        </td>
                        <td className="border p-2">{log.action}</td>
                        <td className="border p-2">
                      {new Date(
                        new Date(log.timestamp).getTime() +
                          7 * 60 * 60 * 1000
                      ).toLocaleString("th-TH", {
                        timeZone: "Asia/Bangkok",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
                      })}
                    </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border p-4">
                        {translations[language].noLogs}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <p
                onClick={() =>
                  handlePageChange(
                    setAdminCurrentPage,
                    adminCurrentPage,
                    false,
                    adminTotalPages
                  )
                }
                className={`cursor-pointer ${
                  adminCurrentPage === 1 ? "text-gray-400" : "text-black"
                }`}
              >
                {translations[language].previous}
              </p>
              <span>
                {translations[language].page} {adminCurrentPage}{" "}
                {translations[language].of} {adminTotalPages}
              </span>
              <p
                onClick={() =>
                  handlePageChange(
                    setAdminCurrentPage,
                    adminCurrentPage,
                    true,
                    adminTotalPages
                  )
                }
                className={`cursor-pointer ${
                  adminCurrentPage === adminTotalPages
                    ? "text-gray-400"
                    : "text-black"
                }`}
              >
                {translations[language].next}
              </p>
            </div>
          </>
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4">
          {translations[language].taskLogs}
        </h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or type_name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">ประเภทงานทั้งหมด</option>
            <option value="งานเช่าเครื่องปรับอากาศ">งานเช่า</option>
            <option value="ขายสินค้า">งานขาย</option>
            <option value="ยืมอุปกรณ์">งานยืมอุปกรณ์</option>
          </select>
          <select
            value={roleFilterTask}
            onChange={(e) => setRoleFilterTask(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">{translations[language].allRoles}</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-center">
                  {translations[language].logId}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].userId}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].role}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].task_type}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].action}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].date}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].details}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredTaskLogs.length > 0 ? (
                filteredTaskLogs.map((log, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2">
                      {(taskCurrentPage - 1) * logsPerPage + index + 1}
                    </td>
                    <td className="border p-2">
                      {log.firstname} {log.lastname}
                    </td>
                    <td className="border p-2">
                      {log.role_name || "N/A"}
                    </td>
                    <td className="border p-2">{log.type_name}</td>
                    <td className="border p-2">{log.action}</td>
                    <td className="border p-2 text-center">
                      {new Date(
                        new Date(log.created_at).getTime() +
                          7 * 60 * 60 * 1000
                      ).toLocaleString("th-TH", {
                        timeZone: "Asia/Bangkok",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
                      })}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          handleTaskDetails(log.task_id, log.task_type_id)
                        }
                        className="underline"
                      >
                        {translations[language].details}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-4">
                    {translations[language].noLogs}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <p
            onClick={() =>
              handlePageChange(
                setTaskCurrentPage,
                taskCurrentPage,
                false,
                taskTotalPages
              )
            }
            className={`cursor-pointer ${
              taskCurrentPage === 1 ? "text-gray-400" : "text-black"
            }`}
          >
            {translations[language].previous}
          </p>
          <span>
            {translations[language].page} {taskCurrentPage}{" "}
            {translations[language].of} {taskTotalPages}
          </span>
          <p
            onClick={() =>
              handlePageChange(
                setTaskCurrentPage,
                taskCurrentPage,
                true,
                taskTotalPages
              )
            }
            className={`cursor-pointer ${
              taskCurrentPage === taskTotalPages
                ? "text-gray-400"
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

export default HistoryLogContent;