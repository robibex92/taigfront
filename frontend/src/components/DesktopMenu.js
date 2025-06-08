import React, { useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Button,
  Skeleton,
  Container,
  Divider
} from '@mui/material';

const DesktopMenu = ({ categories, loading, onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Обработка клика по категории
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Сброс подкатегории при выборе новой категории
    onCategorySelect(category); // Передача выбранной категории родителю
  };

  // Обработка клика по подкатегории
  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onCategorySelect(selectedCategory, subcategory); // Передача выбранной подкатегории родителю
  };

  // Отображение загрузки категорий
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              p: 3,
              mb: 3
            }}
          >
            <Grid container spacing={2}>
              {[...Array(6)].map((_, index) => (
                <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={200} 
                    animation="wave" 
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            p: 3,
            mb: 3
          }}
        >
          <Grid container spacing={2}>
            {/* Категории */}
            <Grid item xs={12}>
              <Divider textAlign="left" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                  Категории
                </Typography>
              </Divider>
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item key={category.id} xs={6} sm={4} md={3} lg={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        height: 200,
                        padding: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 3
                        },
                        backgroundColor: selectedCategory?.id === category.id 
                          ? 'primary.main' 
                          : 'grey.200'
                      }}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {/* Изображение категории */}
                      {category.image && (
                        <Box
                          component="img"
                          src={category.image}
                          alt={category.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.7,
                            filter: 
                              selectedCategory?.id === category.id 
                                ? 'brightness(100%) contrast(110%)' 
                                : 'brightness(80%) contrast(90%)'
                          }}
                        />
                      )}
                      {/* Название категории */}
                      <Typography 
                        variant="h6" 
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          padding: 1,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        {category.name === 'ПРОДУКТЫ' ? 'ОБЪЯВЛЕНИЯ' : category.name}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Подкатегории */}
            {selectedCategory?.subcategories?.length > 0 && (
              <Grid item xs={12}>
                <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Подкатегории {selectedCategory.name}
                  </Typography>
                </Divider>
                <Grid container spacing={2}>
                  {selectedCategory.subcategories.map((subcategory) => (
                    <Grid item key={subcategory.id} xs={6} sm={4} md={3} lg={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          height: 100,
                          padding: 0,
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 2,
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: 3
                          },
                          backgroundColor: selectedSubcategory?.id === subcategory.id 
                            ? 'primary.main' 
                            : 'grey.200'
                        }}
                        onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        <Typography 
                          variant="subtitle1" 
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            padding: 1,
                            color: selectedSubcategory?.id === subcategory.id 
                              ? 'white' 
                              : 'text.primary',
                            textAlign: 'center'
                          }}
                        >
                          {subcategory.name}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default DesktopMenu;