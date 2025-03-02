import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  en: {
    editTechProfile: "Edit Technician Profile",
    nationality: "Nationality",
    workExperience: "Work Experience",
    specialSkills: "Special Skills",
    backgroundCheckStatus: "Background Check Status",
    bankAccountNumber: "Bank Account Number",
    startDate: "Start Date",
    status: "Status",
    idCardImageUrl: "ID Card Image URL",
    driverLicenseImageUrl: "Driver License Image URL",
    criminalRecordImageUrl: "Criminal Record Image URL",
    additionalImageUrl: "Additional Image URL",
    isOutsource: "Is Outsource?",
    saveChanges: "Save Changes",
    selectStatus: "Select Status",
    technicianUpdated: "Technician updated successfully",
    error: "Error updating technician",
  },
  th: {
    editTechProfile: "แก้ไขโปรไฟล์ช่างเทคนิค",
    nationality: "สัญชาติ",
    workExperience: "ประสบการณ์การทำงาน",
    specialSkills: "ทักษะพิเศษ",
    backgroundCheckStatus: "สถานะการตรวจสอบประวัติ",
    bankAccountNumber: "หมายเลขบัญชีธนาคาร",
    startDate: "วันที่เริ่มงาน",
    status: "สถานะ",
    idCardImageUrl: "ลิงก์ภาพบัตรประชาชน",
    driverLicenseImageUrl: "ลิงก์ใบขับขี่",
    criminalRecordImageUrl: "ลิงก์ประวัติอาชญากรรม",
    additionalImageUrl: "ลิงก์ภาพเพิ่มเติม",
    isOutsource: "เป็นช่างภายนอก ?",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    selectStatus: "เลือกสถานะ",
    technicianUpdated: "อัพเดตข้อมูลช่างเทคนิคสำเร็จ",
    error: "เกิดข้อผิดพลาดในการอัพเดตช่างเทคนิค",
  },
};

const EditTechProfile = () => {
  const { techId } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nationality: "",
    isOutsource: false,
    work_experience: "",
    special_skills: "",
    background_check_status: "",
    bank_account_number: "",
    start_date: "",
    status_id: "",
    id_card_image_url: "",
    driver_license_image_url: "",
    criminal_record_image_url: "",
    additional_image_url: "",
  });
  const [language, setLanguage] = useState(
    localStorage.getItem("language" || "th")
  ); // Default language is English
  const [statuses, setStatuses] = useState([]); // State for storing statuses

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch technician data to pre-fill the form
        const techResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/technician/${techId}`
        );
        setFormData(techResponse.data[0]);

        // Fetch statuses for dropdown
        const statusResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/statuses`
        );
        setStatuses(statusResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching technician or statuses:", error);
      }
    };

    fetchData();
  }, [techId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/technician/${techId}`,
        formData
      );
      alert("Technician updated successfully");
    } catch (error) {
      console.error("Error updating technician:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8 ">
      <div className="mx-auto p-6 bg-white rounded-lg shadow-md h-screen">
        {" "}
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translations[language].editTechProfile}
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Nationality */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].nationality}
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Work Experience */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].workExperience}
              </label>
              <input
                type="text"
                name="work_experience"
                value={formData.work_experience}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Special Skills */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].specialSkills}
              </label>
              <input
                type="text"
                name="special_skills"
                value={formData.special_skills}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Background Check Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].backgroundCheckStatus}
              </label>
              <input
                type="text"
                name="background_check_status"
                value={formData.background_check_status}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Bank Account Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].bankAccountNumber}
              </label>
              <input
                type="text"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Start Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].startDate}
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].status}
              </label>
              <select
                name="status_id"
                value={formData.status_id}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">{translations[language].selectStatus}</option>
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>
            {/* ID Card Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].idCardImageUrl}
              </label>
              <input
                type="text"
                name="id_card_image_url"
                value={formData.id_card_image_url}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Driver License Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].driverLicenseImageUrl}
              </label>
              <input
                type="text"
                name="driver_license_image_url"
                value={formData.driver_license_image_url}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Criminal Record Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].criminalRecordImageUrl}
              </label>
              <input
                type="text"
                name="criminal_record_image_url"
                value={formData.criminal_record_image_url}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Additional Image URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].additionalImageUrl}
              </label>
              <input
                type="text"
                name="additional_image_url"
                value={formData.additional_image_url}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            {/* Is Outsource */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                {translations[language].isOutsource}
              </label>
              <input
                type="checkbox"
                name="isOutsource"
                checked={formData.isOutsource}
                onChange={handleChange}
                className="h-5 w-5"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue text-white px-4 py-2 flex justify-end rounded hover:bg-blue"
            >
              {translations[language].saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTechProfile;
