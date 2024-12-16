const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("../cloundinary-config");
const fs = require("fs");
const isAdmin = require("../middlewares/isAdmin");

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

  const query =
    "SELECT pd.*,ct.name as category_name,wh.location,b.name as brand_name FROM products pd  JOIN brands b ON pd.brand_id = b.brand_id JOIN categories ct ON pd.category_id = ct.category_id JOIN warehouses wh ON pd.warehouse_id = wh.warehouse_id  LIMIT ? OFFSET ?";

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
  const query = `
  SELECT 
    pd.*, 
    ct.name AS category_name,
    wh.location,
    b.name AS brand_name 
  FROM 
    products pd  
  JOIN 
    brands b ON pd.brand_id = b.brand_id 
  JOIN 
    categories ct ON pd.category_id = ct.category_id 
  JOIN 
    warehouses wh ON pd.warehouse_id = wh.warehouse_id  
  WHERE 
    pd.product_id = ?`;

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
router.post("/products", upload.fields([
  { name: 'product_image', maxCount: 1 },
  { name: 'model_file', maxCount: 1 }
]), async (req, res) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    brand_id,
    category_id,
    warehouse_id,
    product_type_id,
  } = req.body;

  const productImage = req.files['product_image'] ? req.files['product_image'][0].path : null;
  const modelFile = req.files['model_file'] ? req.files['model_file'][0].path : null;

  if (!productImage) {
    return res.status(400).json({ error: "No product image uploaded." });
  }

  try {
    // Compress product image
    const compressedImagePath = path.join(
      __dirname,
      `compressed-${req.files['product_image'][0].filename}`
    );
    await sharp(productImage).resize(800).toFile(compressedImagePath);

    const result = await cloudinary.uploader.upload(compressedImagePath, {
      folder: "image/product-image",
    });

    const cloudinaryImageUrl = result.secure_url;
    fs.unlinkSync(compressedImagePath);  // Delete the compressed image

    let modelUrl = null;
    if (modelFile) {
      const modelResult = await cloudinary.uploader.upload(modelFile, {
        resource_type: 'auto', // Use 'auto' for automatic type detection
        folder: "models/product-models",
      });
      modelUrl = modelResult.secure_url;  
    }

    // Insert product data into database
    db.query(
      "INSERT INTO products (name, description, price, stock_quantity, brand_id, category_id, warehouse_id, product_type_id, image_url, model_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [
        name,
        description,
        price,
        stock_quantity,
        brand_id,
        category_id,
        warehouse_id,
        product_type_id,
        cloudinaryImageUrl,
        modelUrl, // Save the model URL if present
      ],
      (err, results) => {
        if (err) {
          console.error("Error inserting product:", err);
          return res.status(500).json({ error: "Failed to add product." });
        }
        res.status(200).json({ message: "Product added successfully!" });
      }
    );
  } catch (err) {
    console.error("Error uploading files:", err);
    res.status(500).json({ error: "Failed to upload files." });
  }
});




router.put("/product/:id", upload.single("product_image"), async (req, res) => {
  const id = req.params.id;

  const {
    name,
    description,
    price,
    stock_quantity,
    brand_id,
    category_id,
    warehouse_id,
    product_type_id, // Add this line
  } = req.body;

  let productImageUrl = null;

  try {
    if (req.file) {
      const productImage = req.file.path;

      const compressedImagePath = path.join(
        __dirname,
        `compressed-${req.file.filename}`
      );
      await sharp(productImage).resize(800).toFile(compressedImagePath);

      const result = await cloudinary.uploader.upload(compressedImagePath, {
        folder: "image/product-image",
      });

      productImageUrl = result.secure_url;

      fs.unlinkSync(compressedImagePath);
    }

    const query = `
      UPDATE products
      SET name = ?, description = ?, price = ?, stock_quantity = ?, brand_id = ?, category_id = ?, warehouse_id = ?, product_type_id = ?, image_url = ? WHERE product_id = ?
    `;

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
        product_type_id || null, // Include product_type_id here, set to null if not provided
        productImageUrl || null,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating product: " + err);
          return res.status(500).json({ error: "Failed to update product" });
        } else if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Product not found" });
        } else {
          return res
            .status(200)
            .json({ message: "Product updated successfully" });
        }
      }
    );
  } catch (err) {
    console.error("Error processing the product image:", err);
    res.status(500).json({ error: "Failed to process product image." });
  }
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

router.get("/product-type", (req, res) => {
  const query = "SELECT * FROM product_type";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching product_types: " + err);
      return res.status(500).send("Failed to fetch product_types");
    }

    const product_type = result.map((row) => {
      return {
        product_type_id: row.product_type_id,
        product_type_name: row.product_type_name,
      };
    });

    res.json(product_type);
  });
});

module.exports = router;
