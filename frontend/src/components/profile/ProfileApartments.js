import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText, IconButton, Button, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import { API_URL } from "../../config/config";

const ProfileApartments = ({ currentUser }) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ house: '', number: '' });
  const [houses, setHouses] = useState([]);
  const [maxApartment, setMaxApartment] = useState(null);
  const [apartmentsInHouse, setApartmentsInHouse] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Загрузка уникальных домов
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch(`${API_URL}/nearby/houses`);
        const data = await res.json();
        setHouses(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        setHouses([]);
      }
    };
    fetchHouses();
  }, []);

  // Загрузка максимального номера квартиры при выборе дома
  useEffect(() => {
    if (!addForm.house) {
      setMaxApartment(null);
      setApartmentsInHouse([]);
      return;
    }
    const fetchHouseData = async () => {
      try {
        const res = await fetch(`${API_URL}/nearby?house=${encodeURIComponent(addForm.house)}`);
        const data = await res.json();
        let maxNum = 1;
        let nums = [];
        if (Array.isArray(data.data) && data.data.length > 0) {
          nums = data.data.map(a => String(a.number));
          maxNum = Math.max(...data.data.map(a => Number(a.number) || 1));
        }
        setMaxApartment(maxNum);
        setApartmentsInHouse(nums);
      } catch (e) {
        setMaxApartment(null);
        setApartmentsInHouse([]);
      }
    };
    fetchHouseData();
  }, [addForm.house]);

  useEffect(() => {
    if (!currentUser?.user_id && !currentUser?.id_telegram) return;
    const id_telegram = currentUser.id_telegram || currentUser.user_id;
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/nearby/user/${id_telegram}`);
        const data = await res.json();
        setApartments(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError("Ошибка загрузки адресов");
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, [currentUser]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        
      </Box>
      <List>
        {apartments.map((apt) => (
          <ListItem
            key={apt.id}
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
              pendingDelete === apt.id ? (
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
                        const id_telegram = currentUser.id_telegram || currentUser.user_id;
                        const res = await fetch(`${API_URL}/nearby/unlink`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            id: apt.id,
                            id_telegram
                          })
                        });
                        if (!res.ok) throw new Error('Ошибка удаления');
                        const res2 = await fetch(`${API_URL}/nearby/user/${id_telegram}`);
                        const data2 = await res2.json();
                        setApartments(Array.isArray(data2.data) ? data2.data : []);
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
                  onClick={() => setPendingDelete(apt.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <Box sx={{ mr: 2, minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HomeIcon sx={{ fontSize: 32, color: '#1976d2' }} />
            </Box>
            <ListItemText
              primary={`Дом: ${apt.house}, Кв: ${apt.number}`}
              secondary={`Подъезд: ${apt.entrance}, Этаж: ${apt.floor}`}
            />
          </ListItem>
        ))}
      </List>
      {showAddForm && (
        <Box sx={{ mt: 3, mb: 1, p: 2, border: '1.5px dashed #1976d2', borderRadius: 2, background: 'background.paper', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Добавить адрес</Typography>
          <Box component="form" sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}
            onSubmit={async e => {
              e.preventDefault();
              if (!addForm.house || !addForm.number) return alert('Заполните все поля!');
              if (!apartmentsInHouse.includes(addForm.number)) {
                return alert('Такой квартиры нет в выбранном доме!');
              }
              setAddLoading(true);
              try {
                const id_telegram = currentUser.id_telegram || currentUser.user_id;
                const res = await fetch(`${API_URL}/nearby`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ house: addForm.house, number: addForm.number, id_telegram })
                });
                if (!res.ok) throw new Error('Ошибка добавления');
                setAddForm({ house: '', number: '' });
                setShowAddForm(false);
                setLoading(true);
                const res2 = await fetch(`${API_URL}/nearby/user/${id_telegram}`);
                const data2 = await res2.json();
                setApartments(Array.isArray(data2.data) ? data2.data : []);
              } catch (e) {
                alert(e.message);
              } finally {
                setAddLoading(false);
                setLoading(false);
              }
            }}
          >
            {/* Дом: только из списка */}
            <TextField
              label="Дом"
              select
              value={addForm.house}
              onChange={e => setAddForm(f => ({ ...f, house: e.target.value, number: '' }))}
              size="small"
              sx={{ flex: 1, minWidth: 100, height: 40, m: 1 }}
              required
              SelectProps={{ native: true }}
            >
              <option value="" disabled></option>
              {houses.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </TextField>
            {/* Квартира: число от 1 до maxApartment */}
            <TextField
              label="Квартира"
              type="text"
              value={addForm.number}
              onChange={e => setAddForm(f => ({ ...f, number: e.target.value }))}
              size="small"
              sx={{ flex: 1, minWidth: 100, height: 40, m: 1 }}
              required
              disabled={!addForm.house}
              helperText={addForm.house && maxApartment ? `от 1 до ${maxApartment}` : 'Сначала выберите дом'}
            />

            <Button type="submit" variant="contained" color="primary" disabled={addLoading} sx={{ minWidth: 110, height: 40, m: 1 }}>
              Добавить
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setShowAddForm(false)} sx={{ minWidth: 170, height: 40, m: 1 }}>Отмена</Button>
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Button variant={showAddForm ? 'outlined' : 'contained'} size="small" startIcon={<AddIcon />} onClick={() => setShowAddForm(v => !v)}>
          Добавить адрес
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileApartments;