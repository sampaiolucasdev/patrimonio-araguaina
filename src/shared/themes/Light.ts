import { createTheme } from "@mui/material";
import { yellow, cyan } from "@mui/material/colors";
import { ptBR } from "@mui/material/locale";

export const LightTheme = createTheme(ptBR, {
  palette: {
    primary: {
      main: yellow[700],
      dark: yellow[800],
      light: yellow[500],
      contrastText: "#ffffff",
    },
    secondary: {
      main: cyan[500],
      dark: cyan[400],
      light: cyan[300],
      contrastText: "#ffffff",
    },
    background: {
      paper: "#ffffff",
      default: "#f7f6f3",
    },
  },
});
