import { ColorSchemeProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

describe("Layout", () => {
  it("renders an outlet", async () => {
    render(
      <ColorSchemeProvider colorScheme="light" toggleColorScheme={() => {}}>
        <MemoryRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<p>Home</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ColorSchemeProvider>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
