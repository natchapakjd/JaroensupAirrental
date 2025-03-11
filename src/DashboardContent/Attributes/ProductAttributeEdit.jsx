import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BackButtonEdit from '../../components/BackButtonEdit';
import Loading from '../../components/Loading';
const ProductAttributeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attributeData, setAttributeData] = useState({
    product_id: '',
    attribute_id: '',
    value: '',
  });
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading,setLoading] = useState(true);

  // Fetch product and attribute data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products`);
        setProducts(response.data); // Assuming the response contains an array of products
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchAttributes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/attributes`);
        setAttributes(response.data); // Assuming the response contains an array of attributes
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    const fetchAttribute = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product-attributes/${id}`);
        console.log(response)
        setAttributeData(response.data.product_attributes[0]); // Assuming the response contains the product attribute data

      } catch (error) {
        console.error("Error fetching attribute:", error);
      }
    };

    fetchProducts();
    fetchAttributes();
    fetchAttribute();
    setLoading(false)
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttributeData({ ...attributeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/product-attributes/${id}`, attributeData);
      alert('Attribute updated successfully');
      navigate('/dashboard/attributes');
    } catch (error) {
      console.error("Error updating product attribute:", error);
      alert('Error updating attribute');
    }
  };

  if(loading){
    <Loading/>
  }

  return (
    <div className="container mx-auto p-8 my-8 bg-white shadow-md rounded-md ">
      <div className="flex w-full my-2">
        <BackButtonEdit />
        <h1 className="text-2xl font-semibold mx-2">Edit Product Attribute</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="product_id" className="block text-md">
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
                {index + 1}. {product.name} {/* Replace 'name' with the appropriate field for product name */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="attribute_id" className="block text-md">
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
                {index + 1}. {attribute.name} {/* Replace 'name' with the appropriate field for attribute name */}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="value" className="block text-md">
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
          <button type="submit" className="btn bg-blue text-white hover:bg-blue">
            Update Attribute
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAttributeEdit;
