
import nodemailer from 'nodemailer';

const sendWelcomeEmail = async (email, name) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another service
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Our App!',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for registering with our app.</p>
      <p>We're excited to have you on board!</p>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendWelcomeEmail;