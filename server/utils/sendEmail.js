import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter
  // For production, use a real service like SendGrid, Mailgun, or Gmail
  // For now, we'll assume environment variables are set, or fallback to a console log mock if not.
  
  let transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Mock transporter for development without creds
    console.log('SMTP_HOST not set. Mocking email sending.');
    console.log(`Email to: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    return;
  }

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // can add html support later
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
