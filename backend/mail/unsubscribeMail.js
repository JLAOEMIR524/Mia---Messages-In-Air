import { prisma } from "../db.js";

export async function unsubscribeMail(token) {
  await prisma.user.update({
    where: { unsubscribeToken: token },
    data: { emailNotifications: false },
  });
}
