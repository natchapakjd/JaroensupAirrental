import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BorrowProductDetails = () => {
  const { task_id } = useParams(); // ดึง task_id จาก URL
  const [borrowingData, setBorrowingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowingDetails = async () => {
      try {
        const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/v2/equipment-borrowing/id/${task_id}` // ส่ง task_id ไปยัง API
        );
        setBorrowingData(response.data); // บันทึกข้อมูลที่ได้รับจาก API
      } catch (err) {
        setError("Failed to fetch borrowing details");
        console.error("Error fetching borrowing details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowingDetails();
  }, [task_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!borrowingData) return <div>No data found</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Borrowing Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ข้อมูลผู้ใช้ */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              User Information
            </h2>
            <p className="text-gray-700">
              <strong>User ID:</strong> {borrowingData.user_id}
            </p>
            <p className="text-gray-700">
              <strong>Name:</strong> {borrowingData.firstname} {borrowingData.lastname}
            </p>
          </div>

          {/* ข้อมูลงาน */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Task Information
            </h2>
            <p className="text-gray-700">
              <strong>Task ID:</strong> {borrowingData.task_id}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {borrowingData.task_desc}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {borrowingData.status_name}
              </span>
            </p>
          </div>

          {/* ข้อมูลการยืม */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Borrowing Information
            </h2>
            <p className="text-gray-700">
              <strong>Borrowing ID:</strong> {borrowingData.borrowing_id}
            </p>
            <p className="text-gray-700">
              <strong>Product Name:</strong> {borrowingData.product_name}
            </p>
            <p className="text-gray-700">
              <strong>Borrow Date:</strong>{" "}
              {new Date(borrowingData.borrow_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              <strong>Return Date:</strong>{" "}
              {new Date(borrowingData.return_date).toLocaleDateString()}
            </p>
          </div>

          {/* ข้อมูลเพิ่มเติม (ถ้ามี) */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Additional Information
            </h2>
            <p className="text-gray-700">
              <strong>Remarks:</strong> {borrowingData.remarks || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowProductDetails;