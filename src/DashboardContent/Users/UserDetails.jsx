import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns"; // สำหรับจัดรูปแบบวันที่
import Loading from "../../components/Loading";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
        );
        setUser(response.data[0] || response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details. Please try again later.");
      }
    };

    fetchUser();
  }, [userId]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {user.username}'s Details
      </h1>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center mb-8">
        {user.image_url ? (
          <img
            src={`${user.image_url}`}
            alt={`${user.username}'s profile`}
            className="w-32 h-32 rounded-full mr-6 shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 mr-6 bg-gray-300 rounded-full shadow-lg"></div>
        )}
        <div className="text-center md:text-left">
          <p className="text-lg font-medium text-gray-700">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>First Name:</strong> {user.firstname}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Last Name:</strong> {user.lastname}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Phone:</strong> {user.phone}
          </p>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-medium text-gray-700">
            <strong>Age:</strong> {user.age}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Address:</strong> {user.address}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Gender:</strong> {user.gender_name}
          </p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">
            <strong>Date of Birth:</strong>{" "}
            {format(new Date(user.date_of_birth), "MM/dd/yyyy")}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Role:</strong> {user.role_name}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Created At:</strong>{" "}
            {format(new Date(user.created_at), "MM/dd/yyyy")}
          </p>
        </div>
      </div>

      {user.role_id === 2 && user.technician_details && (
        <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Technician Details
          </h2>
          <p className="text-lg font-medium text-gray-700">
            <strong>Nationality:</strong> {user.technician_details.nationality}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Is Outsource:</strong>{" "}
            {user.technician_details.isOutsource.data[0] === 1 ? "Yes" : "No"}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Work Experience:</strong>{" "}
            {user.technician_details.work_experience}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Special Skills:</strong>{" "}
            {user.technician_details.special_skills}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Background Check Status:</strong>{" "}
            {user.technician_details.background_check_status}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Start Date:</strong>{" "}
            {format(new Date(user.technician_details.start_date), "MM/dd/yyyy")}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Status ID:</strong> {user.technician_details.status_id}
          </p>

          {/* Display images if available */}
          <div className="mt-6">
            {user.technician_details.id_card_image_url && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">ID Card:</h3>
                <img
                  src={user.technician_details.id_card_image_url}
                  alt="ID Card"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            )}
            {user.technician_details.driver_license_image_url && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">
                  Driver's License:
                </h3>
                <img
                  src={user.technician_details.driver_license_image_url}
                  alt="Driver's License"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            )}
            {user.technician_details.criminal_record_image_url && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">
                  Criminal Record:
                </h3>
                <img
                  src={user.technician_details.criminal_record_image_url}
                  alt="Criminal Record"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            )}
            {user.technician_details.additional_image_url && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">
                  Additional Document:
                </h3>
                <img
                  src={user.technician_details.additional_image_url}
                  alt="Additional Document"
                  className="w-full max-w-md rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
