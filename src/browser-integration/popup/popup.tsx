import React from "react";
import { createRoot } from "react-dom/client";
import PopupContainer from "./components/PopupContainer";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<PopupContainer />);
} else {
  console.error("Root container not found");
}
