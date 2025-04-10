import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  useTheme,
  Typography,
  Paper,
  Container,
  Divider,
  Collapse,
  styled,
  CircularProgress
} from "@mui/material";
import { fetchHouses, fetchApartmentsByEntrance, fetchFloorRules } from "../api/api";

// Ленивая загрузка компонента списка квартир
const ApartmentList = React.lazy(() => import("../components/apartments/ApartmentList"));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  margin: theme.spacing(1),
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#fff",
}));

const HelloNeighbor = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedEntrance, setSelectedEntrance] = useState("");
  const [apartments, setApartments] = useState([]);
  const [floorRules, setFloorRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);

  // Мемоизированные вычисления
  const currentHouse = useMemo(() => {
    return houses.find(h => h.house === selectedHouse);
  }, [houses, selectedHouse]);

  const entrances = useMemo(() => {
    if (!currentHouse?.entrances?.length) return [];
    return currentHouse.entrances.map(e => e.entrance);
  }, [currentHouse]);

  const maxCellsPerFloor = useMemo(() => {
    if (!apartments.length) return 8;

    // Подсчитываем количество квартир на каждом этаже
    const apartmentsPerFloor = apartments.reduce((acc, apt) => {
      acc[apt.floor] = (acc[apt.floor] || 0) + 1;
      return acc;
    }, {});

    // Находим максимальное количество квартир среди всех этажей
    const maxApartmentsCount = Math.max(...Object.values(apartmentsPerFloor));

    // Проверяем правила, если они есть
    const maxFromRules = Math.max(
      ...floorRules
        .filter(rule => rule.apartment_id && apartments.find(apt => apt.id === rule.apartment_id))
        .map(rule => rule.position),
      0
    );

    return Math.max(maxApartmentsCount, maxFromRules, 4); // Минимум 4 ячейки
  }, [apartments, floorRules]);

  // Получаем все этажи от 1 до максимального
  const allFloors = useMemo(() => {
    if (!apartments.length) return [];
    const maxFloor = Math.max(...apartments.map(a => a.floor));
    return Array.from({ length: maxFloor }, (_, i) => i + 1);
  }, [apartments]);

  const groupedApartments = useMemo(() => {
    // Создаем объект со всеми этажами
    const floors = allFloors.reduce((acc, floor) => {
      acc[floor] = Array(maxCellsPerFloor).fill(null);
      return acc;
    }, {});

    // Группируем квартиры по этажам
    const apartmentsByFloor = apartments.reduce((acc, apt) => {
      if (!acc[apt.floor]) acc[apt.floor] = [];
      acc[apt.floor].push(apt);
      return acc;
    }, {});

    // Заполняем квартиры последовательно для каждого этажа
    Object.entries(apartmentsByFloor).forEach(([floor, floorApts]) => {
      const floorNumber = parseInt(floor);
      // Сортируем квартиры по номеру
      const sortedApts = [...floorApts].sort((a, b) => a.number - b.number);
      
      // Ищем правило для этого этажа
      const rule = floorRules.find(rule => 
        rule.house === selectedHouse &&
        rule.entrance === parseInt(selectedEntrance) &&
        rule.floor === floorNumber
      );

      if (rule) {
        // Если есть правило, сдвигаем все квартиры
        const offset = rule.position - 1; // На сколько ячеек сдвигать
        
        // Заполняем со сдвигом
        sortedApts.forEach((apt, index) => {
          const position = offset + index;
          if (position >= 0 && position < maxCellsPerFloor) {
            floors[floor][position] = apt;
          }
        });
      } else {
        // Если правила нет, заполняем с начала
        sortedApts.forEach((apt, index) => {
          if (index < maxCellsPerFloor) {
            floors[floor][index] = apt;
          }
        });
      }
    });

    return floors;
  }, [apartments, allFloors, maxCellsPerFloor, floorRules, selectedHouse, selectedEntrance]);

  const sortedFloors = useMemo(() => {
    return allFloors.sort((a, b) => b - a);
  }, [allFloors]);

  // Обработчики событий
  const handleHouseChange = useCallback((event) => {
    const value = event.target.value;
    setSelectedHouse(value);
    setSelectedEntrance("");
    setApartments([]);
    setSelectedApartmentId(null);
  }, []);

  const handleEntranceChange = useCallback((event) => {
    const value = event.target.value;
    setSelectedEntrance(value);
    setSelectedApartmentId(null);
  }, []);

  const handleApartmentSelect = useCallback((apartmentId) => {
    setSelectedApartmentId(prev => prev === apartmentId ? null : apartmentId);
  }, []);

  // Загрузка данных
  const loadInitialData = useCallback(async () => {
    try {
      const [housesData, rulesData] = await Promise.all([
        fetchHouses(),
        fetchFloorRules()
      ]);
      
      if (Array.isArray(housesData)) {
        setHouses(housesData);
      } else {
        console.error("Houses data is not an array:", housesData);
        setHouses([]);
      }

      // Преобразуем правила из объекта в массив
      if (rulesData && typeof rulesData === 'object') {
        setFloorRules(Object.values(rulesData));
      } else {
        console.error("Rules data is not an object:", rulesData);
        setFloorRules([]);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setHouses([]);
      setFloorRules([]);
    }
  }, []);

  const loadApartments = useCallback(async () => {
    if (!selectedHouse || !selectedEntrance) {
      setApartments([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchApartmentsByEntrance(selectedHouse, selectedEntrance);
      if (Array.isArray(data)) {
        setApartments(data);
      } else {
        console.error("Apartments data is not an array:", data);
        setApartments([]);
      }
    } catch (error) {
      console.error("Error loading apartments:", error);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [selectedHouse, selectedEntrance]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadApartments();
  }, [loadApartments]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          Найди своего соседа
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 3 }}>
          <StyledFormControl>
            <InputLabel>Дом</InputLabel>
            <Select
              value={selectedHouse}
              onChange={handleHouseChange}
              label="Дом"
            >
              <MenuItem value="">
                <em>Выберите дом</em>
              </MenuItem>
              {houses.map((house) => (
                <MenuItem key={`house-${house.house}`} value={house.house}>
                  {house.house}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <StyledFormControl>
            <InputLabel>Подъезд</InputLabel>
            <Select
              value={selectedEntrance}
              onChange={handleEntranceChange}
              label="Подъезд"
              disabled={!selectedHouse}
            >
              <MenuItem value="">
                <em>Выберите подъезд</em>
              </MenuItem>
              {entrances.map((entrance) => (
                <MenuItem key={`entrance-${entrance}`} value={entrance}>
                  Подъезд {entrance}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedHouse && selectedEntrance ? (
          <StyledPaper elevation={3}>
            <Suspense fallback={<CircularProgress />}>
              {sortedFloors.map((floor) => (
                <ApartmentList
                  key={`floor-${selectedHouse}-${selectedEntrance}-${floor}`}
                  apartments={groupedApartments[floor] || []}
                  floor={floor}
                  isDarkMode={isDarkMode}
                  maxCellsPerFloor={maxCellsPerFloor}
                  floorRules={floorRules}
                  house={selectedHouse}
                  entrance={selectedEntrance}
                  selectedApartmentId={selectedApartmentId}
                  onApartmentSelect={handleApartmentSelect}
                />
              ))}
            </Suspense>
          </StyledPaper>
        ) : (
          <Typography variant="body1" align="center" color="text.secondary">
            Выберите дом и подъезд для просмотра квартир
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HelloNeighbor;
