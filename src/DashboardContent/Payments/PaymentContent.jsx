import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
const PaymentContent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [statusFilter, setStatusFilter] = useState(""); // For dropdown filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;
  // Load translations from localStorage or default to English
  const language = localStorage.getItem("language") || "en";
  const translations = {
    en: {
      paymentList: "Payment List",
      searchPlaceholder: "Search by user or task...",
      allStatuses: "All Statuses",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      createPayment: "Create Payment",
      approve: "Approve",
      edit: "Edit",
      delete: "Delete",
      noPayments: "No task payments available",
      paymentId: "Payment ID",
      user: "User",
      task: "Task",
      amount: "Amount",
      paymentMethod: "Payment Method",
      paymentDate: "Payment DateTime",
      slipImages: "Slip Images",
      status: "Status",
      actions: "Actions",
      areYouSure: "Are you sure?",
      thisActionCannotBeUndone: "This action cannot be undone.",
      yesDeleteIt: "Yes, delete it!",
      canceled: "Cancelled",
      approvedMessage: "Payment status has been updated to Approved.",
      deletedMessage: "Task payment has been deleted.",
      error: "Error",
      failedToLoad: "Failed to load payments.",
      prev: "previous",
      next: "next",
      of: "of",
      page: "page",
    },
    th: {
      paymentList: "รายการการชำระเงิน",
      searchPlaceholder: "ค้นหาตามผู้ใช้หรือภารกิจ...",
      allStatuses: "สถานะทั้งหมด",
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      rejected: "ปฏิเสธ",
      createPayment: "สร้างการชำระเงิน",
      approve: "อนุมัติ",
      edit: "แก้ไข",
      delete: "ลบ",
      noPayments: "ไม่มีการชำระเงินของงาน",
      paymentId: "รหัสการชำระเงิน",
      user: "ผู้ใช้",
      task: "ภารกิจ",
      amount: "จำนวนเงิน",
      paymentMethod: "วิธีการชำระเงิน",
      paymentDate: "วันเวลาในการชำระเงิน",
      slipImages: "ภาพสลิป",
      status: "สถานะ",
      actions: "การกระทำ",
      areYouSure: "คุณแน่ใจไหม?",
      thisActionCannotBeUndone: "การกระทำนี้ไม่สามารถย้อนกลับได้",
      yesDeleteIt: "ใช่ ลบมัน!",
      canceled: "ยกเลิก",
      approvedMessage: "สถานะการชำระเงินได้รับการอัปเดตเป็นอนุมัติแล้ว",
      deletedMessage: "การชำระเงินงานได้ถูกลบ",
      error: "ข้อผิดพลาด",
      failedToLoad: "ไม่สามารถโหลดการชำระเงินได้",
      prev: "ก่อนหน้า",
      next: "ถัดไป",
      of: "จาก",
      page: "หน้า",
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/payments-paging`, {
        params: { page: currentPage, limit: 10 },
      });
      setPayments(response.data.data);
      setTotalPages(response.data.total.totalPages);
    } catch (err) {
      setError(err.message);
      Swal.fire({ title: t.error, text: t.failedToLoad, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/payments/${paymentId}/status`,
        {
          status_id: 2, // Approve status
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: t.approved,
          text: t.approvedMessage,
          icon: "success",
        });

        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.payment_id === paymentId
              ? { ...payment, status_id: 2 }
              : payment
          )
        );

        // 🔹 บันทึก Log ว่าอนุมัติการชำระเงิน
        await axios.post(`${apiUrl}/adminLog`, {
          admin_id: user_id, // สมมติว่า userId คือ admin ที่ทำรายการ
          action: `อนุมัติการชำระเงินหมายเลข : ${paymentId}`,
        });
      }
    } catch (error) {
      console.error("Error approving payment:", error);

      // 🔹 บันทึก Log เมื่อเกิดข้อผิดพลาด
      await axios.post(`${apiUrl}/adminLog`, {
        admin_id: user_id,
        action: `อนุมัติการชำระเงินหมายเลข: ${paymentId} ไม่สำเร็จ - Error: ${error.message}`,
      });

      Swal.fire({
        title: t.error,
        text: t.failedToLoad,
        icon: "error",
      });
    }
  };

  const handleDelete = async (paymentId) => {
    const result = await Swal.fire({
      title: t.areYouSure,
      text: t.thisActionCannotBeUndone,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t.yesDeleteIt,
      cancelButtonText: t.canceled,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/payment/${paymentId}`);
        if (response.status === 200) {
          Swal.fire({
            title: t.deletedMessage,
            icon: "success",
          });

          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment.payment_id !== paymentId)
          );

          // 🔹 บันทึก Log ว่าลบการชำระเงิน
          await axios.post(`${apiUrl}/adminLog`, {
            admin_id: user_id,
            action: `ลบการชำระเงินหมายเลข: ${paymentId}`,
          });
        } else {
          throw new Error(t.failedToLoad);
        }
      } catch (error) {
        console.error("Error deleting payment:", error);

        // 🔹 บันทึก Log เมื่อเกิดข้อผิดพลาด
        await axios.post(`${apiUrl}/adminLog`, {
          admin_id: user_id,
          action: `ลบการชำระเงินหมายเลข: ${paymentId} ไม่สำเร็จ - Error: ${error.message}`,
        });

        Swal.fire({
          title: t.error,
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.task_desc?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || payment.status_id === Number(statusFilter);

    return matchesSearch && matchesStatus;
  });

  const openSlipImagePopup = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: "Product Image",
      showCloseButton: true,
      showConfirmButton: false,
      background: "#fff",
      width: "auto",
    });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t.paymentList}</h2>
          <div className="flex justify-end mb-4">
            <Link to="/dashboard/payments/add">
              <button className="btn bg-blue text-white hover:bg-blue">
                {t.createPayment}
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
          <select
            className="select select-bordered w-1/4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">{t.allStatuses}</option>
            <option value="1">{t.pending}</option>
            <option value="2">{t.approved}</option>
            <option value="3">{t.rejected}</option>
          </select>
        </div>

        {/* Task Payments Table */}
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">{t.paymentId}</th>
                <th className="border p-2 text-center">{t.user}</th>
                <th className="border p-2 text-center">{t.task}</th>
                <th className="border p-2 text-center">{t.amount}</th>
                <th className="border p-2 text-center">{t.paymentMethod}</th>
                <th className="border p-2 text-center">{t.paymentDate}</th>
                <th className="border p-2 text-center">{t.slipImages}</th>
                <th className="border p-2 text-center">{t.status}</th>
                <th className="border p-2 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2 text-center">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="border p-2 text-center">
                      {payment.firstname} {payment.lastname}
                    </td>
                    <td className="border p-2 text-center">
                      {payment.task_desc}
                    </td>
                    <td className="border p-2 text-center">{payment.amount}</td>
                    <td className="border p-2 text-center">
                      {payment.method_name}
                    </td>
                    <td className="border p-2 text-center">
                      {new Date(payment.created_at).toLocaleString()}
                    </td>
                    <td className="border p-2 text-center">
                      {payment.image_url ? (
                        <img
                          src={`${payment.image_url}`}
                          alt="Slip"
                          className="w-16 h-16 object-cover mx-auto cursor-pointer"
                          onClick={() => openSlipImagePopup(payment.image_url)}
                        />
                      ) : (
                        <p>No Image</p>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                    <span
                        className={`px-2 py-1 rounded ${
                          payment.status_name === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : payment.status_name === "active"
                              ? "bg-blue-100 text-blue-800"
                              : payment.status_name === "approve"
                                ? "bg-green-100 text-green-800"
                                : payment.status_name === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {payment.status_name}
                      </span>
                    </td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {payment.status_id !== 2 && (
                          <button
                            onClick={() => handleApprove(payment.payment_id)}
                            className="btn bg-blue hover:bg-blue text-white"
                          >
                            {t.approve}
                          </button>
                        )}

                        <Link
                          to={`/dashboard/payments/edit/${payment.payment_id}`}
                        >
                          <button className="btn btn-success text-white">
                            {t.edit}
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(payment.payment_id, "task")
                          }
                          className="btn btn-error text-white"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    {t.noPayments}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t.prev}
          </p>
          <span>
            {t.page} {currentPage} {t.of} {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {t.next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentContent;
