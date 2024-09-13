const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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

  const query = "SELECT * FROM products LIMIT ? OFFSET ?";

  db.query(query, [pageSize, offset], (err, result) => {
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

router.post("/products", upload.single("product_image"), (req, res) => {
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


router.put("/product/:id", upload.single('product_image'), (req, res) => {
  const id = req.params.id;
  console.log("Request body:", req.body); // Debug statement
  console.log("Request file:", req.file); // Debug statement

  const {
    name,
    description,
    price,
    stock_quantity,
    brand_id,
    category_id,
    warehouse_id,
  } = req.body;

  const product_image = req.file ? req.file.path: null;

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
        res.sendFile(path.resolve(imagePath));
      } else {
        res.status(404).send("Image not found");
      }
    } else {
      res.status(404).send("Product not found");
    }
  });
});

module.exports = router;
