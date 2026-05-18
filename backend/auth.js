import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db.js";
import { sendNotification } from "./mail/sendMail.js";
import { request } from "http";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:5173"],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      void sendNotification("Mia: Reset Password", user.firstName, user.email, `Click the link to reset your password: ${url}`);
    },
    onPasswordReset: async({user}, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    }
  },

  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendNotification(
            user.name,
            user.email,
            "Welcome to Mia. Your account has been created!",
          );
        },
      },
    },
  },
});
