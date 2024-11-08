const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");

require("dotenv").config();
const LINE_BOT_API = "https://api.line.me/v2/bot";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
};
router.post("/send-message", async (req, res) => {
  const { userId, message,lineToken} = req.body;
  const body = {
    to: userId,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };
  try {
    const response = await axios.post(`${LINE_BOT_API}/message/push`, body, {
      headers,
    });
    res.json({ message: "Send message success", responseData: response.data });
  } catch (err) {
    console.log(err);
  }
});

router.put("/line-token/:id", async (req, res) => {
  const id = req.params.id;
  const { lineToken } = req.body;
  try {
    const query = `
      UPDATE users
      SET linetoken = ?
      WHERE user_id = ?
    `;

    db.query(query, [lineToken, id], (err, result) => {
      if (err) {
        console.error("Error updating user: " + err);
        return res.status(500).json({ error: "Failed to update user" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User's lineToken updated successfully" });
    });
  } catch (err) {
    console.error("Error processing user update:", err);
    res.status(500).json({ error: "Failed to process user update." });
  }
});

module.exports = router;
