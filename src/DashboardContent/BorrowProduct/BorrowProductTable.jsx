import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BorrowProductTable = () => {
  const [borrowingData, setBorrowingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10); // Items per page
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const techId = decodedToken.id;
  const role = decodedToken.role;
  const language = localStorage.getItem("language") || "th"; // Default to "en" if no language is set

  const translation = {
    en: {
      borrowedEquipmentList: "Borrowed Equipment List",
      createBorrowingTask: "Create borrowing task",
      searchByNameOrProduct: "Search by name or product",
      allStatus: "All Status",
      pending: "Pending",
      approve: "Approved",
      completed: "Completed",
      noImage: "No Image",
      notApproved: "Not Approved",
      return: "Return",
      approveSuccess: "Equipment approved successfully",
      equipmentReturned: "Equipment returned successfully",
      equipmentNotReturned: "Not Returned",
      noWarning: "No Warning",
      warning: "⚠️",
      areYouSure: "Are you sure?",
      thisActionCannotBeUndone: "This action cannot be undone.",
      cancel: "Cancel",
      confirmDelete: "Yes, delete it!",
      deleted: "Deleted!",
      deletingError: "Failed to cancel the task.",
      equipmentReturnError: "The equipment return has not been approved yet.",
      errorFetchingData: "Failed to load borrowing data.",
      of: "of",
      page: "page",
      previous: "previous",
      next: "next",
      edit: "edit",
      borrowingID: "borrowing ID",
      technicianName: "tech name",
      productName: "product name",
      borrowDate: "borrow date",
      returnDate: "return date",
      status: "status",
      taskType: "type",
      idCardImage: "id card image",
      actions: "action",
      warningTH: "warning",
      details: "details",
      noBorrowingData: "No borrowing data",
      deletingSuccess: "Deleting success",
    },
    th: {
      borrowedEquipmentList: "รายการอุปกรณ์ที่ยืม",
      createBorrowingTask: "สร้างงานยืมอุปกรณ์",
      searchByNameOrProduct: "ค้นหาตามชื่อหรือผลิตภัณฑ์",
      allStatus: "สถานะทั้งหมด",
      pending: "รอการอนุมัติ",
      approve: "อนุมัติ",
      completed: "เสร็จสิ้น",
      noImage: "ไม่มีภาพ",
      notApproved: "ยังไม่ได้รับการอนุมัติ",
      return: "คืนอุปกรณ์",
      approveSuccess: "อนุมัติอุปกรณ์สำเร็จ",
      equipmentReturned: "คืนอุปกรณ์สำเร็จ",
      equipmentNotReturned: "ยังไม่คืน",
      noWarning: "ไม่มีคำเตือน",
      warning: "⚠️",
      areYouSure: "คุณแน่ใจหรือไม่?",
      thisActionCannotBeUndone: "การกระทำนี้ไม่สามารถย้อนกลับได้",
      cancel: "ยกเลิก",
      confirmDelete: "ใช่, ลบมัน!",
      deleted: "ลบแล้ว!",
      deletingError: "ไม่สามารถยกเลิกงานได้",
      deletingSuccess: "ยกเลิกงานสำเร็จ",
      equipmentReturnError: "การคืนอุปกรณ์ยังไม่ได้รับการอนุมัติ",
      errorFetchingData: "ไม่สามารถโหลดข้อมูลการยืมได้",
      of: "จาก",
      page: "หน้า",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      edit: "แก้ไข",
      borrowingID: "รหัสการยืม",
      technicianName: "ชื่อช่าง",
      productName: "ชื่อสินค้า",
      borrowDate: "วันที่ยืม",
      returnDate: "วันที่คืน",
      status: "สถานะ",
      taskType: "ประเภทงาน",
      idCardImage: "รูปบัตรประชาชน",
      actions: "การดำเนินการ",
      warningTH: "คำเตือน",
      details: "รายละเอียด",
      noBorrowingData: "ไม่มีข้อมูลการยืมอุปกรณ์",
    },
  };
  const currentLang = translation[language] || translation.en;

  useEffect(() => {
    fetchBorrowingData(techId);
  }, [currentPage, borrowingData]);

  useEffect(() => {
    applyFilters();
  }, [borrowingData, searchQuery, statusFilter]);

  const fetchBorrowingData = async (techId) => {
    try {
      let response;
      let userData;
      let techData;
      if (role === 3) {
        response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/v2/equipment-borrowings-paging`,
          { params: { page: currentPage, limit: rowsPerPage } }
        );
      } else if (role === 2) {
        response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/v2/equipment-borrowing-paging/${techId}`,
          { params: { page: currentPage, limit: rowsPerPage } }
        );
      }

      const { data, total } = response.data;
      const today = new Date();
      const updatedData = data.map((item) => {
        if (
          (item.status_id === 1 || item.status_id === 4) && // Check if status is 1 or 4
          item.return_date && // Check if return_date exists
          new Date(item.return_date) < today // Check if return_date is before today
        ) {
          sendOverdueNotification(item.linetoken, item.borrowing_id);
          return { ...item, isOverdue: true }; // Add warning flag
        }
        return { ...item, isOverdue: false };
      });

      setBorrowingData(updatedData);
      total === 0
        ? setTotalPages(1)
        : setTotalPages(Math.ceil(total / rowsPerPage));
    } catch (error) {
      console.error("Error fetching borrowing data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load borrowing data.",
        icon: "error",
      });
    }
  };

  const sendOverdueNotification = async (technicianId, borrowingId) => {
    try {
      const today = new Date().toISOString().split("T")[0]; // รูปแบบวันที่ YYYY-MM-DD
      const notificationKey = `notification_${technicianId}_${borrowingId}`;
      const lastSentDate = localStorage.getItem(notificationKey);

      if (lastSentDate === today) {
        console.log("Notification already sent today.");
        return;
      }

      const message = `อุปกรณ์สำหรับการยืม รหัสการยืม ${borrowingId} เกินวันกำหนดคืนแล้ว กรุณานำสินค้ามาคืนโดยทันที`;
      const body = {
        userId: technicianId,
        message,
      };

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/send-message`, body);
      localStorage.setItem(notificationKey, today);
      console.log("Notification sent successfully.");
    } catch (error) {
      console.error("Error sending LINE notification:", error);
    }
  };

  const applyFilters = () => {
    let filtered = borrowingData;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          `${item.firstname} ${item.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status_name === statusFilter);
    }

    setFilteredData(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleReturn = async (taskId) => {
    try {
      const statusResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/approve/${taskId}`
      );
      const statusId = statusResponse.data.status_id;

      if (statusId !== 4) {
        Swal.fire({
          title: currentLang.equipmentReturnError,
          icon: "warning",
        });
        return;
      }

      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/v2/equipment-borrowing/return/${taskId}`
      );

      if (response.status === 200) {
        Swal.fire({
          title: currentLang.equipmentReturned,
          icon: "success",
        });
        fetchBorrowingData(); // Refresh data after returning equipment
      } else {
        throw new Error(currentLang.deletingError);
      }
    } catch (error) {
      Swal.fire({
        title: currentLang.error,
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleApprove = async (taskId) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/v2/equipment-borrowing/approve/${taskId}`
      );

      if (response.status === 200) {
        Swal.fire({
          title: currentLang.approveSuccess,
          icon: "success",
        });
        fetchBorrowingData(); // Refresh data after approving equipment
      } else {
        throw new Error("Failed to approve equipment.");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleCancel = async (borrowing_id) => {
    const result = await Swal.fire({
      title: currentLang.areYouSure,
      text: currentLang.thisActionCannotBeUndone,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: currentLang.confirmDelete,
      cancelButtonText: currentLang.cancel,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_SERVER_URL
          }/v2/equipment-borrowing/${borrowing_id}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          Swal.fire({
            title: currentLang.deleted,
            text: currentLang.deletingSuccess,
            icon: "success",
          });
          fetchBorrowingData(techId); // Refresh data after deletion
        } else {
          throw new Error(currentLang.deletingError);
        }
      } catch (error) {
        Swal.fire({
          title: currentLang.error,
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const openImagePopup = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: "ID Card Image",
      showCloseButton: true,
      showConfirmButton: false,
      background: "#fff",
      width: "auto",
    });
  };

  const handleNavigate = (task_id) => {
    window.location.href = `/dashboard/borrows/details/${task_id}`;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {currentLang.borrowedEquipmentList}
          </h2>

          <Link to="/dashboard/products">
            <button className="btn bg-blue text-white hover:bg-blue">
              {currentLang.createBorrowingTask}
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="flex  gap-4 mb-6 justify-between">
          <input
            type="text"
            placeholder="Search by name or product "
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            className="select select-bordered max-w-sm"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">{currentLang.allStatus}</option>
            <option value="pending">{currentLang.pending}</option>
            <option value="approve">{currentLang.approve}</option>
            <option value="completed">{currentLang.completed}</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300 ">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">
                  {currentLang.borrowingID}
                </th>
                <th className="border p-2 text-center">
                  {currentLang.technicianName}
                </th>
                {/* <th className="border p-2 text-center">
                  {currentLang.productName}
                </th> */}
                <th className="border p-2 text-center">
                  {currentLang.borrowDate}
                </th>
                <th className="border p-2 text-center">
                  {currentLang.returnDate}
                </th>
                <th className="border p-2 text-center">{currentLang.status}</th>
                <th className="border p-2 text-center">
                  {currentLang.taskType}
                </th>
                {role === 3 && (
                  <th className="border p-2 text-center">
                    {currentLang.idCardImage}
                  </th>
                )}
                <th className="border p-2 text-center">
                  {currentLang.actions}
                </th>
                <th className="border p-2 text-center">
                  {currentLang.warningTH}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2 text-center">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="border p-2 text-center">
                      {item.firstname} {item.lastname}
                    </td>
                    {/* <td className="border p-2 text-center">
                      {item.product_name}
                    </td> */}
                    <td className="border p-2 text-center">
                      {new Date(item.borrow_date).toLocaleDateString()}
                    </td>
                    <td className="border p-2 text-center">
                      {item.return_date
                        ? new Date(item.return_date).toLocaleDateString()
                        : currentLang.equipmentNotReturned}
                    </td>

                    <td className="border p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded ${
                          item.status_name === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status_name === "active"
                              ? "bg-blue-100 text-blue-800"
                              : item.status_name === "approve"
                                ? "bg-green-100 text-green-800"
                                : item.status_name === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {item.status_name}
                      </span>
                    </td>
                    <td className="border p-2 text-center">{item.task_desc}</td>
                    {role === 3 && (
                      <td className="border p-2 text-center">
                        {item.id_card_image ? (
                          <img
                            src={item.id_card_image}
                            alt="ID Card"
                            className="w-16 h-16 object-cover cursor-pointer hover:scale-110 transition duration-200"
                            onClick={() => openImagePopup(item.id_card_image)}
                          />
                        ) : (
                          <p>{currentLang.noImage}</p>
                        )}
                      </td>
                    )}

                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {role === 2 && item.status_id === 4 ? (
                          <button
                            onClick={() => handleReturn(item.task_id)}
                            className="btn btn-primary text-white"
                          >
                            {currentLang.return}
                          </button>
                        ) : null}
                        {role === 3 && item.status_id !== 2 ? (
                          <button
                            onClick={() => handleReturn(item.task_id)}
                            className="btn btn-primary text-white "
                          >
                            {currentLang.return}
                          </button>
                        ) : null}
                        {role === 3 &&
                        item.status_id !== 4 &&
                        item.status_id !== 2 ? (
                          <button
                            onClick={() => handleApprove(item.task_id)}
                            className="btn btn-success text-white"
                          >
                            {currentLang.approve}
                          </button>
                        ) : null}

                        <button
                          className="btn btn-success text-white "
                          onClick={() => handleNavigate(item.task_id)} // Wrap the function in an arrow function
                        >
                          {currentLang.details}
                        </button>

                        {role === 3 ? (
                          <Link
                            to={`/dashboard/borrows/edit/${item.borrowing_id}`}
                          >
                            <button className="btn btn-success text-white ">
                              {currentLang.edit}
                            </button>
                          </Link>
                        ) : null}

                        {role === 3 || (role === 2 && item.status_id === 1) ? (
                          <button
                            onClick={() => handleCancel(item.borrowing_id)}
                            className="btn btn-error text-white"
                          >
                            {currentLang.cancel}
                          </button>
                        ) : null}
                      </div>
                    </td>
                    <td className="border p-2 text-center">
                      {item.isOverdue ? (
                        <span className="text-red-500 font-bold">⚠️</span>
                      ) : (
                        currentLang.noWarning
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="border p-4">
                    {currentLang.noBorrowingData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <p
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            {currentLang.previous}
          </p>
          <span>
            {currentLang.page} {currentPage} {currentLang.of} {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          >
            {currentLang.next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BorrowProductTable;
