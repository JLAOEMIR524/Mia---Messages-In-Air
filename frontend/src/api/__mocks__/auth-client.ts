import { vi } from "vitest";

export const useSession = vi.fn();
export const signIn = {
  passkey: vi.fn(),
  email: vi.fn(),
};
export const signUp = {
  email: vi.fn(),
};
export const signOut = vi.fn();

export const authClient = {
  useSession,
  signIn,
  signUp,
  signOut,
};