import React from "react";
import { createRoot } from "react-dom/client";
import FloatingButton from "@root/src/common/buttonFloating";

function injectFloatingButton() {
  const container = document.getElementById("nb1-floating-button-container");
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(FloatingButton));
  }
}

// Inject button when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectFloatingButton);
} else {
  injectFloatingButton();
}
