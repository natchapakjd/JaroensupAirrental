import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddOrder = () => {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState([{ productId: '', name: '', quantity: 0, price: 0, total_price: 0 }]);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  // Fetch users and products on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    fetchUsers();
  }, [apiUrl]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${productId}`);
      return response.data[0]; 
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Fetch product details when productId is changed
    if (field === 'productId') {
      const productDetails = await fetchProductDetails(value);
      if (productDetails) {
        newItems[index].name = productDetails.name;
        newItems[index].price = productDetails.price;
      } else {
        newItems[index].name = '';
        newItems[index].price = 0;
      }
    }

    // Calculate total price for the item
    newItems[index].total_price = newItems[index].quantity * newItems[index].price;

    setItems(newItems);
    // Recalculate total order price
    setTotalOrderPrice(newItems.reduce((total, item) => total + (item.total_price || 0), 0));
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', name: '', quantity: 0, price: 0, total_price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setTotalOrderPrice(newItems.reduce((total, item) => total + (item.total_price || 0), 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderItems = items.map(item => ({
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total_price: item.total_price,
    }));
    console.log()
    try {
      const response = await axios.post(`${apiUrl}/v2/orders`, {
        user_id: userId,
        items: orderItems,
        total_price: totalOrderPrice,
      });

      if (response.status === 201) {
        // Replace alert with SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: 'Order created successfully!',
          confirmButtonText: 'OK'
        });

        // Reset form state
        setUserId('');
        setItems([{ productId: '', name: '', quantity: 0, price: 0, total_price: 0 }]);
        setTotalOrderPrice(0);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Replace alert with SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Failed to create order',
        text: 'Please check the console for details.',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter bg-base-100 h-full">
      <h2 className="text-2xl mb-4 font-bold">Add Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <option value="" disabled>Select a user</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.firstname} {user.lastname}
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
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>Select a product</option>
                {products.map(product => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.product_id}. {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                value={item.name}
                readOnly
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                className="input input-bordered w-full"
                required
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
                required
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
            <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-error text-white mt-9">
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddItem} className="btn bg-blue hover:bg-blue text-white">
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
