import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";

const ViewAndSortControls = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortModeChange, // Изменено здесь
  isMobile = false,
}) => {
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  const handleSortByChange = (event) => {
    onSortModeChange(event.target.value); // Изменено здесь
  };

  const sortOptions = [
    { value: "newest", label: "Сначала новые" },
    { value: "oldest", label: "Сначала старые" },
    { value: "cheapest", label: "Сначала дешевле" },
    { value: "mostExpensive", label: "Сначала дороже" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 2 : 0,
      }}
    >
      {/* Переключатель вида: сетка / список */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="view mode"
        size="small"
      >
        <ToggleButton value="grid" aria-label="grid view">
          <GridViewIcon />
        </ToggleButton>
        <ToggleButton value="list" aria-label="list view">
          <ListIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Селектор сортировки */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Сортировка</InputLabel>
        <Select
          value={sortBy || "newest"} // Если sortBy undefined, используем "newest"
          onChange={handleSortByChange}
          label="Сортировка"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ViewAndSortControls;
