import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const EditAssignmentTask = () => {
  const { assignmentId } = useParams(); // Get the assignment ID from the URL params
  const [task, setTask] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use the environment variable

  // Determine language from localStorage
  const language = localStorage.getItem("language") || "en";

  // Translation object
  const translation = {
    en: {
      pageTitle: "Edit Assignment",
      selectTask: "Select Task",
      selectTechnician: "Select Technician",
      updateButton: "Update Assignment",
    },
    th: {
      pageTitle: "แก้ไขการมอบหมายงาน",
      selectTask: "เลือกงาน",
      selectTechnician: "เลือกช่างเทคนิค",
      updateButton: "อัปเดตการมอบหมาย",
    },
  };

  // Fetch task and technician data
  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        // Fetch existing assignment data
        const response = await axios.get(
          `${apiUrl}/appointment-assign/${assignmentId}`
        );
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
      const response = await axios.put(
        `${apiUrl}/appointment/${assignmentId}`,
        {
          task_id: selectedTaskId,
          tech_id: selectedTechId,
        }
      );

      if (response.status === 200) {
        navigate("/dashboard/tasks/assign"); // Redirect after successful update
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  // Render loading state or form
  if (!task || !technician) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{translation[language].pageTitle}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              {translation[language].selectTask}
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="border p-2 w-full"
              required
            >
              <option value="">{translation[language].selectTask}</option>
              {task.map((taskItem, index) => (
                <option key={taskItem.task_id} value={taskItem.task_id}>
                  {index + 1}. {taskItem.firstname} {taskItem.lastname}: {taskItem.description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">
              {translation[language].selectTechnician}
            </label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="border p-2 w-full"
              required
            >
              <option value="">{translation[language].selectTechnician}</option>
              {technician.map((tech, index) => (
                <option key={index + 1} value={tech.tech_id}>
                  {index + 1}. {tech.firstname} {tech.lastname}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn bg-blue text-white hover:bg-blue"
          >
            {translation[language].updateButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentTask;
