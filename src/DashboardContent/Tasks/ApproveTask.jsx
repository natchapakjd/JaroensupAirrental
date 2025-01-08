import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ApproveTask = () => {
  const { taskId } = useParams(); // ดึง taskId จาก params
  const [products, setProducts] = useState([]); // เก็บข้อมูลสินค้า
  const [productSelections, setProductSelections] = useState([]); // เก็บข้อมูลสินค้าที่เลือกและจำนวน
  const navigate = useNavigate();
  
  useEffect(() => {
    // ดึงข้อมูลสินค้า (product_id) จาก API
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
        console.error("Error fetching products:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load products.",
          icon: "error",
        });
      }
    };

    fetchProducts();
  }, []);

  // ฟังก์ชันเพื่อจัดการการเพิ่มสินค้าใน productSelections
  // ฟังก์ชันเพื่อจัดการการเพิ่มสินค้าใน productSelections
const handleAddProduct = () => {
    // ตรวจสอบก่อนว่า product_id ที่เลือกมีอยู่ใน productSelections แล้วหรือไม่
    const newSelections = [...productSelections];
    if (newSelections.some(selection => selection.product_id === "")) {
      Swal.fire({
        title: "Invalid Selection",
        text: "You cannot add the same product more than once.",
        icon: "warning",
      });
      return;
    }
    setProductSelections([
      ...productSelections,
      { product_id: "", quantity: 1, stock_quantity: 0 }, // เพิ่ม stock_quantity
    ]);
  };
  
  // ฟังก์ชันเพื่อจัดการการแก้ไขข้อมูลสินค้าใน productSelections
  const handleProductChange = (index, field, value) => {
    const newSelections = [...productSelections];
    newSelections[index][field] = value;
  
    // If the product is changed, update stock_quantity
    if (field === "product_id") {
      // ตรวจสอบว่าเลือกสินค้าที่ซ้ำไหม
      if (newSelections.some((selection, i) => selection.product_id === value && i !== index)) {
        Swal.fire({
          title: "Duplicate Product",
          text: "You cannot select the same product more than once.",
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
  
    // ตรวจสอบจำนวนสินค้า
    if (field === "quantity") {
      const quantity = parseInt(value, 10);
  
      const product = products.find(
        (product) => product.product_id == newSelections[index].product_id
      );
      if (quantity > product?.stock_quantity) {
        Swal.fire({
          title: "Invalid Quantity",
          text: `The quantity cannot exceed the available stock of ${product?.stock_quantity}`,
          icon: "warning",
        });
        return; // ไม่ให้เปลี่ยนจำนวนสินค้าเมื่อเกิน stock_quantity
      }
    }
  
    setProductSelections(newSelections);
  };
  
  

  // ฟังก์ชันในการเคลียร์ข้อมูล
  const handleClear = () => {
    setProductSelections([]); // รีเซ็ตค่า productSelections
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบให้แน่ใจว่าผู้ใช้เลือกสินค้าทุกตัวและจำนวนที่ถูกต้อง
    if (
      productSelections.some(
        (selection) => !selection.product_id || selection.quantity <= 0
      )
    ) {
      Swal.fire({
        title: "Invalid input",
        text: "Please select a product and specify a valid quantity for all products.",
        icon: "warning",
      });
      
      return;
    }

    try {
      // ส่งข้อมูลทั้งหมดไปที่ API เพื่อเพิ่มข้อมูลในตาราง rental
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
          text: "Rental data added successfully.",
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
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h2 className="text-xl font-semibold mb-6">Approve Task {taskId}</h2>

      <form onSubmit={handleSubmit}>
        {productSelections.map((selection, index) => (
          <div key={index} className="mb-4 flex items-center space-x-4">
            <div className="w-1/2">
              <label
                htmlFor={`product-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Select Product {index + 1}
              </label>
              <select
                id={`product-${index}`}
                value={selection.product_id}
                onChange={(e) =>
                  handleProductChange(index, "product_id", e.target.value)
                }
                className="select select-bordered w-full"
              >
                <option value="">-- Select a product --</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/4">
              <label
                htmlFor={`quantity-${index}`}
                className="block text-sm font-medium text-gray-700 mt-2"
              >
                Quantity
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
          Add Another Product
        </button>

        <button
          type="submit"
          className="btn bg-blue hover:bg-blue text-white mx-2"
        >
          Add Rentals
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="btn btn-error text-white"
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default ApproveTask;
