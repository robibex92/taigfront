import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  profileHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: theme.spacing(2),
  },
  userName: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  userInfo: {
    textAlign: "center",
    maxWidth: "80%",
    margin: "0 auto",
  },
  editButton: {
    marginTop: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

function UserProfileHeader({ user, onEdit, loading, error }) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.is_manually_updated
      ? user.telegram_first_name || ""
      : user.first_name || "",
    last_name: user.is_manually_updated
      ? user.telegram_last_name || ""
      : user.last_name || "",
    username: user.username || "",
    avatar: user.avatar || "",
    is_manually_updated: user.is_manually_updated || false,
  });

  const handleOpenDialog = () => {
    setFormData({
      first_name: user.is_manually_updated
        ? user.telegram_first_name || ""
        : user.first_name || "",
      last_name: user.is_manually_updated
        ? user.telegram_last_name || ""
        : user.last_name || "",
      username: user.username || "",
      avatar: user.avatar || "",
      is_manually_updated: user.is_manually_updated || false,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...formData,
      is_manually_updated: true,
      telegram_first_name: formData.first_name,
      telegram_last_name: formData.last_name,
    };
    await onEdit(updatedData);
    if (!error) {
      handleCloseDialog();
    }
  };

  // Определяем, какие поля имени и фамилии показывать
  const isManual =
    user.is_manually_updated === true || user.is_manually_updated === "true";
  const displayFirstName = isManual
    ? user.telegram_first_name
    : user.first_name;
  const displayLastName = isManual ? user.telegram_last_name : user.last_name;

  return (
    <Box className={classes.profileHeader}>
      <Avatar
        src={user.avatar}
        alt={`${displayFirstName} ${displayLastName}`}
        className={classes.avatar}
      />

      <Typography variant="h4" className={classes.userName}>
        {displayFirstName} {displayLastName}
      </Typography>

      <Typography variant="subtitle1" color="textSecondary">
        @{user.username}
      </Typography>

      <Button
        variant="outlined"
        color="primary"
        startIcon={<EditIcon />}
        className={classes.editButton}
        onClick={handleOpenDialog}
      >
        Редактировать профиль
      </Button>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="edit-profile-dialog"
      >
        <DialogTitle id="edit-profile-dialog">
          Редактировать профиль
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                name="first_name"
                label="Имя"
                fullWidth
                value={formData.first_name}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="last_name"
                label="Фамилия"
                fullWidth
                value={formData.last_name}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Имя пользователя"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="avatar"
                label="URL аватара"
                fullWidth
                value={formData.avatar}
                onChange={handleChange}
                className={classes.formField}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default UserProfileHeader;
