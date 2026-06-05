import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, it, vi } from "vitest";
import { Message } from "./Message";
import { mockPostcards } from "../tests/mockdata";

//to have a mocked session and postcards
vi.mock("@/lib/auth-client");

beforeEach(() => {
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
      <Message />
    </MemoryRouter>,
  );
};

describe("The postcard filter", () => {
  it("sorts recived and sent cards in the correct colummn", async () => {
    await renderMessage();
    await waitFor(() =>{
        
    })
  });
});
