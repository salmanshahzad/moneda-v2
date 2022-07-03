import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider withNormalizeCSS>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);
