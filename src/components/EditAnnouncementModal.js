import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dialog,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { announcementApi } from '../api/announcementApi';
import { updateAnnouncementInTelegram } from '../utils/telegramUpdateService';
import { deleteAnnouncementFromTelegram } from '../utils/telegramDeletionService';
import { useNavigate } from 'react-router-dom';
import AnnouncementForm from './common/AnnouncementForm';

// Вспомогательная функция для сравнения массивов
const areArraysEqual = (arr1, arr2) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

const EditAnnouncementModal = ({ 
  isOpen, 
  onClose, 
  initialAnnouncement = null,
  onUpdated
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    status: 'active',
    category: '',
    location: '',
    contact: ''
  });
  const [priceNotSpecified, setPriceNotSpecified] = useState(false);
  const [images, setImages] = useState(
    initialAnnouncement?.ad_images?.map(img => img.image_url) || []
  );
  const [mainImageIndex, setMainImageIndex] = useState(
    initialAnnouncement?.ad_images?.findIndex(img => img.is_main) || 0
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtendDisabled, setIsExtendDisabled] = useState(true);

  // Сохраняем начальные значения для сравнения
  const initialValues = useMemo(() => {
    if (!initialAnnouncement) return {
      title: '',
      description: '',
      price: '',
      status: 'active',
      category: '',
      location: '',
      contact: '',
      images: [],
      mainImageIndex: 0
    };

    return {
      title: initialAnnouncement.title || '',
      description: initialAnnouncement.description || '',
      price: initialAnnouncement.price || '',
      status: initialAnnouncement.status || 'active',
      category: initialAnnouncement.category || '',
      location: initialAnnouncement.location || '',
      contact: initialAnnouncement.contact || '',
      images: initialAnnouncement.ad_images?.map(img => img.image_url) || [],
      mainImageIndex: initialAnnouncement.ad_images?.findIndex(img => img.is_main) || 0
    };
  }, [initialAnnouncement]);

  // Проверяем, были ли изменения
  const hasChanges = useMemo(() => {
    if (!initialAnnouncement) return false;

    const currentPrice = priceNotSpecified ? 'Не указано' : formData.price.replace(/\s/g, '');
    const initialPrice = initialValues.priceNotSpecified ? 'Не указано' : initialValues.price.replace(/\s/g, '');

    return formData.title !== initialValues.title ||
           formData.description !== initialValues.description ||
           currentPrice !== initialPrice ||
           formData.status !== initialValues.status ||
           formData.category !== initialValues.category ||
           formData.location !== initialValues.location ||
           formData.contact !== initialValues.contact ||
           !areArraysEqual(images, initialValues.images) ||
           mainImageIndex !== initialValues.mainImageIndex;
  }, [
    formData.title, formData.description, formData.price, formData.status, 
    formData.category, formData.location, formData.contact, images, mainImageIndex, 
    initialValues, initialAnnouncement, priceNotSpecified
  ]);

  useEffect(() => {
    if (initialAnnouncement) {
      setFormData({
        title: initialAnnouncement.title || '',
        description: initialAnnouncement.description || '',
        price: initialAnnouncement.price || '',
        status: initialAnnouncement.status || 'active',
        category: initialAnnouncement.category || '',
        location: initialAnnouncement.location || '',
        contact: initialAnnouncement.contact || ''
      });
      setPriceNotSpecified(initialAnnouncement.price === 'Не указано');
      setImages(initialAnnouncement.ad_images?.map(img => img.image_url) || []);
      setMainImageIndex(initialAnnouncement.ad_images?.findIndex(img => img.is_main) || 0);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        status: 'active',
        category: '',
        location: '',
        contact: ''
      });
      setPriceNotSpecified(false);
      setImages([]);
      setMainImageIndex(0);
    }
  }, [initialAnnouncement]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedAnnouncement = await announcementApi.updateAnnouncement(initialAnnouncement.id, {
        ...formData,
        price: priceNotSpecified ? 'Не указано' : formData.price.replace(/\s/g, ''),
        status: formData.status,
        category: formData.category,
        location: formData.location,
        contact: formData.contact
      });
      await updateAnnouncementInTelegram(updatedAnnouncement);
      showSnackbar('Объявление успешно обновлено');
      if (onUpdated) {
        onUpdated(updatedAnnouncement);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении объявления:', error);
      showSnackbar('Не удалось обновить объявление', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      const updatedAnnouncement = await announcementApi.updateAnnouncement(initialAnnouncement.id, {
        ...initialAnnouncement,
        status: 'archived'
      });
      showSnackbar('Объявление перемещено в архив');
      if (onUpdated) {
        onUpdated(updatedAnnouncement);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка при архивации объявления:', error);
      showSnackbar('Не удалось архивировать объявление', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Сначала удаляем сообщения из Telegram
      await deleteAnnouncementFromTelegram(initialAnnouncement);

      // Затем удаляем объявление из базы данных
      await announcementApi.deleteAnnouncement(initialAnnouncement.id);

      showSnackbar('Объявление удалено');
      if (onUpdated) {
        onUpdated(initialAnnouncement.id);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка при удалении объявления:', error);
      showSnackbar('Не удалось удалить объявление', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtend = async () => {
    setIsLoading(true);
    try {
      const extendedDate = new Date();
      extendedDate.setDate(extendedDate.getDate() + 30); // Продлеваем на 30 дней

      const updatedAnnouncement = await announcementApi.updateAnnouncement(initialAnnouncement.id, {
        ...initialAnnouncement,
        expires_at: extendedDate.toISOString(),
        status: 'active' // Убеждаемся, что объявление активно
      });

      showSnackbar('Срок объявления продлен на 30 дней');
      if (onUpdated) {
        onUpdated(updatedAnnouncement);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка при продлении объявления:', error);
      showSnackbar('Не удалось продлить объявление', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClick = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие клика
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      onClick={handleDialogClick} // Добавляем обработчик клика
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 2, sm: 3 }
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Редактировать объявление</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <AnnouncementForm
          title={formData.title}
          setTitle={(value) => setFormData(prev => ({ ...prev, title: value }))}
          content={formData.description}
          setContent={(value) => setFormData(prev => ({ ...prev, description: value }))}
          price={formData.price}
          setPrice={(value) => setFormData(prev => ({ ...prev, price: value }))}
          priceNotSpecified={priceNotSpecified}
          setPriceNotSpecified={(value) => setPriceNotSpecified(value)}
          category={formData.category}
          setCategory={(value) => setFormData(prev => ({ ...prev, category: value }))}
          subcategory={''}
          setSubcategory={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
          images={images}
          setImages={(value) => setImages(value)}
          mainImageIndex={mainImageIndex}
          setMainImageIndex={(value) => setMainImageIndex(value)}
          maxImages={5}
          showSnackbar={showSnackbar}
          isLoading={isLoading}
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
          onSnackbarClose={handleSnackbarClose}
          isEdit={true}
          adId={initialAnnouncement?.id}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button 
            onClick={handleArchive} 
            color="warning" 
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            В архив
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            Удалить
          </Button>
          <Button 
            onClick={handleExtend} 
            color="success" 
            disabled={isLoading || isExtendDisabled}
          >
            Продлить
          </Button>
        </Box>
        <Box>
          <Button onClick={onClose} disabled={isLoading} sx={{ mr: 1 }}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isLoading || !hasChanges}
          >
            Сохранить
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditAnnouncementModal;