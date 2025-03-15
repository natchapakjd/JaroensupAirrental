import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.product_id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock_quantity) {
          console.log(`Cannot add more than available stock: ${product.stock_quantity}`);
          return prevItems; // No change if exceeding stock
        }
        const updatedItems = prevItems.map((item) =>
          item.product_id === product.product_id ? { ...item, quantity: newQuantity } : item
        );
        console.log("Updated cart:", updatedItems); // Moved console.log here
        return updatedItems;
      } else {
        if (quantity > product.stock_quantity) {
          console.log(`Cannot add more than available stock: ${product.stock_quantity}`);
          return prevItems; // No change if exceeding stock
        }
        const newItems = [...prevItems, { ...product, quantity }];
        console.log("New cart:", newItems); // Moved console.log here
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product_id === productId ? { ...item, quantity: 0 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};