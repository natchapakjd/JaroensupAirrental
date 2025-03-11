import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/BackButton";
import BackButtonEdit from "../../components/BackButtonEdit";
const AddProductAttribute = () => {
  const [attributeData, setAttributeData] = useState({
    product_id: "",
    attribute_id: "",
    value: "",
  });
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const navigate = useNavigate();

  // Fetch products and attributes on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        setProducts(response.data); // Assuming the response contains an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchAttributes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/attributes`
        );
        setAttributes(response.data); // Assuming the response contains an array of attributes
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    fetchProducts();
    fetchAttributes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttributeData({ ...attributeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/product-attributes`,
        attributeData
      );
      alert("Attribute added successfully");
      navigate("/dashboard/attributes/products");
    } catch (error) {
      console.error("Error adding product attribute:", error);
      alert("Error adding attribute");
    }
  };

  return (
    <div className="container mx-auto p-8 my-8 bg-white shadow-md rounded-md ">
      <div className="flex  w-full my-2">
        <BackButtonEdit />
        <h1 className="text-2xl font-semibold mx-2">Add Product Attribute </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="product_id" className="block text-md ">
            Product
          </label>
          <select
            id="product_id"
            name="product_id"
            value={attributeData.product_id}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          >
            <option value="">Select a product</option>
            {products.map((product, index) => (
              <option key={index} value={product.product_id}>
                {index + 1}. {product.name}{" "}
                {/* Replace 'name' with the appropriate field for product name */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="attribute_id" className="block text-md ">
            Attribute
          </label>
          <select
            id="attribute_id"
            name="attribute_id"
            value={attributeData.attribute_id}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          >
            <option value="">Select an attribute</option>
            {attributes.map((attribute, index) => (
              <option key={index} value={attribute.attribute_id}>
                {index + 1}. {attribute.name}{" "}
                {/* Replace 'name' with the appropriate field for attribute name */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="value" className="block text-md ">
            Value
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={attributeData.value}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn bg-blue text-white hover:bg-blue"
          >
            Add Attribute
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductAttribute;
