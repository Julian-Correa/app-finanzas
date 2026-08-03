import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import "@/styles/global.css";
import { registerSW } from "virtual:pwa-register";

const rootElement = document.getElementById("root");

registerSW({ immediate: true });

if (!rootElement) {
  throw new Error("FinOS root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
