const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt =require('bcrypt')
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/users", (req, res) => {
  const query = "SELECT * FROM  users ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching users: " + err);
      res.status(500).json({ error: "Failed to fetch member" });
    } else {
      res.json(result);
    }
  });
});

router.get("/user/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM users WHERE  user_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching users: " + err);
      res.status(500).json({ error: "Failed to fetch member" });
    } else {
      res.json(result);
    }
  });
});


router.post("/change-password",(req,res)=>{
  const newPassword = req.body.newPassword
  const username = req.body.username

  changePasswordQuery= "SELECT * FROM users WHERE username = ?"

  db.query(changePasswordQuery,[username],async (err,changePassResult)=>{
    if(err){
      console.log(err)
    }else{
      const hashedPassword = await bcrypt.hash(newPassword,10)
      const updatedQuery = "UPDATE member SET password = ? WHERE username = ?"
      db.query(updatedQuery,[hashedPassword,username],(err,updatedResult)=>{
        if(err){
          console.log(err)
        }else{
          res.json(updatedResult)
        }
      })
    }
  })
})


router.put("/user/:id", upload.single('profile_image'), (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, email, phone, age, address, gender, date_of_birth } = req.body;
  const profile_image = req.file ? req.file.path : null;

  const query = `
    UPDATE users
    SET firstname = ?, lastname = ?, email = ?, phone = ?, age = ?, address = ?, gender = ?, profile_image = ?, date_of_birth = ?
    WHERE user_id = ?
  `;

  db.query(query, [firstname, lastname, email, phone, age, address, gender, profile_image, date_of_birth, id], (err, result) => {
    if (err) {
      console.error("Error updating user: " + err);
      return res.status(500).json({ error: "Failed to update user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  });
});

router.delete("/user/:id", (req, res) => {
  const id= req.params.id;
  const query = "DELETE FROM users WHERE user_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user: " + err);
      res.status(500).json({ error: "Failed to delete user" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  });
});


router.post("/user", upload.single('profile_image'), async (req, res) => {
  const { 
    username, 
    firstname, 
    lastname, 
    email, 
    phone, 
    age, 
    address, 
    gender, 
    password, 
    date_of_birth 
  } = req.body;

  const profile_image = req.file ? req.file.path : null; 

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const role = 'client';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = `
    INSERT INTO users (username, firstname, lastname, email, phone, age, address, gender, password, role, date_of_birth, profile_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [username, firstname, lastname, email, phone, age, address, gender, hashedPassword, role, date_of_birth, profile_image], (err, result) => {
    if (err) {
      console.error("Error adding user: " + err);
      res.status(500).json({ error: "Failed to add user" });
    } else {
      res.status(201).json({ message: "User added successfully", userId: result.insertId });
    }
  });
});

router.get("/user-image/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT profile_image FROM users WHERE user_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching image: " + err);
      res.status(500).send("Failed to fetch image");
      return;
    }

    if (result.length > 0) {
      const imagePathBuffer = result[0].profile_image;
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