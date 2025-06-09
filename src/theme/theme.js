// filepath: /src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    h5: {
      fontWeight: "bold",
      fontSize: "1.5rem", // Default font size for h5
      "@media (max-width:600px)": {
        fontSize: "1.2rem", // Smaller font size for mobile screens
      },
    },
    body1: {
      fontSize: "1rem", // Default font size for body text
      "@media (max-width:600px)": {
        fontSize: "0.9rem", // Smaller font size for mobile screens
      },
    },
  },
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#2E3A59",
    },
  },
});

export default theme;