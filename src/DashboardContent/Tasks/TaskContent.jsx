import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2"; // Import Swal for alerts

const TaskContent = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // To navigate programmatically
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksResponse = await axios.get(`${apiUrl}/tasks`);

      if (Array.isArray(tasksResponse.data)) {
        setTasks(tasksResponse.data);
      } else {
        console.error("Tasks response is not an array:", tasksResponse.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${apiUrl}/task/${taskId}`);
        console.log(response);
        if (response.status === 204) {
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          );
          setTasks(tasks.filter((task) => task.task_id !== taskId));
        } else {
          throw new Error("Failed to delete task.");
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
    navigate(`/dashboard/tasks/${taskId}`); // Navigate to TaskDetails page
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mt-8">Task List</h2>
        <div className="flex gap-2">
          <Link to="/dashboard/tasks/add">
            <button className="btn bg-blue text-white hover:bg-blue">Add Task</button>
          </Link>
          <Link to="/dashboard/tasks/assign">
            <button className="btn btn-success text-white">Assign Task</button>
          </Link>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Due Date</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.task_id}>
                <td className="border border-gray-300 p-2">{task.task_id}</td>
                <td className="border border-gray-300 p-2">{task.task_type_id}</td>
                <td className="border border-gray-300 p-2">{task.description}</td>
                <td className="border border-gray-300 p-2">{task.appointment_date}</td>
                <td className="border border-gray-300 p-2">{task.status}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center gap-2">
                    <Link to={`/dashboard/tasks/edit/${task.task_id}`}>
                      <button className="btn btn-success text-white ">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(task.task_id)}
                      className="btn bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewDetails(task.task_id)} // Navigate to details page
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
              <td colSpan="6" className="border border-gray-300 p-4">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskContent;
