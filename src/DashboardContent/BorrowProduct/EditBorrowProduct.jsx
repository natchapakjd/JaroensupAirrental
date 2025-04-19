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
    borrow_date: "",
    return_date: "",
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const language = localStorage.getItem("language") || "th";
  const translation = language === "th" ? {
    tech_id: "รหัสช่าง",
    select_product: "เลือกรายการอุปกรณ์",
    quantity: "จำนวน",
    borrow_date: "วันที่ยืม",
    return_date: "วันที่คืน",
    update: "อัพเดต",
    select_technician: "เลือกช่าง",
    borrow_date_error: "วันที่ยืมไม่สามารถเป็นอดีตได้",
    return_date_error: "วันที่คืนไม่สามารถก่อนวันที่ยืมได้",
    invalid_date: "วันที่ไม่ถูกต้อง",
    success_message: "บันทึกข้อมูลการยืมอุปกรณ์สำเร็จ",
    error_message: "ไม่สามารถบันทึกข้อมูลการยืมอุปกรณ์ได้",
    quantity_exceed: "จำนวนเกินสต็อกที่มีอยู่",
    duplicate_product: "อุปกรณ์นี้ถูกเลือกแล้ว",
  } : {
    tech_id: "Technician ID",
    select_product: "Select Product",
    quantity: "Quantity",
    borrow_date: "Borrow Date",
    return_date: "Return Date",
    update: "Update",
    select_technician: "Select Technician",
    borrow_date_error: "Borrow date cannot be in the past",
    return_date_error: "Return date cannot be before the borrow date",
    invalid_date: "Invalid Date",
    success_message: "Borrowing record updated successfully",
    error_message: "Failed to update borrowing record",
    quantity_exceed: "Quantity exceeds available stock",
    duplicate_product: "This product is already selected",
  };

  useEffect(() => {
    fetchBorrowingDetails();
    fetchProducts();
    fetchTechnicians();
  }, []);

  const fetchBorrowingDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/v3/equipment-borrowing/id/${borrowingId}`
      );
      setFormData({
        tech_id: response.data.tech_id,
        borrow_date: response.data.borrow_date.split(" ")[0],
        return_date: response.data.return_date.split(" ")[0],
        products: response.data.products.map((p) => ({
          product_id: p.product_id,
          quantity: p.quantity,
        })),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrowing details:", error);
      Swal.fire("Error!", "Failed to fetch borrowing details", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products`);
      setProductsList(response.data); // สมมติว่ามี stock_quantity ในข้อมูล
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/technicians`);
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      Swal.fire("Error", "Failed to fetch technicians", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "borrow_date" && formData.return_date && value > formData.return_date) {
      Swal.fire({
        title: translation.invalid_date,
        text: "Borrow date cannot be after the return date.",
        icon: "warning",
      });
      return;
    }
    if (name === "return_date" && value < formData.borrow_date) {
      Swal.fire({
        title: translation.invalid_date,
        text: "Return date cannot be before the borrow date.",
        icon: "warning",
      });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    const product = productsList.find((p) => p.product_id === parseInt(updatedProducts[index].product_id, 10));
  
    if (field === "quantity") {
      const qty = parseInt(value) || 1;
      if (product && qty > product.stock_quantity) {
        Swal.fire({
          title: "Warning",
          text: `${translation.quantity_exceed} (${product.stock_quantity})`,
          icon: "warning",
        });
        updatedProducts[index][field] = product.stock_quantity;
      } else {
        updatedProducts[index][field] = qty;
      }
    } else {
      updatedProducts[index][field] = parseInt(value, 10) || value; // แปลง product_id เป็น integer
    }
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    // แปลง product_id ใน formData.products เป็น integer ก่อนใส่ใน Set
    const selectedProductIds = new Set(
      formData.products.map((p) => parseInt(p.product_id, 10))
    );
    // กรอง productsList โดยแปลง product_id เป็น integer เพื่อเปรียบเทียบ
    const availableProducts = productsList.filter(
      (p) => !selectedProductIds.has(parseInt(p.product_id, 10))
    );
    if (availableProducts.length === 0) {
      Swal.fire({
        title: "Warning",
        text: translation.duplicate_product,
        icon: "warning",
      });
      return;
    }
  
    setFormData({
      ...formData,
      products: [...formData.products, { product_id: "", quantity: 1 }],
    });
  };
  
  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (formData.borrow_date < today) {
      Swal.fire(translation.error_message, translation.borrow_date_error, "error");
      return;
    }
    if (formData.return_date < formData.borrow_date) {
      Swal.fire(translation.error_message, translation.return_date_error, "error");
      return;
    }
    if (!formData.tech_id) {
      Swal.fire(translation.error_message, "Please select a technician.", "error");
      return;
    }
    if (formData.products.length === 0 || formData.products.some((p) => !p.product_id)) {
      Swal.fire(translation.error_message, "Please select at least one product.", "error");
      return;
    }

    // ตรวจสอบ stock_quantity อีกครั้งก่อน submit
    for (const product of formData.products) {
      const stockProduct = productsList.find((p) => p.product_id === product.product_id);
      if (stockProduct && product.quantity > stockProduct.stock_quantity) {
        Swal.fire({
          title: "Error",
          text: `${translation.quantity_exceed} for ${stockProduct.name} (${stockProduct.stock_quantity})`,
          icon: "error",
        });
        return;
      }
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/v4/equipment-borrowing/id/${borrowingId}`,
        formData
      );
      Swal.fire("Success!", translation.success_message, "success");
      navigate("/dashboard/borrows");
    } catch (error) {
      console.error("Error updating borrowing record:", error.response?.data || error);
      Swal.fire("Error!", translation.error_message, "error");
    }
  };

  // ฟังก์ชันกรองผลิตภัณฑ์ที่ยังไม่ได้เลือก
  const getAvailableProducts = (currentIndex) => {
    const selectedProductIds = new Set(
      formData.products
        .filter((_, i) => i !== currentIndex)
        .map((p) => p.product_id)
    );
    return productsList.filter((p) => !selectedProductIds.has(p.product_id));
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-8 min-h-screen ">
  <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <BackButtonEdit />
        <h1 className="text-2xl font-semibold mx-2">
          {translation.select_product}
        </h1>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6 ">
      {/* Technician Dropdown */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 text-md">
            {translation.select_technician}
          </span>
        </label>
        <select
          name="tech_id"
          value={formData.tech_id}
          onChange={handleChange}
          className="select select-bordered w-full bg-gray-50 focus:ring-2 focus:ring-indigo-400 transition-colors"
          required
        >
          <option value="">{translation.select_technician}</option>
          {technicians.map((tech) => (
            <option key={tech.user_id} value={tech.user_id}>
              {tech.firstname} {tech.lastname} (ID: {tech.user_id})
            </option>
          ))}
        </select>
      </div>

      {/* Products Selection */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 text-md">
            {translation.select_product}
          </span>
        </label>
        {formData.products.map((product, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
          >
            <select
              value={product.product_id}
              onChange={(e) => handleProductChange(index, "product_id", e.target.value)}
              className="select select-bordered w-full bg-white focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">{translation.select_product}</option>
              {getAvailableProducts(index).map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name} (Stock: {p.stock_quantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max={productsList.find((p) => p.product_id === product.product_id)?.stock_quantity || 1}
              value={product.quantity}
              onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
              className="input input-bordered w-24 text-center focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              onClick={() => removeProduct(index)}
              className="btn btn-error btn-sm bg-blue-500 hover:bg-blue text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addProduct}
          className="btn btn-primary btn-sm mt-2 bg-blue-500 hover:bg-primary text-white"
        >
          Add Product
        </button>
      </div>

      {/* Borrow Date */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 text-md">
            {translation.borrow_date}
          </span>
        </label>
        <input
          type="date"
          name="borrow_date"
          value={formData.borrow_date}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 focus:ring-2 focus:ring-indigo-400 transition-colors"
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Return Date */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-gray-700 text-md">
            {translation.return_date}
          </span>
        </label>
        <input
          type="date"
          name="return_date"
          value={formData.return_date}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 focus:ring-2 focus:ring-indigo-400 transition-colors"
          required
          min={formData.borrow_date || new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn w-full btn-primary text-white py-3 rounded-lg  transition-colors duration-300 shadow-md"
      >
        {translation.update}
      </button>
    </form>
  </div>
</div>
  );
};

export default EditBorrowProduct;