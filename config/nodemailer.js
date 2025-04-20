import nodemailer from "nodemailer";
import bookingTemplates from "../utils/emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;

export const sendBookingEmail = async (
  type,
  booking,
  instructor,
  recipient
) => {
  try {
    const template = bookingTemplates[type](booking, instructor);

    await transporter.sendMail({
      from: `"Yoga Team" <${process.env.SENDER_EMAIL}>`,
      to: recipient,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log(`✅ ${type} email sent to ${recipient}`);
  } catch (err) {
    console.error(`❌ Failed to send ${type} email:`, err);
    throw new Error(`Email send error: ${type}`);
  }
};
