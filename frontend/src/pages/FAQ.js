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
  const [tokenAuthLoading, setTokenAuthLoading] = useState(false);
  const [tokenAuthError, setTokenAuthError] = useState(null);

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

  const handleAuthorizeWithRefreshToken = async () => {
    setTokenAuthLoading(true);
    setTokenAuthError(null);
    try {
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0NTk0NjY3MCIsImlhdCI6MTc0OTM2ODE4OSwiZXhwIjoxNzUxOTYwMTg5fQ.OI-w2EbbmNodP8a86cjuwEEikK3u92pCawzuGOcPcLk"; // User provided refreshToken

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh token");
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      // Fetch user data using the new accessToken
      const sessionResponse = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        throw new Error(errorData.error || "Failed to fetch user session");
      }

      const userData = await sessionResponse.json();

      // Now call login with the fetched user data and new tokens
      login(userData, newAccessToken, newRefreshToken);
      alert("Авторизация прошла успешно!");
    } catch (error) {
      console.error("Ошибка при авторизации токеном:", error);
      setTokenAuthError(error.message);
    } finally {
      setTokenAuthLoading(false);
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleAuthorizeWithRefreshToken}
              disabled={tokenAuthLoading}
            >
              {tokenAuthLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Авторизоваться для тестов"
              )}
            </Button>
            {tokenAuthError && (
              <Alert severity="error" sx={{ ml: 2 }}>
                {tokenAuthError}
              </Alert>
            )}
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
