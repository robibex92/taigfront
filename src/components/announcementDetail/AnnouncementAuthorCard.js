import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";

const AnnouncementAuthorCard = ({
  user,
  userHouses,
  onUserClick,
  currentUser,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Состояние для аватарки
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  // Проверка, существует ли пользователь
  if (!user) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Информация о пользователе недоступна.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Загрузка аватарки пользователя
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/api/users/${user.user_id}/avatar`);

        if (!response.ok) {
          throw new Error("Failed to load avatar");
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob); // Создаем временный URL для изображения
        setAvatarUrl(imageUrl);
      } catch (error) {
        console.error("Error loading avatar:", error);
        setAvatarUrl(null); // Устанавливаем null, если аватарка недоступна
      } finally {
        setLoadingAvatar(false);
      }
    };

    fetchAvatar();
  }, [user?.user_id]);

  const displayName =
    user.first_name || user.telegram_first_name || "Пользователь";

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => onUserClick(user)}
          >
            {/* Отображение аватарки */}
            <Avatar
              src={avatarUrl || undefined} // Используем загруженную аватарку или placeholder
              alt={displayName}
              sx={{ width: 56, height: 56 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="h6">{displayName}</Typography>
              {userHouses.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Дом: {userHouses.join(", ")}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Button variant="contained" startIcon={<TelegramIcon />} fullWidth>
              Написать автору
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AnnouncementAuthorCard;
