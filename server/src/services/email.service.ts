import { GODADDY_EMAIL, GODADDY_PASSWORD } from "../utils/config";

const nodemailer = require("nodemailer");

const createGoDaddyTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
      user: GODADDY_EMAIL,
      pass: GODADDY_PASSWORD,
    },
  });
  return transporter;
};

export const sendEmail = async (emailOptions: any) => {
  let emailTransporter = createGoDaddyTransporter();
  await emailTransporter.sendMail(emailOptions, (err: any, info: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`email sent to ${info.accepted.join(",")}`);
    }
  });
};

// sample email

// sendEmail(
//   generateNewTutorRequestEmail(
//     "Josh",
//     "jtanjoshua@gmail.com",
//     "https://google.com"
//   )
// );
