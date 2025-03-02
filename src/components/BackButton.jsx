import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <button onClick={handleBackClick} className="btn btn-primary flex items-center space-x-2">
      <i className="fa fa-arrow-left"></i>
      <span>Back</span>
    </button>
  );
};

export default BackButton;
