import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Paper,
  Container,
  Divider,
  CircularProgress,

  styled
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/config";

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
  const { user } = useAuth();
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedEntrance, setSelectedEntrance] = useState("");
  const [apartments, setApartments] = useState([]);
  const [floorRules, setFloorRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [entrances, setEntrances] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);

  // Получить все дома
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
  useEffect(() => {
    if (!selectedHouse) {
      setEntrances([]);
      return;
    }
    const fetchEntrances = async () => {
      try {
        const res = await fetch(`${API_URL}/nearby/entrances/${selectedHouse}`);
        const data = await res.json();
        setEntrances(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        setEntrances([]);
      }
    };
    fetchEntrances();
  }, [selectedHouse]);
  // Получить правила сдвига этажей

useEffect(() => {
  if (!selectedHouse || !selectedEntrance) {
    setFloorRules([]);
    return;
  }
  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_URL}/floorRules?house=${selectedHouse}&entrance=${selectedEntrance}`);
      const data = await res.json();
      setFloorRules(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setFloorRules([]);
    }
  };
  fetchRules();
}, [selectedHouse, selectedEntrance]);

  // Получить квартиры по выбранному дому и подъезду
  useEffect(() => {
    if (!selectedHouse || !selectedEntrance) {
      setApartments([]);
      return;
    }
    setLoading(true);
    const fetchApartments = async () => {
      try {
        const res = await fetch(`${API_URL}/nearby?house=${selectedHouse}&entrance=${selectedEntrance}`);
        const data = await res.json();
        setApartments(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, [selectedHouse, selectedEntrance]);


  // Найти максимальное количество квартир на этаже (для сетки)
  const maxCellsPerFloor = useMemo(() => {
    if (!apartments.length) return 8;
    const apartmentsPerFloor = apartments.reduce((acc, apt) => {
      acc[apt.floor] = (acc[apt.floor] || 0) + 1;
      return acc;
    }, {});
    return Math.max(...Object.values(apartmentsPerFloor), 4);
  }, [apartments]);

  // Получить все этажи
  const allFloors = useMemo(() => {
    if (!apartments.length) return [];
    const maxFloor = Math.max(...apartments.map(a => a.floor));
    return Array.from({ length: maxFloor }, (_, i) => i + 1);
  }, [apartments]);

  // Группировка квартир по этажам и сдвиг по floorRules
  const groupedApartments = useMemo(() => {
    const floors = allFloors.reduce((acc, floor) => {
      acc[floor] = Array(maxCellsPerFloor).fill(null);
      return acc;
    }, {});
    const apartmentsByFloor = apartments.reduce((acc, apt) => {
      if (!acc[apt.floor]) acc[apt.floor] = [];
      acc[apt.floor].push(apt);
      return acc;
    }, {});
    Object.entries(apartmentsByFloor).forEach(([floor, floorApts]) => {
      const floorNumber = parseInt(floor);
      const sortedApts = [...floorApts].sort((a, b) => a.number - b.number);
      const rule = floorRules.find(rule =>
        rule.house === selectedHouse &&
        rule.entrance === parseInt(selectedEntrance) &&
        rule.floor === floorNumber
      );
      if (rule) {
        const offset = rule.position - 1;
        sortedApts.forEach((apt, index) => {
          const position = offset + index;
          if (position >= 0 && position < maxCellsPerFloor) {
            floors[floor][position] = apt;
          }
        });
      } else {
        sortedApts.forEach((apt, index) => {
          if (index < maxCellsPerFloor) {
            floors[floor][index] = apt;
          }
        });
      }
    });
    return floors;
  }, [apartments, allFloors, maxCellsPerFloor, floorRules, selectedHouse, selectedEntrance]);

  const sortedFloors = useMemo(() => allFloors.sort((a, b) => b - a), [allFloors]);

  // Обработчики
  const handleHouseChange = (event) => {
    setSelectedHouse(event.target.value);
    setSelectedEntrance("");
    setApartments([]);
    setSelectedApartmentId(null);
  };
  const handleEntranceChange = (event) => {
    setSelectedEntrance(event.target.value);
    setSelectedApartmentId(null);
  };
  const handleApartmentSelect = (apartmentId) => {
    setSelectedApartmentId(prev => prev === apartmentId ? null : apartmentId);
  };

  // Новый обработчик для показа info под карточкой
  const handleShowInfo = async (apartmentId) => {
    // Если уже открыт этот info — закрыть
    if (selectedInfo && selectedInfo.apartmentId === apartmentId) {
      setSelectedInfo(null);
      return;
    }
    if (!apartmentId) {
      setSelectedInfo(null);
      return;
    }
    // Сначала показываем состояние загрузки
    setSelectedInfo({ apartmentId, text: 'Загрузка...', loading: true });
    // Если не авторизован — сразу сообщение
    if (!user) {
      setSelectedInfo({ apartmentId, text: "Информация доступна только авторизованным пользователям", loading: false });
      return;
    }
    if (user.status === "blocking") {
      setSelectedInfo({ apartmentId, text: "Ваш аккаунт заблокирован. Доступ к информации ограничен.", loading: false });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/nearby/${apartmentId}/info`);
      const data = await res.json();
      setSelectedInfo({
        apartmentId,
        text: (data && typeof data.info === "string" && data.info.trim()) ? data.info : "Информация отсутствует",
        loading: false
      });
    } catch (e) {
      setSelectedInfo({ apartmentId, text: "Ошибка при загрузке информации", loading: false });
    }
  };


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
  <MenuItem key={`house-${house}`} value={house}>
    {house}
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
      maxCellsPerFloor={maxCellsPerFloor}
      house={selectedHouse}
      entrance={selectedEntrance}
      selectedApartmentId={selectedApartmentId}
      onApartmentSelect={handleApartmentSelect}
      onShowInfo={handleShowInfo}
      selectedInfo={
        selectedInfo && (groupedApartments[floor] || []).some(a => a?.id === selectedInfo.apartmentId)
          ? selectedInfo
          : null
      }
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
