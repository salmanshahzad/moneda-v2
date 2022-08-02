import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import SignOut from "./pages/SignOut";

const root = createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signout" element={<SignOut />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

function App(): JSX.Element {
  const [colourScheme, setColourScheme] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: "light",
  });

  function toggleColourScheme(): void {
    setColourScheme((colourScheme) =>
      colourScheme === "light" ? "dark" : "light"
    );
  }

  return (
    <ColorSchemeProvider
      colorScheme={colourScheme}
      toggleColorScheme={toggleColourScheme}
    >
      <MantineProvider
        theme={{ colorScheme: colourScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider>
          <Outlet />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
