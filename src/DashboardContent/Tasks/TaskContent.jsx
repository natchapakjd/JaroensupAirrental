import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode"; // Fix for jwtDecode import

const TaskContent = () => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const techId = decodedToken.technicianId;

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
  }, []);

  const fetchTasks = async () => {
    try {
      let tasksResponse;
      if (role === 2) {
        tasksResponse = await axios.get(`${apiUrl}/tasks/assigned/${techId}`);
      } else {
        tasksResponse = await axios.get(`${apiUrl}/tasks`);
      }

      const fetchedTasks = tasksResponse.data.tasks || tasksResponse.data;
      setTasks(fetchedTasks.filter((task) => task.task_type_id === 1));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/statuses`);
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${apiUrl}/task/${taskId}`, { withCredentials: true });
        if (response.status === 204) {
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
          setTasks(tasks.filter((task) => task.task_id !== taskId));
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleViewDetails = (taskId) => {
    navigate(`/dashboard/tasks/${taskId}`);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status_name === filterStatus;
    const matchesSearch =
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mt-8">Task List</h2>
        <div className="flex gap-2">
          {role === 3 && (
            <>
              <Link to="/dashboard/tasks/add">
                <button className="btn bg-blue text-white hover:bg-blue">Add Task</button>
              </Link>
              <Link to="/dashboard/tasks/assign">
                <button className="btn btn-success text-white">Assign Task</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by description or type..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          {statuses.map((status) => (
            <option key={status.status_id} value={status.status_name}>
              {status.status_name}
            </option>
          ))}
        </select>
      </div>

      <table className="table w-full border-collapse border border-gray-300">
        <thead className="sticky top-0 bg-gray-200">
          <tr>
            <th className="border p-2 text-center">ID</th>
            <th className="border p-2 text-center">Type</th>
            <th className="border p-2 text-center">Description</th>
            <th className="border p-2 text-center">Due Date</th>
            <th className="border p-2 text-center">Due Time</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task.task_id} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{task.task_id}</td>
                <td className="border p-2 text-center">{task.type_name}</td>
                <td className="border p-2 text-center">{task.description}</td>
                <td className="border p-2 text-center">
                  {new Date(task.appointment_date).toLocaleDateString()}
                </td>
                <td className="border p-2 text-center">
                  {new Date(task.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="border p-2 text-center">{task.status_name}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {role === 3 && (
                      <>
                        <Link to={`/dashboard/tasks/edit/${task.task_id}`}>
                          <button className="btn btn-success text-white">Edit</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(task.task_id)}
                          className="btn bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleViewDetails(task.task_id)}
                      className="btn bg-blue text-white hover:bg-blue"
                    >
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-4 text-center">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskContent;
