import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail's service
    auth: {
        user: process.env.SENDER_EMAIL,  // Your Gmail address
        pass: process.env.SMTP_PASS,     // Your generated App Password
    },
});

export default transporter;
