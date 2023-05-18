import { WEB_URL, EMAIL } from "./config";

export const generateNewTutorRequestEmail = (
  name: string,
  recipientEmail: string,
  clientAccessToken: string
) => {
  const link = `${WEB_URL}/request/client-view/${clientAccessToken}`;
  const htmlBody = `
    <p>
        Hi ${name}, thanks for using tutoring.sg to find your next tutor!
        <br>
        <br>
        View your tutor applications <a href="${link}" target="_blank">here</a>.
        <br>
        You can go to this link at any time to see the tutor applications you have received.
        <br>
        <br>
        Thank you.
    </p>
  `;
  return {
    subject: "New Tutor Request",
    html: htmlBody,
    to: recipientEmail,
    from: {
      address: EMAIL,
      name: "tutoring.sg",
    },
  };
};

export const applicationsReceivedReminderEmail = (
  name: string,
  recipientEmail: string,
  clientAccessToken: string
) => {
  const link = `${WEB_URL}/request/client-view/${clientAccessToken}`;
  const htmlBody = `
    <p>
        Hi ${name}, you've received several applications to your tutor request!
        <br>
        <br>
        Review the applications <a href="${link}" target="_blank">here</a>.
        <br>
        Reminder: you can go to this link at any time to see the tutor applications you have received.
        <br>
        <br>
        Thank you.
    </p>
  `;
  return {
    subject: "Tutor profiles are waiting for you",
    html: htmlBody,
    to: recipientEmail,
    from: {
      address: EMAIL,
      name: "tutoring.sg",
    },
  };
};

export const generateContactRequestEmail = ({
  tutorName,
  recipientEmail,
  clientName,
  clientEmail,
  clientPhoneNumber,
  message,
}: {
  tutorName: string;
  recipientEmail: string;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  message: string;
}) => {
  const htmlBody = `
    <p>
        Hi ${tutorName}, ${clientName} is interested in engaging your tutoring services!
        <br>
        <br>
        Please reach out to them via:
        <br>
        ${clientEmail && `Email: ${clientEmail} <br>`}
        ${clientPhoneNumber && `Phone number: ${clientPhoneNumber} <br>`}
        <br>
        ${
          message &&
          `They have also attached the following message: <br> ${message}`
        }
        <br>
        <br>
        Thank you for using tutoring.sg
    </p>
  `;
  return {
    subject: `Tutoring.sg - New contact request from ${clientName}`,
    html: htmlBody,
    to: recipientEmail,
    from: {
      address: EMAIL,
      name: "tutoring.sg",
    },
  };
};

export const generateEmailVerificationEmail = ({
  token,
  name,
  recipientEmail,
}: {
  token: string;
  name: string;
  recipientEmail: string;
}) => {
  const link = `${WEB_URL}/account/verify-email/${token}`;
  const htmlBody = `
    <p>
        Hi ${name}, thank you for signing up to tutoring.sg
        <br>
        <br>
        Please verify your email by visiting the following link
        <br>
        <a href="${link}" target="_blank">${link}</a>
        <br>
        <br>
        Thank you for using tutoring.sg
    </p>
  `;
  return {
    subject: `Confirm you email address`,
    html: htmlBody,
    to: recipientEmail,
    from: {
      address: EMAIL,
      name: "tutoring.sg",
    },
  };
};

export const generatePasswordResetEmail = (
  recipientEmail: string,
  token: string
) => {
  const link = `${WEB_URL}/reset-password/${token}`;
  const htmlBody = `
    <p>
        Reset your password <a href="${link}" target="_blank">here</a>.
        <br>
        <br>
        Thank you.
    </p>
  `;
  return {
    subject: "New Tutor Request",
    html: htmlBody,
    to: recipientEmail,
    from: EMAIL,
  };
};

export const generateRatingRequestEmail = ({
  token,
  tutorName,
  recipientEmail,
  message,
}: {
  token: string;
  tutorName: string;
  recipientEmail: string;
  message: string;
}) => {
  const link = `${WEB_URL}/tutor/leave-rating/${token}`;
  const htmlBody = `
    <p>
        Hi,
        <br>
        <br>
        ${tutorName} would like you to rate their tutoring services.
        <br>
        <br>
        ${
          message &&
          `
        "${message}"
        <br>
        <br>
        `
        }
        
        Please leave your rating at the following link
        <br>
        <a href="${link}" target="_blank">${link}</a>
        <br>
        <br>
        Thank you for using tutoring.sg
    </p>
  `;
  return {
    subject: `Leave a rating for ${tutorName}`,
    html: htmlBody,
    to: recipientEmail,
    from: {
      address: EMAIL,
      name: "tutoring.sg",
    },
  };
};
