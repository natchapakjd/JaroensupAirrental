import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
const AddOrder = () => {
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState([
    { productId: "", name: "", quantity: 0, price: 0, total_price: 0, stock_quantity: 0 },
  ]);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  // Add translation object for localization
  const translation = {
    en: {
      title: "Add Order",
      selectUser: "Select a user",
      selectProduct: "Select a product",
      quantity: "Quantity",
      price: "Price",
      totalPrice: "Total Price",
      addItem: "Add Item",
      submitOrder: "Submit Order",
      orderCreated: "Order created successfully!",
      orderFailed: "Failed to create order",
      quantityExceedsStock: "Quantity exceeds stock",
      availableStock: "Available stock: ",
      remove: "Remove",
    },
    th: {
      title: "เพิ่มคำสั่งซื้อ",
      selectUser: "เลือกผู้ใช้",
      selectProduct: "เลือกสินค้า",
      quantity: "จำนวน",
      price: "ราคา",
      totalPrice: "ราคารวม",
      addItem: "เพิ่มสินค้า",
      submitOrder: "ส่งคำสั่งซื้อ",
      orderCreated: "คำสั่งซื้อถูกสร้างสำเร็จ!",
      orderFailed: "ไม่สามารถสร้างคำสั่งซื้อได้",
      quantityExceedsStock: "จำนวนมากกว่าคลังสินค้า",
      availableStock: "สินค้ามีในสต็อก: ",
      remove: "ลบ",
    },
  };

  const [language, setLanguage] = useState(localStorage.getItem('language'||'th')); // Set default language to English

  // Fetch users and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(`${apiUrl}/users`),
          axios.get(`${apiUrl}/products`),
        ]);
        setUsers(usersResponse.data);
        setProducts(productsResponse.data.filter((p) => p.product_type_id === 1)); // Filter products
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${productId}`);
      return response.data[0];
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "productId") {
      if (value === "") {
        newItems[index] = {
          productId: "",
          name: "",
          price: 0,
          quantity: 0,
          total_price: 0,
          stock_quantity: 0,
        };
      } else {
        const productDetails = await fetchProductDetails(value);
        if (productDetails) {
          newItems[index] = {
            ...newItems[index],
            name: productDetails.name,
            price: productDetails.price,
            stock_quantity: productDetails.stock_quantity,
            quantity: 0, // Reset quantity on product change
            total_price: 0, // Reset total price
          };
        }
      }
    }

    if (field === "quantity" && value > newItems[index].stock_quantity) {
      Swal.fire({
        icon: "error",
        title: translation[language].quantityExceedsStock,
        text: `${translation[language].availableStock}${newItems[index].stock_quantity}`,
      });
      newItems[index].quantity = newItems[index].stock_quantity;
    } else if (field === "quantity") {
      newItems[index].quantity = value;
      newItems[index].total_price = value * newItems[index].price;
    }

    setItems(newItems);
    setTotalOrderPrice(newItems.reduce((total, item) => total + item.total_price, 0));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", name: "", quantity: 0, price: 0, total_price: 0, stock_quantity: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setTotalOrderPrice(newItems.reduce((total, item) => total + item.total_price, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/v2/orders`, {
        user_id: userId,
        items: items.map(({ productId, quantity, price, total_price, name }) => ({
          product_id: productId,
          name,
          quantity,
          price,
          total_price,
        })),
        total_price: totalOrderPrice,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: translation[language].orderCreated,
        });
        setUserId("");
        setItems([{ productId: "", name: "", quantity: 0, price: 0, total_price: 0 }]);
        setTotalOrderPrice(0);
        navigate('/dashboard/orders')
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      Swal.fire({
        icon: "error",
        title: translation[language].orderFailed,
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt bg-base-100 h-full">
      <h2 className="text-2xl mb-4 font-bold">{translation[language].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
        <div>
          <label className="label">
            <span className="label-text">{translation[language].selectUser}</span>
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>
              {translation[language].selectUser}
            </option>
            {users.map((user,index) => (
              <option key={index+1} value={user.user_id}>
                {index+1}. {user.firstname} - {user.lastname}
              </option>
            ))}
          </select>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translation[language].selectProduct}</span>
              </label>
              <select
                value={item.productId}
                onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  {translation[language].selectProduct}
                </option>
                {products.map((product,index) => (
                  <option key={index+1} value={product.product_id}>
                    {index+1}. {product.name} - Stock: {product.stock_quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translation[language].quantity}</span>
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                className="input input-bordered w-full"
                required
                min="0"
              />
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translation[language].price}</span>
              </label>
              <input
                type="number"
                value={item.price}
                readOnly
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translation[language].totalPrice}</span>
              </label>
              <input
                type="number"
                value={item.total_price}
                readOnly
                className="input input-bordered w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="btn btn-error text-white mt-8"
            >
              {translation[language].remove}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="btn bg-blue hover:bg-blue text-white"
        >
          {translation[language].addItem}
        </button>

        <div className="mt-4">
          <strong>{translation[language].totalPrice}: </strong> {totalOrderPrice}
        </div>

        <button type="submit" className="btn btn-success text-white">
          {translation[language].submitOrder}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
