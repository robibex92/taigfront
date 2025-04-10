import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  useMediaQuery,
  IconButton,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import ProductIcon from "@mui/icons-material/Storefront";
import HelpIcon from "@mui/icons-material/Help";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useAuth } from "../context/AuthContext";

const Menu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMainMenu, setActiveMainMenu] = useState(null);

  const toggleMenu = (title) => {
    setActiveMainMenu(title === activeMainMenu ? null : title);
  };

  const handleMenuItemClick = (path, title) => {
    if (title === "Объявления") {
      navigate("/ads");
      toggleMenu(title);
    } else if (path) {
      navigate(path);
      setActiveMainMenu(null);
    }
  };

  const menuItems = [
    { title: "Новостная лента", path: "/", icon: <HomeIcon /> },
    {
      title: "Объявления",
      path: "/ads",
      icon: <ProductIcon />,
    },
    {
      title: "Мои объявления",
      path: "/ads/my",
      icon: <ListAltIcon />,
      requireAuth: true,
    },
    { title: "FAQ", path: "/faq", icon: <HelpIcon /> },
    { title: "Сосед, привет", path: "/hello", icon: <PeopleIcon /> },
    { title: "Чей авто?", path: "/car", icon: <DirectionsCarIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const renderMobileMenu = () => {
    const filteredMenuItems = menuItems.filter(
      (item) => !item.requireAuth || (item.requireAuth && user)
    );

    return (
      <>
        <AppBar
          position="fixed"
          color="primary"
          elevation={0}
          sx={{
            top: "auto",
            bottom: 0,
            marginTop: 0,
            backgroundColor: "#ffffff", // Белый фон для нижней панели
            boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)", // Легкая тень для разделения
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-around",
              maxWidth: 1200,
              width: "100%",
              mx: "auto",
              px: { xs: 2, sm: 3 },
            }}
          >
            {filteredMenuItems.map((item) => (
              <React.Fragment key={item.title}>
                <IconButton
                  component={Link}
                  to={item.path}
                  aria-label={item.title}
                  sx={{
                    color: isActive(item.path) ? "#1976d2" : "#000000", // Зеленый цвет для активной иконки
                  }}
                >
                  {item.icon}
                </IconButton>
              </React.Fragment>
            ))}
            <IconButton
              color="inherit"
              aria-label="Еще"
              onClick={handleDrawerToggle}
              sx={{
                color: "#000000", // Черный цвет для иконки "Еще"
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          anchor="bottom"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onOpen={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#ffffff", // Белый фон для мобильного меню
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              backdropFilter: "blur(10px)", // Добавляем размытие для заднего фона
            },
          }}
        >
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem
                key={item.title}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                selected={isActive(item.path)}
                disablePadding
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>
      </>
    );
  };

  const renderDesktopMenu = () => (
    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
      {menuItems
        .filter((item) => !item.requireAuth || (item.requireAuth && user))
        .map((item) => (
          <Button
            key={item.title}
            onClick={() => handleMenuItemClick(item.path, item.title)}
            startIcon={item.icon}
            sx={{
              color: isActive(item.path) ? "white" : "white",
              fontWeight: isActive(item.path) ? "bold" : "medium",
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              py: 1,
              backgroundColor: isActive(item.path)
                ? "rgba(0, 0, 0, 0.08)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {item.title}
          </Button>
        ))}
    </Box>
  );

  return isMobile ? (
    renderMobileMenu()
  ) : (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "transparent" }}
    >
      <Toolbar>{renderDesktopMenu()}</Toolbar>
    </AppBar>
  );
};

export default Menu;
