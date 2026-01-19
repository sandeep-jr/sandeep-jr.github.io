import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f4c81"
    },
    secondary: {
      main: "#e4572e"
    },
    background: {
      default: "#f7f4ef",
      paper: "#ffffff"
    },
    text: {
      primary: "#1d1c1a",
      secondary: "#4a4a45"
    }
  },
  typography: {
    fontFamily: "\"Space Grotesk\", sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.01em"
    }
  },
  shape: {
    borderRadius: 18
  }
});

export default theme;
