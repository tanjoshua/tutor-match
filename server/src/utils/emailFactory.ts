import { BASE_URL, EMAIL } from "./config";

export const generateNewTutorRequestEmail = (
  name: string,
  recipientEmail: string,
  clientAccessToken: string
) => {
  const link = `${BASE_URL}/request/client-view/${clientAccessToken}`;
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

export const generatePasswordResetEmail = (
  recipientEmail: string,
  token: string
) => {
  const link = `${BASE_URL}/reset-password/${token}`;
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
