import React, { useState, useEffect } from "react";
import { Box, Chip, Typography, CircularProgress, Button, Drawer, useMediaQuery, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { categoryApi } from "../../services/categoryApi";

const CategorySelector = ({
  onCategorySelect = () => {}, // Значение по умолчанию
  onReset = () => {}, // Значение по умолчанию
  selectedCategory: externalSelectedCategory = null, // Принимаем выбранные значения извне
  selectedSubcategory: externalSelectedSubcategory = null
}) => {
  // Закрытие и сброс состояния выбора в мобильном меню
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setMobileStep('categories');
    setMobileSelectedCategory(null);
    setMobileSelectedSubcategory(null);
    onCategorySelect(null, null); // Сброс внешнего фильтра
  };

  // Для бургер-меню
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileStep, setMobileStep] = useState('categories'); // 'categories' | 'subcategories'
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState(null);
  const [mobileSelectedSubcategory, setMobileSelectedSubcategory] = useState(null);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Локальные состояния для выбранных значений
  const [selectedCategory, setSelectedCategory] = useState(
    externalSelectedCategory
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    externalSelectedSubcategory
  );

  // Синхронизация внешних и внутренних состояний
  useEffect(() => {
    setSelectedCategory(externalSelectedCategory);
    setSelectedSubcategory(externalSelectedSubcategory);
  }, [externalSelectedCategory, externalSelectedSubcategory]);

  // Если выбрана категория (в том числе при открытии), подгружаем подкатегории
  useEffect(() => {
    const fetchSubcats = async () => {
      if (selectedCategory && selectedCategory.id) {
        setLoading(true);
        try {
          const response = await categoryApi.getSubcategories(selectedCategory.id);
          setSubcategories(response.subcategories);
          // Если извне пришла подкатегория, выставляем её, иначе сбрасываем
          if (externalSelectedSubcategory) {
            const found = response.subcategories.find(s => s.id === externalSelectedSubcategory.id);
            setSelectedSubcategory(found || null);
          } else {
            setSelectedSubcategory(null);
          }
        } catch (error) {
          setSubcategories([]);
          setSelectedSubcategory(null);
        } finally {
          setLoading(false);
        }
      } else {
        setSubcategories([]);
        setSelectedSubcategory(null);
      }
    };
    fetchSubcats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?.id]);

  // Получение всех категорий
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryApi.getAll();
        setCategories(response);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
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
      onCategorySelect(category, null); // Передаем выбранную категорию
    } catch (error) {
      console.error("Ошибка при загрузке подкатегорий:", error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка клика по подкатегории
  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    onCategorySelect(selectedCategory, subcategory); // Передаем выбранную подкатегорию
  };

  return (
    <Box>
      {isMobile ? (
        <>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => {
              setDrawerOpen(true);
              // Если уже есть выбранная категория — сразу показываем подкатегории, иначе категории
              if (selectedCategory) {
                setMobileStep('subcategories');
                setMobileSelectedCategory(selectedCategory);
                setMobileSelectedSubcategory(selectedSubcategory);
              } else {
                setMobileStep('categories');
                setMobileSelectedCategory(null);
                setMobileSelectedSubcategory(null);
              }
            }}
          >
            Выбрать категорию
          </Button>
          <Drawer
            anchor="top"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            PaperProps={{ sx: { borderRadius: 0, p: 0, minHeight: '100vh', maxHeight: '100vh', bgcolor: '#fff' } }}
            transitionDuration={300}
          >
            <Box sx={{ width: '100vw', minHeight: '100vh', p: 0, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', minHeight: 56 }}>
                {mobileStep === 'subcategories' && (
                  <IconButton onClick={() => setMobileStep('categories')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>
                  {mobileStep === 'categories' ? 'Выберите категорию' : mobileSelectedCategory?.name || 'Подкатегории'}
                </Typography>
                <IconButton onClick={handleCloseDrawer} sx={{ ml: 1 }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1, p: 2, minHeight: 0 }}>
                <Box sx={{
                  width: '100%',
                  maxHeight: 'calc(100vh - 56px - 24px)', // 56px header, 24px запас
                  minHeight: 120,
                  overflowY: 'auto',
                  pr: 1
                }}>
                  {loading && categories.length === 0 ? (
                    <CircularProgress size={32} sx={{ display: 'block', mx: 'auto', my: 4 }} />
                  ) : (
                    <>
                      {mobileStep === 'categories' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {categories.map((cat) => (
                            <Button
                              key={cat.id}
                              variant={mobileSelectedCategory?.id === cat.id ? 'contained' : 'outlined'}
                              color={mobileSelectedCategory?.id === cat.id ? 'primary' : 'inherit'}
                              sx={{ mb: 1, py: 1, fontSize: 16, borderRadius: 1, textAlign: 'left', justifyContent: 'flex-start', fontWeight: 500, wordBreak: 'break-word', maxWidth: 160 }}
                              onClick={async () => {
                                setMobileSelectedCategory(cat);
                                setMobileSelectedSubcategory(null);
                                setMobileStep('subcategories');
                                setLoading(true);
                                try {
                                  const response = await categoryApi.getSubcategories(cat.id);
                                  setSubcategories(response.subcategories);
                                } catch (error) {
                                  setSubcategories([]);
                                } finally {
                                  setLoading(false);
                                }
                              }}
                            >
                              {cat.name}
                            </Button>
                          ))}
                        </Box>
                      )}
                      {mobileStep === 'subcategories' && (
                        <>
                          {subcategories.length === 0 ? (
                            <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>Нет подкатегорий</Typography>
                          ) : (
                            subcategories.map((sub) => (
                              <Button
                                key={sub.id}
                                fullWidth
                                variant={mobileSelectedSubcategory?.id === sub.id ? 'contained' : 'outlined'}
                                color={mobileSelectedSubcategory?.id === sub.id ? 'primary' : 'inherit'}
                                sx={{ mb: 1, py: 1, fontSize: 16, borderRadius: 1, textAlign: 'left', justifyContent: 'flex-start', fontWeight: 500 }}
                                onClick={() => {
                                  setMobileSelectedSubcategory(sub);
                                }}
                              >
                                {sub.name}
                              </Button>
                            ))
                          )}
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Box>
              {/* Нижние кнопки управления */}
              {mobileStep === 'subcategories' && (
                <Box sx={{ p: 2, display: 'flex', gap: 2, borderTop: '1px solid #eee', bgcolor: '#fff', position: 'sticky', bottom: 0, left: 0, right: 0 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    sx={{ py: 1, fontSize: 16, borderRadius: 1, fontWeight: 500 }}
                    onClick={() => setMobileStep('categories')}
                  >
                    Назад
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ py: 1, fontSize: 16, borderRadius: 1, fontWeight: 500 }}
                    disabled={!mobileSelectedCategory}
                    onClick={() => {
                      // Применить выбранное
                      onCategorySelect(mobileSelectedCategory, mobileSelectedSubcategory);
                      setDrawerOpen(false);
                      setMobileStep('categories');
                    }}
                  >
                    Применить
                  </Button>
                </Box>
              )}
            </Box>
          </Drawer>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Категории
          </Typography>

          {loading && categories.length === 0 ? (
            <CircularProgress size={24} />
          ) : (
            <>
              {/* Категории */}
              {(() => {
                function chunkArray(array, chunkSize) {
                  const result = [];
                  for (let i = 0; i < array.length; i += chunkSize) {
                    result.push(array.slice(i, i + chunkSize));
                  }
                  return result;
                }
                const categoriesPerRow = 6;
                const rows = chunkArray(categories, categoriesPerRow);
                return (
                  <>
                    {rows.map((row, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 1,
                          flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                        }}
                      >
                        {row.map((cat) => (
                          <Chip
                            key={cat.id}
                            label={cat.name}
                            onClick={() => handleCategoryClick(cat)}
                            color={selectedCategory?.id === cat.id ? "primary" : "default"}
                            variant={selectedCategory?.id === cat.id ? "filled" : "outlined"}
                            sx={{ wordBreak: 'break-word', maxWidth: 160 }}
                          />
                        ))}
                      </Box>
                    ))}
                  </>
                );
              })()}

              {/* Подкатегории */}
              {selectedCategory && subcategories.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Подкатегории
                  </Typography>
                  {(() => {
                    function chunkArray(array, chunkSize) {
                      const result = [];
                      for (let i = 0; i < array.length; i += chunkSize) {
                        result.push(array.slice(i, i + chunkSize));
                      }
                      return result;
                    }
                    const subcategoriesPerRow = 6;
                    const rows = chunkArray(subcategories, subcategoriesPerRow);
                    return (
                      <>
                        {rows.map((row, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              gap: 1,
                              mb: 1,
                              flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {row.map((sub) => (
                              <Chip
                                key={sub.id}
                                label={sub.name}
                                onClick={() => handleSubcategoryClick(sub)}
                                color={selectedSubcategory?.id === sub.id ? "primary" : "default"}
                                variant={selectedSubcategory?.id === sub.id ? "filled" : "outlined"}
                                sx={{ wordBreak: 'break-word', maxWidth: 160 }}
                              />
                            ))}
                          </Box>
                        ))}
                      </>
                    );
                  })()}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default CategorySelector;
