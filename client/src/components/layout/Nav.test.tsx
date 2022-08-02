import { ColorSchemeProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Nav from "./Nav";

describe("Nav", () => {
  it("navigates", async () => {
    const layout = (text: string) => (
      <ColorSchemeProvider colorScheme="light" toggleColorScheme={() => {}}>
        <Nav />
        <p>{text}</p>
      </ColorSchemeProvider>
    );

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={layout("Home")} />
          <Route path="/dashboard" element={layout("Dashboard")} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Home")).toBeInTheDocument();
    const dashboardButton = screen.getByText("Dashboard");
    await userEvent.click(dashboardButton);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });
});
