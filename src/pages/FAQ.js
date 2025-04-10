import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchFAQ } from '../api/api';
import PageContainer from '../components/common/PageContainer';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]); // Состояние для хранения вопросов и ответов
  const [expanded, setExpanded] = useState(null); // Состояние для управления раскрытием аккордеонов

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