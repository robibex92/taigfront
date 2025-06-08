import React, { useRef, useCallback } from "react";
import { Typography, Box, Paper, Skeleton } from "@mui/material";
import ApartmentCard from "./ApartmentCard";

const ApartmentList = ({
  apartments = [],
  floor,
  isDarkMode,
  maxCellsPerFloor = 8,
  selectedApartmentId,
  onApartmentSelect,
  onShowInfo,
  selectedInfo
}) => {
  const containerRef = useRef(null);

  const handleApartmentClick = useCallback((apartmentId) => {
    onApartmentSelect && onApartmentSelect(apartmentId);
  }, [onApartmentSelect]);

  // apartments может быть массивом с null для пустых ячеек
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          mb: 2,
          color: isDarkMode ? "text.primary" : "inherit",
          fontWeight: "medium"
        }}
      >
        Этаж {floor}
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1
        }}
      >
        {apartments.map((apartment, index) => (
          <ApartmentCard
            key={apartment?.id || `empty-${index}`}
            apartment={apartment}
            hasInfo={apartment?.hasInfo}
            onShowInfo={onShowInfo}
            isSelected={selectedApartmentId === apartment?.id}
            isDarkMode={isDarkMode}
            // info-блок теперь не нужен в карточке
          />
        ))}
      </Box>
      {/* Info-блок под всеми ячейками этажа */}
      {selectedInfo && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 2,
            mx: 'auto',
            maxWidth: 350,
            textAlign: 'left',
            background: 'transparent',
            border: '1.5px solid rgba(40,40,40,0.7)', // dark semi-transparent border
            boxShadow: 'none',
          }}
        >
          {selectedInfo.loading ? (
            <Skeleton variant="rectangular" height={24} width={48} sx={{ borderRadius: 1, mb: 1 }} />
          ) : (
            <Typography variant="body2">{selectedInfo.text}</Typography>
          )}
        </Paper>
      )}
    </Paper>
  );
};

export default React.memo(ApartmentList);