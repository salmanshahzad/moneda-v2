import { ColorSchemeProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DarkThemeToggle from "./DarkThemeToggle";

describe("DarkThemeToggle", () => {
  it("toggles the colour scheme", async () => {
    const toggle = jest.fn();
    render(
      <ColorSchemeProvider colorScheme="light" toggleColorScheme={toggle}>
        <DarkThemeToggle />
      </ColorSchemeProvider>
    );

    const input = screen.getByRole("checkbox");
    await userEvent.click(input);
    expect(toggle).toHaveBeenCalled();
  });
});
