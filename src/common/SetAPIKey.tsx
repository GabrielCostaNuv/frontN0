import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Input,
  VStack,
  Text,
  Link,
  HStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React from "react";
import { useAppState } from "../state/store";
import Login from "./Login";

type SetAPIKeyProps = {
  asInitializerView?: boolean;
  initialOpenAIKey?: string;
  initialAnthropicKey?: string;
  onClose?: () => void;
};

const SetAPIKey = ({
  asInitializerView = false,
  initialOpenAIKey = "",
  initialAnthropicKey = "",
  onClose,
}: SetAPIKeyProps) => {
  const { updateSettings, initialOpenAIBaseUrl, initialAnthropicBaseUrl } =
    useAppState((state) => ({
      initialOpenAIBaseUrl: state.settings.openAIBaseUrl,
      initialAnthropicBaseUrl: state.settings.anthropicBaseUrl,
      updateSettings: state.settings.actions.update,
    }));

  const [openAIKey, setOpenAIKey] = React.useState(initialOpenAIKey || "");
  const [anthropicKey, setAnthropicKey] = React.useState(
    initialAnthropicKey || "",
  );
  const [openAIBaseUrl, setOpenAIBaseUrl] = React.useState(
    initialOpenAIBaseUrl || "",
  );
  const [anthropicBaseUrl, setAnthropicBaseUrl] = React.useState(
    initialAnthropicBaseUrl || "",
  );

  const [showPassword, setShowPassword] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authToken, setAuthToken] = React.useState("");

  React.useEffect(() => {
    chrome.storage.local.get("authToken", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error retrieving token from chrome.storage.local:",
          chrome.runtime.lastError,
        );
        return;
      }
      const token = result.authToken;
      if (token) {
        setAuthToken(token);
        setIsAuthenticated(true);
      }
    });
  }, []);

  const handleLogin = (token: string) => {
    chrome.storage.local.set({ authToken: token }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error saving token to chrome.storage.local:",
          chrome.runtime.lastError,
        );
        return;
      }
      setAuthToken(token);
      setIsAuthenticated(true);
    });
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const onSave = () => {
    // Use authToken if needed for API requests
    updateSettings({
      openAIKey,
      openAIBaseUrl,
      anthropicKey,
      anthropicBaseUrl,
    });
    onClose && onClose();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "0px 0px 10px 0px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <p style={{ margin: "0" }}>
        Você precisará de uma chave de API do OpenAI ou Anthropic para executar
        o Nova no modo de desenvolvedor. Se você ainda não tiver uma, pode criar
        uma em sua{" "}
        <a
          href="https://platform.openai.com/account/api-keys"
          style={{ color: "blue" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          conta OpenAI
        </a>{" "}
        ou sua{" "}
        <a
          href="https://console.anthropic.com/settings/keys"
          style={{ color: "blue" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          conta Anthropic
        </a>
        .
        <br />
        <br />O Nova armazena suas chaves de API localmente no seu dispositivo e
        elas são usadas apenas para se comunicar com a API do OpenAI e/ou a API
        do Anthropic.
      </p>

      <div style={{ position: "relative", padding: "8px 0" }}>
        <hr />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#202124",

            padding: "0 16px",
          }}
        >
          OpenAI
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          htmlFor="openAIKey"
          style={{ fontSize: "1rem", fontWeight: 600 }}
        >
          Chave de API do OpenAI
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            id="openAIKey"
            type={showPassword ? "text" : "password"}
            placeholder="Insira a chave de API do OpenAI"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          {asInitializerView && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                color: "white",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          )}
        </div>
      </div>

      {!asInitializerView && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="openAIBaseUrl" style={{ fontSize: "1rem" }}>
            URL Base (opcional)
          </label>
          <input
            id="openAIBaseUrl"
            type="text"
            placeholder="Definir URL Base"
            value={openAIBaseUrl}
            onChange={(e) => setOpenAIBaseUrl(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      )}

      <div style={{ position: "relative", padding: "8px 0" }}>
        <hr />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#202124",
            padding: "0 16px",
          }}
        >
          Anthropic
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          htmlFor="anthropicKey"
          style={{ fontSize: "1rem", fontWeight: 600 }}
        >
          Chave de API do Anthropic
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            id="anthropicKey"
            type={showPassword ? "text" : "password"}
            placeholder="Insira a chave de API do Anthropic"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          {asInitializerView && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                color: "white",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          )}
        </div>
      </div>

      {!asInitializerView && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="anthropicBaseUrl" style={{ fontSize: "1rem" }}>
            URL Base (opcional)
          </label>
          <input
            id="anthropicBaseUrl"
            type="text"
            placeholder="Definir URL Base"
            value={anthropicBaseUrl}
            onChange={(e) => setAnthropicBaseUrl(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      )}

      <button
        onClick={onSave}
        disabled={!openAIKey && !anthropicKey}
        style={{
          padding: "12px",
          backgroundColor: "#3182ce",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Salvar
      </button>
    </div>
  );
};

export default SetAPIKey;
