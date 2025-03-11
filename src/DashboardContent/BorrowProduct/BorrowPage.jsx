import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButtonEdit from "../../components/BackButtonEdit";

const BorrowPage = () => {
  const language = localStorage.getItem("language") || "en";
  const translation = language === "th" ? {
    borrow_equipment: "ยืมอุปกรณ์",
    select_product: "เลือกรายการอุปกรณ์",
    quantity: "จำนวน",
    select_technician: "เลือกช่าง",
    borrow_date: "วันที่ยืม",
    return_date: "วันที่คืน",
    id_card_image: "รูปบัตรประจำตัว",
    pdpa_consent: "ฉันยินยอมให้มีการเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของฉันตามนโยบายความเป็นส่วนตัว (PDPA)",
    borrow_button: "ยืมอุปกรณ์",
    no_products: "ยังไม่มีอุปกรณ์ที่เลือก",
    error_fill_fields: "กรุณากรอกข้อมูลให้ครบถ้วนและเลือกอุปกรณ์อย่างน้อยหนึ่งรายการ",
    error_pdpa_consent: "คุณต้องยินยอมตามข้อกำหนด PDPA ก่อนดำเนินการ",
    error_quantity_exceed: "จำนวนสำหรับ {name} เกินสต็อกที่มีอยู่ ({stock})",
    success_message: "ยืมอุปกรณ์สำเร็จ!",
    error_message: "ไม่สามารถยืมอุปกรณ์ได้",
    image_card: "กรุณาอัปโหลดภาพบัตรประชาชน"
  } : {
    borrow_equipment: "Borrow Equipment",
    select_product: "Select Products to Borrow",
    quantity: "Quantity",
    select_technician: "Select Technician",
    borrow_date: "Borrow Date",
    return_date: "Return Date",
    id_card_image: "ID Card Image",
    pdpa_consent: "I consent to the collection and processing of my personal data in accordance with the Privacy Policy (PDPA)",
    borrow_button: "Borrow Equipment",
    no_products: "No products selected yet.",
    error_fill_fields: "Please fill in all required fields and select at least one product.",
    error_pdpa_consent: "You must consent to the PDPA terms before submitting.",
    error_quantity_exceed: "Quantity for {name} exceeds available stock ({stock}).",
    success_message: "Equipment borrowed successfully!",
    error_message: "Failed to borrow equipment.",
    image_card: "Plese upload id card image."
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProducts } = location.state || { selectedProducts: [] };
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const techId = decodedToken.id;
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [quantities, setQuantities] = useState({});
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [idCardImage, setIdCardImage] = useState(null);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products`);
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching all products:", error);
        Swal.fire({ title: "Error", text: translation.error_message, icon: "error" });
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/technicians`);
        setTechnicians(response.data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
        Swal.fire({ title: "Error", text: translation.error_message, icon: "error" });
      }
    };
    fetchTechnicians();
  }, []);

  useEffect(() => {
    if (selectedProducts.length > 0 && allProducts.length > 0) {
      const filtered = allProducts.filter((product) =>
        selectedProducts.includes(product.product_id)
      );
      setFilteredProducts(filtered);
      const initialQuantities = filtered.reduce((acc, product) => {
        acc[product.product_id] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      setSelectedProductIds(new Set(filtered.map((p) => p.product_id)));
    }
  }, [selectedProducts, allProducts]);

  const handleQuantityChange = (productId, value) => {
    const product = filteredProducts.find((p) => p.product_id === productId);
    const maxQuantity = product?.stock_quantity || 0;
    const quantity = Math.max(1, Math.min(parseInt(value) || 1, maxQuantity));

    if (parseInt(value) > maxQuantity) {
      Swal.fire({
        title: "Warning",
        text: translation.error_quantity_exceed
          .replace("{name}", product.name)
          .replace("{stock}", maxQuantity),
        icon: "warning",
      });
    }

    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
  };

  const handleCheckboxChange = (productId) => {
    const updatedSelected = new Set(selectedProductIds);
    if (updatedSelected.has(productId)) {
      updatedSelected.delete(productId);
    } else {
      updatedSelected.add(productId);
    }
    setSelectedProductIds(updatedSelected);
  };

  const handleConsentChange = () => {
    setIsConsentChecked((prev) => !prev);
  };

  const handleBorrow = async () => {
    if (!borrowDate || !returnDate || selectedProductIds.size === 0) {
      Swal.fire({ title: "Error", text: translation.error_fill_fields, icon: "error" });
      return;
    }

    if (!isConsentChecked) {
      Swal.fire({ title: "Error", text: translation.error_pdpa_consent, icon: "error" });
      return;
    }

    for (const product of filteredProducts.filter((p) => selectedProductIds.has(p.product_id))) {
      const qty = quantities[product.product_id] || 1;
      if (qty > product.stock_quantity) {
        Swal.fire({
          title: "Error",
          text: translation.error_quantity_exceed
            .replace("{name}", product.name)
            .replace("{stock}", product.stock_quantity),
          icon: "error",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("tech_id", selectedTechId ? selectedTechId : techId);
    formData.append("borrow_date", borrowDate);
    formData.append("return_date", returnDate);
    formData.append("user_id", selectedTechId ? selectedTechId : techId);
    formData.append(
      "products",
      JSON.stringify(
        filteredProducts
          .filter((product) => selectedProductIds.has(product.product_id))
          .map((product) => ({
            product_id: product.product_id,
            quantity: quantities[product.product_id] || 1,
          }))
      )
    );

    if (!idCardImage) {
      Swal.fire({ title: "Error", text: `${translation.image_card}`, icon: "error" });
      return;
    }
    

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/v2/equipment-borrowing`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        const taskLogResponse = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/task-log`,
          {
            task_id: response.data.task_id,
            user_id: selectedTechId ? selectedTechId : techId,
            action: language === "th" ? "ยืมอุปกรณ์" : "Borrow Equipment",
          }
        );

        Swal.fire({ title: "Success", text: translation.success_message, icon: "success" });
        if (taskLogResponse.status === 201) {
          navigate("/dashboard/borrows");
        }
      }
    } catch (error) {
      console.error("Error borrowing equipment:", error.response?.data || error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || translation.error_message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen font-prompt">
      <div className="p-8 rounded-lg shadow-xl w-full mx-auto bg-white transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">{translation.borrow_equipment}</h1>
        </div>

        {/* Selected Products with Checkboxes */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">{translation.select_product}</h3>
          {filteredProducts.length > 0 ? (
            <ul className="space-y-4">
              {filteredProducts.map((product) => (
                <li
                  key={product.product_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.has(product.product_id)}
                      onChange={() => handleCheckboxChange(product.product_id)}
                      className="checkbox border-blue-500 checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-400"
                    />
                    <span className="text-gray-800 ">
                      {product.name} (ID: {product.product_id}) - Stock: {product.stock_quantity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-600">{translation.quantity}:</label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantities[product.product_id] || 1}
                      onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                      className="input input-bordered w-20 text-center focus:ring-2 focus:ring-blue-400"
                      disabled={!selectedProductIds.has(product.product_id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">{translation.no_products}</p>
          )}
        </div>

        {/* Technician Selection */}
        {role === 3 && (
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 ">{translation.select_technician}</label>
            <select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
              className="select select-bordered w-full focus:ring-2 focus:ring-blue-400"
            >
              <option value="">{language === "th" ? "-- เลือกช่าง --" : "-- Select a Technician --"}</option>
              {technicians.map((tech) => (
                <option key={tech.user_id} value={tech.user_id}>
                  {tech.firstname} {tech.lastname} (ID: {tech.user_id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Borrow Date */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 ">{translation.borrow_date}</label>
          <input
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Return Date */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 ">{translation.return_date}</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
            min={borrowDate || new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* ID Card Image */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 ">{translation.id_card_image}</label>
          <input
            type="file"
            name="id_card_image"
            onChange={(e) => setIdCardImage(e.target.files[0])}
            className="file-input file-input-bordered w-full h-12 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          />
        </div>

        {/* PDPA Consent Checkbox */}
        <div className="mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isConsentChecked}
              onChange={handleConsentChange}
              className="checkbox border-blue-500 checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-400"
            />
            <span className="text-gray-700">{translation.pdpa_consent}</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBorrow}
          className="btn w-full bg-primary text-white py-3 rounded-lg hover:bg-primary transition-colors duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!isConsentChecked}
        >
          {translation.borrow_button}
        </button>
      </div>
    </div>
  );
};

export default BorrowPage;