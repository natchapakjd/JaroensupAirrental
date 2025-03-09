import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import OrderReceipt from "../../pages/History/OrderReceipt";
const translations = {
  en: {
    orders: "Orders",
    addOrder: "Add Order",
    searchPlaceholder: "Search orders...",
    orderId: "Order ID",
    user: "User",
    totalAmount: "Total Amount",
    orderDate: "Order Date",
    actions: "Actions",
    cancel: "Cancel",
    viewDetails: "View Details",
    noOrders: "No orders available",
    previous: "Previous",
    next: "Next",
    error: "Error",
    loading: "Loading...",
    of: "of",
    page: "page",
    areYouSure: "Are you sure?",
    thisActionCannotBeUndone: "This action cannot be undone.",
    yesDeleteIt: "Yes, delete it!",
    deleted: "Deleted!",
    orderDeleted: "The order has been deleted.",
    file: "file",
  },
  th: {
    orders: "คำสั่งซื้อ",
    addOrder: "เพิ่มคำสั่งซื้อ",
    searchPlaceholder: "ค้นหาคำสั่งซื้อ...",
    orderId: "รหัสคำสั่งซื้อ",
    user: "ผู้ใช้",
    totalAmount: "จำนวนเงินรวม",
    orderDate: "วันที่คำสั่งซื้อ",
    actions: "การกระทำ",
    cancel: "ยกเลิก",
    viewDetails: "ดูรายละเอียด",
    noOrders: "ไม่มีคำสั่งซื้อ",
    error: "ข้อผิดพลาด",
    loading: "กำลังโหลด...",
    of: "จาก",
    page: "หน้า",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    areYouSure: "คุณแน่ใจหรือไม่?",
    thisActionCannotBeUndone: "การกระทำนี้ไม่สามารถย้อนกลับได้",
    yesDeleteIt: "ใช่, ลบเลย!",
    deleted: "ลบเรียบร้อย!",
    orderDeleted: "คำสั่งซื้อถูกลบแล้ว",
    file: "ไฟล์",
  },
};

const OrderContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;

  useEffect(() => {
    fetchOrders();
  }, [page, searchQuery]); // Fetch orders when page or search query changes

  useEffect(() => {
    fetchOrders();
  }, [page, searchQuery]); // Fetch orders when page or search query changes

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/orders`, {
        params: {
          limit: 10, // Set number of items per page
          page: page, // Send page number
          search: searchQuery, // Send search query
        },
      });
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages); // Set total pages
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: translations[language].error,
        text: translations[language].error,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: translations[language].areYouSure,
      text: translations[language].thisActionCannotBeUndone,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: translations[language].yesDeleteIt,
      cancelButtonText: translations[language].cancel,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/v1/orders/${orderId}`);
        if (response.status === 200) {
          // บันทึก Log
          await axios.post(`${apiUrl}/adminLog`, {
            admin_id: user_id, // ID ของแอดมินที่ลบ
            action: `ลบคำสั่งซื้อไอดี ${orderId}`,
          });

          Swal.fire({
            title: translations[language].deleted,
            text: translations[language].orderDeleted,
            icon: "success",
          });

          setOrders(orders.filter((order) => order.id !== orderId));
        } else {
          throw new Error("Failed to delete order.");
        }
      } catch (error) {
        Swal.fire({
          title: translations[language].error,
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="table p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {translations[language].orders}
          </h2>
          <Link to="/dashboard/orders/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              {translations[language].addOrder}
            </button>
          </Link>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={translations[language].searchPlaceholder}
            className="input input-bordered w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="sticky-top bg-gray-200">
              <tr>
                <th className="border p-2 text-center">
                  {translations[language].orderId}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].user}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].totalAmount}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].orderDate}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].actions}
                </th>
                <th className="border p-2 text-center">
                  {translations[language].file}
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">
                      {order.firstname} {order.lastname}
                    </td>
                    <td className="border p-2 text-center">
                      {order.total_price}
                    </td>
                    <td className="border p-2 text-center">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(order.order_id)}
                          className="btn btn-error text-white"
                        >
                          {translations[language].cancel}
                        </button>
                        <Link
                          to={`/dashboard/orders/details/${order.order_id}`}
                        >
                          <button className="btn btn-success  text-white">
                            {translations[language].viewDetails}
                          </button>
                        </Link>
                      </div>
                    </td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center">
                        <OrderReceipt order={order} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border border-gray-300 p-4">
                    {translations[language].noOrders}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <p
            onClick={handlePreviousPage}
            className={`cursor-pointer ${
              page === 1 ? "text-gray-400" : "text-black"
            }`}
            style={{ pointerEvents: page === 1 ? "none" : "auto" }}
          >
            {translations[language].previous}
          </p>
          <span>
            {translations[language].page} {page} {translations[language].of}{" "}
            {totalPages}
          </span>
          <p
            onClick={handleNextPage}
            className={`cursor-pointer ${
              page === totalPages ? "text-gray-400" : "text-black"
            }`}
            style={{ pointerEvents: page === totalPages ? "none" : "auto" }}
          >
            {translations[language].next}
          </p>
        </div>
      </div>
    </div>
  );
};
export default OrderContent;
