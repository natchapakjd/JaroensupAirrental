import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

const AddBorrowProduct = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [technicians, setTechnicians] = useState([]); // State to store technicians
  const [formData, setFormData] = useState({
    tech_id: '',
    product_id: '',
    borrow_date: '',
    return_date: '',
    consent: false, // New state for consent checkbox
  });
  const [idCardImage, setIdCardImage] = useState(null); // State for image file
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get('authToken');
  const decodedToken = jwtDecode(token);
  let user_id = decodedToken.id; // Get user_id from decoded token
  const role = decodedToken.role
  const [techUserId,setTechUserId] = useState();
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/technicians`); // Adjust the URL according to your API
        setTechnicians(response.data);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchProducts();
    fetchTechnicians();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      consent: e.target.checked, // Update consent state
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
      alert('You must agree to the terms to proceed');
      return;
    }
    if (role === 3) {
      try {
        if (!tech_id) {
          console.error("Tech ID is missing");
          return;
        } 
        const techId = formData.tech_id
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/technician/${techId}`
        );
    
        console.log("Technician Data:", response.data[0]);
        setTechUserId(response.data[0].user_id)
      } catch (error) {
        console.error("Error fetching technician data:", error);
      }
    }
    
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('tech_id', formData.tech_id);
    formDataToSubmit.append('borrow_date', formData.borrow_date);
    formDataToSubmit.append('return_date', formData.return_date);
    formDataToSubmit.append('product_id', formData.product_id);
    if(role === 2){
      formDataToSubmit.append('user_id', user_id);
    }else{
      formDataToSubmit.append('user_id', techUserId);
    }

    if (idCardImage) {
      formDataToSubmit.append('id_card_image', idCardImage); // Add the image file
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/equipment-borrowing`,
        formDataToSubmit,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200) {
        navigate('/dashboard/borrows'); // Redirect on success
      }
    } catch (error) {
      console.error('Error borrowing product:', error);
    }
  };

  const today = new Date().toISOString().slice(0, 16); // Get today's date and time in YYYY-MM-DDTHH:mm format

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md my-5 font-inter">
      <h2 className="text-2xl font-bold mb-4">Add Borrow Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="tech_id" className="block text-sm font-medium">
            Select Technician
          </label>
          <select
            name="tech_id"
            id="tech_id"
            value={formData.tech_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select a technician</option>
            {technicians.map((technician) => (
              <option key={technician.tech_id} value={technician.tech_id}>
                {technician.firstname} {technician.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="product_id" className="block text-sm font-medium">
            Select Product
          </label>
          <select
            name="product_id"
            id="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select a product</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.name}
              </option>
            ))}
          </select>
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
            min={today} // Prevent selecting past dates
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
            min={today}
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
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleCheckboxChange}
            required
          />
          <label htmlFor="consent" className="ml-2 text-2sm font-inter">ฉันยินยอมให้เก็บข้อมูลของฉันลงในระบบ</label>
            </div>
        <button type="submit" className="btn bg-blue text-white hover:bg-blue">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBorrowProduct;
