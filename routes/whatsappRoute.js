// routes/whatsapp.js
import { Router } from "express";
import client from "../whatsapp/client.js";

const router = Router();

router.post("/send-message", async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Number and message are required" });
  }

  try {
    const chatId = number.startsWith("+")
      ? number.slice(1) + "@c.us"
      : number + "@c.us";

    // ✅ Directly send message without checking registration
    await client.sendMessage(chatId, message);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
