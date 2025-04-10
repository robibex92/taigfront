import React from "react";
import { IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import TelegramLoginButton from "./TelegramLoginButton";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();
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

  if (!user) {
    // Если пользователь не авторизован, показываем кнопку входа через Telegram
    return (
      <TelegramLoginButton
        botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
        onAuth={(telegramUser) => {
          console.log("Telegram login successful:", telegramUser);
        }}
      />
    );
  }

  // Если пользователь авторизован, показываем меню профиля
  return (
    <>
      <IconButton onClick={handleMenu} color="inherit">
        {user.avatar ? (
          <Avatar src={user.avatar} alt={user.username} />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem component="a" href="/profile" onClick={handleClose}>
          Профиль
        </MenuItem>
        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
