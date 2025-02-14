import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");
  const [linetoken, setLineToken] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  // Read language from localStorage (default to English)
  const language = localStorage.getItem("language") || "en";

  // Translation object
  const translations = {
    en: {
      assignTask: "Assign Task",
      selectTask: "Select Task",
      selectTechnician: "Select Technician",
      assignedTasks: "Assigned Tasks",
      appointmentId: "Appointment ID",
      task: "Task",
      technicianName: "Technician Name",
      action: "Action",
      noAssignedTasks: "No assigned tasks",
      assignButton: "Assign Task",
      deleteConfirmationTitle: "Are you sure?",
      deleteConfirmationText: "You won't be able to revert this!",
      deleteSuccessTitle: "Deleted!",
      deleteSuccessText: "The task has been deleted.",
      deleteErrorTitle: "Error!",
      deleteErrorText: "There was an issue deleting the task.",
    },
    th: {
      assignTask: "มอบหมายงาน",
      selectTask: "เลือกงาน",
      selectTechnician: "เลือกช่างภายนอก",
      assignedTasks: "งานที่ได้รับมอบหมาย",
      appointmentId: "รหัสการนัดหมาย",
      task: "งาน",
      technicianName: "ชื่อช่างภายนอก",
      action: "การกระทำ",
      noAssignedTasks: "ไม่มีงานที่ได้รับมอบหมาย",
      assignButton: "มอบหมายงาน",
      deleteConfirmationTitle: "คุณแน่ใจหรือไม่?",
      deleteConfirmationText: "คุณจะไม่สามารถย้อนกลับได้!",
      deleteSuccessTitle: "ลบเรียบร้อย!",
      deleteSuccessText: "งานถูกลบแล้ว",
      deleteErrorTitle: "ข้อผิดพลาด!",
      deleteErrorText: "มีปัญหาในการลบงาน",
    },
  };

  const t = translations[language]; // Shortcut for current translations

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
  }, []);

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
        await axios.post(`${apiUrl}/send-message`, {
          userId: lineTokenResponse.data[0].linetoken,
          message: "แจ้งเตือนจากระบบ:\n\nคุณได้รับมอบหมายงานใหม่จากแอดมินในระบบ.\n\nกรุณาตรวจสอบและดำเนินการตามความเหมาะสม.\n\nขอบคุณที่เลือกใช้บริการของเรา!",
        });

        navigate("/dashboard/tasks/assign");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const handleDelete = async (assignmentId) => {
    const result = await Swal.fire({
      title: t.deleteConfirmationTitle,
      text: t.deleteConfirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/appointment/${assignmentId}`);
        if (response.status === 200) {
          const updatedAssignedTasks = await axios.get(`${apiUrl}/appointments`);
          setAssignedTasks(updatedAssignedTasks.data);
          Swal.fire(t.deleteSuccessTitle, t.deleteSuccessText, "success");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire(t.deleteErrorTitle, t.deleteErrorText, "error");
      }
    }
  };

  const handleEdit = (assignmentId) => {
    navigate(`/dashboard/tasks/assign/edit/${assignmentId}`);
  };

  const unassignedTasks = tasks.filter(
    (task) => !assignedTasks.some((assigned) => assigned.task_id === task.task_id)
  );

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full ">
      <h2 className="text-2xl mb-4">{t.assignTask}</h2>
      <form onSubmit={handleAssign} className="space-y-4 text-sm font-medium">
        <div>
          <label className="block mb-2">{t.selectTask}</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">{t.selectTask}</option>
            {unassignedTasks.map((task,index) => (
              <option key={index+1} value={task.task_id}>
                {index+1}. {task.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">{t.selectTechnician}</label>
          <select
            value={selectedTechId}
            onChange={(e) => setSelectedTechId(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">{t.selectTechnician}</option>
            {technicians.map((tech,index) => (
              <option key={index+1} value={tech.tech_id}>
                {index+1}. {tech.firstname} {tech.lastname}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn bg-blue text-white hover:bg-blue">{t.assignButton}</button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl mb-4">{t.assignedTasks}</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">{t.appointmentId}</th>
              <th className="border border-gray-300 p-2">{t.task}</th>
              <th className="border border-gray-300 p-2">{t.technicianName}</th>
              <th className="border border-gray-300 p-2">{t.action}</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {assignedTasks.length > 0 ? (
              assignedTasks.map((assignment) => (
                <tr key={assignment.assignment_id}>
                  <td className="border border-gray-300 p-2">{assignment.assignment_id}</td>
                  <td className="border border-gray-300 p-2">{assignment.description}</td>
                  <td className="border border-gray-300 p-2">
                    {assignment.firstname} {assignment.lastname}
                  </td>
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
                <td colSpan="4" className="border border-gray-300 p-4">
                  {t.noAssignedTasks}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignTask;
