import React, { memo } from "react";
import { Box, Typography, Collapse, Paper } from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';
import MessageDialog from '../MessageDialog';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/config';
import { Snackbar, Alert } from '@mui/material';


const hasValidInfo = (apartment) => {
  return apartment && (
    (apartment.info && apartment.info.trim() !== "") ||
    apartment.id_telegram
  );
};

const getCardStyles = (type, { apartment, isSelected, isDarkMode }) => {
  const baseStyle = {
    width: { xs: "30px", sm: "40px" },
    height: { xs: "30px", sm: "40px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1,
    transition: "all 0.2s ease",
    fontSize: { xs: "12px", sm: "14px" },
    userSelect: "none",
    position: 'relative',
  };

  const colors = {
    dark: {
      empty: "rgba(66, 66, 66, 0.3)",
      noInfo: "rgba(66, 66, 66, 0.5)",
      selected: "#1a3f6b",
      border: "#555555",
      selectedBorder: "#4d90fe",
      text: "#ffffff",
    },
    light: {
      empty: "rgba(224, 224, 224, 0.3)",
      noInfo: "rgba(224, 224, 224, 0.5)",
      selected: "#e3f2fd",
      border: "#dddddd",
      selectedBorder: "#2196f3",
      text: "inherit",
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  switch (type) {
    case 'empty':
      return {
        ...baseStyle,
        backgroundColor: theme.empty,
        opacity: 0.5,
        cursor: "not-allowed",
        border: `1px dashed ${isDarkMode ? "rgba(102,102,102,0.5)" : "rgba(204,204,204,0.5)"}`,
        backgroundImage: `repeating-linear-gradient(45deg, \
          transparent, \
          transparent 5px, \
          ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 5px, \
          ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 10px)`
      };
    case 'no-info':
      return {
        ...baseStyle,
        backgroundColor: apartment?.facade_color 
          ? `${apartment.facade_color}80` 
          : theme.noInfo,
        opacity: 0.7,
        cursor: "default",
        border: `1px solid ${theme.border}`,
      };
    case 'with-info':
      return {
        ...baseStyle,
        backgroundColor: apartment?.facade_color || "#fff",
        opacity: 1,
        border: isSelected 
          ? `2px solid ${theme.selectedBorder}` 
          : `1px solid ${theme.border}`,
        cursor: "pointer",
        boxShadow: isSelected ? 2 : "none",
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 1
        }
      };
    default:
      return baseStyle;
  }
};

const ApartmentCard = memo(({ apartment, hasInfo, onShowInfo, isSelected, isDarkMode, isInfoOpen, infoText }) => {
  const { user, isAuthenticated } = useAuth();
  const [msgDialogOpen, setMsgDialogOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });


  const type = !apartment ? 'empty' 
    : !hasInfo ? 'no-info' 
    : 'with-info';

  const cardStyles = getCardStyles(type, { apartment, isSelected, isDarkMode });


  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Box>
        <Box
          onClick={() => {
            if (type === 'with-info' && hasInfo && onShowInfo) {
              if (isSelected) {
                onShowInfo(null); // Закрыть info
              } else {
                onShowInfo(apartment.id); // Открыть info
              }
            }
          }}
          sx={{
            ...cardStyles,
            position: 'relative',
          }}
        >
          <Typography 
            variant="body2"
            sx={{ 
              color: isDarkMode ? 'text.primary' : 'text.primary',
              fontWeight: isSelected ? 'bold' : 'normal'
            }}
          >
            {apartment?.number || ''}
          </Typography>
          {apartment?.id_telegram && (
  <TelegramIcon
    onClick={e => {
      e.stopPropagation();
      setMsgDialogOpen(true);
    }}
    sx={{
      position: 'absolute',
      top: '-12px',
      right: '-12px',
      color: '#0088cc',
      fontSize: 24,
      zIndex: 10,
      background: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      pointerEvents: 'auto',
    }}
  />
)}
          {hasInfo && (
  <span
    style={{
      position: 'absolute',
      bottom: '-12px',
      left: '-12px',
      zIndex: 10,
      color: '#1976d2',
      background: 'none',
      borderRadius: 0,
      width: 18,
      height: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      cursor: 'pointer',
    }}
    onClick={e => {
      e.stopPropagation();
      if (onShowInfo && apartment) onShowInfo(apartment.id);
    }}
    title="Подробнее"
  >i</span>
)}
        </Box>
      </Box>
      {/* Диалог отправки сообщения */}
      <MessageDialog
        open={msgDialogOpen}
        onClose={() => {
          setMsgDialogOpen(false);
        }}
        targetChatId={apartment?.id_telegram}
        contextType="apartment"
        contextData={{ number: apartment?.number }}
        isAuthenticated={isAuthenticated}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  );
});

ApartmentCard.displayName = 'ApartmentCard';

export default ApartmentCard;
