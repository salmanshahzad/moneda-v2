import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";

const root = createRoot(document.getElementById("root")!);
root.render(
  <MantineProvider withNormalizeCSS>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);
