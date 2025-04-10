import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileApartments = ({ 
  apartments = [], 
  onAddApartment, 
  onDeleteApartment,
  currentUser,
  uniqueHouses = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState(() => {
    const savedState = localStorage.getItem('apartmentsAccordionState');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showAddApartmentForm, setShowAddApartmentForm] = useState(false);
  const [newApartment, setNewApartment] = useState({
    house: '',
    number: '',
  });
  const [numberError, setNumberError] = useState(false);

  useEffect(() => {
    localStorage.setItem('apartmentsAccordionState', JSON.stringify(expanded));
  }, [expanded]);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    
    // Разрешаем только цифры и проверяем диапазон
    if (value === '' || ((/^\d+$/.test(value) && numValue >= 1 && numValue <= 515))) {
      setNewApartment(prev => ({ ...prev, number: value }));
      setNumberError(false);
    } else {
      setNumberError(true);
    }
  };

  const handleAddApartment = () => {
    const numValue = parseInt(newApartment.number, 10);
    if (
      onAddApartment && 
      newApartment.house && 
      newApartment.number && 
      numValue >= 1 && 
      numValue <= 515
    ) {
      onAddApartment(newApartment);
      setNewApartment({ house: '', number: '' });
      setShowAddApartmentForm(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      
      <Accordion 
        expanded={expanded} 
        onChange={handleChange}
        sx={{ 
          '& .MuiAccordionSummary-root': { 
            paddingRight: 0 
          } 
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="apartments-content"
          id="apartments-header"
          sx={{ 
            '& .MuiAccordionSummary-content': { 
              display: 'flex', 
              alignItems: 'center',
              width: '100%'
            }
          }}
        >
          <Typography variant="h6">Список ваших квартир</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {apartments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              У вас пока нет добавленных квартир
            </Typography>
          ) : (
            <Grid container spacing={2} direction="column">
              {apartments.map((apartment, index) => (
                <Grid item xs={12} key={apartment.id}>
                  <Paper 
                    elevation={1}
                    sx={{ 
                      p: 2,
                      mb: 2,
                      position: 'relative',
                      backgroundColor: isDarkMode ? 'background.paper' : '#fff',
                      borderRadius: 2,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      },
                      opacity: apartment.status === false ? 0.5 : 1,
                      border: '2px dashed', // Стиль рамки для неактивного состояния
                      borderColor: 'text.secondary'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                      <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                      }}>
                        <HomeIcon sx={{ color: 'grey.500' }} />
                        <Typography>
                          <strong>Дом:</strong> {apartment.house}
                        </Typography>
                        <Typography>
                          <strong>Квартира:</strong> {apartment.number}
                        </Typography>
                        <Typography>
                          <strong>Подъезд:</strong> {apartment.entrance}
                        </Typography>
                        <Typography>
                          <strong>Этаж:</strong> {apartment.floor}
                        </Typography>
                        {apartment.status === false && (
                          <Typography 
                            component="span" 
                            sx={{ 
                              color: 'warning.main', 
                              fontWeight: 'bold',
                              width: '100%' 
                            }}
                          >
                            (На проверке)
                          </Typography>
                        )}
                      </Box>

                      {/* Delete Button */}
                      <Box 
                        sx={{ 
                          width: 50,
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.grey[200],
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                          '&:hover': {
                            backgroundColor: theme.palette.error.light,
                          }
                        }}
                        onClick={() => onDeleteApartment(apartment.id)}
                      >
                        <IconButton>
                          <DeleteIcon sx={{ color: theme.palette.common.black }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          
          {!showAddApartmentForm ? (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddApartmentForm(true)}
              sx={{ mt: 2 }}
              fullWidth
            >
              Добавить квартиру
            </Button>
            </Box>
          ) : (
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              alignItems: 'center', 
              gap: 2, 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: 2,
              p: 2
            }}>
              <FormControl 
                sx={{ 
                  flexGrow: 1, 
                  width: isMobile ? '100%' : 'auto',
                  marginBottom: isMobile ? 2 : 0
                }}
              >
                <InputLabel>Дом</InputLabel>
                <Select
                  value={newApartment.house}
                  label="Дом"
                  onChange={(e) => setNewApartment(prev => ({ ...prev, house: e.target.value }))}
                  fullWidth={isMobile}
                >
                  {uniqueHouses.length > 0 ? (
                    uniqueHouses.map((house) => (
                      <MenuItem key={house} value={house}>
                        {house}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Нет доступных домов</MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                label="Номер квартиры"
                variant="outlined"
                type="number"
                value={newApartment.number}
                onChange={handleNumberChange}
                error={numberError}
                helperText={numberError ? "Введите число от 1 до 515" : ""}
                fullWidth={isMobile}
                sx={{ 
                  width: isMobile ? '100%' : 'auto',
                  marginBottom: isMobile ? 2 : 0
                }}
              />
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                width: isMobile ? '100%' : 'auto',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddApartment}
                  fullWidth={isMobile}
                >
                  Добавить
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => setShowAddApartmentForm(false)}
                  fullWidth={isMobile}
                >
                  Отмена
                </Button>
              </Box>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ProfileApartments;
