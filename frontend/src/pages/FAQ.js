import React, { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { API_URL } from "../config/config";
import TelegramLoginButton from "react-telegram-login";
import { useAuth } from "../context/AuthContext";

// Кэш для FAQ
const FAQ_CACHE_KEY = "faq_cache";
const FAQ_CACHE_DURATION = 5 * 60 * 1000; // 5 минут

const getCachedFAQs = () => {
  const cached = localStorage.getItem(FAQ_CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > FAQ_CACHE_DURATION) {
    localStorage.removeItem(FAQ_CACHE_KEY);
    return null;
  }

  return data;
};

const setCachedFAQs = (data) => {
  localStorage.setItem(
    FAQ_CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};

const FAQ = () => {
  const [faqs, setFaqs] = useState(() => getCachedFAQs() || []);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(!getCachedFAQs());
  const [error, setError] = useState(null);
  const { user, login } = useAuth();

  const loadFAQ = useCallback(async (force = false) => {
    // Если есть кэш и не требуется принудительное обновление, используем его
    if (!force && getCachedFAQs()) {
      setFaqs(getCachedFAQs());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

      const response = await fetch(`${API_URL}/faqs`, {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const faqData = data.data || [];

      setFaqs(faqData);
      setCachedFAQs(faqData);
    } catch (error) {
      if (error.name === "AbortError") {
        setError("Превышено время ожидания ответа от сервера");
      } else {
        console.error("Ошибка при загрузке FAQ:", error);
        setError("Ошибка при загрузке данных");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFAQ();
  }, [loadFAQ]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onAuth = async (telegramUser) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/auth/telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegram_token: telegramUser.hash,
          user_data: telegramUser,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to authenticate with Telegram");
      }

      const data = await response.json();
      login(data.user, data.accessToken, data.refreshToken);
    } catch (error) {
      if (error.name === "AbortError") {
        alert("Превышено время ожидания ответа от сервера");
      } else {
        alert("Ошибка при авторизации через Telegram");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4">Часто задаваемые вопросы</Typography>
        {!user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TelegramLoginButton
              botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
              dataOnauth={onAuth}
              buttonSize="large"
              cornerRadius={8}
              requestAccess={true}
            />
          </Box>
        )}
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={() => loadFAQ(true)} sx={{ ml: 2 }}>
            Повторить
          </Button>
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        Страница находится в разработке. Содержимое может быть неполным или
        изменяться.
      </Alert>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        faqs.map((item) => (
          <Accordion
            key={item.id}
            expanded={expanded === item.id}
            onChange={handleChange(item.id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                style={{
                  color: item.status === "inactive" ? "gray" : "inherit",
                }}
              >
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                style={{
                  color: item.status === "inactive" ? "gray" : "inherit",
                }}
              >
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </div>
  );
};

export default FAQ;
