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

const renderDashboard = async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
};

const expectedReceived = mockPostcards
  .filter((element) => !element.sentByMe)
  .slice(0, 3);
const expectedSent = mockPostcards
  .filter((element) => element.sentByMe)
  .slice(0, 3);

const expectedCountries = mockPostcards
  .map((card) => card.countryName || card.location)
  .map((name) => name.trim().toLowerCase());

describe("The Badge View shows", () => {
  it("the statistics correctly", async () => {
    await renderDashboard();
    await waitFor(() => {
      expect(document.querySelectorAll(".dashboard-column")).toHaveLength(2);
    });

    const [sentCard, receiveCard, countryCard] = document.querySelectorAll(
      ".statisticCard",
    ) as NodeListOf<HTMLElement>;

    expect(sentCard.querySelector(".text-s")?.textContent?.trim()).toBe(
      `${expectedSent.length}`,
    );
    expect(receiveCard.querySelector(".text-s")?.textContent?.trim()).toBe(
      `${expectedReceived.length}`,
    );
    expect(countryCard.querySelector(".text-s")?.textContent?.trim()).toBe(
      `${expectedCountries.length}`,
    );
  });
});

describe("The postcard filter", () => {
  it("sorts recived and sent cards in the correct colummn", async () => {
    await renderDashboard();
    await waitFor(() => {
      expect(document.querySelectorAll(".dashboard-column")).toHaveLength(2);
    });

    const [recivedCards, sentCards] = document.querySelectorAll(
      ".dashboard-column",
    ) as NodeListOf<HTMLElement>;

    //Amout of sent/recived sorted correct
    expect(
      within(sentCards).getAllByText("To: Someone in the world"),
    ).toHaveLength(expectedSent.length);
    expect(
      within(recivedCards).getAllByText("From: Someone to you"),
    ).toHaveLength(expectedReceived.length);
  });
});
