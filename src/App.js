import React, { useState, useEffect } from "react";
//import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Заменил HashRouter на BrowserRouter
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Menu from "./components/Menu";
import News from "./pages/News";
import Announcements from "./pages/Announcements";
import FAQ from "./pages/FAQ";
import UnderConstruction from "./pages/UnderConstruction";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import HelloNeighbor from "./pages/HelloNeighbor";
import WhoseCar from "./pages/WhoseCar";
import UserAnnouncementsPage from "./pages/UserAnnouncementsPage";
import PublicAnnouncementsPage from "./pages/PublicAnnouncementsPage";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";
import { Box } from "@mui/material";

const App = () => {
  // Получаем сохраненную тему из localStorage или используем 'light' по умолчанию
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    return savedMode || "light";
  });

  // Создаем тему Material UI на основе текущего режима
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? "#1976d2" : "#90caf9",
      },
      secondary: {
        main: mode === "light" ? "#dc004e" : "#f48fb1",
      },
      background: {
        default: mode === "light" ? "#1976d2" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
  });

  // Функция для переключения темы
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      // Сохраняем новое значение в localStorage
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  };

  // Применяем класс темы к body
  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`app ${mode}`}>
          <Router>
            <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
              <Header toggleTheme={toggleTheme} theme={theme} />
              <Menu />
              <Box
                sx={{
                  backgroundColor: mode === "light" ? "#f5f5f5" : "#1e1e1e",
                  color: mode === "light" ? "inherit" : "#ffffff",
                  minHeight: "calc(100vh - 64px - 64px - 64px)", // header + menu + footer
                  p: "20px",
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              >
                <Routes>
                  <Route path="/" element={<News />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="/announcements"
                    element={<PublicAnnouncementsPage />}
                  />
                  <Route
                    path="/user-announcements"
                    element={<UserAnnouncementsPage />}
                  />
                  <Route path="/ads/:id" element={<AnnouncementDetailPage />} />
                  <Route path="/ads" element={<Announcements />} />
                  <Route path="/ads/my" element={<UserAnnouncementsPage />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/hello" element={<HelloNeighbor />} />
                  <Route path="/car" element={<WhoseCar />} />
                  <Route
                    path="/under-construction"
                    element={<UnderConstruction />}
                  />
                  <Route
                    path="/ads/:userId"
                    element={<PublicAnnouncementsPage />}
                  />
                </Routes>
              </Box>
            </Box>
            <Footer />
          </Router>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
