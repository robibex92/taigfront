import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Box, Paper } from "@mui/material";
import Logo from "./icons/Logo";
import UserMenu from "./UserMenu";

const Header = ({ toggleTheme, theme }) => {
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(10px)",
        padding: 0, // Убираем паддинг у AppBar
        "& > :not(style)": {
          padding: 0, // Убираем паддинг у всех дочерних элементов
        },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: "40px !important",
          alignItems: "flex-start",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mt: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo />
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: 0,
              borderRadius: "0px 0px 16px 16px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
            }}
          >
            <UserMenu toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
