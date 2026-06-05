import { render, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPostcards } from "../tests/mockdata";
import { Dashboard } from "./Dashboard";
import { mockLoggedIn } from "../tests/setup";

//to have a mocked session and postcards
vi.mock("../api/auth-client");

beforeEach(() => {
  mockLoggedIn();

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ postcards: mockPostcards }),
    }),
  );
});

const renderMessage = async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
};

describe("The postcard filter", () => {
  it("sorts recived and sent cards in the correct colummn", async () => {
    await renderMessage();
    await waitFor(() => {
      expect(document.querySelectorAll(".dashboard-column")).toHaveLength(2);
    });

    const [recivedCards, sentCards] =
      document.querySelectorAll(".dashboard-column");

    const expectedReviced = mockPostcards
      .filter((element) => !element.sentByMe)
      .slice(0, 3);
    const expectedSent = mockPostcards
      .filter((element) => element.sentByMe)
      .slice(0, 3);

    //Amout of sent/recived sorted correct
    expect(
      within(sentCards).getAllByText("To: Someone in the world"),
    ).toHaveLength(expectedSent.length);
    expect(
      within(recivedCards).getAllByText("From: Someone to you"),
    ).toHaveLength(expectedReviced.length);
  });
});
