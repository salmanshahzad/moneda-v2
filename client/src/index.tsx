import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthGuard from "./components/auth/AuthGuard";
import Home from "./pages/Home";
import SignOut from "./pages/SignOut";

const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider withNormalizeCSS>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Home />} />
          <Route path="/signout" element={<SignOut />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);
