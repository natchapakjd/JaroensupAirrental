// ApplicantDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";

const ApplicantDetails = () => {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/applicants/${id}`
        );
        setApplicant(response.data[0]);
      } catch (err) {
        setError(language === "en" ? "Cannot load applicant data" : "ไม่สามารถโหลดข้อมูลผู้สมัครได้");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id, language]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!applicant) return <p className="text-center">{language === "en" ? "No applicant data found" : "ไม่มีข้อมูลผู้สมัคร"}</p>;

  const text = {
    title: language === "en" ? "Applicant Details" : "รายละเอียดผู้สมัคร",
    personalInfo: language === "en" ? "Personal Information" : "ข้อมูลส่วนตัว",
    documents: language === "en" ? "Documents" : "เอกสารแนบ",
    editApplicant: language === "en" ? "Edit Applicant" : "แก้ไขข้อมูลผู้สมัคร",
    applicantNotFound: language === "en" ? "No applicant data found" : "ไม่มีข้อมูลผู้สมัคร",
    back: language === "en" ? "Back" : "กลับ",
    noIdCard: language === "en" ? "No ID Card" : "ไม่มีบัตรประชาชน",
    noDriverLicense: language === "en" ? "No Driver License" : "ไม่มีใบขับขี่",
    noCriminalRecord: language === "en" ? "No Criminal Record" : "ไม่มีประวัติอาชญากรรม",
    noAdditionalImage: language === "en" ? "No Additional Image" : "ไม่มีรูปภาพเพิ่มเติม",
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full bg-base-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">{text.title}</h1>

        <Link to={`/dashboard/applicants/edit/${id}`}>
          <button className="btn bg-blue text-white hover:bg-blue">
            {text.editApplicant}
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">{text.personalInfo}</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>{language === "en" ? "Name:" : "ชื่อ:"}</strong> {applicant.first_name} {applicant.last_name}
          </li>
          <li>
            <strong>{language === "en" ? "Date of Birth:" : "วันเกิด:"}</strong> {new Date(applicant.date_of_birth).toLocaleDateString(language === "en" ? "en-GB" : "th-TH")}
          </li>
          <li>
            <strong>{language === "en" ? "Email:" : "อีเมล:"}</strong> {applicant.email}
          </li>
          <li>
            <strong>{language === "en" ? "Position Applied:" : "ตำแหน่งที่สมัคร:"}</strong> {applicant.position_applied}
          </li>
          <li>
            <strong>{language === "en" ? "Status:" : "สถานะ:"}</strong> {applicant.status_name}
          </li>
          <li>
            <strong>{language === "en" ? "Application Date:" : "วันที่สมัคร:"}</strong> {new Date(applicant.application_date).toLocaleDateString(language === "en" ? "en-GB" : "th-TH")}
          </li>
          <li>
            <strong>{language === "en" ? "Notes:" : "หมายเหตุ:"}</strong> {applicant.notes || (language === "en" ? "No notes" : "ไม่มีหมายเหตุ")}
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">{text.documents}</h2>
        <div className="grid grid-cols-2 gap-4">
          {applicant.id_card_image_url && (
            <div className="flex flex-col items-center">
              <img
                src={applicant.id_card_image_url}
                alt="ID Card"
                className="w-32 h-32 object-cover rounded-md"
              />
              <span>ID Card</span>
            </div>
          )}
          {applicant.driver_license_image_url && (
            <div className="flex flex-col items-center">
              <img
                src={applicant.driver_license_image_url}
                alt="Driver License"
                className="w-32 h-32 object-cover rounded-md"
              />
              <span>Driver License</span>
            </div>
          )}
          {applicant.criminal_record_image_url && (
            <div className="flex flex-col items-center">
              <img
                src={applicant.criminal_record_image_url}
                alt="Criminal Record"
                className="w-32 h-32 object-cover rounded-md"
              />
              <span>Criminal Record</span>
            </div>
          )}
          {applicant.additional_image_url && (
            <div className="flex flex-col items-center">
              <img
                src={applicant.additional_image_url}
                alt="Additional Image"
                className="w-32 h-32 object-cover rounded-md"
              />
              <span>Additional Image</span>
            </div>
          )}
          {/* Fallback for images */}
          {!applicant.id_card_image_url && (
            <div className="flex flex-col items-center">
              <p>{text.noIdCard}</p>
            </div>
          )}
          {!applicant.driver_license_image_url && (
            <div className="flex flex-col items-center">
              <p>{text.noDriverLicense}</p>
            </div>
          )}
          {!applicant.criminal_record_image_url && (
            <div className="flex flex-col items-center">
              <p>{text.noCriminalRecord}</p>
            </div>
          )}
          {!applicant.additional_image_url && (
            <div className="flex flex-col items-center">
              <p>{text.noAdditionalImage}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="btn bg-blue hover:bg-blue text-white w-full"
      >
        {text.back}
      </button>
    </div>
  );
};

export default ApplicantDetails;
