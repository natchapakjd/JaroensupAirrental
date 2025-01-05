import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddOrder = () => {
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState([
    { productId: "", name: "", quantity: 0, price: 0, total_price: 0, stock_quantity: 0 },
  ]);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

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
        title: "Quantity exceeds stock",
        text: `Available stock: ${newItems[index].stock_quantity}`,
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
        items: items.map(({ productId, quantity, price, total_price,name}) => ({
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
          title: "Order created successfully!",
        });
        setUserId("");
        setItems([{ productId: "", name: "", quantity: 0, price: 0, total_price: 0 }]);
        setTotalOrderPrice(0);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to create order",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter bg-base-100 h-full">
      <h2 className="text-2xl mb-4 font-bold">Add Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
        <div>
          <label className="label">
            <span className="label-text">User</span>
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.firstname} - {user.lastname}
              </option>
            ))}
          </select>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Product</span>
              </label>
              <select
                value={item.productId}
                onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select a product
                </option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name} - Stock: {product.stock_quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">Quantity</span>
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
                <span className="label-text">Price</span>
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
                <span className="label-text">Total Price</span>
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
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="btn bg-blue hover:bg-blue text-white"
        >
          Add Item
        </button>

        <div className="mt-4">
          <strong>Total Order Price: </strong> {totalOrderPrice}
        </div>

        <button type="submit" className="btn btn-success text-white">
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
