// services/whatsappService.js
import axios from "axios";

export const sendWhatsAppMessage = async (number, message) => {
  if (!number) {
    console.warn("⚠️ No phone number provided for WhatsApp message.");
    return null;
  }

  // Add +977 prefix if not present
  let formattedNumber = number.startsWith("+") ? number : `+977${number}`;

  console.log("📞 Preparing to send WhatsApp message to:", formattedNumber);
  console.log("📨 Message content:", message);

  try {
    const response = await axios.post(
      "http://localhost:3000/api/whatsapp/send-message",
      {
        number: formattedNumber,
        message,
      }
    );
    console.log("✅ WhatsApp message sent successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("⚠️ Failed to send WhatsApp message:", err.message);
    if (err.response) {
      console.error("❗ WhatsApp API response error:", err.response.data);
    }
    throw err;
  }
};
