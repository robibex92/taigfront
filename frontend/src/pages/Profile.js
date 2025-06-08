import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
} from "@mui/material";
import ProfileApartments from "../components/profile/ProfileApartments";
import ProfileCars from "../components/profile/ProfileCars";
import UserProfileHeader from "../components/profile/UserProfileHeader";
import { updateUserProfile } from "../services/api"; // You'll need to create this API service

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const handleEditProfile = async (formData) => {
    try {
      setEditLoading(true);
      setEditError(null);
      // Call your API to update the user profile
      const updatedUser = await updateUserProfile(formData);
      // Update the user in the auth context
      updateUser(updatedUser.user);
    } catch (error) {
      setEditError(error.message || "Ошибка при обновлении профиля");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 6,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 6,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Пожалуйста, авторизуйтесь для просмотра профиля
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box elevation={3}>
      {/* 1. Аватар и имя пользователя */}
      <UserProfileHeader
        user={user}
        onEdit={handleEditProfile}
        loading={editLoading}
        error={editError}
      />

      {/* 2. Мои адреса */}
      <Divider textAlign="left" sx={{ my: 2 }}>
        Мои адреса
      </Divider>
      <ProfileApartments currentUser={user} />

      {/* 3. Мои автомобили */}
      <Divider textAlign="left" sx={{ my: 2 }}>
        Мои автомобили
      </Divider>
      <ProfileCars currentUser={user} />
    </Box>
  );
};

export default Profile;
