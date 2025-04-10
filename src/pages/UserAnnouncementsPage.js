import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { announcementApi } from '../services/apiService';
import AnnouncementList from '../components/announcements/AnnouncementList';
import AddAnnouncementDialog from '../components/AddAnnouncementDialog';
import EditAnnouncementDialog from '../components/EditAnnouncementDialog';

const UserAnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await announcementApi.getList({
        user_id: user.user_id,
        status: activeTab
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке объявлений:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddAnnouncement = async (data) => {
    try {
      await announcementApi.create({
        ...data,
        user_id: user.user_id,
        status: 'active'
      });
      setIsAddDialogOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Ошибка при создании объявления:', error);
      setError(error.message);
    }
  };

  const handleEditAnnouncement = async (data) => {
    try {
      await announcementApi.update(selectedAnnouncement.id, data);
      setIsEditDialogOpen(false);
      setSelectedAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Ошибка при обновлении объявления:', error);
      setError(error.message);
    }
  };

  const handleDeleteAnnouncement = async () => {
    try {
      await announcementApi.delete(selectedAnnouncement.id);
      setIsDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Ошибка при удалении объявления:', error);
      setError(error.message);
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>Пожалуйста, войдите в систему</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Мои объявления
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddDialogOpen(true)}
          sx={{ mb: 3 }}
        >
          Добавить объявление
        </Button>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab value="active" label="Активные" />
          <Tab value="archived" label="Архив" />
          <Tab value="draft" label="Черновики" />
        </Tabs>

        {loading ? (
          <Typography>Загрузка...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : announcements.length === 0 ? (
          <Typography>Нет объявлений</Typography>
        ) : (
          <AnnouncementList
            announcements={announcements}
            onEdit={(announcement) => {
              setSelectedAnnouncement(announcement);
              setIsEditDialogOpen(true);
            }}
            onDelete={(announcement) => {
              setSelectedAnnouncement(announcement);
              setIsDeleteDialogOpen(true);
            }}
          />
        )}

        <AddAnnouncementDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddAnnouncement}
        />

        {selectedAnnouncement && (
          <EditAnnouncementDialog
            open={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedAnnouncement(null);
            }}
            onSubmit={handleEditAnnouncement}
            announcement={selectedAnnouncement}
          />
        )}

        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedAnnouncement(null);
          }}
        >
          <DialogTitle>Удалить объявление?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedAnnouncement(null);
            }}>
              Отмена
            </Button>
            <Button onClick={handleDeleteAnnouncement} color="error">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserAnnouncementsPage;
