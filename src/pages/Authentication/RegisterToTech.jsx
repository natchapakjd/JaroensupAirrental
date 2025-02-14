import React, { useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import { useEffect } from "react";
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
    submitButton: "Submit Application",
    files: "Upload Files",
    id_card_image: "ID Card Copy",
    driver_license_image: "Driver License",
    criminal_record_image: "Criminal Record",
    additional_image: "Additional Documents",
    addData: "Add Data",
    AddOutsourceTech: "Add Technician Outsource",

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
    submitButton: "ส่งใบสมัคร",
    files: "แนบไฟล์",
    id_card_image: "สำเนาบัตรประชาชน",
    driver_license_image: "ใบขับขี่",
    criminal_record_image: "ประวัติอาชญากรรม",
    additional_image: "เอกสารเพิ่มเติม",
    AddOutsourceTech: "เพิ่มช่างภายนอก",
    addData: "เพิ่มข้อมูล",

    // Add other translations here
  },
};

const RegisterToTech = () => {
  const [formData, setFormData] = useState({
    date_of_birth: "",
    address: "",
    email: "",
    phone_number: "",
    position_applied: "ช่างซ่อมบำรุง", // Default value
    notes: "",
    id_card_image: null,
    driver_license_image: null,
    criminal_record_image: null,
    additional_image: null,
  });

  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const isValidDateOfBirth = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && monthDiff >= 0);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Example for a 10-digit number
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0], // Handle file uploads
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidDateOfBirth(formData.date_of_birth)) {
      Swal.fire({
        title: "วันเกิดไม่ถูกต้อง",
        text: "คุณต้องมีอายุอย่างน้อย 18 ปี",
        icon: "error",
      });
      return;
    }

    if (!isValidPhoneNumber(formData.phone_number)) {
      Swal.fire({
        title: "หมายเลขโทรศัพท์ไม่ถูกต้อง",
        text: "กรุณากรอกหมายเลขโทรศัพท์ให้ครบ 10 หลัก",
        icon: "error",
      });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (
        key !== "status_id" &&
        key !== "interview_date" &&
        key !== "interviewer"
      ) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/applicants`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "ส่งใบสมัครสำเร็จ",
          icon: "success",
        });
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="bg-gray-100 text-gray-800 font-prompt py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {!isDashboard ? translations[language].title : translations[language].AddOutsourceTech}
          </h1>
          <p className="text-lg text-gray-600">
            {translations[language].description}
          </p>
        </header>

        <div className="container mx-auto px-4 mb-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="first_name">
                  {translations[language].firstNameLabel}
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="border rounded w-full py-2 px-3"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="last_name">
                  {translations[language].lastNameLabel}
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="border rounded w-full py-2 px-3"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="date_of_birth">
                  {translations.birthDateLabel}
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  className="border rounded w-full py-2 px-3"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="phone_number">
                  {translations[language].phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  className="border rounded w-full py-2 px-3"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="email">
                {translations[language].emailLabel}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border rounded w-full py-2 px-3"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Please enter a valid email address."
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="address">
                {translations[language].addressLabel}
              </label>
              <textarea
                name="address"
                id="address"
                className="border rounded w-full py-2 px-3"
                rows="3"
                required
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="position_applied">
                {translations[language].positionLabel}
              </label>
              <select
                name="position_applied"
                id="position_applied"
                className="border rounded w-full py-2 px-3"
                required
                onChange={handleChange}
              >
                <option value="ช่างซ่อมบำรุง">ช่างซ่อมบำรุง</option>
                <option value="ช่างติดตั้ง">ช่างติดตั้ง</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="notes">
                {translations[language].notesLabel}
              </label>
              <textarea
                name="notes"
                id="notes"
                className="border rounded w-full py-2 px-3"
                onChange={handleChange}
              ></textarea>
            </div>
            {/* File Inputs */}
            <div className="mb-4">
              <label className="block text-gray-700 my-2">
                {" "}
                {translations[language].files}
              </label>
              <label className="block text-gray-700" htmlFor="id_card_image">
                {translations[language].id_card_image}
              </label>
              <input
                type="file"
                name="id_card_image"
                className=" file-input file-input-bordered w-full h-10"
                onChange={handleChange}
              />
              <label
                className="block text-gray-700"
                htmlFor="driver_license_image"
              >
                {translations[language].driver_license_image}
              </label>
              <input
                type="file"
                name="driver_license_image"
                className=" file-input file-input-bordered w-full h-10"
                onChange={handleChange}
              />
              <label
                className="block text-gray-700"
                htmlFor="criminal_record_image"
              >
                {translations[language].criminal_record_image}
              </label>
              <input
                type="file"
                name="criminal_record_image"
                className=" file-input file-input-bordered w-full h-10"
                onChange={handleChange}
              />
              <label className="block text-gray-700" htmlFor="additional_image">
                {translations[language].additional_image}
              </label>
              <input
                type="file"
                name="additional_image"
                className=" file-input file-input-bordered w-full h-10"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                  className="mr-2"
                />
                {translations[language].consentLabel}
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue text-white rounded px-4 py-2 hover:bg-blue"
            >
              {!isDashboard
                ? translations[language].submitButton
                : translations[language].addData}
            </button>
          </form>
        </div>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
};

export default RegisterToTech;
