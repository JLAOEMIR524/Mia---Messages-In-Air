import { sendNotification } from "./sendMail.js";
import { prisma } from "../db.js";

export async function sendPasswordResetMail({ user, url }) {
  void sendNotification(
    "Mia: Reset Password",
    user.id,
    user.firstName,
    user.email,
    `Click the link to reset your password: ${url}`,
  );
}
