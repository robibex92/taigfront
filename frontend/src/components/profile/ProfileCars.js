import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, IconButton, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CarSVG from '../icons/CarSVG';
import { API_URL } from "../../config/config";
import { COLOR_MAP, getRussianColorName } from '../../utils/colorUtils';

const ProfileCars = ({ currentUser }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  // Получаем уникальные цвета для селектора
  const uniqueColors = Object.entries(COLOR_MAP)
    .filter(([name, hex], idx, arr) => {
      // Только русские и уникальные HEX
      return /^[а-я]/i.test(name) && arr.findIndex(([, h]) => h === hex) === idx;
    })
    .map(([name, hex]) => ({ name, hex }));

  const [addForm, setAddForm] = useState({ car_brand: '', car_model: '', car_number: '', car_color: '' }); // цвет не выбран по умолчанию
  const [addLoading, setAddLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!currentUser?.user_id) return;
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/cars/user/${currentUser.user_id}`);
        const data = await res.json();
        setCars(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError("Ошибка загрузки автомобилей");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [currentUser]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        
      </Box>
      <List>
        {cars.map((car) => (
          <ListItem
            key={car.id}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
              boxShadow: 'none',
              border: '1.5px solid transparent',
              '&:hover': {
                border: '1.5px solid #1976d2',
                boxShadow: 3,
                transform: 'scale(1.01)'
              },
              display: 'flex',
              alignItems: 'center',
            }}
            secondaryAction={
              pendingDelete === car.id ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => setPendingDelete(null)}
                    disabled={deleteLoading}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={async () => {
                      setDeleteLoading(true);
                      try {
                        const res = await fetch(`${API_URL}/cars/${car.id}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Ошибка удаления');
                        setCars(cars.filter(c => c.id !== car.id));
                        setPendingDelete(null);
                      } catch (e) {
                        alert(e.message);
                      } finally {
                        setDeleteLoading(false);
                      }
                    }}
                  >
                    Подтвердить удаление
                  </Button>
                </Box>
              ) : (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  sx={{ color: '#888', '&:hover': { color: '#d32f2f' } }}
                  onClick={() => setPendingDelete(car.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <Box sx={{ mr: 2, minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CarSVG width={32} height={32} fill={car.car_color || '#888888'} stroke="#222" angle={0} />
            </Box>
            <ListItemText
              primary={`Марка: ${car.car_brand}, Модель: ${car.car_model}`}
              secondary={`Госномер: ${car.car_number}`}
            />
          </ListItem>
        ))}
      </List>
      {showAddForm && (
        <Box sx={{ mt: 3, mb: 1, p: 2, border: '1.5px dashed #1976d2', borderRadius: 2, background: 'background.paper', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Добавить автомобиль</Typography>
          <Box component="form" sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}
            onSubmit={async e => {
              e.preventDefault();
              if (!addForm.car_color) return alert('Выберите цвет автомобиля!');
              setAddLoading(true);
              try {
                const res = await fetch(`${API_URL}/cars`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...addForm, user_id: currentUser.user_id })
                });
                if (!res.ok) throw new Error('Ошибка добавления');
                setAddForm({ car_brand: '', car_model: '', car_number: '', car_color: '' });
                setShowAddForm(false);
                // Обновить список
                setLoading(true);
                const res2 = await fetch(`${API_URL}/cars/user/${currentUser.user_id}`);
                const data2 = await res2.json();
                setCars(Array.isArray(data2.data) ? data2.data : []);
              } catch (e) {
                alert(e.message);
              } finally {
                setAddLoading(false);
                setLoading(false);
              }
            }}
          >
            <TextField label="Марка" value={addForm.car_brand} onChange={e => setAddForm(f => ({ ...f, car_brand: e.target.value }))} size="small" sx={{ flex: 1, minWidth: 120 }} required />
            <TextField label="Модель" value={addForm.car_model} onChange={e => setAddForm(f => ({ ...f, car_model: e.target.value }))} size="small" sx={{ flex: 1, minWidth: 120 }} required />
            <TextField label="Госномер" value={addForm.car_number} onChange={e => setAddForm(f => ({ ...f, car_number: e.target.value }))} size="small" sx={{ flex: 1, minWidth: 120 }} required />
            <FormControl sx={{ flex: 1, minWidth: 140, height: 40, justifyContent: 'center' }} required size="small">
              <InputLabel id="car-color-label" shrink={!!addForm.car_color}>Цвет</InputLabel>
              <Select
                labelId="car-color-label"
                value={addForm.car_color}
                label="Цвет"
                onChange={e => setAddForm(f => ({ ...f, car_color: e.target.value }))}
                displayEmpty
                notched
                renderValue={selected => {
                  if (!selected) return <span style={{ color: '#aaa' }}></span>;
                  const colorObj = uniqueColors.find(c => c.hex === selected);
                  return (
                    <span>
                      <span style={{ display: 'inline-block', width: 18, height: 18, background: selected, border: '1px solid #ccc', borderRadius: '50%', marginRight: 6, verticalAlign: 'middle' }} />
                      {colorObj ? colorObj.name.charAt(0).toUpperCase() + colorObj.name.slice(1) : selected}
                    </span>
                  );
                }}
                sx={{ height: 40 }}
              >
                <MenuItem value=""><em>Не выбран</em></MenuItem>
                {uniqueColors.map(({ name, hex }) => (
                  <MenuItem key={hex} value={hex}>
                    <Box sx={{ display: 'inline-block', width: 18, height: 18, background: hex, border: '1px solid #ccc', borderRadius: '50%', mr: 1, verticalAlign: 'middle' }} />
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" disabled={addLoading || !addForm.car_color} sx={{ minWidth: 110, height: 40 }}>
              Добавить
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowAddForm(false)} sx={{ minWidth: 170, height: 40 }}>Отмена</Button>
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Button variant={showAddForm ? 'outlined' : 'contained'} size="small" startIcon={<AddIcon />} onClick={() => setShowAddForm(v => !v)}>
        Добавить автомобиль
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileCars;