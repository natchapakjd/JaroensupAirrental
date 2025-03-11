import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import BackButtonEdit from "../../components/BackButtonEdit";
const ProductAttributeContent = () => {
  const [attributes, setAttributes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(true);

  // Fetch attributes with pagination
  const fetchAttributes = async (page = 1) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/product-attributes?page=${page}&limit=${pagination.itemsPerPage}`
      );
      setAttributes(response.data.product_attributes);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.totalItems,
        itemsPerPage: response.data.pagination.itemsPerPage,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchAttributes(page);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/product-attributes/${id}`
      );
      setAttributes(
        attributes.filter((attr) => attr.product_attribute_id !== id)
      );
      alert("Attribute deleted successfully");
    } catch (error) {
      console.error("Error deleting attribute:", error);
      alert("Error deleting attribute");
    }
  };

  // Fetch attributes on component mount or when pagination changes
  useEffect(() => {
    fetchAttributes(pagination.currentPage);
  }, [pagination.currentPage]);

  if (loading) {
    <Loading />;
  }
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md my-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex  w-full my-2">
        <BackButtonEdit />
        <h1 className="text-2xl font-semibold mx-2">Product Attributes </h1>
      </div>
        <Link
          to="/dashboard/attributes/products/add"
          className="flex justify-end"
        >
          <button className="btn btn-primary text-white ">
            Add Product Attribute
          </button>
        </Link>
      </div>
      <table className="table w-full border-collapse border border-gray-300 text-center">
        <thead className="sticky-top bg-gray-200">
          <tr>
            <th className="border p-2 text-center">ID</th>
            <th className="border p-2 text-center">Product Name</th>
            <th className="border p-2 text-center">Attribute Name</th>
            <th className="border p-2 text-center">Value</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attr, index) => (
            <tr key={attr.product_attribute_id}>
              <td>{index + 1}</td>
              <td className="border p-2 text-center">{attr.name}</td>
              <td className="border p-2 text-center">{attr.attribute_name}</td>
              <td className="border p-2 text-center">{attr.value}</td>
              <td>
                <Link
                  to={`/dashboard/attributes/products/edit/${attr.product_attribute_id}`}
                  className="btn bg-blue text-white hover:bg-blue mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(attr.product_attribute_id)}
                  className="btn btn-error text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <p
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="cursor-pointer"
        >
          Previous
        </p>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <p
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="cursor-pointer"
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default ProductAttributeContent;
