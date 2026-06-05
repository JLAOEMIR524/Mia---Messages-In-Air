import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavBar } from "./Navbar";
import { test, expect } from "vitest";

test("shows back button on mobile when NOT on dashboard", () => {
  window.innerWidth = 500;
  window.dispatchEvent(new Event("resize"));

  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <NavBar />
    </MemoryRouter>,
  );

  const backButton = screen.getByRole("button", { name: /back/i });
  expect(backButton.classList.contains("StepBackNav")).toBe(true);

  expect(screen.queryByAltText("Mia Logo")).toBeNull();
});

test("closes mobile menu after clicking a nav item", async () => {
  window.innerWidth = 500;
  window.dispatchEvent(new Event("resize"));

  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );

  const hamburger = screen.getByLabelText(/menu open/i);
  fireEvent.click(hamburger);

  const profileLink = screen.getByText(/profile/i);
  fireEvent.click(profileLink);

  const sidebar = document.querySelector(".sidebar");
  expect(sidebar?.classList.contains("is-open")).toBe(false);
});

test("all nav items have the correct href", () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );

  const expectedLinks = [
    { name: /dashboard/i, path: "/dashboard" },
    { name: /profile/i, path: "/profile" },
    { name: /generate postcard/i, path: "/quest" },
    { name: /gallery/i, path: "/gallery" },
    { name: /imprint & privacy/i, path: "/imprint" },
  ];

  expectedLinks.forEach((item) => {
    const link = screen.getByText(item.name);
    expect((link as HTMLAnchorElement).getAttribute("href")).toBe(item.path);
  });
});
