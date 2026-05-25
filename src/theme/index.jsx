// import { useMemo } from 'react';
// import PropTypes from 'prop-types';

// import CssBaseline from '@mui/material/CssBaseline';
// import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

// import { palette } from './palette';
// import { shadows } from './shadows';
// import { overrides } from './overrides';
// import { typography } from './typography';
// import { customShadows } from './custom-shadows';

// // ----------------------------------------------------------------------

// export default function ThemeProvider({ children }) {
//   const memoizedValue = useMemo(
//     () => ({
//       palette: palette(),
//       typography,
//       shadows: shadows(),
//       customShadows: customShadows(),
//       shape: { borderRadius: 8 },
//     }),
//     []
//   );

//   const theme = createTheme(memoizedValue);

//   theme.components = overrides(theme);

//   return (
//     <MUIThemeProvider theme={theme}>
//       <CssBaseline />
//       {children}
//     </MUIThemeProvider>
//   );
// }
import PropTypes from "prop-types";
import { useMemo, useState, useEffect, createContext } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { overrides } from "./overrides";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";

export const ColorModeContext = createContext();

export default function ThemeProvider({ children }) {
  // ✅ Lazy initializer (runs only once on mount)
  const getInitialMode = () => localStorage.getItem("themeMode") || "light";

  const [mode, setMode] = useState(getInitialMode);

  // Persist mode
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const contextValue = useMemo(
    () => ({
      toggleColorMode,
      mode,
    }),
    [mode],
  );

  const themeOptions = useMemo(
    () => ({
      palette: palette(mode),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    [mode],
  );

  const theme = useMemo(() => {
    const createdTheme = createTheme(themeOptions);
    createdTheme.components = overrides(createdTheme);
    return createdTheme;
  }, [themeOptions]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
