const nodemailer = require('nodemailer');

const sendmail = async (options) => {
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      pass: process.env.EMAIL_PASSWORD,
      user: process.env.EMAIL_USERNAME,
    },
  });

  // 2) define the email options

  const mailOptions = {
    from: 'Norbert Toth <ntoth@natours.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  // 3) send the eamil

  await transporter.sendMail(mailOptions);
};

module.exports = sendmail;
