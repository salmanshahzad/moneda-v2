import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import SignOut from "./pages/SignOut";

const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <NotificationsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/signout" element={<SignOut />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationsProvider>
  </MantineProvider>
);
