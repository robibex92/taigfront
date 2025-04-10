import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  CircularProgress
} from '@mui/material';
import { categoryApi } from '../../services/categoryApi';

const CategorySelector = ({ onCategorySelect, onReset }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Получение всех категорий
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryApi.getAll();
        setCategories(response);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Загрузка подкатегорий при выборе категории
  const handleCategoryClick = async (category) => {
    if (category.id === selectedCategory?.id) {
      // Повторный клик по выбранной категории — сброс
      setSelectedCategory(null);
      setSubcategories([]);
      setSelectedSubcategory(null);
      onReset();
      return;
    }

    setLoading(true);
    try {
      const response = await categoryApi.getSubcategories(category.id);
      setSelectedCategory(category);
      setSubcategories(response.subcategories);
      setSelectedSubcategory(null);
      onCategorySelect(category, null);
    } catch (error) {
      console.error('Ошибка при загрузке подкатегорий:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка клика по подкатегории
  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onCategorySelect(selectedCategory, subcategory);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Категории
      </Typography>

      {loading && categories.length === 0 ? (
        <CircularProgress size={24} />
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => handleCategoryClick(cat)}
              color={selectedCategory?.id === cat.id ? 'primary' : 'default'}
              variant={selectedCategory?.id === cat.id ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      )}

      {selectedCategory && subcategories.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Подкатегории
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {subcategories.map((sub) => (
              <Chip
                key={sub.id}
                label={sub.name}
                onClick={() => handleSubcategoryClick(sub)}
                color={selectedSubcategory?.id === sub.id ? 'primary' : 'default'}
                variant={selectedSubcategory?.id === sub.id ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CategorySelector;
