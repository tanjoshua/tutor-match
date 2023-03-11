import {
  EMAIL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN,
} from "../utils/config";

require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err: any, token: any) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL,
      accessToken,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_OAUTH_REFRESH_TOKEN,
    },
  });

  return transporter;
};

export const sendEmail = async (emailOptions: any) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions, (err: any, info: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`email sent to ${info.accepted.join(",")}`);
    }
  });
};

// sample email
/*
sendEmail(
  generateNewTutorRequestEmail(
    "Josh",
    "jtanjoshua@gmail.com",
    "https://google.com"
  )
);
*/
