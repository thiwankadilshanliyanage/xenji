import React, { createContext, useContext, useMemo, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem("xenji_theme") || "light"
  );

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light";
    localStorage.setItem("xenji_theme", next);
    setMode(next);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#6366f1",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#64748b",
          },
          background: {
            default: mode === "dark" ? "#050505" : "#f7f8fa",
            paper: mode === "dark" ? "#111111" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f5f5f5" : "#111827",
            secondary: mode === "dark" ? "#a3a3a3" : "#64748b",
          },
          divider:
            mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(15,23,42,0.10)",
        },
        shape: {
          borderRadius: 14,
        },
        typography: {
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Arial",
          button: {
            fontWeight: 700,
            textTransform: "none",
          },
        },
        components: {
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: mode === "dark" ? "#f5f5f5" : "#111827",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border:
                  mode === "dark"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.06)",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border:
                  mode === "dark"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(15,23,42,0.06)",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);