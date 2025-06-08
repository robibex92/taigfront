import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { API_URL } from "../config/config";
import { applyFormat } from "../utils/textFormatter";
import { useAuth } from "../context/AuthContext";

export default function MessageDialog({
  open,
  onClose,
  targetChatId,
  contextType,
  contextData,
}) {
  const { isAuthenticated, user, accessToken } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Формируем заголовок
  let title = "Написать сообщение";
  if (contextType === "announcement") {
    title += ` по объявлению "${contextData?.title || ""}"`;
  } else if (contextType === "apartment") {
    title += ` соседу из кв. ${contextData?.number || ""}`;
  } else if (contextType === "car") {
    title += ` владельцу автомобиля ${contextData?.car_brand || ""} ${
      contextData?.car_model || ""
    }`;
  }

  const handleFormat = (tag) => {
    setMessage((prev) => applyFormat(prev, tag));
  };

  const handleSend = async () => {
    if (!isAuthenticated) {
      setError("Вы должны быть авторизованы для отправки сообщений");
      return;
    }

    let senderInfo = "";
    if (user?.user_id) {
      // Используем HTML-разметку для ссылки
      senderInfo = `\n\nОт: <a href="tg://user?id=${user.user_id}">ID ${user.user_id}</a>`;
    } else if (user?.username) {
      senderInfo = `\n\nОт: @${user.username}`;
    } else if (user?.first_name) {
      senderInfo = `\n\nОт: ${user.first_name}`;
    }

    if (!message.trim()) {
      setError("Сообщение не может быть пустым");
      return;
    }

    setError("");
    const chat_id = targetChatId;

    try {
      const res = await fetch(`${API_URL}/telegram/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          chat_id,
          message: message + senderInfo, // Добавляем информацию об отправителе
          parse_mode: "HTML", // Указываем, что используем HTML-разметку
          contextType,
          contextData,
        }),
      });

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Сообщение отправлено!",
          severity: "success",
        });
        setMessage("");
        onClose();
      } else {
        const data = await res.json();
        throw new Error(data?.error || "Ошибка отправки");
      }
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: "error" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{title}</span>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!isAuthenticated && (
            <Typography color="error" sx={{ mb: 2 }}>
              Для отправки сообщений необходимо авторизоваться.
            </Typography>
          )}
          <TextField
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            disabled={!isAuthenticated}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={!isAuthenticated || !message.trim()}
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
