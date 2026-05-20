import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,

  fetchOptions: {
    // send cookies with every request
    credentials: "include",
  },

  plugins: [
    // Tell auth client that firstName and lastName actually exist on the user
    inferAdditionalFields({
      user: {
        firstName: { type: "string" as const },
        lastName: { type: "string" as const },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
