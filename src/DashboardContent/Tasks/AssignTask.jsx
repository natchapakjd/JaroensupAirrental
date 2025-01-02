import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons for edit and delete
import Swal from "sweetalert2";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");
  const [linetoken, setLineToken] = useState(""); // State to hold Line token
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

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
  }, [assignedTasks]); // Dependency is `apiUrl` to ensure fetch logic runs correctly

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

        const lineTokenResponse = await axios.get(`${apiUrl}/linetoken-tech/${selectedTechId}`);
        setLineToken(lineTokenResponse.data[0].linetoken); 
        const messageResponse = await axios.post(
          `${apiUrl}/send-message`,
          {
            userId: lineTokenResponse.data[0].linetoken, 
            message: `แจ้งเตือนจากระบบ:\n\nคุณได้รับมอบหมายงานใหม่จากแอดมินในระบบ.\n\nกรุณาตรวจสอบและดำเนินการตามความเหมาะสม.\n\nขอบคุณที่เลือกใช้บริการของเรา!`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (messageResponse.status === 200) {
          console.log("Message sent successfully!");
        } else {
          throw new Error("Failed to send message");
        }
      
        // Redirect to the task assignment page
        navigate("/dashboard/tasks/assign");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  
  const handleDelete = async (assignmentId) => {
    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    // Proceed with delete if user confirms
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/appointment/${assignmentId}`);
        if (response.status === 200) {
          const updatedAssignedTasks = await axios.get(`${apiUrl}/appointments`);
          setAssignedTasks(updatedAssignedTasks.data);
          Swal.fire(
            'Deleted!',
            'The task has been deleted.',
            'success'
          );
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire(
          'Error!',
          'There was an issue deleting the task.',
          'error'
        );
      }
    }
  };

  const handleEdit = (assignmentId) => {
    navigate(`/dashboard/tasks/assign/edit/${assignmentId}`);
  };

  // Filter out tasks that are already assigned
  const unassignedTasks = tasks.filter(
    (task) => !assignedTasks.some((assigned) => assigned.task_id === task.task_id)
  );

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full ">
      <h2 className="text-2xl mb-4">Assign Task</h2>
      <form onSubmit={handleAssign} className="space-y-4 text-sm font-medium">
        <div>
          <label className="block mb-2">Select Task</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Task</option>
            {unassignedTasks.map((task) => (
              <option key={task.task_id} value={task.task_id}>
                {task.task_id}. {task.description}
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
                {tech.tech_id}. {tech.firstname} {tech.lastname}
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
              <th className="border border-gray-300 p-2">Appointment ID</th>
              <th className="border border-gray-300 p-2">Task</th>
              <th className="border border-gray-300 p-2">Technician Name</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {assignedTasks.length > 0 ? (
              assignedTasks.map((assignment) => (
                <tr key={assignment.assignment_id}>
                  <td className="border border-gray-300 p-2">{assignment.assignment_id}</td>
                  <td className="border border-gray-300 p-2">{assignment.description}</td>
                  <td className="border border-gray-300 p-2">{assignment.firstname} {assignment.lastname}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center gap-2">
                    <FaEdit
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => handleEdit(assignment.assignment_id)}
                    />
                    
                    <FaTrash
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(assignment.assignment_id)}
                    />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-gray-300 p-4">No assigned tasks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignTask;
