import React, { useState } from "react";
import { Box } from "@mui/material";
import CategorySelector from "../components/announcements/CategorySelector";
import ViewAndSortControls from "../components/announcements/ViewAndSortControls";
import AnnouncementList from "../components/announcements/AnnouncementList";

const Announcements = () => {
  // Выбранные категории
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Настройки отображения
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortMode, setSortMode] = useState("newest"); // 'newest' | 'oldest' | 'price-high' | 'price-low'

  return (
    <Box>
      {/* 1. Категории и подкатегории */}
      <Box sx={{ marginBottom: 2 }}>
        <CategorySelector
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategorySelect={(cat, sub) => {
            setSelectedCategory(cat);
            setSelectedSubcategory(sub || null);
          }}
          onReset={() => {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
          }}
        />
      </Box>

      {/* 2. Панель фильтров и вида */}
      <Box sx={{ marginBottom: 2 }}>
        <ViewAndSortControls
          viewMode={viewMode}
          sortMode={sortMode}
          onViewModeChange={setViewMode}
          onSortModeChange={setSortMode}
        />
      </Box>

      {/* 3. Отображение объявлений */}
      <Box>
        <AnnouncementList
          category={selectedCategory}
          subcategory={selectedSubcategory}
          viewMode={viewMode}
          sortMode={sortMode}
        />
      </Box>
    </Box>
  );
};

export default Announcements;
