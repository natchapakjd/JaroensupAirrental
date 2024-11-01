import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`${apiUrl}/technicians`);
        setTechnicians(response.data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/appointments`);
        setAssignedTasks(response.data);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchTasks();
    fetchTechnicians();
    fetchAssignedTasks();
  }, [apiUrl]);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/appointments`, {
        task_id: selectedTaskId,
        tech_id: selectedTechId,
      });

      if (response.status === 201) {
        const updatedAssignedTasks = await axios.get(`${apiUrl}/appointments`);
        setAssignedTasks(updatedAssignedTasks.data);
        navigate("/dashboard/tasks");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h2 className="text-2xl mb-4">Assign Task</h2>
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block mb-2">Select Task</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task.task_id} value={task.task_id}>
                {task.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Select Technician</label>
          <select
            value={selectedTechId}
            onChange={(e) => setSelectedTechId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Technician</option>
            {technicians.map((tech) => (
              <option key={tech.tech_id} value={tech.tech_id}>
                {tech.tech_id} 
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn bg-blue text-white hover:bg-blue">Assign Task</button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl mb-4">Assigned Tasks</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Task ID</th>
              <th className="border border-gray-300 p-2">Technician ID</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {assignedTasks.length > 0 ? (
              assignedTasks.map((assignment) => (
                <tr key={assignment.assignment_id}>
                  <td className="border border-gray-300 p-2">{assignment.task_id}</td>
                  <td className="border border-gray-300 p-2">{assignment.tech_id}</td>
                  <td className="border border-gray-300 p-2">
                    <Link
                      to={`/dashboard/tasks/${assignment.task_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border border-gray-300 p-4">No assigned tasks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignTask;
