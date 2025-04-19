import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading';
import BackButton from "../../components/BackButton";  // เพิ่มการนำเข้าปุ่มย้อนกลับ

const WorkExpDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // สถานะสำหรับจัดการรูปที่คลิกเพื่อดูเต็ม
  const navigate = useNavigate();

  const translations = {
    en: {
      title: 'Work Experience Details',
      company: 'Company Name:',
      project: 'Project Title:',
      description: 'Description:',
      images: 'Images:',
      notFound: 'Work experience not found.',
    },
    th: {
      title: 'รายละเอียดผลงาน',
      company: 'ชื่อบริษัท:',
      project: 'ชื่อโปรเจกต์:',
      description: 'รายละเอียด:',
      images: 'รูปภาพ:',
      notFound: 'ไม่พบผลงานนี้',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/work_exps/${id}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setData(null);
      }
    };

    fetchData();
  }, [id]);

  const handleImageClick = (url) => {
    setSelectedImage(url); // ตั้งค่าสถานะของรูปที่คลิก
  };

  const closeModal = () => {
    setSelectedImage(null); // ปิดการดูรูปเต็ม
  };

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>{translations[language].notFound}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton /> 

      <h1 className="text-3xl font-bold mb-4">{translations[language].title}</h1>
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div>
          <strong>{translations[language].company}</strong> {data.company_name}
        </div>
        <div>
          <strong>{translations[language].project}</strong> {data.project_title}
        </div>
        <div>
          <strong>{translations[language].description}</strong>
          <p className="whitespace-pre-line">{data.description}</p>
        </div>
        <div>
          <strong>{translations[language].images}</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {data.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Work image ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-sm cursor-pointer"
                onClick={() => handleImageClick(url)} // คลิกเพื่อดูรูปเต็ม
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal สำหรับดูรูปเต็ม */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal} // คลิกปิด modal
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default WorkExpDetails;
