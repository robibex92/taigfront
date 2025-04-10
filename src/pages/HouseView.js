
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Box } from "@mui/material";
import { fetchApartmentsByEntrance, fetchFloorRules } from "../api/api";
import ApartmentList from "../components/ApartmentList";

const HouseView = ({ isDarkMode }) => {
  const { house, entrance } = useParams();
  const [apartments, setApartments] = useState([]);
  const [floorRules, setFloorRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Загружаем квартиры
        const apartmentsData = await fetchApartmentsByEntrance(house, entrance);
        setApartments(apartmentsData);
        
        // Загружаем правила этажей
        const floorRulesData = await fetchFloorRules();
        setFloorRules(floorRulesData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [house, entrance]);

  // Функция для группировки квартир по этажам
  const groupByFloor = (apartments) => {
    const grouped = {};
    apartments.forEach((apartment) => {
      if (!grouped[apartment.floor]) {
        grouped[apartment.floor] = [];
      }
      grouped[apartment.floor].push(apartment);
    });
    return grouped;
  };

  const handleApartmentClick = (apartment) => {
    // Если выбрана та же квартира, снимаем выделение
    if (selectedApartment && selectedApartment.number === apartment.number) {
      setSelectedApartment(null);
    } else {
      setSelectedApartment(apartment);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const groupedApartments = groupByFloor(apartments);
  const floors = Object.keys(groupedApartments).sort((a, b) => b - a); // Сортировка по убыванию (сверху вниз)

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h5"
        gutterBottom
        style={{ color: isDarkMode ? "#ffffff" : "inherit" }}
      >
        Дом {house}, Подъезд {entrance}
      </Typography>

      {floors.map((floor) => (
        <ApartmentList
          key={floor}
          floor={floor}
          apartments={groupedApartments[floor]}
          onApartmentClick={handleApartmentClick}
          isDarkMode={isDarkMode}
          floorRules={floorRules}
          house={house}
          entrance={entrance}
        />
      ))}
    </div>
  );
};

export default HouseView;
