import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import BackButtonEdit from "../../components/BackButtonEdit";

const AssignTask = () => {
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTechIds, setSelectedTechIds] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [taskTypes, setTaskTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  // Language and translations
  const language = localStorage.getItem("language") || "en";
  const translations = {
    en: {
      assignTask: "Assign Task",
      selectTask: "Select Task",
      selectTechnician: "Select Technician",
      assignedTasks: "Assigned Tasks",
      appointmentId: "Appointment ID",
      task: "Task description",
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
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      notificationSuccess: "Task assigned and technicians notified!",
      notificationError: "Failed to notify technicians.",
    },
    th: {
      assignTask: "มอบหมายงาน",
      selectTask: "เลือกงาน",
      selectTechnician: "เลือกช่าง",
      assignedTasks: "งานที่ได้รับมอบหมาย",
      appointmentId: "รหัสการนัดหมาย",
      task: "รายละเอียดงาน",
      technicianName: "ชื่อช่างที่ถูกมอบหมาย",
      action: "การกระทำ",
      noAssignedTasks: "ไม่มีงานที่ได้รับมอบหมาย",
      assignButton: "มอบหมายงาน",
      deleteConfirmationTitle: "คุณแน่ใจหรือไม่?",
      deleteConfirmationText: "คุณจะไม่สามารถย้อนกลับได้!",
      deleteSuccessTitle: "ลบเรียบร้อย!",
      deleteSuccessText: "งานถูกลบแล้ว",
      deleteErrorTitle: "ข้อผิดพลาด!",
      deleteErrorText: "มีปัญหาในการลบงาน",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      page: "หน้า",
      of: "จาก",
      notificationSuccess: "มอบหมายงานสำเร็จและแจ้งช่างเรียบร้อย!",
      notificationError: "ไม่สามารถแจ้งช่างได้",
    },
  };
  const t = translations[language];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasks`);
        const taskFilter = response.data.filter((task)=>task.status_id === 4 || task.task_type_id === 12)
        setTasks(taskFilter);
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
        const response = await axios.get(
          `${apiUrl}/assignments-paging?page=${currentPage}&limit=5`
        );
        setAssignedTasks(response.data.data);
        setTotalPages(response.data.total.totalPages);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasktypes`);
        const filteredTaskTypes = response.data.filter((type) =>
          ["งานเช่าเครื่องปรับอากาศ", "ล้างเครื่่องปรับอากาศ"].includes(type.type_name)
        );
        setTaskTypes(filteredTaskTypes);
      } catch (error) {
        console.error("Error fetching task types:", error);
      }
    };

    fetchTasks();
    fetchTechnicians();
    fetchTaskTypes();
    fetchAssignedTasks();
  }, [currentPage]);

  const handleAssign = async (e) => {
    e.preventDefault();
  
    const uniqueTechIds = [...new Set(selectedTechIds)].map((id) => parseInt(id, 10)); // Convert strings to numbers
    const selectedTask = tasks.find((task) => task.task_id === parseInt(selectedTaskId, 10));   
    try {
      // Assign the task
      await axios.post(`${apiUrl}/v2/appointments`, {
        task_id: selectedTaskId,
        tech_ids: uniqueTechIds,
      });
  
      // Fetch updated assigned tasks
      const updatedAssignedTasks = await axios.get(
        `${apiUrl}/assignments-paging?page=${currentPage}&limit=5`
      );
      setAssignedTasks(updatedAssignedTasks.data.data);
      setTotalPages(updatedAssignedTasks.data.total.totalPages);
  
      // Get linetoken of selected technicians
      const assignedTechs = technicians.filter((tech) =>
        uniqueTechIds.includes(tech.tech_id) // Now this should match
      );
      console.log("Assigned Techs:", assignedTechs);
  
      const linetokenArray = assignedTechs
        .filter((tech) => tech.linetoken) // Ensure linetoken exists
        .map((tech) => tech.linetoken);
      console.log("Linetoken Array:", linetokenArray);
  
      // Send LINE notification to all assigned technicians
      if (linetokenArray.length > 0) {
        const message = `คุณได้รับมอบหมายงานใหม่: ${selectedTask.description}`;
        await sendLineNotification(linetokenArray, message);
      } else {
        console.log("No valid linetokens found for notification.");
      }
  
      // Show success notification
      await Swal.fire({
        title: "สำเร็จ!",
        text: t.notificationSuccess,
        icon: "success",
        confirmButtonText: "ตกลง",
      });
  
      // Reset form fields
      setSelectedTaskId("");
      setSelectedTechIds([]);
      setSelectedTaskType("");
    } catch (error) {
      console.error("Error assigning task:", error);
      await Swal.fire({
        title: t.deleteErrorTitle,
        text: t.notificationError,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const sendLineNotification = async (linetokenArray, message) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const notificationKey = `task_assign_notification_${selectedTaskId}`;

      // Check if notification was already sent today
      if (localStorage.getItem(notificationKey) === today) {
        console.log("Notification already sent today for this task.");
        return;
      }

      const body = {
        userIds: linetokenArray,
        message: message,
      };

      const response = await axios.post(
        `${apiUrl}/send-messages-multi`,
        body,
        { withCredentials: true }
      );

      // Mark notification as sent
      localStorage.setItem(notificationKey, today);
      console.log("Multicast notification sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending LINE notification:", error);
      throw error; // Re-throw to handle in handleAssign
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
          const updatedAssignedTasks = await axios.get(
            `${apiUrl}/assignments-paging?page=${currentPage}&limit=5`
          );
          setAssignedTasks(updatedAssignedTasks.data.data);
          setTotalPages(updatedAssignedTasks.data.total.totalPages);
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
    (task) =>
      !assignedTasks.some((assigned) => assigned.task_id === task.task_id) &&
      task.status_id !== 2 &&
      task.status_id !== 5
  );

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{t.assignTask}</h1>
        </div>
        <form onSubmit={handleAssign} className="space-y-4 text-md">
          <div className="mb-4">
            <label className="block mb-2">ประเภทงาน</label>
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="input input-bordered p-2 w-full"
            >
              <option value="">All Task Types</option>
              {taskTypes.map((type) => (
                <option key={type.task_type_id} value={type.task_type_id}>
                  {type.type_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">{t.selectTask}</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="input input-bordered p-2 w-full"
              required
            >
              <option value="">{t.selectTask}</option>
              {unassignedTasks
                .filter((task) =>
                  selectedTaskType
                    ? task.task_type_id === parseInt(selectedTaskType)
                    : true
                )
                .map((task, index) => (
                  <option key={index + 1} value={task.task_id}>
                    {index + 1}. {task.firstname} {task.lastname} ({task.username}) รายละเอียดงาน: {task.description}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">{t.selectTechnician}</label>
            <select
              multiple
              value={selectedTechIds}
              onChange={(e) =>
                setSelectedTechIds(
                  [...e.target.selectedOptions].map((option) => option.value)
                )
              }
              className="border p-2 w-full"
              required
            >
              {technicians.map((tech) => (
                <option key={tech.tech_id} value={tech.tech_id}>
                  {tech.firstname} {tech.lastname}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn bg-blue text-white hover:bg-blue">
            {t.assignButton}
          </button>
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
                assignedTasks.map((assignment, index) => (
                  <tr key={index + 1}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
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
          <div className="flex justify-between items-center mt-4">
            <p
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`cursor-pointer ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
            >
              {t.previous}
            </p>
            <span>
              {t.page} {currentPage} {t.of} {totalPages}
            </span>
            <p
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
            >
              {t.next}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;