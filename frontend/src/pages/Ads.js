import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Pagination } from "@mui/material";
import CategorySelector from "../components/announcements/CategorySelector";
import ViewAndSortControls from "../components/announcements/ViewAndSortControls";
import AnnouncementList from "../components/announcements/AnnouncementList";
import { API_URL } from "../config/config"; // Путь к файлу конфигурации

const ADS_PER_PAGE = 20;

const Ads = () => {
  // Выбранные категории
  const [selectedCategory, setSelectedCategory] = useState(null); // Полный объект категории
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Полный объект подкатегории
  // Настройки отображения
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortMode, setSortMode] = useState("newest"); // 'newest' | 'oldest' | 'price-high' | 'price-low'
  // Состояние для загрузки и ошибок
  const [ads, setAds] = useState([]); // Объявления
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // Общее количество объявлений
  const [page, setPage] = useState(1); // Текущая страница

  // Функция для загрузки объявлений
  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Формируем параметры запроса
      const queryParams = [];
      if (selectedCategory) {
        queryParams.push(`category=${encodeURIComponent(selectedCategory.id)}`);
      }
      if (selectedSubcategory) {
        queryParams.push(
          `subcategory=${encodeURIComponent(selectedSubcategory.id)}`
        );
      }

      // Добавляем параметры сортировки
      const sortMapping = {
        newest: { field: "created_at", order: "DESC" },
        oldest: { field: "created_at", order: "ASC" },
        cheapest: { field: "price", order: "ASC" },
        mostExpensive: { field: "price", order: "DESC" },
      };

      if (sortMode && sortMapping[sortMode]) {
        const { field, order } = sortMapping[sortMode];
        queryParams.push(`sort=${encodeURIComponent(field)}`);
        queryParams.push(`order=${encodeURIComponent(order)}`);
      }

      // Пагинация
      const offset = (page - 1) * ADS_PER_PAGE;
      queryParams.push(`limit=${ADS_PER_PAGE}`);
      queryParams.push(`offset=${offset}`);

      // Формируем URL
      let url = `${API_URL}/ads?status=active`;
      if (queryParams.length > 0) {
        url += `&${queryParams.join("&")}`;
      }
      // Выполняем запрос
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setAds(data.data);
        setTotal(data.total || data.count || data.data.length); // total/count из API, fallback на длину
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем объявления при изменении фильтров или страницы
  useEffect(() => {
    fetchAds();
  }, [selectedCategory, selectedSubcategory, sortMode, page]);

  // Обработка сброса категорий
  const handleResetCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setPage(1);
  };

  // Обработка смены страницы
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Если загрузка
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Ошибка загрузки данных: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* 1. Категории и подкатегории */}
      <Box sx={{ marginBottom: 2 }}>
        <CategorySelector
          selectedCategory={selectedCategory} // Передаем полный объект категории
          selectedSubcategory={selectedSubcategory} // Передаем полный объект подкатегории
          onCategorySelect={(cat, sub) => {
            setSelectedCategory(cat); // Устанавливаем полный объект категории
            setSelectedSubcategory(sub); // Устанавливаем полный объект подкатегории
            setPage(1); // Сбросить на первую страницу при смене фильтра
          }}
          onReset={handleResetCategories}
        />
      </Box>

      {/* 2. Панель фильтров и вида */}
      <Box sx={{ marginBottom: 2 }}>
        <ViewAndSortControls
          viewMode={viewMode}
          onViewModeChange={setViewMode} // Передаем функцию обновления состояния
          sortMode={sortMode}
          onSortModeChange={setSortMode} // Передаем функцию обновления состояния
          isMobile={false}
        />
      </Box>

      {/* 3. Отображение объявлений */}
      <Box>
        {ads.length > 0 ? (
          <>
            <AnnouncementList
              ads={ads}
              viewMode={viewMode}
              onReset={handleResetCategories}
            />
            {/* Пагинация */}
            {total > ADS_PER_PAGE && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <Pagination
                  count={Math.ceil(total / ADS_PER_PAGE)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Нет доступных объявлений
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Ads;
