import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const BorrowProductContent = () => {
  const { productId } = useParams();
  const [technician, setTechnician] = useState("");
  const [loading, setLoading] = useState(true);

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
    consent: false, // New state for consent checkbox
  });
  const [idCardImage, setIdCardImage] = useState(null);

  // Translation based on language in localStorage
  const language = localStorage.getItem("language") || "en";

  const translations = {
    en: {
      borrow_equipment: "Borrow Equipment",
      technician_name: "Technician Name",
      borrow_date: "Borrow Date",
      return_date: "Return Date",
      upload_id_card: "Upload ID Card Image",
      consent_text: "I consent to storing my data in the system",
      submit: "Submit",
    },
    th: {
      borrow_equipment: "ยืมอุปกรณ์",
      technician_name: "ชื่อช่าง",
      borrow_date: "วันที่ยืม",
      return_date: "วันที่คืน",
      upload_id_card: "อัพโหลดรูปบัตรประชาชน",
      consent_text: "ฉันยินยอมให้เก็บข้อมูลของฉันลงในระบบ",
      submit: "ยืนยัน",
    },
  };

  const translation = translations[language];

  useEffect(() => {
    fetchTechnicianById();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTechnicianById = async () => {
    try {
      const techResult = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/${user_id}`
      );
      setTechnician(techResult.data); // Assign the actual data to the state
      console.log(techResult.data); // Log the data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching technician details:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      consent: e.target.checked,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setIdCardImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("You must agree to the terms to proceed.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("tech_id", formData.tech_id);
    formDataToSubmit.append("borrow_date", formData.borrow_date);
    formDataToSubmit.append("return_date", formData.return_date);
    formDataToSubmit.append("product_id", productId);
    formDataToSubmit.append("user_id", user_id);

    if (idCardImage) {
      formDataToSubmit.append("id_card_image", idCardImage);
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
        const taskLogResponse = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/task-log`,
          {
            task_id: res.data.task_id,
            user_id: user_id,
            action: "ยืมอุปกรณ์",
          }
        );
        navigate("/dashboard/borrows");
      }
    } catch (error) {
      console.error("Error borrowing product:", error);
    }
  };

  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  return (
    <div className="container mx-auto p-8">
      <div className="p-6  mx-auto bg-white rounded-xl shadow-md my-5">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
          {translation.borrow_equipment}
          </h1>
        </div>
     
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="tech_id" className="block text-sm font-medium">
              {translation.technician_name}
            </label>
            <input
              type="text"
              name="tech_name"
              id="tech_name"
              value={
                formData.tech_id +
                "." +
                technician.firstname +
                " " +
                technician.lastname
              }
              onChange={handleChange}
              required
              disabled
              className="input input-bordered w-full "
            />
            <input
              type="number"
              name="tech_id"
              id="tech_id"
              value={formData.tech_id}
              onChange={handleChange}
              required
              disabled
              className="input input-bordered w-full hidden"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="borrow_date" className="block text-sm font-medium">
              {translation.borrow_date}
            </label>
            <input
              type="date"
              name="borrow_date"
              id="borrow_date"
              value={formData.borrow_date}
              onChange={handleChange}
              required
              min={today} // Prevent past dates
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="return_date" className="block text-sm font-medium">
              {translation.return_date}
            </label>
            <input
              type="date"
              name="return_date"
              id="return_date"
              value={formData.return_date}
              onChange={handleChange}
              min={formData.borrow_date || today} // Ensure return_date is after borrow_date
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="id_card_image"
              className="block text-sm font-medium"
            >
              {translation.upload_id_card}
            </label>
            <input
              type="file"
              name="id_card_image"
              id="id_card_image"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input file-input-bordered w-full h-10"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="consent" className="ml-2 text-sm">
              {translation.consent_text}
            </label>
          </div>
          <button
            type="submit"
            className="btn bg-blue text-white hover:bg-blue"
          >
            {translation.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BorrowProductContent;
