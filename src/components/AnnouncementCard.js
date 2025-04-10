import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const AnnouncementCard = ({
  announcement,
  onEdit,
  onDelete,
  onView,
  showActions = true
}) => {
  // Функция для форматирования цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'archived':
        return 'default';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Функция для получения метки статуса
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Активное';
      case 'archived':
        return 'В архиве';
      case 'draft':
        return 'Черновик';
      default:
        return status;
    }
  };

  // Безопасный доступ к изображению (если оно есть)
  const imageUrl = announcement?.images?.[0]?.url || '/placeholder.jpg';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={announcement?.title || 'Объявление'}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {announcement?.title || 'Без названия'}
            </Typography>
            <Chip
              label={getStatusLabel(announcement?.status)}
              color={getStatusColor(announcement?.status)}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {announcement?.created_at ? format(new Date(announcement.created_at), 'dd MMMM yyyy', { locale: ru }) : 'Дата не указана'}
          </Typography>

          <Typography variant="h6" color="primary">
            {formatPrice(announcement?.price || 0)}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {announcement?.description || 'Описание не указано'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {announcement?.views || 0} просмотров
            </Typography>
          </Box>

          {showActions && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onView(announcement)}
                color="primary"
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onEdit(announcement)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(announcement)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
