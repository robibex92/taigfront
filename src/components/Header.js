import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Box, Paper } from "@mui/material";
import Logo from "./icons/Logo";
import ThemeSwitcher from "./ThemeSwitcher";
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
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo />
          </Link>
        </Box>
        <ThemeSwitcher toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "8px 16px",
            borderRadius: "0px 0px 16px 16px", // Закругленные нижние углы
            backgroundColor: "#ffffff", // Белый фон
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Легкая тень
          }}
        >
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
