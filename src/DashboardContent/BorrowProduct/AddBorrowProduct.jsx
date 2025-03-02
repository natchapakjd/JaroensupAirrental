import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const AddBorrowProduct = () => {
  const [products, setProducts] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tech_id: "",
    user_id: "",
    product_id: "",
    borrow_date: "",
    return_date: "",
    consent: false,
  });
  const [idCardImage, setIdCardImage] = useState(null);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.id;
  const role = decodedToken.role;
  const [techUserId, setTechUserId] = useState();

  const translation = {
    en: {
      title: "Add Borrow Product",
      selectTechnician: "Select Technician",
      selectProduct: "Select Product",
      borrowDate: "Borrow Date",
      returnDate: "Return Date",
      uploadIdCardImage: "Upload ID Card Image",
      consent: "I consent to the collection of my data in the system",
      submit: "Submit",
      termsAgreementError: "You must agree to the terms to proceed",
      techIdError: "Tech ID is missing",
      techUserIdError: "Tech User ID is not yet available.",
    },
    th: {
      title: "เพิ่มข้อมูลการยืมสินค้า",
      selectTechnician: "เลือกช่างเทคนิค",
      selectProduct: "เลือกสินค้า",
      borrowDate: "วันที่ยืม",
      returnDate: "วันที่ส่งคืน",
      uploadIdCardImage: "อัปโหลดภาพบัตรประชาชน",
      consent: "ฉันยินยอมให้เก็บข้อมูลของฉันลงในระบบ",
      submit: "ส่งข้อมูล",
      termsAgreementError: "คุณต้องยอมรับข้อตกลงเพื่อดำเนินการต่อ",
      techIdError: "รหัสช่างเทคนิคขาดหายไป",
      techUserIdError: "ยังไม่มีรหัสผู้ใช้ของช่างเทคนิค",
    },
  };

  const currentLang = localStorage.getItem("language") || "th"; // You can dynamically set this based on user preference

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/technicians`
        );
        setTechnicians(response.data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    const currentDate = new Date().toISOString().split("T")[0];
    setToday(currentDate);
    fetchProducts();
    fetchTechnicians();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      consent: e.target.checked,
    });
  };

  const handleFileChange = (e) => {
    setIdCardImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      alert(translation[currentLang].termsAgreementError);
      return;
    }

    if (role === 3 && !formData.tech_id) {
      console.error(translation[currentLang].techIdError);
      return;
    }

    let id = formData.tech_id;
    let techId;

    if (role === 3 && formData.tech_id) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/v2/technician/${id}`
        );
        techId = response.data[0].user_id;
      } catch (error) {
        console.error("Error fetching technician data:", error);
        return;
      }
    }

    if (role === 3 && !techId) {
      console.error(translation[currentLang].techUserIdError);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("tech_id", formData.tech_id);
    formDataToSubmit.append("borrow_date", formData.borrow_date);
    formDataToSubmit.append("return_date", formData.return_date);
    formDataToSubmit.append("product_id", formData.product_id);

    if (role === 2) {
      formDataToSubmit.append("user_id", user_id);
    } else if (role === 3) {
      formDataToSubmit.append("user_id", techId);
    }

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

        if (taskLogResponse.status === 201) {
          navigate("/dashboard/borrows");
        }
      }
    } catch (error) {
      console.error("Error borrowing product:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="p-6  mx-auto bg-white rounded-xl shadow-md my-5 font-prompt">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
          {translation[currentLang].title}
          </h1>
        </div>
       
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="tech_id" className="block text-sm font-medium">
              {translation[currentLang].selectTechnician}
            </label>
            <select
              name="tech_id"
              id="tech_id"
              value={formData.tech_id}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select a technician
              </option>
              {technicians.map((technician, index) => (
                <option key={index + 1} value={technician.tech_id}>
                  {index + 1}. {technician.firstname} {technician.lastname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="product_id" className="block text-sm font-medium">
              {translation[currentLang].selectProduct}
            </label>
            <select
              name="product_id"
              id="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product, index) => (
                <option key={index + 1} value={product.product_id}>
                  {index + 1}. {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="borrow_date" className="block text-sm font-medium">
              {translation[currentLang].borrowDate}
            </label>
            <input
              type="date"
              name="borrow_date"
              id="borrow_date"
              value={formData.borrow_date}
              onChange={handleChange}
              required
              min={today}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="return_date" className="block text-sm font-medium">
              {translation[currentLang].returnDate}
            </label>
            <input
              type="date"
              name="return_date"
              id="return_date"
              value={formData.return_date}
              onChange={handleChange}
              min={today}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="id_card_image"
              className="block text-sm font-medium"
            >
              {translation[currentLang].uploadIdCardImage}
            </label>
            <input
              type="file"
              name="id_card_image"
              id="id_card_image"
              onChange={handleFileChange}
              accept="image/*"
              className=" file-input file-input-bordered w-full h-10"
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
            <label htmlFor="consent" className="ml-2 text-2sm font-prompt">
              {translation[currentLang].consent}
            </label>
          </div>
          <button
            type="submit"
            className="btn bg-blue text-white hover:bg-blue"
          >
            {translation[currentLang].submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBorrowProduct;
