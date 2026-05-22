import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db.js";
import crypto from "crypto";
import { sendPasswordResetMail } from "./mail/resetMail.js";
import { sendWelcomeMail } from "./mail/welcomeMail.js";
import { passkey } from "@better-auth/passkey";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL ?? "http://localhost:5173"],

  advanced: {
    crossSubDomainCookies: {
      enabled: isProd,
      domain: isProd ? ".mia.jlaoemir.at" : undefined,
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: sendPasswordResetMail,
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },

  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
      unsubscribeToken: {
        type: "string",
        defaultValue: () => crypto.randomBytes(32).toString("hex"),
        input: false,
      },
      emailNotifications: {
        type: "boolean",
        defaultValue: true,
        input: false,
      },
    },
  },

  plugins: [
    passkey({
      rpID: isProd ? "mia.jlaoemir.at" : "localhost",
      rpName: "MIA",
      origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    }),
  ],

  databaseHooks: {
    user: {
      create: {
        after: sendWelcomeMail,
      },
    },
  },
});
