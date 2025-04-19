import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BackButtonEdit from '../../components/BackButtonEdit';

const AddWorkExp = () => {
  const navigate = useNavigate();
  const [workExp, setWorkExp] = useState({
    company_name: '',
    project_title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const translations = {
    en: {
      pageTitle: 'Add Work Experience',
      companyLabel: 'Company Name:',
      projectLabel: 'Project Title:',
      descLabel: 'Description:',
      addButton: 'Add Work Experience',
      addingButton: 'Adding...',
      successAdd: 'Work Experience Added!',
      errorAdd: 'Failed to add work experience.',
    },
    th: {
      pageTitle: 'เพิ่มประสบการณ์ทำงาน',
      companyLabel: 'ชื่อบริษัท:',
      projectLabel: 'ชื่อโปรเจกต์:',
      descLabel: 'รายละเอียด:',
      addButton: 'เพิ่มผลงาน',
      addingButton: 'กำลังเพิ่ม...',
      successAdd: 'เพิ่มผลงานสำเร็จ!',
      errorAdd: 'เพิ่มผลงานไม่สำเร็จ',
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkExp((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/work_exps`, workExp);
      if (response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: translations[language].successAdd,
        });
        navigate('/dashboard/workexperiences');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: translations[language].errorAdd,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex w-full my-2">
        <BackButtonEdit />
        <h1 className="text-2xl font-semibold mx-2">{translations[language].pageTitle}</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="company_name" className="block mb-2">{translations[language].companyLabel}</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={workExp.company_name}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="project_title" className="block mb-2">{translations[language].projectLabel}</label>
          <input
            type="text"
            id="project_title"
            name="project_title"
            value={workExp.project_title}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">{translations[language].descLabel}</label>
          <textarea
            id="description"
            name="description"
            value={workExp.description}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className={`btn bg-blue text-white hover:bg-blue ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? translations[language].addingButton : translations[language].addButton}
        </button>
      </form>
    </div>
  );
};

export default AddWorkExp;
