import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import Home from "./Home";

describe("Home", () => {
  it("displays the sign in modal", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.queryByText("Username")).not.toBeInTheDocument();
    const signInButton = screen.getByRole("button", { name: "Sign In" });
    await userEvent.click(signInButton);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("displays the sign up modal", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.queryByText("Username")).not.toBeInTheDocument();
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });
    await userEvent.click(signUpButton);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });
});
