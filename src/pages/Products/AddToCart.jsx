import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AddToCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    addToCart(product, quantity); 
    navigate('/checkout', { state: { cartItems: [...cartItems, { ...product, quantity }] } });
  };

  if (!product) return <p>No product found.</p>;

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex flex-col font-prompt">
        <main className="flex-grow">
          <section className="container mx-auto p-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">เพิ่มลงตะกร้า</h1>
            <p className="text-lg text-gray-600 mb-4">คุณต้องการเพิ่ม {product.name} ลงในตะกร้าหรือไม่?</p>
            <p className="text-lg font-bold text-gray-900 mt-2">Price: ${product.price.toFixed(2)}</p>
            <div className="mt-4">
              <label className="text-lg text-gray-600" htmlFor="quantity">จำนวน:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded p-2 w-20 text-center"
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleConfirm}
                className="bg-blue text-white py-2 px-4 rounded hover:bg-blue transition duration-200"
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
