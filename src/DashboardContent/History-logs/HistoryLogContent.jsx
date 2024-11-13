import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HistoryLogContent = () => {
  const [adminLogs, setAdminLogs] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const adminResponse = await axios.get(`${apiUrl}/adminLogs`);
        setAdminLogs(adminResponse.data);

        const taskResponse = await axios.get(`${apiUrl}/task-log`);
        setTaskLogs(taskResponse.data);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          title: "Error",
          text: "Failed to load logs.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto h-screen">
      <h2 className="text-xl font-semibold mb-4">Admin Logs</h2>
      <table className="table w-full border-collapse border border-gray-300 mb-8">
        <thead className='sticky-top bg-gray-200'>
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
                <td className="border p-2 text-center">{log.log_id}</td>
                <td className="border p-2 text-center">{log.admin_id}</td>
                <td className="border p-2 text-center">{log.action}</td>
                <td className="border p-2 text-center">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 p-4">No admin logs available</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-4">Task Logs</h2>
      <table className="table w-full border-collapse border border-gray-300">
        <thead className='sticky-top bg-gray-200'>
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
                <td className="border p-2 text-center">{log.log_id}</td>
                <td className="border p-2 text-center">{log.task_id}</td>
                <td className="border p-2 text-center">{log.user_id}</td>
                <td className="border p-2 text-center">{log.action}</td>
                <td className="border p-2 text-center">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border border-gray-300 p-4">No task logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryLogContent;
