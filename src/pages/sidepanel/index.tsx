import { createRoot } from "react-dom/client";

import App from "@src/common/App";

import refreshOnUpdate from "virtual:reload-on-update-in-view";
import FloatingButton from "@root/src/common/buttonFloating";

refreshOnUpdate("pages/sidepanel");

function init() {
  const appContainer: HTMLElement | null =
    document.querySelector("#app-container");
  appContainer!.style.height = "100%";
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(
    <>
      <App />
      {/* <FloatingButton /> */}
    </>,
  );
}

init();
