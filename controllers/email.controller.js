const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = process.env.SENDER;
const emailAccess = process.env.PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender,
    pass: emailAccess,
  },
});

function sendEmail(email, resetToken) {
  const resetLink = `http://localhost:5000/api/user/reset-password/${resetToken}`;
}
