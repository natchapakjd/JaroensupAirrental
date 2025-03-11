import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.name === product.name);
      console.log("existingItem", existingItem);
      if (existingItem) {
        // คำนวณจำนวนรวมใหม่
        const newQuantity = existingItem.quantity + quantity;
        console.log(newQuantity);
        // ตรวจสอบว่าจำนวนรวมใหม่เกิน stock_quantity หรือไม่
        if (newQuantity > product.stock_quantity) {
          console.log(`Cannot add more than available stock 1: ${product.stock_quantity}`);
          console.log(prevItems)
          return prevItems; // ไม่เพิ่ม ถ้าเกิน stock
        }
        return prevItems.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: newQuantity } 
            : item
        );
        console.log(prevItems); // <--- นี้จะไม่ทำงาน
      } else {
        // กรณีเพิ่มสินค้าใหม่ ตรวจสอบว่า quantity เกิน stock_quantity หรือไม่
        if (quantity > product.stock_quantity) {
          console.log(`Cannot add more than available stock 2: ${product.stock_quantity}`);
          return prevItems; // ไม่เพิ่ม ถ้าเกิน stock
        }
        return [...prevItems, { ...product, quantity }]; 
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: 0 } // ตั้งค่า quantity เป็น 0
            : item
        )
        .filter((item) => item.quantity > 0) // ลบไอเทมที่มี quantity เป็น 0
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};