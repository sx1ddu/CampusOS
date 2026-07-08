import nodemailer from 'nodemailer';

// Set up the mail transporter using SMTP details from .env.
// Used for sending verification and password reset emails.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send a simple HTML email through Nodemailer.
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"CampusOS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
