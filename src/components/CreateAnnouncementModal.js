import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { TelegramCreationService } from '../utils/telegramCreationService';
import { LIST_TELEGRAM_CHATS } from '../config/telegramChats';
import AnnouncementForm from './common/AnnouncementForm';

const CreateAnnouncementModal = ({ 
  isOpen, 
  onClose, 
  onAnnouncementCreated, 
  currentUser 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [isPriceNotSpecified, setIsPriceNotSpecified] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [images, setImages] = useState([]);
  //const [images, setImages] = useState(['https://tp.sibroot.ru/uploads/image_1742745505236_3015.png','https://tp.sibroot.ru/uploads/image_1742744088521_5975.png']);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, username')
        .eq('username', currentUser.username)
        .single();

      if (userError || !userData) {
        console.error('User lookup error:', userError);
        showSnackbar('Не удалось определить пользователя', 'error');
        return;
      }

      const announcementData = {
        user_id: userData.user_id,
        title,
        content,
        price: isPriceNotSpecified ? null : Number(price),
        category: Number(category),
        subcategory: Number(subcategory),
        status: 'active',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ads')
        .insert(announcementData)
        .select();

      if (error) {
        console.error('Detailed announcement creation error:', error);
        showSnackbar(`Не удалось создать объявление: ${error.message}`, 'error');
        return;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from announcement insertion');
        showSnackbar('Не удалось создать объявление (пустой ответ)', 'error');
        return;
      }

      const announcementId = data[0].id;
      
      // Сохраняем изображения
      if (images.length > 0) {
        const imageInsertPromises = images.map(async (imageUrl, index) => {
          if (!imageUrl || !imageUrl.startsWith('https://tp.sibroot.ru/uploads/')) {
            console.error(`Некорректный URL изображения: ${imageUrl}`);
            return null;
          }

          const { error: imageError } = await supabase
            .from('ad_images')
            .insert({
              ad_id: announcementId,
              image_url: imageUrl,
              is_main: index === mainImageIndex
            });

          if (imageError) {
            console.error(`Ошибка сохранения изображения ${index + 1}:`, imageError);
            return null;
          }

          return imageUrl;
        });

        await Promise.all(imageInsertPromises);
      }

      // Отправляем в Telegram
      const messageText = await TelegramCreationService.generateAnnouncementText({
        title,
        content,
        price: isPriceNotSpecified ? 'Не указано' : price,
        category,
        subcategory,
        images,
        username: userData.username,
        user_id: userData.user_id,
        id: announcementId
      });

      // Используем список чатов для обновления объявлений
      const chatIds = LIST_TELEGRAM_CHATS.ANNOUNCEMENT_UPDATE.map(chat => chat.id);
      const threadIds = LIST_TELEGRAM_CHATS.ANNOUNCEMENT_UPDATE.map(chat => chat.threadId || null);

      await TelegramCreationService.sendMessage({
        message: messageText,
        chatIds,
        threadIds,
        photos: images,
        adId: announcementId,
        userId: userData.user_id
      });

      showSnackbar('Объявление успешно создано');
      if (onAnnouncementCreated) {
        onAnnouncementCreated(announcementId);
      }
      onClose();
    } catch (error) {
      console.error('Error creating announcement:', error);
      showSnackbar('Произошла ошибка при создании объявления', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Создать объявление
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <AnnouncementForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          price={price}
          setPrice={setPrice}
          isPriceNotSpecified={isPriceNotSpecified}
          setIsPriceNotSpecified={setIsPriceNotSpecified}
          category={category}
          setCategory={setCategory}
          subcategory={subcategory}
          setSubcategory={setSubcategory}
          images={images}
          setImages={setImages}
          mainImageIndex={mainImageIndex}
          setMainImageIndex={setMainImageIndex}
          maxImages={5}
          showSnackbar={showSnackbar}
          isLoading={isLoading}
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
          onSnackbarClose={handleSnackbarClose}
          isEdit={false}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAnnouncementModal;