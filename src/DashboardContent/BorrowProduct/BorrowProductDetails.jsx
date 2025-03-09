import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/BackButton";
import Loading from "../../components/Loading";

const BorrowProductDetails = () => {
  const { task_id } = useParams();
  const [borrowingData, setBorrowingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task_id) {
      fetchBorrowingDetails();
    } else {
      setError("Task ID is missing");
      setLoading(false);
    }
  }, [task_id]);

  const fetchBorrowingDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/v4/equipment-borrowing/id/${task_id}`
      );
      if (!response.data || Object.keys(response.data).length === 0) {
        setBorrowingData(null); // ถ้าไม่มีข้อมูลใน response
      } else {
        setBorrowingData(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch borrowing details");
      console.error("Error fetching borrowing details:", err);
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error)  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <BackButton />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          ไม่พบข้อมูลการยืมนี้ ข้อมูลอาจถูกยกเลิกไปแล้ว
        </h1>
        <p className="text-gray-600">
          ไม่มีข้อมูลสำหรับ Task ID: {task_id} กรุณาตรวจสอบอีกครั้ง
        </p>
      </div>
    </div>
  );;
  

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <BackButton />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Borrowing Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Additional Information
            </h2>
            <p className="text-gray-700">
              <strong>Remarks:</strong> {borrowingData.remarks || "N/A"}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Borrowed Products
            </h2>
            {borrowingData.products && borrowingData.products.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700">
                {borrowingData.products.map((product, index) => (
                  <li key={index}>
                    {product.product_name} (Quantity: {product.quantity})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No products borrowed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowProductDetails;