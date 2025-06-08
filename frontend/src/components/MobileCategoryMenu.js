import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Divider,
  Collapse
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as BackIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton'; // Добавлен импорт

const MobileCategoryMenu = ({ 
  categories, 
  loading, 
  onCategorySelect, 
  onClose 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  // Обработка клика по категории
  const handleCategoryClick = (category) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [category.id]: !prevState[category.id], // Переключаем состояние текущей категории
    }));
    setSelectedCategory(category); // Выбираем категорию
  };

  // Обработка клика по подкатегории
  const handleSubcategoryClick = (subcategory) => {
    onCategorySelect(selectedCategory, subcategory); // Передаем выбранную подкатегорию родителю
    onClose(); // Закрываем меню
  };

  // Рендеринг списка категорий
  const renderCategories = () => {
    if (loading) {
      return (
        <Box sx={{ padding: 2 }}>
          {[...Array(6)].map((_, index) => (
            <ListItem key={index}>
              <ListItemText>
                <Skeleton variant="text" width="80%" />
              </ListItemText>
            </ListItem>
          ))}
        </Box>
      );
    }

    return categories.map((category) => (
      <React.Fragment key={category.id}>
        {/* Категория */}
        <ListItem 
          button 
          onClick={() => handleCategoryClick(category)}
        >
          <ListItemText primary={category.name} />
          {category.subcategories && category.subcategories.length > 0 && (
            <IconButton size="small">
              {openCategories[category.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </ListItem>

        {/* Подкатегории */}
        {category.subcategories && category.subcategories.length > 0 && (
          <Collapse in={openCategories[category.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.subcategories.map((subcategory) => (
                <ListItem 
                  key={subcategory.id} 
                  button 
                  sx={{ pl: 4 }}
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <ListItemText primary={subcategory.name} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}

        <Divider />
      </React.Fragment>
    ));
  };

  return (
    <Drawer
      anchor="top"
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '100vh',
          width: '100%',
        },
      }}
    >
      <Box>
        {/* Заголовок */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 2,
          position: 'relative',
        }}>
          <Typography variant="h6">
            {selectedCategory 
              ? selectedCategory.name 
              : 'Все категории'}
          </Typography>
          {/* Кнопка "Назад" или "Закрыть" */}
          {selectedCategory ? (
            <IconButton 
              onClick={() => setSelectedCategory(null)} 
              sx={{ position: 'absolute', right: 16 }}
            >
              <BackIcon />
            </IconButton>
          ) : (
            <IconButton 
              onClick={onClose} 
              sx={{ position: 'absolute', right: 16 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Список категорий */}
        <List>
          {renderCategories()}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileCategoryMenu;