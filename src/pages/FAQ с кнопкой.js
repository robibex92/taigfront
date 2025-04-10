import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Alert, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchFAQ } from '../api/api';
import PageContainer from '../components/common/PageContainer';
import { useAuth } from '../context/AuthContext';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]); // Состояние для хранения вопросов и ответов
  const [expanded, setExpanded] = useState(null); // Состояние для управления раскрытием аккордеонов
  const { login } = useAuth();

  const handleTestAuthUser1 = () => {
    // Тестовые данные для первого пользователя
    const testUserData1 = {
      user_id: '245946670',
      username: 'vallilonga',
      first_name: 'Антон',
      last_name: 'Р',
      joined_at: new Date('2025-02-20 03:06:45.872118'),
      avatar: 'https://t.me/i/userpic/320/3O4Qw6TslFY95lLLByko169t9pw3YVoN_oaaEy15-70.jpg',
      Invited: null,
      role: 'true',
      is_manually_updated: 'true',
      telegram_first_name: 'Тестер',
      telegram_last_name: 'Тестеров'
    };

    // Используем функцию login из AuthContext
    login(testUserData1);
  };

  const handleTestAuthUser2 = () => {
    // Тестовые данные для второго пользователя
    const testUserData2 = {
      user_id: '6646694639',
      username: 'secondUser',
      first_name: 'Второй',
      last_name: 'Пользователь',
      joined_at: new Date('2025-02-20 03:06:45.872118'),
      avatar: '', // Замените на реальный URL
      Invited: null,
      role: 'false',
      is_manually_updated: 'true',
      telegram_first_name: 'ВторойТестер',
      telegram_last_name: 'Тестеров'
    };

    // Используем функцию login из AuthContext
    login(testUserData2);
  };

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const data = await fetchFAQ(); // Загружаем данные из API
        setFaqs(data);
      } catch (error) {
        console.error('Ошибка при загрузке FAQ:', error);
      }
    };

    loadFAQ(); // Эта функция должна вызываться только здесь
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false); // Устанавливаем состояние для раскрытия конкретного аккордеона
  };

  return (
    <PageContainer>
      <Alert severity="info" sx={{ mb: 2 }}>
        Страница находится в разработке. Содержимое может быть неполным или изменяться.
      </Alert>
      <Typography variant="h4" gutterBottom>
        Часто задаваемые вопросы
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleTestAuthUser1}
        sx={{ mb: 2 }}
      >
        Тестовая авторизация для пользователя 1
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleTestAuthUser2}
        sx={{ mb: 2 }}
      >
        Тестовая авторизация для пользователя 2
      </Button>
      {faqs.map((item) => (
        <Accordion key={item.id} expanded={expanded === item.id} onChange={handleChange(item.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography style={{ color: item.status === 'inactive' ? 'gray' : 'inherit' }}>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography style={{ color: item.status === 'inactive' ? 'gray' : 'inherit' }}>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
};

export default FAQ;