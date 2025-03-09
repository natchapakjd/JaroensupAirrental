import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns"; // สำหรับจัดรูปแบบวันที่
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  ); // State for language selection

  const translations = {
    en: {
      details: "Personal Details",
      username: "Username",
      firstname: "First Name",
      lastname: "Last Name",
      email: "Email",
      phone: "Phone",
      age: "Age",
      address: "Address",
      gender: "Gender",
      dateOfBirth: "Date of Birth",
      role: "Role",
      createdAt: "Created At",
      technicianDetails: "Technician Details",
      nationality: "Nationality",
      isOutsource: "Is Outsource",
      workExperience: "Work Experience",
      specialSkills: "Special Skills",
      backgroundCheckStatus: "Background Criminal Check Status",
      startDate: "Start Date",
      statusId: "Status ID",
      idCard: "ID Card",
      driversLicense: "Driver's License",
      criminalRecord: "Criminal Record",
      additionalDocument: "Additional Document",
      failedToLoad: "Failed to load user details. Please try again later.",
    },
    th: {
      details: "ข้อมูลส่วนตัว",
      username: "ชื่อผู้ใช้",
      firstname: "ชื่อจริง",
      lastname: "นามสกุล",
      email: "อีเมล์",
      phone: "โทรศัพท์",
      age: "อายุ",
      address: "ที่อยู่",
      gender: "เพศ",
      dateOfBirth: "วันเกิด",
      role: "บทบาท",
      createdAt: "วันที่สร้าง",
      technicianDetails: "รายละเอียดช่างเทคนิค",
      nationality: "สัญชาติ",
      isOutsource: "เป็นผู้รับจ้าง",
      workExperience: "ประสบการณ์การทำงาน",
      specialSkills: "ทักษะพิเศษ",
      backgroundCheckStatus: "สถานะการตรวจสอบประวัติอาชญากรรม",
      startDate: "วันที่เริ่มงาน",
      statusId: "สถานะ ID",
      idCard: "บัตรประชาชน",
      driversLicense: "ใบขับขี่",
      criminalRecord: "ประวัติอาชญากรรม",
      additionalDocument: "เอกสารเพิ่มเติม",
      failedToLoad: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้ กรุณาลองใหม่ภายหลัง",
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
        );
        setUser(response.data[0] || response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(translations[language].failedToLoad);
      }
    };

    fetchUser();
  }, [userId, language]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div  className="flex w-full">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {user.username}'s {translations[language].details}
          </h1>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
          {user.image_url ? (
            <img
              src={user.image_url}
              alt={`${user.username}'s profile`}
              className="w-32 h-32 rounded-full shadow-lg border-2 border-gray-300"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full shadow-lg"></div>
          )}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-gray-600">{translations[language].email}: {user.email}</p>
            <p className="text-gray-600">{translations[language].phone}: {user.phone}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].age}:</strong> {user.age}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].address}:</strong> {user.address}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].gender}:</strong>{" "}
              {user.gender_name}
            </p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].dateOfBirth}:</strong>{" "}
              {format(new Date(user.date_of_birth), "MM/dd/yyyy")}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].role}:</strong> {user.role_name}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].createdAt}:</strong>{" "}
              {format(new Date(user.created_at), "MM/dd/yyyy")}
            </p>
          </div>
        </div>

        {user.role_id === 2 && user.technician_details && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {translations[language].technicianDetails}
            </h2>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].nationality}:</strong>{" "}
              {user.technician_details.nationality}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].isOutsource}:</strong>{" "}
              {user.technician_details.isOutsource.data[0] === 1 ? "Yes" : "No"}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].workExperience}:</strong>{" "}
              {user.technician_details.work_experience}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].specialSkills}:</strong>{" "}
              {user.technician_details.special_skills}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].backgroundCheckStatus}:</strong>{" "}
              {user.technician_details.background_check_status}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>{translations[language].startDate}:</strong>{" "}
              {format(
                new Date(user.technician_details.start_date),
                "MM/dd/yyyy"
              )}
            </p>
            
            {/* Display images if available */}
            <div className="mt-6">
              {user.technician_details.id_card_image_url && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-700">
                    {translations[language].idCard}:
                  </h3>
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
                    {translations[language].driversLicense}:
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
                    {translations[language].criminalRecord}:
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
                    {translations[language].additionalDocument}:
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
    </div>
  );
};

export default UserDetails;
