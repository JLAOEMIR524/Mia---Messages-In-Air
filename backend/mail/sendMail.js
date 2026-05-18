import express from "express";
import { userInfo } from "node:os";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

//Basic Mail sender
async function sendMail({ to, templateId, variables }) {
  const recipient = process.env.TEST === "true" ? "delivered@resend.dev" : to;

  const { data, error } = await resend.emails.send({
    from: "Mia <noreply@mia.jlaoemir.at>",
    to: recipient,
    template: {
      id: templateId,
      variables,
    },
  });

  if (error) {
    throw new Error(`Resend Mail error: ${error.message}`);
  }

  return data;
}

//New Postcard notice
export async function sendPostcardNotification(recipientMail, recipientName, cardId ) {
  return sendMail({
    to: recipientMail,
    templateId: 'notification',
    variables: {
      Receiver_username: recipientName,
      Postcard_url: cardId,
    },
  });
}

//New notification
export async function sendNotification(recipientName, recipientMail, note) {
  return sendMail({
    to: recipientMail,
    templateId: "info",
    variables: {
      Receiver_username: recipientName,
      note,
    },
  });
}
