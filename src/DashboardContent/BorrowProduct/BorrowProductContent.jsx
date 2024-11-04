import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";

const BorrowProductContent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const tech_id = decodedToken.technicianId;
  const user_id = decodedToken.id;

  const [formData, setFormData] = useState({
    tech_id: tech_id,
    borrow_date: "",
    return_date: "",
  });
  const [idCardImage, setIdCardImage] = useState(null); // State for image file

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setIdCardImage(e.target.files[0]); // Capture the selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("tech_id", formData.tech_id);
    formDataToSubmit.append("borrow_date", formData.borrow_date);
    formDataToSubmit.append("return_date", formData.return_date);
    formDataToSubmit.append("product_id", productId);
    formDataToSubmit.append("user_id", user_id);

    if (idCardImage) {
      formDataToSubmit.append("id_card_image", idCardImage); // Add the image file
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/equipment-borrowing`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        navigate("/dashboard/borrows"); // Redirect or show success message
      }
    } catch (error) {
      console.error("Error borrowing product:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md my-5">
      <h2 className="text-2xl font-bold mb-4">Borrow Equipment</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="tech_id" className="block text-sm font-medium">
            Technician ID
          </label>
          <input
            type="number"
            name="tech_id"
            id="tech_id"
            value={formData.tech_id}
            onChange={handleChange}
            required
            disabled
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="borrow_date" className="block text-sm font-medium">
            Borrow Date
          </label>
          <input
            type="datetime-local"
            name="borrow_date"
            id="borrow_date"
            value={formData.borrow_date}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="return_date" className="block text-sm font-medium">
            Return Date
          </label>
          <input
            type="datetime-local"
            name="return_date"
            id="return_date"
            value={formData.return_date}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="id_card_image" className="block text-sm font-medium">
            Upload ID Card Image
          </label>
          <input
            type="file"
            name="id_card_image"
            id="id_card_image"
            onChange={handleFileChange}
            accept="image/*"
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn bg-blue text-white hover:bg-blue">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BorrowProductContent;
