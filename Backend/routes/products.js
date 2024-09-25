const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/product-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/products", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const query = "SELECT * FROM products WHERE product_type_id = ? LIMIT ? OFFSET ?";
  
  db.query(query, [1, pageSize, offset], (err, result) => {
    if (err) {
      console.error("Error fetching products: " + err);
      res.status(500).json({ error: "Failed to fetch products" });
    } else {
      res.json(result);
    }
  });
});

router.get("/products/count", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM products";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error counting products: " + err);
      res.status(500).json({ error: "Failed to count products" });
    } else {
      res.json({ count: result[0].count });
    }
  });
});

router.get("/product/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM products WHERE product_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching product: " + err);
      res.status(500).json({ error: "Failed to fetch product" });
    } else {
      res.json(result);
    }
  });
});

router.delete("/product/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM products WHERE product_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product: " + err);
      res.status(500).json({ error: "Failed to delete product" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  });
});

router.post("/products", upload.single("product_image"), async (req, res) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    brand_id,
    category_id,
    warehouse_id,
  } = req.body;
  const productImage = req.file ? req.file.path : null;

  if (productImage) {
    const compressedImagePath = `compressed-${req.file.filename}`;
    await sharp(productImage)
      .resize(800) 
      .toFile(compressedImagePath);
  }

  db.query(
    "INSERT INTO products (name, description, price, stock_quantity, brand_id, category_id, warehouse_id, product_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      description,
      price,
      stock_quantity,
      brand_id,
      category_id,
      warehouse_id,
      productImage,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).json({ error: "Failed to add product." });
      }
      res.status(200).json({ message: "Product added successfully!" });
    }
  );
});

router.put("/product/:id", upload.single("product_image"), (req, res) => {
  const id = req.params.id;

  const {
    name,
    description,
    price,
    stock_quantity,
    brand_id,
    category_id,
    warehouse_id,
  } = req.body;

  const product_image = req.file ? req.file.path : null;

  const query = `UPDATE products
                 SET name = ?, description = ?, price = ?, stock_quantity = ?, brand_id = ?, category_id = ?, warehouse_id = ?, product_image = ?
                 WHERE product_id = ?`;
  db.query(
    query,
    [
      name,
      description,
      price,
      stock_quantity,
      brand_id,
      category_id,
      warehouse_id,
      product_image,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating product: " + err);
        res.status(500).json({ error: "Failed to update product" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(200).json({ message: "Product updated successfully" });
      }
    }
  );
});

router.get("/product-image/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT product_image FROM products WHERE product_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching image: " + err);
      res.status(500).send("Failed to fetch image");
      return;
    }

    if (result.length > 0) {
      const imagePathBuffer = result[0].product_image;
      if (Buffer.isBuffer(imagePathBuffer)) {
        const imagePath = imagePathBuffer.toString();
        const filename = imagePath.split("\\").pop(); 
        const imageUrl = imagePath
          ? `/uploads/product-image/${filename}`.replace(/\\/g, "/")
          : null;

        res.json({ product_image: imageUrl });
      } else {
        res.status(404).send("Image not found");
      }
    } else {
      res.status(404).send("Product not found");
    }
  });
});

router.get("/product-image/", (req, res) => {
  const query = "SELECT product_image, product_id FROM products";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching images: " + err);
      res.status(500).send("Failed to fetch images");
      return;
    }

    if (result.length > 0) {
      const images = result.map((row) => {
        const imagePathBuffer = row.product_image;
        if (Buffer.isBuffer(imagePathBuffer)) {
          const imagePath = imagePathBuffer.toString();
          const filename = imagePath.split("\\").pop();
          const imageUrl = imagePath
            ? `/uploads/product-image/${filename}`.replace(/\\/g, "/")
            : null;

          return { product_id: row.product_id, product_image: imageUrl };
        } else {
          return { product_id: row.product_id, product_image: null };
        }
      });

      res.json(images);
    } else {
      res.status(404).send("No products found");
    }
  });
});

router.get("/products/count", (req, res) => {
  const query = "SELECT COUNT(*) AS total_products FROM products";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching total products: " + err);
      return res.status(500).json({ error: "Failed to fetch total products " });
    }

    const totalProduct = result[0].total_products || 0; // Default to 0 if no payments
    res.status(200).json({ totalProduct });
  });
});

module.exports = router;
