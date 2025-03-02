import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import BackButtonEdit from "../../components/BackButtonEdit";

const translations = {
  en: {
    title: "Register as Technician",
    description: "Please fill in the form below to register",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    birthDateLabel: "Date of Birth",
    phoneLabel: "Phone Number",
    emailLabel: "Email",
    addressLabel: "Address",
    positionLabel: "Position Applied",
    notesLabel: "Notes",
    consentLabel: "I agree to the collection of my data",
    submitButton: "Edit Application",
    files: "Upload Files",
    id_card_image: "ID Card Copy",
    driver_license_image: "Driver License",
    criminal_record_image: "Criminal Record",
    additional_image: "Additional Documents",
    editApplicantLabel: "Edit Applicant",
    statusLabel: "Status",
    interviewDateLabel: "interview date",

    // Add other translations here
  },
  th: {
    title: "สมัครเป็นช่าง",
    description: "กรุณากรอกข้อมูลด้านล่างเพื่อลงทะเบียน",
    firstNameLabel: "ชื่อ",
    lastNameLabel: "นามสกุล",
    birthDateLabel: "วันเกิด",
    phoneLabel: "หมายเลขโทรศัพท์",
    emailLabel: "อีเมล",
    addressLabel: "ที่อยู่",
    positionLabel: "ตำแหน่งที่สมัคร",
    notesLabel: "หมายเหตุ",
    consentLabel: "ฉันยินยอมให้เก็บข้อมูลของฉันลงในระบบ",
    submitButton: "แก้ไขผู้สมัคร",
    files: "แนบไฟล์",
    id_card_image: "สำเนาบัตรประชาชน",
    driver_license_image: "ใบขับขี่",
    criminal_record_image: "ประวัติอาชญากรรม",
    additional_image: "เอกสารเพิ่มเติม",
    editApplicantLabel: "แก้ไขผู้สมัคร",
    statusLabel: "สถานะ",
    interviewDateLabel: "วันสัมภาษณ์",

    // Add other translations here
  },
};

const EditApplicant = () => {
  const { applicantId } = useParams();
  const [applicant, setApplicant] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    address: "",
    email: "",
    phone_number: "",
    position_applied: "",
    notes: "",
    interview_date: "",
    status_id: "",
  });
  const [images, setImages] = useState({
    id_card_image: null,
    driver_license_image: null,
    criminal_record_image: null,
    additional_image: null,
  });
  const navigate = useNavigate(); // for navigation
  const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด
  const [statuses, setStatuses] = useState([]);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/applicants/${applicantId}`
        );

        // Assuming the API returns an array or object with the applicant data
        if (response.data.length > 0) {
          setApplicant(response.data[0]); // Assuming response is an array, otherwise use response.data directly
        } else {
          console.error("Applicant data is empty.");
        }

        const statusesResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/statuses`
        );
        if (Array.isArray(statusesResponse.data)) {
          setStatuses(statusesResponse.data);
        } else {
          console.error(
            "Statuses response is not an array:",
            statusesResponse.data
          );
        }
        setLoading(false); // กำหนดสถานะการโหลดเป็น false เมื่อโหลดข้อมูลเสร็จ
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load data",
          text: "Unable to fetch applicant data.",
        });
      }
    };

    fetchApplicantData();
  }, [applicantId]);
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth();
    if (
      month < birth.getMonth() ||
      (month === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Validate that the applicant is over 18 and interview date is not in the past
  const validateForm = () => {
    const age = calculateAge(applicant.date_of_birth);
    if (age < 18) {
      Swal.fire({
        icon: "error",
        title: "Invalid Age",
        text: "Applicant must be at least 18 years old.",
      });
      return false;
    }

    const interviewDate = new Date(applicant.interview_date);
    const today = new Date();
    if (interviewDate < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Interview Date",
        text: "Interview date cannot be in the past.",
      });
      return false;
    }

    return true;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setImages((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = new FormData();

    // Append form data
    for (const key in applicant) {
      formData.append(key, applicant[key]);
    }

    // Append image files only if they exist
    for (const key in images) {
      if (images[key]) {
        formData.append(key, images[key]);
      }
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/applicants/${applicantId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire({
        icon: "success",
        title: "Applicant updated successfully!",
      });
      // Navigate to the applicants page after successful update
      navigate("/dashboard/applicants");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update applicant",
        text: error.message,
      });
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto p-8">
      {" "}
      <div className="mx-auto p-8 bg-white rounded-lg shadow-md font-prompt">
        <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translations[language].editApplicantLabel}
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {translations[language].firstNameLabel}
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={applicant.first_name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  {translations[language].lastNameLabel}
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={applicant.last_name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Date of Birth, Address, Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {translations[language].birthDateLabel}
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={applicant.date_of_birth}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  max={new Date().toISOString().split("T")[0]}
                  min={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18) // คำนวณวันที่อย่างน้อย 18 ปีที่แล้ว
                    )
                      .toISOString()
                      .split("T")[0]
                  } // ตั้ง min เป็น 18 ปีที่แล้ว
                  required
                />
              </div>

              <div>
                <label className="label">
                  {translations[language].emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={applicant.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Phone Number and Position Applied */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {translations[language].phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={applicant.phone_number}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">
                  {translations[language].positionLabel}
                </label>
                <select
                  name="position_applied"
                  value={applicant.position_applied}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Position
                  </option>
                  <option value="maintenance">ช่างซ่อมบำรุง</option>
                  <option value="installation">ช่างติดตั้ง</option>
                </select>
              </div>
            </div>

            {/* Interview Date and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {translations[language].interviewDateLabel}
                </label>
                <input
                  type="date"
                  name="interview_date"
                  value={applicant.interview_date}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  {translations[language].statusLabel}
                </label>
                <select
                  name="status_id"
                  value={applicant.status_id}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  {Array.isArray(statuses) &&
                    statuses.map((status) => (
                      <option key={status.status_id} value={status.status_id}>
                        {status.status_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">
                {translations[language].addressLabel}
              </label>
              <textarea
                name="address"
                value={applicant.address}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                required
              />
            </div>
            {/* Notes */}
            <div>
              <label className="label">
                {translations[language].notesLabel}
              </label>
              <textarea
                name="notes"
                value={applicant.notes}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {translations[language].id_card_image}
                </label>
                <input
                  type="file"
                  name="id_card_image"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  {translations[language].driver_license_image}
                </label>
                <input
                  type="file"
                  name="driver_license_image"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  {translations[language].criminal_record_image}
                </label>
                <input
                  type="file"
                  name="criminal_record_image"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  {translations[language].statusLabel}
                </label>
                <input
                  type="file"
                  name="additional_image"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn bg-blue hover:bg-blue text-white w-full"
              >
                {translations[language].submitButton}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApplicant;
