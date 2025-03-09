import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    title: "Approve Task No ",
    selectProduct: "Select Product",
    quantity: "Quantity",
    addProduct: "Add Another Product",
    addRentals: "Add Rentals",
    clear: "Clear",
    success: "Rental data added successfully.",
    duplicateProduct: "You cannot select the same product more than once.",
    invalidQuantity: "The quantity cannot exceed the available stock of",
    invalidInput: "Please select a product and specify a valid quantity for all products.",
  },
  th: {
    title: "อนุมัติงาน หมายเลข ",
    selectProduct: "เลือกสินค้า",
    quantity: "จำนวน",
    addProduct: "เพิ่มสินค้าสำหรับงาน",
    addRentals: "เพิ่มการเช่า",
    clear: "ล้างข้อมูล",
    success: "เพิ่มข้อมูลการเช่าเรียบร้อยแล้ว",
    duplicateProduct: "ไม่สามารถเลือกสินค้าซ้ำได้",
    invalidQuantity: "จำนวนต้องไม่เกินจำนวนสินค้าที่มีอยู่",
    invalidInput: "กรุณาเลือกสินค้าและระบุจำนวนที่ถูกต้องสำหรับทุกสินค้า",
  },
};

const ApproveTask = () => {
  const { taskId } = useParams();
  const [products, setProducts] = useState([]);
  const [productSelections, setProductSelections] = useState([]);
  const [language, setLanguage] = useState("en"); // Default language
  const navigate = useNavigate();

  useEffect(() => {
    // Set language from localStorage or default to "en"
    const savedLanguage = localStorage.getItem("language") || "en";
    setLanguage(savedLanguage);

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        const filteredProducts = response.data.filter(
          (product) => product.product_type_id === 1
        );
        setProducts(filteredProducts);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to load products.",
          icon: "error",
        });
      }
    };

    fetchProducts();
  }, []);

  const t = (key) => translations[language][key]; // Translation function

  const handleAddProduct = () => {
    const newSelections = [...productSelections];
    if (newSelections.some((selection) => selection.product_id === "")) {
      Swal.fire({
        title: t("duplicateProduct"),
        icon: "warning",
      });
      return;
    }
    setProductSelections([
      ...productSelections,
      { product_id: "", quantity: 1, stock_quantity: 0 },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const newSelections = [...productSelections];
    newSelections[index][field] = value;

    if (field === "product_id") {
      if (
        newSelections.some(
          (selection, i) => selection.product_id === value && i !== index
        )
      ) {
        Swal.fire({
          title: t("duplicateProduct"),
          icon: "warning",
        });
        return;
      }

      const selectedProduct = products.find(
        (product) => product.product_id === value
      );
      if (selectedProduct) {
        newSelections[index].stock_quantity = selectedProduct.stock_quantity;
      }
    }

    if (field === "quantity") {
      const quantity = parseInt(value, 10);
      const product = products.find(
        (product) => product.product_id == newSelections[index].product_id
      );
      if (quantity > product?.stock_quantity) {
        Swal.fire({
          title: t("invalidQuantity"),
          text: `${t("invalidQuantity")} ${product?.stock_quantity}`,
          icon: "warning",
        });
        return;
      }
    }

    setProductSelections(newSelections);
  };

  const handleClear = () => {
    setProductSelections([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      productSelections.some(
        (selection) => !selection.product_id || selection.quantity <= 0
      )
    ) {
      Swal.fire({
        title: t("invalidInput"),
        icon: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/rental`,
        {
          task_id: taskId,
          rentals: productSelections.map((selection) => ({
            product_id: selection.product_id,
            rental_start_date: new Date().toISOString().split("T")[0],
            rental_end_date: new Date().toISOString().split("T")[0],
            quantity: selection.quantity,
          })),
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: t("success"),
          icon: "success",
        });
        navigate("/dashboard/tasks");
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add rental data.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while processing the request.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
      <h2 className="text-xl font-semibold mb-6">
        {t("title")} {taskId}
      </h2>

      <form onSubmit={handleSubmit}>
        {productSelections.map((selection, index) => (
          <div key={index} className="mb-4 flex items-center space-x-4">
            <div className="w-1/2">
              <label
                htmlFor={`product-${index}`}
                className="block text-md text-gray-700"
              >
                {t("selectProduct")} {index + 1}
              </label>
              <select
                id={`product-${index}`}
                value={selection.product_id}
                onChange={(e) =>
                  handleProductChange(index, "product_id", e.target.value)
                }
                className="select select-bordered w-full"
              >
                <option value="">{t("selectProduct")}</option>
                {products.map((product, idx) => (
                  <option key={idx + 1} value={product.product_id}>
                    {idx + 1}. {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/4">
              <label
                htmlFor={`quantity-${index}`}
                className="block text-sm font-medium text-gray-700 mt-2"
              >
                {t("quantity")}
              </label>
              <input
                type="number"
                id={`quantity-${index}`}
                value={selection.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                min="1"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddProduct}
          className="btn btn-success mb-4 text-white"
        >
          {t("addProduct")}
        </button>

        <button
          type="submit"
          className="btn bg-blue hover:bg-blue text-white mx-2"
        >
          {t("addRentals")}
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="btn btn-error text-white"
        >
          {t("clear")}
        </button>
      </form>
    </div>
  );
};

export default ApproveTask;
