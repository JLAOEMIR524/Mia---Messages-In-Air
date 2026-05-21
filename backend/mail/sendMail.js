import { Resend } from "resend";
import { prisma } from "../db.js";

//Basic Mail sender
async function sendMail({ to, templateId, variables }, id) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || user.emailNotifications === false) {
    return;
  }

  const recipient = process.env.TEST === "true" ? "delivered@resend.dev" : to;
  const url = process.env.BETTER_AUTH_URL;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const unsubscribeLink = `${url}/unsubscribe?token=${user.unsubscribeToken}`;

  const { data, error } = await resend.emails.send({
    from: "Mia <noreply@mia.jlaoemir.at>",
    to: recipient,
    template: {
      id: templateId,
      variables: {
        ...variables,
        unsubscribeLink,
      },
    },
    headers: {
      "List-Unsubscribe": `<${unsubscribeLink}>, <mailto:unsubscribe@mia.jlaoemir.at>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  // Error for Rate limit
  if (error) {
    const isRateLimit =
      error.statusCode === 422 ||
      error.message?.toLowerCase().includes("rate limit") ||
      error.message?.toLowerCase().includes("daily limit");

    if (isRateLimit) {
      throw new Error("Daily email limit reached. Emails are out for today.");
    }

    throw new Error(`Resend Mail error: ${error.message}`);
  }

  return data;
}

//New Postcard notice
export async function sendPostcardNotification(
  recipientMail,
  id,
  recipientName,
  cardId,
) {
  return sendMail(
    {
      to: recipientMail,
      templateId: "notification",
      variables: {
        Receiver_username: recipientName,
        Postcard_url: cardId,
      },
    },
    id,
  );
}

//New notification
export async function sendNotification(
  subject,
  id,
  recipientName,
  recipientMail,
  note,
) {
  return sendMail(
    {
      to: recipientMail,
      templateId: "info",
      variables: {
        subject,
        name: recipientName,
        text: note,
      },
    },
    id,
  );
}
