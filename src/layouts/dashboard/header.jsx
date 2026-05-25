/*eslint-disable */
import PropTypes from "prop-types";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { useResponsive } from "src/hooks/use-responsive";

import { bgBlur } from "src/theme/css";

import Iconify from "src/components/iconify";

// import Searchbar from './common/searchbar';
import { NAV, HEADER } from "./config-layout";
import AccountPopover from "./common/account-popover";
import LanguagePopover from "./common/language-popover";
import { ColorModeContext } from "../../theme";
import { useContext } from "react";
import { Switch, Typography } from "@mui/material";

// import NotificationsPopover from './common/notifications-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  useEffect(() => {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [mode]);

  const theme = useTheme();

  const lgUp = useResponsive("up", "lg");

  const bgColor = theme.palette.mode === "dark" ? "black" : "white";

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {/* Push everything to right */}
      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={2}>
        <LanguagePopover />

        {/* 🌙 Theme Toggle */}
        <Box
          onClick={toggleColorMode}
          sx={{
            width: 70,
            height: 36,
            borderRadius: 50,
            cursor: "pointer",
            position: "relative",
            display: "flex",
            alignItems: "center",
            px: 0.5,
            transition: "all 0.3s ease",
            bgcolor:
              mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Sliding Circle */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              transition: "all 0.3s ease",
              transform:
                mode === "dark" ? "translateX(34px)" : "translateX(0px)",
              boxShadow: `0 0 12px ${theme.palette.primary.main}`,
            }}
          >
            <Iconify
              icon={mode === "dark" ? "eva:moon-fill" : "eva:sun-fill"}
              width={16}
            />
          </Box>
        </Box>

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      position="fixed"
      color="transparent"
      enableColorOnDark
      sx={{
        bgcolor: "background.paper",
        backgroundImage: "none", // 🔥 THIS IS KEY
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: (theme) => theme.zIndex.appBar,
        borderBottom:
          bgColor === "black" ? "3px solid #2e2c2e" : "3px solid #eaecef",
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
