import React, { memo } from "react";
import { Box, Typography, Collapse, Paper } from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';
import TelegramMessageDialog from '../TelegramMessageDialog';

const hasValidInfo = (apartment) => {
  return apartment && 
    (
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
        backgroundImage: `repeating-linear-gradient(45deg, 
          transparent, 
          transparent 5px, 
          ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 5px, 
          ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 10px)`,
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
        backgroundColor: apartment?.facade_color || "#FFFFFF",
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

const ApartmentCard = memo(({ apartment, onClick, isSelected, isDarkMode }) => {
  const type = !apartment ? 'empty' 
    : !hasValidInfo(apartment) ? 'no-info' 
    : 'with-info';

  const cardStyles = getCardStyles(type, { apartment, isSelected, isDarkMode });

  const [isTelegramModalOpen, setIsTelegramModalOpen] = React.useState(false);

  const handleTelegramClick = (e) => {
    e.stopPropagation();
    setIsTelegramModalOpen(true);
  };

  const handleTelegramModalClose = () => {
    setIsTelegramModalOpen(false);
  };

  return (
    <Box>
      <Box
        onClick={() => type === 'with-info' && onClick(apartment)}
        sx={cardStyles}
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
            size="small"
            sx={{
              position: 'absolute',
              top: '-8px',  // Поднимаем выше
              right: '-8px', // Ближе к углу
              zIndex: 10,
              color: '#0088cc', // Цвет Telegram
              padding: '2px',
              '&:hover': {
                backgroundColor: 'transparent', // Прозрачный фон при наведении
              }
            }}
            onClick={handleTelegramClick}
          />
        )}
      </Box>

      <Collapse in={isSelected} timeout="auto">
        {isSelected && apartment?.info && (
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              mt: 1,
              backgroundColor: isDarkMode ? 'background.paper' : 'background.default',
              color: isDarkMode ? 'text.primary' : 'text.primary',
              width: { xs: '200px', sm: '250px' },
              position: 'absolute',
              zIndex: 1000,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Typography variant="body2">
              {apartment.info}
            </Typography>
          </Paper>
        )}
      </Collapse>
      {apartment?.id_telegram && (
        <TelegramMessageDialog 
          open={isTelegramModalOpen}
          onClose={handleTelegramModalClose}
          onSend={(message, recipientId) => {
            console.log(`Сообщение отправлено: ${message} для квартиры ${apartment.number}`);
            handleTelegramModalClose();
          }}
          recipientId={apartment.id_telegram}
          contextType="apartment"
          contextId={apartment.id}
          recipientName={`жильцу квартиры №${apartment.number}`}
          announcementTitle={`№${apartment.number}`}
        />
      )}
    </Box>
  );
});

ApartmentCard.displayName = 'ApartmentCard';

export default ApartmentCard;
