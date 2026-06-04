import { vi } from "vitest";
import { useSession } from "../api/auth-client";

//makes it possible to manually set a different value in the test
type MockUserOverrides = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
};

export const mockLoggedIn = (overrides: MockUserOverrides = {}) => {
  vi.mocked(useSession).mockReturnValue({
    data: {
      user: {
        id: "1",
        name: "Max Mustermann",
        email: "max@test.de",
        firstName: "Max",
        lastName: "Mustermann",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
      },
      session: {
        id: "test-session-abc",
        userId: "test-user-1",
        token: "test-token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: null,
        userAgent: null,
      },
    },
    isPending: false,
    isRefetching: false,
    error: null,
    refetch: vi.fn(),
  });
};

export const mockLoggedOut = () => {
  vi.mocked(useSession).mockReturnValue({
    data: null,
    isPending: false,
    isRefetching: false,
    error: null,
    refetch: vi.fn(),
  });
};

export const mockLoading = () => {
  vi.mocked(useSession).mockReturnValue({
    data: null,
    isPending: true,
    isRefetching: false,
    error: null,
    //.fn() listens to everything that happens in order to later ask if certain
    // procedures happened and also acts as a placeholder instead of the actual function that would do sth
    refetch: vi.fn(),
  });
};
