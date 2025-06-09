import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { BhaktiCenterProvider } from "./contexts/BhaktiCenterContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BhaktiCenterProvider>
        <App />
      </BhaktiCenterProvider>
    </ThemeProvider>
  </StrictMode>
);
