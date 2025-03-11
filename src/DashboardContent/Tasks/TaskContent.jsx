import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode"; // Fix for jwtDecode import
import BookingPDF from "../../pages/History/BookingPdf";
import Loading from "../../components/Loading";
const TaskContent = () => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [totalTasks, setTotalTasks] = useState(1);
  const [quantities, setQuantities] = useState({}); // Store quantities
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const techId = decodedToken.technicianId;
  const user_id = decodedToken.id;
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const language = localStorage.getItem("language") || "en";

  const translation = {
    en: {
      taskList: "Task List",
      addTask: "Add Task",
      assignTask: "Assign Task",
      searchPlaceholder: "Search by description or type...",
      allStatus: "All Status",
      id: "ID",
      type: "Type",
      description: "Description",
      dueDate: "Due Date",
      dueTime: "Due Time",
      status: "Status",
      actions: "Actions",
      approve: "Approve",
      return: "Return",
      edit: "Edit",
      delete: "Delete",
      viewDetails: "View Details",
      noTasksFound: "No tasks found",
      previous: "Previous",
      next: "Next",
      of: "of",
      page: "page",
      file: "file",
    },
    th: {
      taskList: "รายการงาน",
      addTask: "เพิ่มงาน",
      assignTask: "มอบหมายงาน",
      searchPlaceholder: "ค้นหาโดยคำอธิบายหรือลักษณะ...",
      allStatus: "สถานะทั้งหมด",
      id: "รหัส",
      type: "ประเภท",
      description: "คำอธิบาย",
      dueDate: "วันที่ครบกำหนด",
      dueTime: "เวลาที่ครบกำหนด",
      status: "สถานะ",
      actions: "การดำเนินการ",
      approve: "อนุมัติ",
      return: "คืนอุปกรณ์",
      edit: "แก้ไข",
      delete: "ลบ",
      viewDetails: "ดูรายละเอียด",
      noTasksFound: "ไม่พบงาน",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      of: "จาก",
      page: "หน้า",
      file: "ไฟล์",
    },
  };

  const currentLang = translation[language];

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
  }, [currentPage]);

  useEffect(() => {
    tasks.forEach((task) => {
      fetchQuantities(task.task_id);
    });
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/tasks/paged`,
        {
          params: {
            page: currentPage,
            limit: tasksPerPage,
          },
        }
      );

      const { tasks, total } = response.data;

      // Filter relevant tasks
      const filteredTasks = tasks.filter(
        (t) => t.task_type_id === 1 || t.task_type_id === 12
      );

      // Fetch rental data
      const rentalResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/rentals`
      );

      // Access rentalData array safely
      const rentalData =
        rentalResponse.data?.rentalData || rentalResponse.data || [];

      if (!Array.isArray(rentalData)) {
        console.error("Unexpected rentalData format:", rentalData);
        return;
      }

      // Store rentals
      setRentals(rentalData);

      // Combine rentals with tasks based on task_id
      const tasksWithRentals = filteredTasks.map((task) => {
        const rentalsForTask = rentalData.filter(
          (rental) => rental.task_id === task.task_id
        );
        return {
          ...task,
          rentalDetails: rentalsForTask.length > 0 ? rentalsForTask : null,
        };
      });

      setTasks(tasksWithRentals);
      setTotalTasks(total);
    } catch (error) {
      console.error("Error fetching paged tasks:", error);
    }
  };

  const fetchQuantities = async (taskId) => {
    try {
      const response = await axios.get(`${apiUrl}/rental/quantity/${taskId}`);
      if (response.status === 200) {
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [taskId]: response.data.totalQuantity,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rental quantities:", error);
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
        const response = await axios.delete(`${apiUrl}/task/${taskId}`, {
          withCredentials: true,
        });
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

  const handleReturn = async (taskId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to return the products and update the quantities.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, return it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.put(`${apiUrl}/rental/return/${taskId}`);

        if (response.status === 200) {
          Swal.fire(
            "Returned!",
            "Your task has been updated and products returned.",
            "success"
          );
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

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status_name === filterStatus;
    const matchesSearch =
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    <Loading />;
  }
  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">{currentLang.taskList}</h2>
          <div className="flex gap-2">
            {role === 3 && (
              <>
                <Link to="/dashboard/tasks/add">
                  <button className="btn bg-blue text-white hover:bg-blue">
                    {currentLang.addTask}
                  </button>
                </Link>
                <Link to="/dashboard/tasks/assign">
                  <button className="btn btn-success text-white">
                    {currentLang.assignTask}
                  </button>
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
            <option value="all">{currentLang.allStatus}</option>
            {statuses.map((status) => (
              <option key={status.status_id} value={status.status_name}>
                {status.status_name}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="border p-2 text-center">{currentLang.id}</th>
                <th className="border p-2 text-center">{currentLang.type}</th>
                <th className="border p-2 text-center">
                  {currentLang.description}
                </th>
                <th className="border p-2 text-center">
                  {currentLang.dueDate}
                </th>
                <th className="border p-2 text-center">
                  {currentLang.dueTime}
                </th>
                <th className="border p-2 text-center">{currentLang.status}</th>
                <th className="border p-2 text-center">
                  {currentLang.actions}
                </th>
                <th className="border p-2 text-center">{currentLang.file}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <tr key={index + 1} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">{task.type_name}</td>
                    <td className="border p-2 text-center">
                      {task.description}
                    </td>
                    <td className="border p-2 text-center">
                      {new Date(task.appointment_date).toLocaleDateString(
                        "th-TH",
                        {
                          timeZone: "Asia/Bangkok",
                        }
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      {new Date(
                        new Date(task.appointment_date).getTime() +
                          7 * 60 * 60 * 1000
                      ).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded ${
                          task.status_name === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status_name === "active"
                              ? "bg-blue-100 text-blue-800"
                              : task.status_name === "approve"
                                ? "bg-green-100 text-green-800"
                                : task.status_name === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {task.status_name}
                      </span>
                    </td>

                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {role === 3 && (
                          <>
                            {task.status_id !== 4 &&
                              task.status_id !== 2 &&
                              task.task_type_id !== 12 && (
                                <Link
                                  to={`/dashboard/tasks/approve/${task.task_id}`}
                                >
                                  <button className="btn btn-primary text-white">
                                    {currentLang.approve}
                                  </button>
                                </Link>
                              )}

                            {quantities[task.task_id] > 0 &&
                              task.status_id !== 2 && (
                                <button
                                  className="btn btn-success text-white"
                                  onClick={() => handleReturn(task.task_id)}
                                >
                                  {currentLang.return}
                                </button>
                              )}
                            <Link to={`/dashboard/tasks/edit/${task.task_id}`}>
                              <button className="btn btn-success text-white">
                                {currentLang.edit}
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(task.task_id)}
                              className="btn bg-red-500 text-white hover:bg-red-600"
                            >
                              {currentLang.delete}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewDetails(task.task_id)}
                          className="btn bg-blue text-white hover:bg-blue"
                        >
                          {currentLang.viewDetails}
                        </button>
                      </div>
                    </td>
                    <td className="flex justify-center">
                      {task.status_id !== 1 && task.task_type_id === 1 && (
                        <BookingPDF task={task} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="border p-4 text-center">
                    {currentLang.noTasksFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <p
            onClick={() => handlePageChange(currentPage - 1)}
            className={`cursor-pointer ${
              currentPage === 1 ? "text-gray-400" : "text-black"
            }`}
            style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
          >
            {currentLang.previous}
          </p>

          <span>
            {currentLang.page} {currentPage} {currentLang.of} {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
            style={{
              pointerEvents: currentPage === totalPages ? "none" : "auto",
            }}
          >
            {currentLang.next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskContent;
