// whatsapp/client.js
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "whatsapp-client",
    dataPath: "./.wwebjs_auth",
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("📱 Scan the QR code:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp Client is ready!");
});

client.on("authenticated", () => {
  console.log("🔐 Authenticated successfully!");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
});

client.on("disconnected", (reason) => {
  console.warn("⚠️ Client was disconnected:", reason);
});

client.initialize();

export default client;
