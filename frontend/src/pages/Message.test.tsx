import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { Message } from "./Message";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  localStorage.clear();
});

test("shows error after typing short message", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Message />
    </MemoryRouter>,
  );

  const input = screen.getByLabelText(/your message/i);

  await user.type(input, "short text");
  expect(
    screen.getByText(/your message is too short/i, { exact: false }),
  ).toBeInTheDocument();
});

test("allows user to search and select a location", async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><Message /></MemoryRouter>)

  const locationInput = screen.getByPlaceholderText(/search city or country/i)

  await user.type(locationInput, "Ber")

  const option = await screen.findByRole("option", { name: /berlin/i })
  expect(option).toBeInTheDocument()

  await user.click(option)

  expect(locationInput).toHaveValue("Berlin")
});

test("character count matches actual char amout", async() => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Message />
    </MemoryRouter>,
  );

  const input = screen.getByLabelText(/your message/i);
  await user.type(input, "this is a text which is exactly 45 chars long");

  expect(
    screen.getByText((_content, element) => {
      return element?.textContent === "Characters: 45/700";
    })
  ).toBeInTheDocument();
});

test("user chan't proceed if the text box is insufficcently filled", async() => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Message />
    </MemoryRouter>,
  );

  const input = screen.getByLabelText(/your message/i);
  await user.type(input, "this is a text which is exactly 55 chars long");

  const continueButton = screen.getByRole("link", {name: /Send Postcard/i});

  expect(continueButton).toHaveClass("is-disabled");
});

test("user can proceed if the text box is sufficcently filled", async() => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Message />
    </MemoryRouter>,
  );

  const input = screen.getByLabelText(/your message/i);
  await user.type(input, "this is a text which is exactly 171 chars long and therefore should technically be logn enough to let a user proceed to the next step eg. the end of the postcard generator");

  const location = screen.getByLabelText(/Where are you writing from?/i)
  await user.type(location, "Salzburg");

  //Click on the Salzburg button and should then be able to continue (button is activated)

  const continueButton = screen.getByRole("link", {name: /Send Postcard/i});

  expect(continueButton).not.toHaveClass("is-disabled");
});