import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Accordion, AccordionSummary, AccordionDetails, Typography, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { API_URL } from '../../config/config';
import { categoryApi } from '../../services/categoryApi';

const CategorySelectionStep = ({ categories, setCategories, expandedCategory, setExpandedCategory, subcategory, setSubcategory }) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        const categoriesWithSubcategories = await Promise.all(
          response.map(async cat => {
            const subcats = await categoryApi.getSubcategories(cat.id || cat._id);
            return { ...cat, subcategories: subcats.subcategories };
          })
        );
        setCategories(categoriesWithSubcategories);
      } catch (err) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    setValue('category', category);
  };

  const handleSubcategoryClick = (subcat) => {
    setSubcategory(subcat);
    setValue('subcategory', subcat);
  };

  if (!categories.length) return <CircularProgress />;

  return (
    <>
      {categories.map((category) => (
        <Accordion key={category.id} expanded={expandedCategory?.id === category.id} onChange={() => handleCategoryClick(category)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{category.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Array.isArray(category.subcategories) && category.subcategories.length > 0 ? (
              category.subcategories.map((subcat) => (
                <Typography
                  key={subcat.id}
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    fontWeight: subcategory?.id === subcat.id ? 'bold' : 'normal',
                    color: subcategory?.id === subcat.id ? 'primary.main' : 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    userSelect: 'none',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    backgroundColor: subcategory?.id === subcat.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    transition: 'background 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.15)'
                    }
                  }}
                  onClick={() => handleSubcategoryClick(subcat)}
                >
                  {subcategory?.id === subcat.id && (
                    <span style={{ marginRight: 6, color: '#1976d2', fontSize: 18 }}>✓</span>
                  )}
                  {subcat.name}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: '#999', fontSize: 13 }}>Нет подкатегорий</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default CategorySelectionStep;