const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();
const LINE_BOT_API = "https://api.line.me/v2/bot";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_TOKEN;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
};
router.post("/send-message", async (req, res) => {
  const { userId, message } = req.body;
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
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
