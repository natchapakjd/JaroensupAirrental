import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';

const HistoryLogContent = () => {
  const [adminLogs, setAdminLogs] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [adminTotalPages, setAdminTotalPages] = useState(0);
  const [taskTotalPages, setTaskTotalPages] = useState(0);
  const [adminCurrentPage, setAdminCurrentPage] = useState(1);
  const [taskCurrentPage, setTaskCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const logsPerPage = 10;

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
        title: 'Error',
        text: 'Failed to load admin logs.',
        icon: 'error',
      });
    }
  };

  const fetchTaskLogs = async (page) => {
    try {
      const response = await axios.get(`${apiUrl}/task-log-paging`, {
        params: { page, limit: logsPerPage },
      });
      setTaskLogs(response.data.taskLogs);
      setTaskTotalPages(Math.ceil(response.data.total / logsPerPage));
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load task logs.',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdminLogs(adminCurrentPage), fetchTaskLogs(taskCurrentPage)]).finally(() =>
      setLoading(false)
    );
  }, [adminCurrentPage, taskCurrentPage]);

  const handlePageChange = (setPage, currentPage, isNext, totalPages) => {
    const newPage = isNext ? currentPage + 1 : currentPage - 1;
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <h2 className="text-xl font-semibold mb-4">Admin Logs</h2>
      <table className="table w-full border-collapse border border-gray-300 mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-center">Log ID</th>
            <th className="border p-2 text-center">Admin ID</th>
            <th className="border p-2 text-center">Action</th>
            <th className="border p-2 text-center">Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {adminLogs.length > 0 ? (
            adminLogs.map((log) => (
              <tr key={log.log_id}>
                <td className="border p-2">{log.log_id}</td>
                <td className="border p-2">{log.admin_id}</td>
                <td className="border p-2">{log.action}</td>
                <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-4">No admin logs available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <p
          onClick={() =>
            handlePageChange(setAdminCurrentPage, adminCurrentPage, false, adminTotalPages)
          }
          className={`cursor-pointer ${adminCurrentPage === 1 ? 'text-gray-400' : 'text-black'}`}
        >
          Previous
        </p>
        <span>
          Page {adminCurrentPage} of {adminTotalPages}
        </span>
        <p
          onClick={() =>
            handlePageChange(setAdminCurrentPage, adminCurrentPage, true, adminTotalPages)
          }
          className={`cursor-pointer ${
            adminCurrentPage === adminTotalPages ? 'text-gray-400' : 'text-black'
          }`}
        >
          Next
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Task Logs</h2>
      <table className="table w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-center">Log ID</th>
            <th className="border p-2 text-center">Task ID</th>
            <th className="border p-2 text-center">User ID</th>
            <th className="border p-2 text-center">Action</th>
            <th className="border p-2 text-center">Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {taskLogs.length > 0 ? (
            taskLogs.map((log) => (
              <tr key={log.log_id}>
                <td className="border p-2">{log.log_id}</td>
                <td className="border p-2">{log.task_id}</td>
                <td className="border p-2">{log.user_id}</td>
                <td className="border p-2">{log.action}</td>
                <td className="border p-2">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-4">No task logs available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <p
          onClick={() =>
            handlePageChange(setTaskCurrentPage, taskCurrentPage, false, taskTotalPages)
          }
          className={`cursor-pointer ${taskCurrentPage === 1 ? 'text-gray-400' : 'text-black'}`}
        >
          Previous
        </p>
        <span>
          Page {taskCurrentPage} of {taskTotalPages}
        </span>
        <p
          onClick={() =>
            handlePageChange(setTaskCurrentPage, taskCurrentPage, true, taskTotalPages)
          }
          className={`cursor-pointer ${
            taskCurrentPage === taskTotalPages ? 'text-gray-400' : 'text-black'
          }`}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default HistoryLogContent;
