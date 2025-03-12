import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import BackButton from "../../components/BackButton";

const ProductContent = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTypeName, setSelectedTypeName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10); // Set the rows per page
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;
  const user_id = decodedToken.id;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const translation = {
    en: {
      productList: "Product List",
      addProduct: "Add Product",
      searchPlaceholder: "Search by product name",
      allCategories: "All Categories",
      allBrands: "All Brands",
      id: "ID",
      name: "Name",
      description: "Description",
      price: "Price",
      stockQuantity: "Stock Quantity",
      brand: "Brand",
      category: "Category",
      warehouse: "Warehouse",
      productImage: "Product Image",
      actions: "Actions",
      noProducts: "No products available",
      productDeleted: "Product deleted successfully",
      confirmDelete: "Are you sure you want to delete this product?", // เพิ่มคำถามยืนยันลบ
      areYouSureYouWantToDelete: "Are you sure you want to delete", // คำถามยืนยันลบก่อนที่จะลบสินค้า
      yesDeleteIt: "Yes, delete it", // ปุ่มยืนยัน
      cancel: "Cancel", // ปุ่มยกเลิก
      error: "Error",
      errorText: "Failed to load products.",
      of: "of",
      page: "page",
      previous: "previous",
      next: "next",
      borrow: "borrow",
      edit: "edit",
      delete: "delete",
      noImage: "No image",
      borrowProduct: "Borrow Product",
      notForSale: "Not for sale",
      allTypeName: "Product Type",
      details: "Product details",
      noAttributes: "noAttributes",
    },
    th: {
      productList: "รายการสินค้า",
      addProduct: "เพิ่มสินค้า",
      searchPlaceholder: "ค้นหาชื่อสินค้า",
      allCategories: "ทุกหมวดหมู่",
      allBrands: "ทุกแบรนด์",
      id: "รหัส",
      name: "ชื่อ",
      description: "คำอธิบาย",
      price: "ราคา",
      stockQuantity: "จำนวนในสต็อก",
      brand: "แบรนด์",
      category: "หมวดหมู่",
      warehouse: "คลังสินค้า",
      productImage: "ภาพสินค้า",
      actions: "การกระทำ",
      noProducts: "ไม่มีสินค้าที่พร้อมใช้งาน",
      productDeleted: "ลบสินค้าสำเร็จ",
      confirmDelete: "คุณแน่ใจที่จะลบสินค้านี้?", // เพิ่มคำถามยืนยันลบ
      areYouSureYouWantToDelete: "คุณแน่ใจที่จะลบ", // คำถามยืนยันลบก่อนที่จะลบสินค้า
      yesDeleteIt: "ใช่, ลบเลย", // ปุ่มยืนยัน
      cancel: "ยกเลิก", // ปุ่มยกเลิก
      error: "ข้อผิดพลาด",
      errorText: "ไม่สามารถโหลดสินค้าได้",
      of: "จาก",
      page: "หน้า",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      borrow: "ยืมอุปกรณ์",
      edit: "แก้ไข",
      delete: "ลบสินค้า",
      noImage: "ไม่มีรูปภาพ",
      borrowProduct: "สร้างรายการยืม",
      notForSale: "ไม่จำหน่าย",
      allTypeName: "ชนิดสินค้า",
      details: "รายละเอียดสินค้า",
      noAttributes: "ไม่มีคุณสมบัติ",
    },
  };

  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("language") || "th"
  ); // default language

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchTypeName();
  }, [currentPage]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedTypeName]);

  const fetchTypeName = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product-types`
      );
      setProductTypes(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
        title: translation[currentLanguage].error,
        text: translation[currentLanguage].errorText,
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

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter((id) => id !== productId); // Deselect
      } else {
        return [...prevSelectedProducts, productId]; // Select
      }
    });
    console.log(selectedProducts);
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

    if (selectedTypeName) {
      filtered = filtered.filter(
        (product) => product.product_type_name === selectedTypeName
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId, productName) => {
    Swal.fire({
      title: translation[currentLanguage].confirmDelete, // แสดงคำถามยืนยันการลบ
      text: `${translation[currentLanguage].areYouSureYouWantToDelete} ${productName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: translation[currentLanguage].yesDeleteIt,
      cancelButtonText: translation[currentLanguage].cancel,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}/product/${productId}`,
            { withCredentials: true }
          );
          if (response.status === 200) {
            // ส่งข้อมูลไปยัง adminLog รวมถึงชื่อสินค้า
            axios.post(`${import.meta.env.VITE_SERVER_URL}/adminLog`, {
              admin_id: user_id,
              action: `ลบสินค้าไอดี ${productId} ชื่อสินค้า: ${productName}`, // เพิ่มชื่อสินค้าใน log
            });

            Swal.fire({
              title: translation[currentLanguage].productDeleted,
              text: `${productName}`,
              icon: "success",
            });

            setProducts(
              products.filter((product) => product.product_id !== productId)
            );
          }
        } catch (error) {
          Swal.fire({
            title: translation[currentLanguage].error,
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleNavigateToBorrowPage = () => {
    if (selectedProducts.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one product to borrow.",
        icon: "error",
      });
      return;
    }
    console.log(selectedProducts);
    navigate("/dashboard/borrows/new", {
      state: { selectedProducts }, // ส่ง selectedProducts ไปยังหน้า BorrowPage
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openImagePopup = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: translation[currentLanguage].productImage,
      showCloseButton: true,
      showConfirmButton: false,
      background: "#fff",
      width: "auto",
    });
  };

  const openProductDetailsPopup = async (productId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/v4/product/${productId}`
      );
      const productDetails = response.data;
      console.log(productDetails);

      if (productDetails) {
        const product = productDetails.product;
        const attributes = productDetails.product.attributes || [];

        Swal.fire({
          title: product.name,
          html: `
            <div class="container mx-auto">
              <div>
                <strong class="text-lg text-gray-700">${
                  translation[currentLanguage].productImage
                }:</strong>
                <div class="flex justify-center mt-2">
                  <img src="${product.image_url}" alt="${
                    product.name
                  }" class="w-48 h-48 object-cover rounded-lg shadow-md"/>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-left"><strong class="text-lg text-gray-700">${
                  translation[currentLanguage].description
                }:</strong> ${product.description}</p>
                <p class="text-left"><strong class="text-lg text-gray-700">${
                  translation[currentLanguage].stockQuantity
                }:</strong> ${product.stock_quantity}</p>
                <p class="text-left"><strong class="text-lg text-gray-700">${
                  translation[currentLanguage].brand
                }:</strong> ${product.brand_name}</p>
                <p class="text-left"><strong class="text-lg text-gray-700">${
                  translation[currentLanguage].category
                }:</strong> ${product.category_name}</p>
                <p class="text-left"><strong class="text-lg text-gray-700">${
                  translation[currentLanguage].warehouse
                }:</strong> ${product.location}</p>
              </div>
  
              <div class="mt-4">
                <ul class="list-disc pl-6">
                  <h3 class="text-xl font-semibold text-gray-800">${
                    translation[currentLanguage].details
                  }:</h3>
  
                  ${
                    Array.isArray(attributes) && attributes.length > 0
                      ? attributes
                          .map(
                            (attr) => `
                        <li class="text-gray-600 text-left"><strong>${attr.attribute_name}:</strong> ${attr.value}</li>
                      `
                          )
                          .join("")
                      : `<li class="text-gray-600">${translation[currentLanguage].noAttributes}</li>`
                  }
                </ul>
              </div>
            </div>
          `,
          showCloseButton: true,
          showConfirmButton: false,
          width: "30%",
          customClass: {
            popup: "bg-white p-8 rounded-lg shadow-lg",
            title: "text-2xl font-bold text-gray-800",
            htmlContainer: "text-base text-gray-700",
          },
          padding: "20px",
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      Swal.fire({
        title: translation[currentLanguage].error,
        text: "Failed to fetch product details.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt h-full">
        <div className="flex sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">
            {translation[currentLanguage].productList}
          </h2>

          <div className="flex">
            <button
              onClick={handleNavigateToBorrowPage}
              className="btn bg-success text-white hover:bg-success"
            >
              {translation[currentLanguage].borrowProduct}
            </button>
            {role === 3 && (
              <Link to="/dashboard/products/add">
                <button className="btn bg-blue text-white hover:bg-blue">
                  {translation[currentLanguage].addProduct}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder={translation[currentLanguage].searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full md:w-1/3"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-bordered w-full md:w-1/3"
          >
            <option value="">
              {translation[currentLanguage].allCategories}
            </option>
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
            <option value="">{translation[currentLanguage].allBrands}</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTypeName}
            onChange={(e) => setSelectedTypeName(e.target.value)}
            className="select select-bordered w-full md:w-1/3"
          >
            <option value="">{translation[currentLanguage].allTypeName}</option>
            {productTypes.map((type, index) => (
              <option key={index} value={type.product_type_name}>
                {type.product_type_name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300 font-prompt">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="border p-2 text-center"></th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].id}
                </th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].name}
                </th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].description}
                </th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].price}
                </th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].stockQuantity}
                </th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].productImage}
                </th>
                <th className="border p-2 text-center">
                  {translation[currentLanguage].details}
                </th>
                {role === 3 && (
                  <th className="border p-2 text-center">
                    {translation[currentLanguage].actions}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-center">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={index + 1}>
                    <td className="border p-2 text-center">
                      {product.product_type_id === 2 && (
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(
                            product.product_id
                          )}
                          onChange={() =>
                            handleCheckboxChange(product.product_id)
                          }
                        />
                      )}
                    </td>
                    <td className="border p-2 text-center">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="border p-2 text-center">{product.name}</td>
                    <td className="border p-2 text-center">
                      {product.description}
                    </td>
                    <td className="border p-2 text-center">
                      {product.price !== 0
                        ? product.price
                        : translation[currentLanguage].notForSale}
                    </td>
                    <td className="border p-2 text-center">
                      {product.stock_quantity}
                    </td>

                    <td>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover cursor-pointer mx-auto"
                          onClick={() => openImagePopup(product.image_url)}
                        />
                      ) : (
                        translation[currentLanguage].noImage
                      )}
                    </td>
                    {role === 3 && (
                      <td className="border p-2 text-center">
                        <div className="flex justify-center gap-2">
                          <>
                            <Link
                              to={`/dashboard/products/edit/${product.product_id}`}
                            >
                              <button className="btn btn-success text-white">
                                {translation[currentLanguage].edit}
                              </button>
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(product.product_id, product.name)
                              }
                              className="btn btn-error text-white"
                            >
                              {translation[currentLanguage].delete}
                            </button>
                          </>
                        </div>
                      </td>
                    )}
                    <td className="border p-2 text-center underline">
                      <p
                        onClick={() =>
                          openProductDetailsPopup(product.product_id)
                        }
                        className="text-center cursor-pointer"
                      >
                        {translation[currentLanguage].details}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="border border-gray-300 p-4">
                    {translation[currentLanguage].noProducts}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <p
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
          >
            {translation[currentLanguage].previous}
          </p>
          <span className="flex items-center justify-center">
            {translation[currentLanguage].page} {currentPage}{" "}
            {translation[currentLanguage].of} {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
          >
            {translation[currentLanguage].next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductContent;
