// ApplicantDetails.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ApplicantDetails = () => {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/applicants/${id}`);
        setApplicant(response.data[0]);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลผู้สมัครได้');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id]);

  if (loading) return <p className="text-center">กำลังโหลด...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!applicant) return <p className="text-center">ไม่มีข้อมูลผู้สมัคร</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full bg-base-200">
      <h1 className="text-3xl font-bold mb-6 text-center">รายละเอียดผู้สมัคร</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
        <ul className="list-disc list-inside">
          <li><strong>ชื่อ:</strong> {applicant.first_name} {applicant.last_name}</li>
          <li><strong>วันเกิด:</strong> {new Date(applicant.date_of_birth).toLocaleDateString('th-TH')}</li>
          <li><strong>อีเมล:</strong> {applicant.email}</li>
          <li><strong>ตำแหน่งที่สมัคร:</strong> {applicant.position_applied}</li>
          <li><strong>สถานะ:</strong> {applicant.status_id}</li>
          <li><strong>วันที่สมัคร:</strong> {new Date(applicant.application_date).toLocaleDateString('th-TH')}</li>
          <li><strong>หมายเหตุ:</strong> {applicant.notes || 'ไม่มีหมายเหตุ'}</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">เอกสารแนบ</h2>
        <div className="grid grid-cols-2 gap-4">
          {applicant.id_card_image_url && (
            <div className="flex flex-col items-center">
              <img src={applicant.id_card_image_url} alt="ID Card" className="w-32 h-32 object-cover rounded-md" />
              <span>ID Card</span>
            </div>
          )}
          {applicant.driver_license_image_url && (
            <div className="flex flex-col items-center">
              <img src={applicant.driver_license_image_url} alt="Driver License" className="w-32 h-32 object-cover rounded-md" />
              <span>Driver License</span>
            </div>
          )}
          {applicant.criminal_record_image_url && (
            <div className="flex flex-col items-center">
              <img src={applicant.criminal_record_image_url} alt="Criminal Record" className="w-32 h-32 object-cover rounded-md" />
              <span>Criminal Record</span>
            </div>
          )}
          {applicant.additional_image_url && (
            <div className="flex flex-col items-center">
              <img src={applicant.additional_image_url} alt="Additional Image" className="w-32 h-32 object-cover rounded-md" />
              <span>Additional Image</span>
            </div>
          )}
          {/* Fallback for images */}
          {!applicant.id_card_image_url && <div className="flex flex-col items-center"><p>No ID Card</p></div>}
          {!applicant.driver_license_image_url && <div className="flex flex-col items-center"><p>No Driver License</p></div>}
          {!applicant.criminal_record_image_url && <div className="flex flex-col items-center"><p>No Criminal Record</p></div>}
          {!applicant.additional_image_url && <div className="flex flex-col items-center"><p>No Additional Image</p></div>}
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="btn bg-blue hover:bg-blue text-white w-full">
        Back
      </button>
    </div>
  );
};

export default ApplicantDetails;
