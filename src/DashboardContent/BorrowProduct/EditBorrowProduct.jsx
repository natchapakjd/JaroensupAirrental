import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";

const EditBorrowProduct = () => {
  const { borrowingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tech_id: "",
    product_id: "",
    borrow_date: "",
    return_date: "",
    user_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Set the translation based on the language in localStorage
  const language = localStorage.getItem("language") || "en"; // Default to English if no language is set
  const translation = language === "th" ? {
    tech_id: "รหัสช่าง",
    select_product: "เลือกผลิตภัณฑ์",
    borrow_date: "วันที่ยืม",
    return_date: "วันที่คืน",
    update: "อัพเดต",
    borrow_date_error: "วันที่ยืมไม่สามารถเป็นอดีตได้",
    return_date_error: "วันที่คืนไม่สามารถก่อนวันที่ยืมได้",
    invalid_date: "วันที่ไม่ถูกต้อง",
    success_message: "บันทึกข้อมูลการยืมอุปกรณ์สำเร็จ",
    error_message: "ไม่สามารถบันทึกข้อมูลการยืมอุปกรณ์ได้",
  } : {
    tech_id: "Technician ID",
    select_product: "Select Product",
    borrow_date: "Borrow Date",
    return_date: "Return Date",
    update: "Update",
    borrow_date_error: "Borrow date cannot be in the past",
    return_date_error: "Return date cannot be before the borrow date",
    invalid_date: "Invalid Date",
    success_message: "Borrowing record updated successfully",
    error_message: "Failed to update borrowing record",
  };

  useEffect(() => {
    fetchBorrowingDetails();
    fetchProducts();
  }, []);

  const fetchBorrowingDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/equipment-borrowing/id/${borrowingId}`
      );
      console.log(response.data); // Check what data is coming back

      if (Array.isArray(response.data) && response.data.length > 0) {
        setFormData(response.data[0]); // Set only the first object
      } else if (response.data) {
        setFormData(response.data); // If API returns an object directly
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrowing details:", error);
      Swal.fire("Error!", "Failed to fetch borrowing details", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/products`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "borrow_date") {
      // Ensure return date is not before the borrow date
      if (formData.return_date && value > formData.return_date) {
        Swal.fire({
          title: translation.invalid_date,
          text: "Borrow date cannot be after the return date.",
          icon: "warning",
        });
        return;
      }
    }

    if (name === "return_date") {
      // Ensure return date is after borrow date
      if (value < formData.borrow_date) {
        Swal.fire({
          title: translation.invalid_date,
          text: "Return date cannot be before the borrow date.",
          icon: "warning",
        });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submitting past borrow dates
    const today = new Date().toISOString().split("T")[0];
    if (formData.borrow_date < today) {
      Swal.fire(translation.error_message, translation.borrow_date_error, "error");
      return;
    }

    // Prevent submitting return date before borrow date
    if (formData.return_date < formData.borrow_date) {
      Swal.fire(translation.error_message, translation.return_date_error, "error");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/equipment-borrowing/${borrowingId}`,
        formData
      );

      Swal.fire("Success!", translation.success_message, "success");
      navigate("/dashboard/borrows");
    } catch (error) {
      console.error("Error updating borrowing record:", error);
      Swal.fire("Error!", translation.error_message, "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-8"><div className=" mx-auto p-6 bg-white shadow rounded-lg font-prompt my-5">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
            {translation.select_product}
          </h1>
        </div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        {translation.tech_id}
        <input
          type="text"
          name="tech_id"
          value={formData.tech_id}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          disabled
        />
      </label>

      <label className="block">
        {translation.select_product}
        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        >
          {products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        {translation.borrow_date}
        <input
          type="date"
          name="borrow_date"
          value={formData.borrow_date}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
        />
      </label>

      <label className="block">
        {translation.return_date}
        <input
          type="date"
          name="return_date"
          value={formData.return_date}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          min={formData.borrow_date || new Date().toISOString().split("T")[0]} // Ensure return date is not before borrow date
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue text-white py-2 rounded-md hover:bg-blue "
      >
        {translation.update}
      </button>
    </form>
  </div></div> 
    
  );
};

export default EditBorrowProduct;
