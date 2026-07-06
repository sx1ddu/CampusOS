import nodemailer from 'nodemailer';

// Creates a reusable transporter using credentials from .env.
// Works with Gmail (using an App Password) or any SMTP provider.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sends a simple HTML email. Used for email verification and
// password reset links.
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"CampusOS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
