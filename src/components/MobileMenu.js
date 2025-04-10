import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Collapse, 
  IconButton
} from '@mui/material';
import { 
  ExpandLess, 
  ExpandMore, 
  Menu as MenuIcon 
} from '@mui/icons-material';

const MobileMenu = ({ categories, loading, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryToggle = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategorySelect = (category, subcategory = null) => {
    onCategorySelect(category, subcategory);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <IconButton 
        edge="start" 
        color="inherit" 
        aria-label="menu" 
        sx={{ 
          position: 'fixed', 
          top: 10, 
          left: 10, 
          zIndex: 1200 
        }}
      >
        <MenuIcon />
      </IconButton>
    );
  }

  return (
    <>
      <IconButton 
        edge="start" 
        color="inherit" 
        aria-label="menu" 
        onClick={toggleDrawer}
        sx={{ 
          position: 'fixed', 
          top: 10, 
          left: 10, 
          zIndex: 1200 
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer}
      >
        <List sx={{ width: 250 }}>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <ListItem 
                button 
                onClick={() => {
                  handleCategoryToggle(category.id);
                  handleCategorySelect(category);
                }}
              >
                <ListItemText primary={category.name} />
                {category.subcategories.length > 0 && (
                  openCategories[category.id] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItem>

              <Collapse 
                in={openCategories[category.id]} 
                timeout="auto" 
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {category.subcategories.map((subcategory) => (
                    <ListItem 
                      key={subcategory.id} 
                      button 
                      sx={{ pl: 4 }}
                      onClick={() => handleCategorySelect(category, subcategory)}
                    >
                      <ListItemText primary={subcategory.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default MobileMenu;
