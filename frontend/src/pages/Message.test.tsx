import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, beforeEach, vi, describe, it } from "vitest";
import "@testing-library/jest-dom";
import { Message } from "./Message";
import { MemoryRouter } from "react-router-dom";
import { fetchRandomAddressFromDB } from "../api/locationApi";

beforeEach(() => {
  localStorage.clear();
});

vi.mock("../api/locationApi", () => ({
  fetchRandomAddressFromDB: vi.fn().mockResolvedValue({
    name: "Test Person",
    street: "Testgasse 1",
    zip: "1010",
    city: "Wien",
    country: "Austria",
  }),
  searchLocationsFromDB: vi.fn().mockResolvedValue([
    { name: "Berlin", type: "city" },
    { name: "Bern", type: "city" },
    { name: "Salzburg", type: "city" },
  ]),
}));

const renderMessage = async () => {
  render(
    <MemoryRouter>
      <Message />
    </MemoryRouter>,
  );
  await waitFor(() => expect(fetchRandomAddressFromDB).toHaveBeenCalled());
};

describe("Message text field tests", () => {
  it("shows error after typing short message", async () => {
    const user = userEvent.setup();

    await renderMessage();

    const input = screen.getByLabelText(/your message/i);

    await act(async () => await user.type(input, "short text"));

    const errors = screen.getAllByText(/your message is too short/i, {
      exact: false,
    });
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it("character count matches actual char amout", async () => {
    const user = userEvent.setup();

    await renderMessage();

    const input = screen.getByLabelText(/your message/i);
    await act(
      async () =>
        await user.type(input, "this is a text which is exactly 45 chars long"),
    );

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Characters: 45/700";
      }),
    ).toBeInTheDocument();
  });

  it("user chan't proceed if the text box is insufficcently filled", async () => {
    const user = userEvent.setup();

    await renderMessage();
    const input = screen.getByLabelText(/your message/i);
    await act(
      async () =>
        await user.type(input, "this is a text which is exactly 55 chars long"),
    );

    const continueButton = screen.getByRole("button", {
      name: /Send Postcard/i,
    });

    expect(continueButton).toHaveClass("is-disabled");
  });

  it("user can proceed if the text box is sufficcently filled", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Message />
      </MemoryRouter>,
    );

    const greetingImputField = screen.getByLabelText(/Greeting \/ Subject/i);
    await user.type(greetingImputField, "Dear Stranger");

    const messageImputField = screen.getByLabelText(/your message/i);
    await user.type(
      messageImputField,
      "this is a text which is exactly 171 chars long and therefore should technically be logn enough to let a user proceed to the next step eg. the end of the postcard generator",
    );

    const locationInput = screen.getByPlaceholderText(
      /search city or country/i,
    );
    await user.type(locationInput, "Salzburg");
    await act(async () => await user.type(locationInput, "Ber"));
    const option = await screen.findByRole("option", { name: /berlin/i });
    expect(option).toBeInTheDocument();
    await user.click(option);

    const continueButton = screen.getByRole("button", {
      name: /Send Postcard/i,
    });

    expect(continueButton).not.toHaveClass("is-disabled");
  });
});

describe("Location search Tests", () => {
  it("allows user to search and select a location", async () => {
    const user = userEvent.setup();
    await renderMessage();

    const locationInput = screen.getByPlaceholderText(
      /search city or country/i,
    );

    await act(async () => await user.type(locationInput, "Ber"));

    const option = await screen.findByRole("option", { name: /berlin/i });
    expect(option).toBeInTheDocument();

    await user.click(option);

    expect(locationInput).toHaveValue("Berlin");
  });
});
