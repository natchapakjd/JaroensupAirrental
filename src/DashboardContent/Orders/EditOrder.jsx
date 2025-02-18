import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
const EditOrder = () => {
  const { orderId } = useParams();
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState([]);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  const translations = {
    th: {
      editOrderTitle: "แก้ไขคำสั่งซื้อ",
      productLabel: "สินค้า",
      quantityLabel: "จำนวน",
      priceLabel: "ราคา",
      totalPriceLabel: "ราคาทั้งหมด",
      selectProduct: "เลือกสินค้าที่ต้องการ",
      addItemButton: "เพิ่มสินค้า",
      removeItemButton: "ลบสินค้า",
      totalOrderPrice: "ราคาสั่งซื้อรวม",
      updateOrderButton: "อัปเดตคำสั่งซื้อ",
      errorFetchingData: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      errorUpdatingOrder: "ไม่สามารถอัปเดตคำสั่งซื้อได้",
      successUpdatingOrder: "อัปเดตคำสั่งซื้อสำเร็จ",
      selectProductOption: (name, stock_quantity) =>
        `${name} (คงเหลือ: ${stock_quantity})`,
    },
    en: {
      editOrderTitle: "Edit Order",
      productLabel: "Product",
      quantityLabel: "Quantity",
      priceLabel: "Price",
      totalPriceLabel: "Total Price",
      selectProduct: "Select a product",
      addItemButton: "Add Product",
      removeItemButton: "Remove Product",
      totalOrderPrice: "Total Order Price",
      updateOrderButton: "Update Order",
      errorFetchingData: "Error fetching data",
      errorUpdatingOrder: "Failed to update order",
      successUpdatingOrder: "Order updated successfully",
      selectProductOption: (name, stock_quantity) =>
        `${name} (remain: ${stock_quantity})`,
    },
  };
  

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [usersResponse, productsResponse, orderResponse] = await Promise.all([
          axios.get(`${apiUrl}/users`),
          axios.get(`${apiUrl}/products`),
          axios.get(`${apiUrl}/v3/orders/${orderId}`),
        ]);

        setUsers(usersResponse.data);
        setProducts(productsResponse.data);

        const order = orderResponse.data.orders[0];
        setUserId(order.user_id);
        console.log(order)
        setItems(
          order.items.map((item) => ({
            productId: item.product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            total_price: item.total_price,
            maxQuantity: item.stock_quantity
          }))
        );
        setTotalOrderPrice(
          order.items.reduce((total, item) => total + item.total_price, 0)
        );
      } catch (error) {
        console.error(translations.errorFetchingData, error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [apiUrl, orderId]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${apiUrl}/product/${productId}`);
      return response.data[0];
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  const getFilteredProducts = (currentIndex) => {
    const selectedProductIds = items.map((item) => item.productId);
    return products.filter(
      (product) =>
        !selectedProductIds.includes(product.product_id) ||
        product.product_id === items[currentIndex]?.productId
    );
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    console.log(items)

    if (field === "productId") {
      const productDetails = await fetchProductDetails(value);
      if (productDetails) {
        newItems[index].name = productDetails.name;
        newItems[index].price = productDetails.price;
        newItems[index].maxQuantity = productDetails.stock_quantity;
        newItems[index].quantity = 0;
        newItems[index].total_price = 0;
      } else {
        newItems[index].name = "";
        newItems[index].price = 0;
        newItems[index].maxQuantity = 0;
        newItems[index].quantity = 0;
        newItems[index].total_price = 0;
      }
    }

    if (field === "quantity") {
      const maxQuantity = newItems[index].maxQuantity || 0;
      newItems[index].quantity = Math.min(value, maxQuantity);
      newItems[index].total_price = newItems[index].quantity * newItems[index].price;
    }

    setItems(newItems);
    setTotalOrderPrice(
      newItems.reduce((total, item) => total + (item.total_price || 0), 0)
    );
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", name: "", quantity: 0, price: 0, total_price: 0, maxQuantity: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setTotalOrderPrice(
      newItems.reduce((total, item) => total + (item.total_price || 0), 0)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderItems = items.map((item) => ({
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total_price: item.total_price,
    }));

    try {
      const response = await axios.put(`${apiUrl}/v2/orders/${orderId}`, {
        user_id: userId,
        items: orderItems,
        total_price: totalOrderPrice,
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: translations[language].successUpdatingOrder,
          confirmButtonText: "OK",
        });
      }
      navigate('/dashboard/orders')
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: translations[language].errorUpdatingOrder,
        text: "Please check the console for details.",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-prompt bg-base-100 h-full">
      <h2 className="text-2xl mb-4 font-bold">{translations[language].editOrderTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translations[language].productLabel}</span>
              </label>
              <select
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", e.target.value)
                }
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  {translations.selectProduct}
                </option>
                {getFilteredProducts(index).map((product,index) => (
                  <option key={index+1} value={product.product_id}>
                    {product.product_id}. {translations[language].selectProductOption(product.name, product.stock_quantity)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translations[language].quantityLabel}</span>
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
                className="input input-bordered w-full"
                max={item.maxQuantity || 0}
                min="0" 
                required
              />
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">{translations[language].priceLabel}</span>
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
                <span className="label-text">{translations[language].totalPriceLabel}</span>
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
              className="btn btn-error text-white mt-9"
            >
              {translations[language].removeItemButton}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="btn bg-blue hover:bg-blue text-white"
        >
          {translations[language].addItemButton}
        </button>

        <div className="mt-4">
          <strong>{translations[language].totalOrderPrice}: </strong> {totalOrderPrice}
        </div>

        <button type="submit" className="btn btn-success text-white">
          {translations[language].updateOrderButton}
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
