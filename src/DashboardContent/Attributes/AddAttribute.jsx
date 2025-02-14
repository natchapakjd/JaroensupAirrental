import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Translation object for multiple languages
const translations = {
  en: {
    title: "Add New Attribute",
    nameLabel: "Name",
    addButton: "Add Attribute",
    addingButton: "Adding...",
    successTitle: "Success!",
    successMessage: "Attribute added successfully.",
    errorTitle: "Error!",
    errorMessage: "Failed to add attribute.",
  },
  th: {
    title: "เพิ่มคุณลักษณะใหม่",
    nameLabel: "ชื่อ",
    addButton: "เพิ่มคุณลักษณะ",
    addingButton: "กำลังเพิ่ม...",
    successTitle: "สำเร็จ!",
    successMessage: "เพิ่มคุณลักษณะสำเร็จ.",
    errorTitle: "ข้อผิดพลาด!",
    errorMessage: "ไม่สามารถเพิ่มคุณลักษณะได้.",
  }
};

const AddAttribute = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/attribute`, { name });
      if (response.status === 201) {
        Swal.fire(translations[language].successTitle, translations[language].successMessage, 'success');
        setName('');
        setTimeout(() => {
          navigate('/dashboard/attributes');
        }, 800);
      } else {
        throw new Error(translations[language].errorMessage);
      }
    } catch (error) {
      Swal.fire(translations[language].errorTitle, error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto max-w-md mt-5">
      <h1 className="text-2xl font-semibold mb-6">{translations[language].title}</h1>
      <form onSubmit={handleSubmit} className='text-sm font-medium'>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">{translations[language].nameLabel}</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className={`btn bg-blue text-white hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? translations[language].addingButton : translations[language].addButton}
        </button>
      </form>
    </div>
  );
};

export default AddAttribute;
