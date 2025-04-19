import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import BackButtonEdit from '../../components/BackButtonEdit';

const EditWorkExp = () => {
  const { id: workExperienceId } = useParams();
  const [formData, setFormData] = useState({
    company_name: '',
    project_title: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [language] = useState(localStorage.getItem('language') || 'en');

  const translations = {
    en: {
      pageTitle: 'Edit Work Experience',
      sectionEdit: 'Edit Information',
      sectionUpload: 'Upload Images',
      instruction: 'Select one or more images to upload:',
      uploadButton: 'Upload',
      successUpdate: 'Information updated successfully!',
      errorUpdate: 'Failed to update information.',
      successUpload: 'Images uploaded successfully!',
      errorUpload: 'Failed to upload images.',
      saveButton: 'Save Changes',
    },
    th: {
      pageTitle: 'แก้ไขผลงานเก่า',
      sectionEdit: 'แก้ไขข้อมูล',
      sectionUpload: 'อัปโหลดรูปภาพ',
      instruction: 'เลือกรูปภาพอย่างน้อย 1 รูป เพื่ออัปโหลด:',
      uploadButton: 'อัปโหลด',
      successUpdate: 'อัปเดตข้อมูลสำเร็จ!',
      errorUpdate: 'อัปเดตข้อมูลไม่สำเร็จ',
      successUpload: 'อัปโหลดรูปภาพสำเร็จ!',
      errorUpload: 'อัปโหลดรูปภาพไม่สำเร็จ',
      saveButton: 'บันทึกการเปลี่ยนแปลง',
    },
  };

  // ดึงข้อมูลเดิมมาแสดงก่อน
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/work_exps/${workExperienceId}`);
        setFormData(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        Swal.fire({ icon: 'error', title: 'Error fetching data' });
      }
    };

    fetchData();
  }, [workExperienceId]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/work_exps/${workExperienceId}`, formData);
      Swal.fire({ icon: 'success', title: translations[language].successUpdate });
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire({ icon: 'error', title: translations[language].errorUpdate });
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      Swal.fire({ icon: 'warning', text: translations[language].instruction });
      return;
    }

    const formDataUpload = new FormData();
    images.forEach((file) => {
      formDataUpload.append('images', file);
    });
    formDataUpload.append('work_experience_id', workExperienceId);

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/work_exps/images`,
        formDataUpload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        }
      );

      Swal.fire({ icon: 'success', title: translations[language].successUpload });
      setImages([]);
    } catch (err) {
      console.error('Upload error:', err);
      Swal.fire({
        icon: 'error',
        title: translations[language].errorUpload,
        text: err.response?.data?.error || err.message || 'Unknown error occurred',
      });
    }
  };

  return (
    <div className="container mx-auto p-8 font-prompt">
      <div className="flex items-center mb-6">
        <BackButtonEdit />
        <h1 className="text-2xl font-semibold ml-2">
          {translations[language].pageTitle} #{workExperienceId}
        </h1>
      </div>

      {/* ส่วนแก้ไขข้อมูล */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">{translations[language].sectionEdit}</h2>

        <div className="space-y-2">
          <label className="block">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block">Project Title</label>
          <input
            type="text"
            name="project_title"
            value={formData.project_title}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn bg-green-600 text-white hover:bg-green-700"
        >
          {translations[language].saveButton}
        </button>
      </form>

      {/* ส่วนอัปโหลดรูป */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">{translations[language].sectionUpload}</h2>

        <div>
          <label className="block mb-2">{translations[language].instruction}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn bg-blue text-white hover:bg-blue"
        >
          {translations[language].uploadButton}
        </button>
      </form>
    </div>
  );
};

export default EditWorkExp;
