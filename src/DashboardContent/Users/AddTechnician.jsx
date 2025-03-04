import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  en: {
    selectUser: "Select User",
    specialization: "Specialization",
    nationality: "Nationality",
    bankAccount: "Bank Account Number",
    specialSkills: "Special Skills",
    workExperience: "Work Experience",
    backgroundCheckStatus: "Background Criminal Check Status",
    startDate: "Start Date",
    idCardImage: "ID Card Image URL",
    criminalRecordImage: "Criminal Record Image URL",
    driverLicenseImage: "Driver License Image URL",
    additionalImage: "Additional Image URL",
    outsourceTechnician: "Outsourced Technician",
    addTechnician: "Add Technician",
    successMessage: "Technician added successfully",
    errorMessage: "Error adding technician",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
  },
  th: {
    selectUser: "เลือกผู้ใช้",
    specialization: "ความชำนาญ",
    nationality: "สัญชาติ",
    bankAccount: "หมายเลขบัญชีธนาคาร",
    specialSkills: "ทักษะพิเศษ",
    workExperience: "ประสบการณ์การทำงาน",
    backgroundCheckStatus: "สถานะการตรวจสอบประวัติอาชญากรรม",
    startDate: "วันที่เริ่มงาน",
    idCardImage: "URL รูปบัตรประชาชน",
    criminalRecordImage: "URL รูปประวัติอาชญากรรม",
    driverLicenseImage: "URL รูปใบขับขี่",
    additionalImage: "URL รูปภาพเพิ่มเติม",
    outsourceTechnician: "ช่างภายนอก?",
    addTechnician: "เพิ่มช่างเทคนิค",
    successMessage: "เพิ่มช่างเทคนิคสำเร็จ",
    errorMessage: "เกิดข้อผิดพลาดในการเพิ่มช่างเทคนิค",
    pending: "รอดำเนินการ",
    completed: "เสร็จสิ้น",
    failed: "ล้มเหลว",
  },
};

const AddTechnician = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    nationality: "",
    rating: "0.00",
    isOutsource: false,
    work_experience: "",
    special_skills: "",
    certificates: "",
    background_check_status: "pending",
    bank_account_number: "",
    start_date: "",
    notes: "",
    status_id: 1,
    id_card_image_url: "",
    driver_license_image_url: "",
    criminal_record_image_url: "",
    additional_image_url: "",
  });

  const [language, setLanguage] = useState(
    localStorage.getItem("language" || "th")
  ); // You can change this dynamically

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/technician`,
        formData
      );
      if (response.status === 201) {
        Swal.fire({
          title: translations[language].successMessage,
          icon: "success",
        });
        setFormData({
          user_id: "",
          specialization: "",
          nationality: "",
          rating: "0.00",
          isOutsource: false,
          work_experience: "",
          special_skills: "",
          certificates: "",
          background_check_status: "pending",
          bank_account_number: "",
          start_date: "",
          notes: "",
          status_id: 1,
          id_card_image_url: "",
          driver_license_image_url: "",
          criminal_record_image_url: "",
          additional_image_url: "",
        });
      }
    } catch (error) {
      Swal.fire({
        title: translations[language].errorMessage,
        text: error.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto p-6 bg-white rounded-lg shadow-md h-screen">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translations[language].addTechnician}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium"
        >
          {/* User Selection */}
          <div>
            <label htmlFor="user_id" className="block mb-1">
              {translations[language].selectUser}
            </label>
            <select
              name="user_id"
              id="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">
                -- {translations[language].selectUser} --
              </option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.firstname} {user.lastname} - {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization */}
          <div>
            <label htmlFor="specialization" className="block mb-1">
              {translations[language].specialization}
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block mb-1">
              {translations[language].nationality}
            </label>
            <input
              type="text"
              name="nationality"
              id="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Bank Account */}
          <div>
            <label htmlFor="bank_account_number" className="block mb-1">
              {translations[language].bankAccount}
            </label>
            <input
              type="text"
              name="bank_account_number"
              id="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Special Skills */}
          <div>
            <label htmlFor="special_skills" className="block mb-1">
              {translations[language].specialSkills}
            </label>
            <textarea
              name="special_skills"
              id="special_skills"
              value={formData.special_skills}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Work Experience */}
          <div>
            <label htmlFor="work_experience" className="block mb-1">
              {translations[language].workExperience}
            </label>
            <textarea
              name="work_experience"
              id="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Background Check Status */}
          <div>
            <label htmlFor="background_check_status" className="block mb-1">
              {translations[language].backgroundCheckStatus}
            </label>
            <select
              name="background_check_status"
              id="background_check_status"
              value={formData.background_check_status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="pending">{translations[language].pending}</option>
              <option value="completed">
                {translations[language].completed}
              </option>
              <option value="failed">{translations[language].failed}</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block mb-1">
              {translations[language].startDate}
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* ID Card Image URL */}
          <div>
            <label htmlFor="id_card_image_url" className="block mb-1">
              {translations[language].idCardImage}
            </label>
            <input
              type="text"
              name="id_card_image_url"
              id="id_card_image_url"
              value={formData.id_card_image_url}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Criminal Record Image URL */}
          <div>
            <label htmlFor="criminal_record_image_url" className="block mb-1">
              {translations[language].criminalRecordImage}
            </label>
            <input
              type="text"
              name="criminal_record_image_url"
              id="criminal_record_image_url"
              value={formData.criminal_record_image_url}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Driver License Image URL */}
          <div>
            <label htmlFor="driver_license_image_url" className="block mb-1">
              {translations[language].driverLicenseImage}
            </label>
            <input
              type="text"
              name="driver_license_image_url"
              id="driver_license_image_url"
              value={formData.driver_license_image_url}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Additional Image URL */}
          <div>
            <label htmlFor="additional_image_url" className="block mb-1">
              {translations[language].additionalImage}
            </label>
            <input
              type="text"
              name="additional_image_url"
              id="additional_image_url"
              value={formData.additional_image_url}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Outsource Technician */}
          <div>
            <label htmlFor="isOutsource" className="flex items-center">
              <input
                type="checkbox"
                name="isOutsource"
                id="isOutsource"
                checked={formData.isOutsource}
                onChange={handleChange}
              />
              <span className="ml-2">
                {translations[language].outsourceTechnician}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 text-center mt-4">
            <button
              type="submit"
              className="btn bg-blue w-full text-white hover:bg-blue"
            >
              {translations[language].addTechnician}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechnician;
