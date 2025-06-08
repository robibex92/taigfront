import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const UserProfileHeader = ({ user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });

  if (!user) return null;

  // Определяем, какие поля показывать
  let displayName = "";
  if (user.is_manually_updated) {
    if (user.telegram_first_name || user.telegram_last_name) {
      displayName = `${user.telegram_first_name || ""} ${
        user.telegram_last_name || ""
      }`.trim();
    } else {
      displayName = "Имя и Фамилия не заполнены";
    }
  } else {
    displayName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  }

  // Tooltip для незаполненного имени
  const showTooltip =
    user.is_manually_updated &&
    !user.telegram_first_name &&
    !user.telegram_last_name;

  // Обработчик начала редактирования
  const handleEditClick = () => {
    // Устанавливаем начальные значения полей на основе текущих данных
    setFirstName(
      user.is_manually_updated
        ? user.telegram_first_name || ""
        : user.first_name || ""
    );
    setLastName(
      user.is_manually_updated
        ? user.telegram_last_name || ""
        : user.last_name || ""
    );
    setIsEditing(true);
  };

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({ firstName: "", lastName: "" });
  };

  // Функция валидации имени (только буквы)
  const validateName = (value) => {
    return /^[А-ЯЁа-яёA-Za-z\s-]*$/.test(value)
      ? ""
      : "Только буквы, пробелы и дефисы";
  };

  // Обработчики изменения полей с валидацией
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    setErrors((prev) => ({ ...prev, firstName: validateName(value) }));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    setErrors((prev) => ({ ...prev, lastName: validateName(value) }));
  };

  // Обработчик сохранения изменений
  const handleSaveEdit = async () => {
    // Проверяем наличие ошибок валидации
    const firstNameError = validateName(firstName);
    const lastNameError = validateName(lastName);

    if (firstNameError || lastNameError) {
      setErrors({ firstName: firstNameError, lastName: lastNameError });
      return;
    }

    // Проверяем, были ли изменения
    const hasChanges = user.is_manually_updated
      ? firstName !== (user.telegram_first_name || "") ||
        lastName !== (user.telegram_last_name || "")
      : firstName !== (user.first_name || "") ||
        lastName !== (user.last_name || "");

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    // Подготавливаем данные для обновления
    const updatedData = {
      is_manually_updated: true,
      telegram_first_name: firstName,
      telegram_last_name: lastName,
    };

    try {
      // Вызываем функцию обновления из пропсов
      await onEdit(updatedData);

      // Показываем уведомление об успешном обновлении
      setSnackbarMessage("Данные успешно обновлены");
      setSnackbarOpen(true);

      // Закрываем режим редактирования
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      setSnackbarMessage("Ошибка при обновлении данных");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
      <Avatar
        src={user.avatar || undefined}
        alt={user.username || user.first_name || "User"}
        sx={{ width: 72, height: 72, fontSize: 36 }}
      >
        {user.first_name ? user.first_name[0] : "U"}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        {!isEditing ? (
          // Режим просмотра
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showTooltip ? (
              <Tooltip title="Просьба указать, как отображать Ваше имя в объявлениях">
                <Typography variant="h5" fontWeight={600} color="warning.main">
                  {displayName}
                </Typography>
              </Tooltip>
            ) : (
              <Typography variant="h5" fontWeight={600}>
                {displayName}
              </Typography>
            )}
            <IconButton size="small" onClick={handleEditClick} sx={{ ml: 1 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          // Режим редактирования
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 400,
            }}
          >
            <TextField
              label="Имя"
              value={firstName}
              onChange={handleFirstNameChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
              variant="outlined"
              size="small"
              margin="dense"
            />
            <TextField
              label="Фамилия"
              value={lastName}
              onChange={handleLastNameChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
              variant="outlined"
              size="small"
              margin="dense"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 1,
              }}
            >
              <IconButton color="default" onClick={handleCancelEdit}>
                <CloseIcon />
              </IconButton>
              <IconButton color="primary" onClick={handleSaveEdit}>
                <CheckIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        {!isEditing && user.username && (
          <Typography variant="subtitle1" color="text.secondary">
            @{user.username}
          </Typography>
        )}
      </Box>

      {/* Уведомление о результате обновления */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfileHeader;
