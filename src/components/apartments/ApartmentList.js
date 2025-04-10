import React, { useRef, useCallback } from "react";
import { Typography, Box, Paper } from "@mui/material";
import ApartmentCard from "./ApartmentCard";

const ApartmentList = ({
  apartments,
  floor,
  isDarkMode,
  maxCellsPerFloor,
  selectedApartmentId,
  onApartmentSelect
}) => {
  const containerRef = useRef(null);

  const handleApartmentClick = useCallback((apartment) => {
    if (!apartment?.info?.trim()) return;
    onApartmentSelect(apartment.id);
  }, [onApartmentSelect]);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        mb: 3,
        p: 2,
        backgroundColor: 'transparent'
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
            onClick={handleApartmentClick}
            isSelected={selectedApartmentId === apartment?.id}
            isDarkMode={isDarkMode}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default React.memo(ApartmentList);
