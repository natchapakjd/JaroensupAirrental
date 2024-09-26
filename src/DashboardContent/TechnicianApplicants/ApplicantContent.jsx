import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ApplicantContent = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/applicants`);
        setApplicants(response.data);
      } catch (err) {
        console.error("Error fetching applicants: ", err);
        setError('ไม่สามารถโหลดข้อมูลผู้สมัครได้');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [applicants]);

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้สมัคร?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบ',
      cancelButtonText: 'ไม่, ยกเลิก'
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/applicants/${id}`);
        if (response.status === 200) {
          Swal.fire({
            title: 'ลบผู้สมัครสำเร็จ!',
            icon: 'success',
          });
          setApplicants(applicants.filter(applicant => applicant.id !== id));
        } else {
          throw new Error('ไม่สามารถลบผู้สมัครได้');
        }
      } catch (error) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h1 className="text-3xl font-bold mb-6">รายชื่อผู้สมัคร</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Firstname</th>
            <th className="border border-gray-300 p-2">Lastname</th>
            <th className="border border-gray-300 p-2">Date of birth</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Position Applied</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Applicant date</th>
            <th className="border border-gray-300 p-2">Note</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
          
        </thead>
        <tbody className="text-center">
          {applicants.length > 0 ? (
            applicants.map(applicant => (
              <tr key={applicant.applicant_id}>
                <td className="border border-gray-300 p-2">{applicant.first_name}</td>
                <td className="border border-gray-300 p-2">{applicant.last_name}</td>
                <td className="border border-gray-300 p-2">{new Date(applicant.date_of_birth).toLocaleDateString('th-TH')}</td>
                <td className="border border-gray-300 p-2">{applicant.email}</td>
                <td className="border border-gray-300 p-2">{applicant.position_applied}</td>
                <td className="border border-gray-300 p-2">{applicant.status_id}</td>
                <td className="border border-gray-300 p-2">{new Date(applicant.application_date).toLocaleDateString('th-TH')}</td>
                <td className="border border-gray-300 p-2">{applicant.notes || 'ไม่มีหมายเหตุ'}</td>
                <td className="border border-gray-300 p-2">
                  <button className="btn btn-error text-white" onClick={() => handleDelete(applicant.applicant_id)}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="border border-gray-300 p-4">ไม่มีข้อมูลผู้สมัคร</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicantContent;
