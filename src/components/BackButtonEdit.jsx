import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const BackButtonEdit = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <button
    onClick={handleBackClick}
    className="flex items-center space-x-2 cursor-pointer hover:shadow-lg transition-shadow duration-300"
  >
    <i className="fa fa-arrow-left"></i>
  </button>
  
  );
};

export default BackButtonEdit;
