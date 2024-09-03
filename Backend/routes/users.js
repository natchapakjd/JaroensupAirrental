const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt =require('bcrypt')

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
  const query = "SELECT *FROM users WHERE  username = ?";

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
module.exports = router;