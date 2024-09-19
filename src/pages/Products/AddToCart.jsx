import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2'; 

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const stockQuantity = product?.stock_quantity || 0; // Get available stock quantity

  const handleConfirm = () => {
    Swal.fire({
      title: 'ยืนยันการเพิ่มสินค้า',
      text: `คุณต้องการเพิ่ม ${product.name} จำนวน ${quantity } ชิ้น ลงในตะกร้าหรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, เพิ่ม!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        addToCart(product, quantity);
        navigate('/checkout', { state: { cartItems: [...cartItems, { ...product, quantity }] } });
      }
    });
  };

  if (!product) return <p>No product found.</p>;

  const totalPrice = (product.price * quantity).toFixed(2);


  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    // Ensure quantity does not exceed stock
    if (value <= stockQuantity && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt ">
        <main className="flex-grow">
          <section className="container mx-auto p-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">เพิ่มลงตะกร้า</h1>
            <p className="text-lg text-gray-600 mb-4">คุณต้องการเพิ่ม {product.name} ลงในตะกร้าหรือไม่?</p>
            <p className="text-lg font-bold text-gray-900 mt-2">Price: ${product.price.toFixed(2)}</p>
            <p className="text-lg font-bold text-gray-900 mt-2">Total: ${totalPrice}</p>
            <div className="mt-4">
              <label className="text-lg text-gray-600" htmlFor="quantity">จำนวน:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={stockQuantity} // Limit max input to stock quantity
                onChange={handleQuantityChange}
                className="border rounded p-2 w-20 text-center"
              />
              <p className="text-red-500 mt-2">{quantity > stockQuantity && `จำนวนที่เลือกเกินสต็อก (${stockQuantity})`}</p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleConfirm}
                className={`bg-blue text-white py-2 px-4 rounded hover:bg-blue transition duration-200 ${quantity > stockQuantity ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={quantity > stockQuantity} // Disable button if quantity exceeds stock
              >
                ยืนยันการเพิ่ม
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AddToCart;
