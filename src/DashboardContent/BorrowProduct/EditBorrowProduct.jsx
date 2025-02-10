import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

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

  useEffect(() => {
    fetchBorrowingDetails();
    fetchProducts();
  }, []);

  const fetchBorrowingDetails = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/equipment-borrowing/id/${borrowingId}`
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
          title: "Invalid Date",
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
          title: "Invalid Date",
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
      Swal.fire("Error!", "Borrow date cannot be in the past.", "error");
      return;
    }

    // Prevent submitting return date before borrow date
    if (formData.return_date < formData.borrow_date) {
      Swal.fire("Error!", "Return date cannot be before borrow date.", "error");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/equipment-borrowing/${borrowingId}`,
        formData
      );

      Swal.fire("Success!", "Borrowing record updated successfully", "success");
      navigate("/dashboard/borrows");
    } catch (error) {
      console.error("Error updating borrowing record:", error);
      Swal.fire("Error!", "Failed to update borrowing record", "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg font-inter my-5">
      <h2 className="text-2xl font-bold mb-4">Edit Borrowed Equipment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Technician ID
          <input
            type="text"
            name="tech_id"
            value={formData.tech_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled
          />
        </label>

        <label className="block">
          Select Product
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
          Borrow Date
          <input
            type="date"
            name="borrow_date"
            value={formData.borrow_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
          />
        </label>

        <label className="block">
          Return Date
          <input
            type="date"
            name="return_date"
            value={formData.return_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min={formData.borrow_date || new Date().toISOString().split("T")[0]} // Ensure return date is not before borrow date
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue text-white py-2 rounded hover:bg-blue"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditBorrowProduct;
