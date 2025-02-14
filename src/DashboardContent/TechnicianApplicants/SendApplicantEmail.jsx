import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const SendApplicantEmail = () => {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'th');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        title: language === 'en' ? 'Please fill in all the fields' : 'กรุณากรอกข้อมูลให้ครบถ้วน',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/applicant-email/${id}`, 
        { username, password }
      );

      if (response.status === 200) {
        Swal.fire({
          title: language === 'en' ? 'Email sent successfully!' : 'ส่งอีเมลสำเร็จ!',
          text: language === 'en' ? 'The applicant’s login details have been sent to their email.' : 'ข้อมูลการเข้าสู่ระบบของผู้สมัครได้ถูกส่งไปยังอีเมลแล้ว',
          icon: 'success',
        });
        navigate('/dashboard/applicants');  // Redirect after success
      }
    } catch (error) {
      Swal.fire({
        title: language === 'en' ? 'An error occurred!' : 'เกิดข้อผิดพลาด!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const text = {
    title: language === 'en' ? 'Send Login Details to Applicant' : 'ส่งข้อมูลการเข้าสู่ระบบให้ผู้สมัคร',
    usernameLabel: language === 'en' ? 'Username' : 'ชื่อผู้ใช้',
    passwordLabel: language === 'en' ? 'Password' : 'รหัสผ่าน',
    submitButton: language === 'en' ? 'Send Login Details' : 'ส่งข้อมูลการเข้าสู่ระบบ',
    loading: language === 'en' ? 'Loading...' : 'กำลังโหลด...',
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
      <h2 className="text-xl font-semibold mt-8 mb-5">{text.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="username" className="block text-base font-medium text-gray-700 ">{text.usernameLabel}</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full text-base text-gray-800 border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-base font-medium text-gray-700">{text.passwordLabel}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full text-base text-gray-800 border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="btn bg-blue hover:bg-blue text-white w-full p-3"
          disabled={loading}
        >
          {loading ? text.loading : text.submitButton}
        </button>
      </form>
    </div>
  );
};

export default SendApplicantEmail;
