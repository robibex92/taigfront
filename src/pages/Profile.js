import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Box, Typography, Paper, Skeleton, CircularProgress } from "@mui/material";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileApartments from "../components/profile/ProfileApartments";
import ProfileCars from "../components/profile/ProfileCars";
import ProfileSnackbar from "../components/profile/ProfileSnackbar";
import ProfileDialog from "../components/profile/ProfileDialog";
import { useProfileData } from "../hooks/useProfileData";
import { useApartments } from "../hooks/useApartments";
import { useCars } from "../hooks/useCars";
import { useNotifications } from "../hooks/useNotifications";

const Profile = () => {
  const { user } = useAuth();
  const { currentUser, userData, isLoading: userLoading, updateUserName } = useProfileData(user);
  const { 
    apartments, 
    uniqueHouses, 
    addApartment, 
    deleteApartment, 
    isLoading: apartmentsLoading 
  } = useApartments(currentUser?.user_id);
  const { 
    cars, 
    setCars, 
    deleteCar, 
    isLoading: carsLoading 
  } = useCars(currentUser?.user_id);
  const { 
    snackbarOpen, 
    snackbarMessage, 
    snackbarSeverity, 
    showNotification, 
    hideNotification 
  } = useNotifications();

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    type: "",
    id: null
  });

  const handleSaveName = async (firstName, lastName) => {
    try {
      await updateUserName(firstName, lastName);
      showNotification('Имя успешно сохранено');
    } catch (error) {
      showNotification(error.message || 'Произошла ошибка при обновлении имени', 'error');
    }
  };

  const handleAddApartment = async (newApartmentData) => {
    try {
      await addApartment(newApartmentData);
      showNotification('Квартира успешно добавлена');
    } catch (error) {
      showNotification('Не удалось добавить квартиру', 'error');
    }
  };

  const handleDeleteApartment = async (id) => {
    try {
      await deleteApartment(id);
      showNotification('Квартира успешно удалена');
    } catch (error) {
      showNotification('Не удалось удалить квартиру', 'error');
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await deleteCar(id);
      showNotification('Автомобиль успешно удален');
    } catch (error) {
      showNotification('Не удалось удалить автомобиль', 'error');
    }
  };

  const renderDeleteConfirmDialog = () => (
    <ProfileDialog
      open={deleteConfirmDialog.open}
      title="Подтверждение удаления"
      content="Вы уверены, что хотите удалить этот элемент?"
      onConfirm={() => {
        if (deleteConfirmDialog.type === "apartment") {
          handleDeleteApartment(deleteConfirmDialog.id);
        } else if (deleteConfirmDialog.type === "car") {
          handleDeleteCar(deleteConfirmDialog.id);
        }
        setDeleteConfirmDialog({ open: false, type: "", id: null });
      }}
      onCancel={() => setDeleteConfirmDialog({ open: false, type: "", id: null })}
    />
  );

  if (!currentUser) {
    return (
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          {userLoading ? (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="h6" color="text.secondary">
              Пожалуйста, авторизуйтесь для просмотра профиля
            </Typography>
          )}
        </Box>
      </Container>
    );
  }

  const isLoading = userLoading || apartmentsLoading || carsLoading;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 1 }} />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
          {renderDeleteConfirmDialog()}
          <ProfileHeader 
            firstName={userData?.telegram_first_name || currentUser.first_name}
            lastName={userData?.telegram_last_name || currentUser.last_name}
            onSaveName={handleSaveName}
            currentUser={currentUser}
          />
          <ProfileApartments 
            apartments={apartments}
            uniqueHouses={uniqueHouses}
            onAddApartment={handleAddApartment}
            onEditApartment={() => {}}
            onDeleteApartment={(id) => setDeleteConfirmDialog({ open: true, type: "apartment", id })}
            currentUser={currentUser}
          />
          <ProfileCars 
            cars={cars}
            setCars={setCars}
            onAddCar={() => {}}
            onEditCar={() => {}}
            onDeleteCar={(id) => setDeleteConfirmDialog({ open: true, type: "car", id })}
            currentUser={currentUser}
          />
          <ProfileSnackbar 
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={hideNotification}
          />
        </Paper>
      )}
    </Container>
  );
};

export default Profile;