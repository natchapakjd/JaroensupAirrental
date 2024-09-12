import React, { useEffect, useState } from "react";

const ProductImage = ({ productId}) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/product-image/${productId}`
        );
        if (response.ok) {
          setImageUrl(response.url);
        } else {
          console.error("Failed to fetch image");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [productId]);

  return (
    <img
      src={imageUrl}
      alt="Product"
      className="w-full h-48 object-cover"
      />
  );
};

export default ProductImage;
