import mailgun from "mailgun-js";

const API_KEY = "b8b6cf8b387887d243fb748a110a8f5e-ac3d5f74-c3e4afff";
const DOMAIN = "sandbox81c16fe08d6941a6a6ab99b8c9616a32.mailgun.org";

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

const sendMail = async (
  senderEmail: string,
  receiverEmail: string,
  emailSubject: string,
  emailBody: string
): Promise<void> => {
  const data = {
    from: senderEmail,
    to: receiverEmail,
    subject: emailSubject,
    html: emailBody,
  };

  try {
    const response = await mg.messages().send(data);
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// // Example usage
// const senderEmail = "onosogapelumi@gmail.com";
// const receiverEmail = "receiver@gmail.com";
// const emailSubject = "Mailgun Demo";
// const emailBody = "Greetings from GeeksforGeeks";

export const sendEmailHandler = (
  receiver: string,
  subject: string,
  body: string
) => {
  sendMail("onasogapelumi@gmail.com", receiver, subject, body);
};
