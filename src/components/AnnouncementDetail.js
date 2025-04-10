import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import ImageGallery from "./ImageGallery";

export const AnnouncementTitle = ({
  title,
  isOwner,
  isAdmin,
  onEdit,
  onDelete,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      mb: 2,
    }}
  >
    <Typography variant="h4" component="h1">
      {title}
    </Typography>
    {(isOwner || isAdmin) && (
      <Box>
        <IconButton onClick={onEdit} color="primary" size="large">
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} color="error" size="large">
          <DeleteIcon />
        </IconButton>
      </Box>
    )}
  </Box>
);

export const AnnouncementImageSection = ({
  images,
  isOwner,
  onImageDelete,
}) => (
  <Box sx={{ mb: 3 }}>
    <ImageGallery
      images={images}
      canDelete={isOwner}
      onDelete={onImageDelete}
    />
  </Box>
);

export const AnnouncementContent = ({
  description,
  categoryName,
  subcategoryName,
  viewCount,
  createdAt,
}) => (
  <Stack spacing={3}>
    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
      {description}
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {categoryName && <Chip label={categoryName} color="primary" />}
      {subcategoryName && <Chip label={subcategoryName} />}
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        color: "text.secondary",
      }}
    >
      <Typography variant="body2">{createdAt}</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <VisibilityIcon fontSize="small" />
        <Typography variant="body2">{viewCount} просмотров</Typography>
      </Box>
    </Box>
  </Stack>
);

export const AnnouncementAuthorCard = ({ user, onUserView, onMessage }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar src={user.avatar} alt={user.name} />
        <Box>
          <Typography variant="h6" component="div">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role === true ? "Администратор" : "Пользователь"}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="outlined"
        startIcon={<MessageIcon />}
        onClick={onMessage}
        fullWidth
      >
        Написать сообщение
      </Button>
      <Button
        variant="text"
        onClick={() => onUserView(user)}
        fullWidth
        sx={{ mt: 1 }}
      >
        Все объявления автора
      </Button>
    </CardContent>
  </Card>
);

export const AnnouncementPrice = ({ price, onContact }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          {formatPrice(price)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<MessageIcon />}
          onClick={onContact}
          fullWidth
        >
          Связаться с продавцом
        </Button>
      </CardContent>
    </Card>
  );
};

// Основной компонент
const AnnouncementDetail = ({
  announcement,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "archived":
        return "default";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Активное";
      case "archived":
        return "В архиве";
      case "draft":
        return "Черновик";
      default:
        return status;
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <Box>
      <Stack spacing={3}>
        <AnnouncementTitle
          title={announcement.title}
          isOwner={showActions}
          isAdmin={false}
          onEdit={() => onEdit(announcement)}
          onDelete={handleDeleteClick}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={getStatusLabel(announcement.status)}
            color={getStatusColor(announcement.status)}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(announcement.created_at), "dd MMMM yyyy", {
              locale: ru,
            })}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {announcement.views || 0} просмотров
            </Typography>
          </Box>
        </Box>

        <Divider />

        <AnnouncementPrice price={announcement.price} onContact={() => {}} />

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {announcement.description}
        </Typography>

        {announcement.images?.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Фотографии
            </Typography>
            <ImageGallery images={announcement.images} canDelete={false} />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default AnnouncementDetail;
