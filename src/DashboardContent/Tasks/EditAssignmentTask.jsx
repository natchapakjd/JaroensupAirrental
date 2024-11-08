import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditAssignmentTask = () => {
  const { assignmentId } = useParams(); // Get the assignment ID from the URL params
  const [task, setTask] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedTechId, setSelectedTechId] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable

  // Fetch task and technician data
  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        // Fetch existing assignment data
        const response = await axios.get(`${apiUrl}/appointment-assign/${assignmentId}`);
        const { task_id, tech_id } = response.data;
        setSelectedTaskId(task_id);
        setSelectedTechId(tech_id);
        
        // Fetch all tasks and technicians (if needed for select options)
        const tasksResponse = await axios.get(`${apiUrl}/tasks`);
        const techniciansResponse = await axios.get(`${apiUrl}/technicians`);

        setTask(tasksResponse.data);
        setTechnician(techniciansResponse.data);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
      }
    };

    fetchAssignmentData();
  }, [assignmentId, apiUrl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/appointment/${assignmentId}`, {
        task_id: selectedTaskId,
        tech_id: selectedTechId,
      });

      if (response.status === 200) {
        navigate('/dashboard/tasks/assign'); // Redirect after successful update
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  // Render loading state or form
  if (!task || !technician) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h2 className="text-2xl mb-4">Edit Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Task</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Task</option>
            {task.map((taskItem) => (
              <option key={taskItem.task_id} value={taskItem.task_id}>
                {taskItem.task_id}. {taskItem.description}
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
            {technician.map((tech) => (
              <option key={tech.tech_id} value={tech.tech_id}>
                {tech.tech_id}. {tech.firstname} {tech.lastname}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn bg-blue text-white hover:bg-blue">Update Assignment</button>
      </form>
    </div>
  );
};

export default EditAssignmentTask;
