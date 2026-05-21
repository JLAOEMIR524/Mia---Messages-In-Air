import { sendNotification } from "./sendMail.js";

export async function sendWelcomeMail(user) {
  void sendNotification(
    "Welcome to Mia. Your account has been created!",
    user.id,
    user.name,
    user.email,
    "Your accout has been created and we are more than happy to welcome you.",
  );
}
