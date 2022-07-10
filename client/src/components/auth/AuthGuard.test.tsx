import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import api from "../../api";
import AuthGuard from "./AuthGuard";
import * as useStore from "../../store";

describe("AuthGuard", () => {
  const router = (initialRoute = "/") => (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/" element={<p>Home</p>} />
          <Route path="/dashboard" element={<p>Dashboard</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  it("redirects to the dashboard if authenticated", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 200,
      headers: new Headers(),
      data: {},
    });
    render(router());
    await screen.findByText("Dashboard");
  });

  it("renders the dashboard if authenticated", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 200,
      headers: new Headers(),
      data: {},
    });
    render(router("/dashboard"));
    await screen.findByText("Dashboard");
  });

  it("renders the home page if unauthenticated", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 401,
      headers: new Headers(),
      data: {},
    });
    render(router());
    await screen.findByText("Home");
  });

  it("redirects to the home page if unauthenticated", async () => {
    jest.spyOn(api, "get").mockResolvedValue({
      status: 401,
      headers: new Headers(),
      data: {},
    });
    render(router("/dashboard"));
    await screen.findByText("Home");
  });

  it("is authenticated if there is a user in global state", async () => {
    jest.spyOn(useStore, "default").mockReturnValue({});
    render(router());
    await screen.findByText("Dashboard");
  });

  it("is unauthenticated if there is an API error", async () => {
    jest.spyOn(useStore, "default").mockReturnValue(null);
    jest.spyOn(api, "get").mockRejectedValue({});
    render(router());
    await screen.findByText("Home");
  });
});
