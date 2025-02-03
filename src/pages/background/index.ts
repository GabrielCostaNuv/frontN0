import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import "webextension-polyfill";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Erro ao configurar side panel:", error));

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "injectFunctions") {
//     if (message.tabId == null) {
//       console.log("no active tab found");
//     } else {
//       chrome.scripting.executeScript({
//         target: { tabId: message.tabId },
//         files: ["assets/js/mainWorld.js"],
//         world: "MAIN",
//       });
//     }
//     return true;
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background recebeu mensagem:", message, "Sender:", sender);
  // Lógica para injetar funções (por exemplo, mainWorld.js)
  if (message.action === "injectFunctions") {
    if (message.tabId == null) {
      console.log("No active tab found for injection.");
    } else {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        files: ["assets/js/mainWorld.js"],
        world: "MAIN",
      });
    }
    return true;
  }
  // Lógica para redirecionar o usuário para a aba ativa
  if (message.action === "FOCUS_TAB") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        chrome.tabs.update(tabs[0].id, { active: true });
      }
    });
    return;
  }
  // Lógica para abrir o side panel
  if (message.action === "openSidePanel") {
    let tabId = sender.tab && sender.tab.id;
    if (!tabId) {
      // Se sender.tab não estiver definido, busca a aba ativa
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          tabId = tabs[0].id;
          chrome.sidePanel
            .open({ tabId, windowId: chrome.windows.WINDOW_ID_CURRENT })
            .catch((error) => {
              console.error("Erro ao abrir o side panel:", error);
            });
        } else {
          console.error("Nenhuma aba ativa encontrada");
        }
      });
    } else {
      chrome.sidePanel.open({ tabId }).catch((error) => {
        console.error("Erro ao abrir o side panel:", error);
      });
    }
    return;
  }
  // Lógica para fechar o side panel
  if (message.action === "closeSidePanel") {
    chrome.sidePanel
      .setOptions({ enabled: false })
      .then(() => chrome.sidePanel.setOptions({ enabled: true }))
      .catch((error) => {
        console.error("Erro ao fechar o side panel:", error);
      });
    return;
  }
});
