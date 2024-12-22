import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const ProductContent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10); // Set the rows per page

  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [currentPage]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/products-paging`,
        {
          params: { page: currentPage, pageSize: rowsPerPage },
        }
      );
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
      setTotalPages(response.data.totalPages); // Set total pages from response
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load products.",
        icon: "error",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/brands`
      );
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_name === selectedCategory
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brand_name === selectedBrand
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/product/${productId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Product deleted successfully",
          icon: "success",
        });
        setProducts(products.filter((product) => product.product_id !== productId));
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Product List</h2>
        {role === 3 && (
          <Link to="/dashboard/products/add">
            <button className="btn bg-blue text-white hover:bg-blue">
              Add Product
            </button>
          </Link>
        )}
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select select-bordered w-full md:w-1/3"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="select select-bordered w-full md:w-1/3"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.brand_id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <table className="table w-full border-collapse border border-gray-300 font-inter">
        <thead className="sticky top-0 bg-gray-200">
          <tr>
            <th className="border p-2 text-center">ID</th>
            <th className="border p-2 text-center">Name</th>
            <th className="border p-2 text-center">Description</th>
            <th className="border p-2 text-center">Price</th>
            <th className="border p-2 text-center">Stock Quantity</th>
            <th className="border p-2 text-center">Brand</th>
            <th className="border p-2 text-center">Category</th>
            <th className="border p-2 text-center">Warehouse</th>
            <th className="border p-2 text-center">Product Image</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.product_id}>
                <td className="border p-2 text-center">{product.product_id}</td>
                <td className="border p-2 text-center">{product.name}</td>
                <td className="border p-2 text-center">{product.description}</td>
                <td className="border p-2 text-center">{product.price}</td>
                <td className="border p-2 text-center">{product.stock_quantity}</td>
                <td className="border p-2 text-center">{product.brand_name}</td>
                <td className="border p-2 text-center">{product.category_name}</td>
                <td className="border p-2 text-center">{product.location}</td>
                <td className="border p-2 text-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover mx-auto" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {role === 3 ? (
                      <>
                        <Link to={`/dashboard/products/edit/${product.product_id}`}>
                          <button className="btn btn-success text-white">Edit</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="btn btn-error text-white"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <Link to={`/dashboard/borrows/${product.product_id}`}>
                        <button className="btn btn-success text-white">Borrow</button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="border border-gray-300 p-4">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
      <p
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
          >
          Previous
        </p>
        <span className="flex items-center justify-center">
          Page {currentPage} of {totalPages}
        </span>
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
          >
          Next
        </p>
      </div>
    </div>
  );
};

export default ProductContent;
