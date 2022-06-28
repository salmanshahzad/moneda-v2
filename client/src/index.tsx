import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
