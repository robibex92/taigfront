import React from "react";
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import {
  AccountCircle,
  Person,
  ExitToApp,
  Brightness7,
  Brightness4,
  Brightness7Outlined,
} from "@mui/icons-material";
import TelegramLoginButton from "react-telegram-login";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/config";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    minWidth: 220,
    boxShadow: theme.shadows[4],
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 0),
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  "& .MuiListItemIcon-root": {
    minWidth: 36,
    color: theme.palette.text.primary,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserMenu = ({ toggleTheme, isDarkMode }) => {
  const theme = useTheme();
  const { user, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const onAuth = async (user) => {
    try {
      const response = await fetch(`${API_URL}/auth/telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegram_token: user.hash, user_data: user }),
      });
      if (!response.ok) {
        throw new Error("Failed to authenticate with Telegram");
      }
      const data = await response.json();
      login(data.user, data.accessToken, data.refreshToken);
    } catch (error) {
      alert("Ошибка при авторизации через Telegram");
    }
  };

  // Кнопка "Профиль" всегда в шапке
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          borderRadius: 2,
          transition: "background 0.2s",
          px: 2,
          py: 1,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={handleMenu}
        tabIndex={0}
        role="button"
        aria-label="Открыть меню пользователя"
      >
        {user && user.avatar ? (
          <Avatar
            src={user.avatar}
            alt={user.username}
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <AccountCircle
            sx={{
              fontSize: 32,
              color: !isDarkMode
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
            }}
          />
        )}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            userSelect: "none",
            ml: 1,
          }}
        >
          Профиль
        </Typography>
      </Box>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(1px)",
          },
        }}
      >
        {!user ? (
          <Box
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TelegramLoginButton
              botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
              dataOnauth={onAuth}
              buttonSize="large"
              cornerRadius={8}
              requestAccess={true}
            />
            <Divider sx={{ width: "100%", my: 1 }} />
            <StyledMenuItem onClick={toggleTheme}>
              <ListItemIcon>
                {!isDarkMode ? (
                  <Brightness7 fontSize="small" />
                ) : (
                  <Brightness4 fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={!isDarkMode ? "Светлая тема" : "Темная тема"}
                primaryTypographyProps={{ color: "text.primary" }}
              />
            </StyledMenuItem>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={500}
                color="text.primary"
                sx={{ whiteSpace: "nowrap" }}
              >
                {user.first_name || user.username}
              </Typography>
              {user.username && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, whiteSpace: "nowrap" }}
                >
                  @{user.username}
                </Typography>
              )}
            </Box>
            <Divider sx={{ my: 1 }} />
            <StyledMenuItem
              component={Link}
              to="/profile"
              onClick={handleClose}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Профиль"
                primaryTypographyProps={{ color: "text.primary" }}
              />
            </StyledMenuItem>
            <StyledMenuItem onClick={toggleTheme}>
              <ListItemIcon>
                {!isDarkMode ? (
                  <Brightness4 fontSize="small" />
                ) : (
                  <Brightness7 fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={!isDarkMode ? "Светлая тема" : "Темная тема"}
                primaryTypographyProps={{ color: "text.primary" }}
              />
            </StyledMenuItem>
            <Divider sx={{ my: 1 }} />
            <StyledMenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Выйти"
                primaryTypographyProps={{ color: "text.primary" }}
              />
            </StyledMenuItem>
          </>
        )}
      </StyledMenu>
    </>
  );
};

export default UserMenu;
