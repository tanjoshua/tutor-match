import { BASE_URL, EMAIL } from "./config";

export const generateNewTutorRequestEmail = (
  name: string,
  recipientEmail: string,
  clientAccessToken: string
) => {
  const link = `${BASE_URL}/request/client-view/${clientAccessToken}`;
  const htmlBody = `
    <p>
        Hi ${name}, thanks for using tutor match to find your next tutor!
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
    from: EMAIL,
  };
};
