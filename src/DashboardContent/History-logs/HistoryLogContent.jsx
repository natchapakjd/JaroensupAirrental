import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HistoryLogContent = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/adminLogs`);
        setLogs(response.data);
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
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter">
      <h2 className="text-xl font-semibold mb-4">Admin Logs</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Log ID</th>
            <th className="border border-gray-300 p-2">Admin ID</th>
            <th className="border border-gray-300 p-2">Action</th>
            <th className="border border-gray-300 p-2">Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.log_id}>
                <td className="border border-gray-300 p-2">{log.log_id}</td>
                <td className="border border-gray-300 p-2">{log.admin_id}</td>
                <td className="border border-gray-300 p-2">{log.action}</td>
                <td className="border border-gray-300 p-2">{new Date(log.timestamp).toLocaleString()}</td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 p-4">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryLogContent;
