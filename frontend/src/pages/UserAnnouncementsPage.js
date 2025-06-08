import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ViewAndSortControls from "../components/announcements/ViewAndSortControls";
import AnnouncementList from "../components/announcements/AnnouncementList";
import UserAdsTabs from "../components/announcements/UserAdsTabs";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/config"; // Путь к файлу конфигурации
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import { createAd } from "../services/adsApi";
import EditAnnouncementModal from "../components/EditAnnouncementModal";

const UserAnnouncementsPage = () => {
  const { user, accessToken } = useAuth();
  const userId = user?.user_id;
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createSnackbar, setCreateSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("newest");
  const [activeTab, setActiveTab] = useState("active");
  const [allAds, setAllAds] = useState([]); // Все объявления пользователя
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Добавляем состояние для общих уведомлений
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [updating, setUpdating] = useState(false);
  // Добавляем состояние для хранения начальных данных
  const [initialData, setInitialData] = useState(null);

  // Загрузка всех объявлений пользователя с поддержкой сортировки и фильтрации по статусу
  // Универсальная функция для получения объявлений
  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const sortMapping = {
        newest: { field: "created_at", order: "DESC" },
        oldest: { field: "created_at", order: "ASC" },
        cheapest: { field: "price", order: "ASC" },
        mostExpensive: { field: "price", order: "DESC" },
      };
      const { field, order } = sortMapping[sortMode] || {};
      let url = `${API_URL}/ads/user/${userId}`;
      if (field && order) {
        url += `?sort=${encodeURIComponent(field)}&order=${encodeURIComponent(
          order
        )}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setAllAds(data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAds();
  }, [userId, sortMode, activeTab]);

  if (!user) {
    return (
      <Container>
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h5" color="text.secondary">
            Пожалуйста, войдите в аккаунт для просмотра и управления вашими
            объявлениями.
          </Typography>
        </Box>
      </Container>
    );
  }
  // Обработчик создания нового объявления

  // Обновите handleCreateAnnouncement
  const handleCreateAnnouncement = async (fields, closeModal) => {
    setCreating(true);
    try {
      const priceClean = fields.isPriceNotSpecified
        ? null
        : typeof fields.price === "string"
        ? fields.price.replace(/\s/g, "")
        : fields.price;
      const body = {
        user_id: userId,
        title: fields.title,
        content: fields.content,
        price: priceClean,
        category: fields.category
          ? typeof fields.category === "object"
            ? Number(fields.category.id)
            : Number(fields.category)
          : null,
        subcategory: fields.subcategory
          ? typeof fields.subcategory === "object"
            ? Number(fields.subcategory.id)
            : Number(fields.subcategory)
          : null,
        images: Array.isArray(fields.images)
          ? fields.images
              .filter((img) => img && (img.url || img.image_url))
              .map((img, idx) => ({
                url: img.url || img.image_url,
                is_main: idx === 0,
              }))
          : [],
        status: "active",
        isTelegram: fields.selectedChats && fields.selectedChats.length > 0,
        selectedChats: fields.selectedChats || [],
        isImportant: true,
      };
      const response = await createAd(body);
      setCreateSnackbar({
        open: true,
        message: `Объявление создано${
          body.isTelegram
            ? ` и отправлено в Telegram (${
                response.telegramResults?.filter((r) => r.ok).length || 0
              })`
            : ""
        }`,
        severity: "success",
      });
      setCreateModalOpen(false);
      if (typeof closeModal === "function") closeModal();
      fetchAds();
    } catch (error) {
      setCreateSnackbar({
        open: true,
        message: "Ошибка сети: " + error.message,
        severity: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  // Обработчики действий с объявлениями
  const handleDeleteAnnouncement = async (adId) => {
    try {
      const response = await fetch(`${API_URL}/ads/${adId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при удалении объявления");
      }

      handleAdAction("delete", adId);
    } catch (error) {
      console.error("Ошибка при удалении объявления:", error);
      setNotification({
        open: true,
        message: `Ошибка: ${error.message || "Не удалось удалить объявление"}`,
        severity: "error",
      });
    }
  };

  const handleArchiveAnnouncement = async (adId) => {
    try {
      const response = await fetch(`${API_URL}/ads/${adId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "archive" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Ошибка при архивировании объявления"
        );
      }

      handleAdAction("archive", adId);
    } catch (error) {
      console.error("Ошибка при архивировании объявления:", error);
      setNotification({
        open: true,
        message: `Ошибка: ${
          error.message || "Не удалось архивировать объявление"
        }`,
        severity: "error",
      });
    }
  };

  const handleExtendAnnouncement = async (adId) => {
    try {
      // Продление на фиксированный срок (7 дней)
      const extendDays = 7;
      const response = await fetch(`${API_URL}/ads/${adId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          updated_at: new Date(
            Date.now() + extendDays * 24 * 60 * 60 * 1000
          ).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при продлении объявления");
      }

      handleAdAction("extend", adId);
    } catch (error) {
      console.error("Ошибка при продлении объявления:", error);
      setNotification({
        open: true,
        message: `Ошибка: ${error.message || "Не удалось продлить объявление"}`,
        severity: "error",
      });
    }
  };

  const handleRestoreAnnouncement = async (adId) => {
    try {
      const response = await fetch(`${API_URL}/ads/${adId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "active" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Ошибка при восстановлении объявления"
        );
      }

      handleAdAction("restore", adId);
    } catch (error) {
      console.error("Ошибка при восстановлении объявления:", error);
      setNotification({
        open: true,
        message: `Ошибка: ${
          error.message || "Не удалось восстановить объявление"
        }`,
        severity: "error",
      });
    }
  };

  const handleAdAction = (action, adId) => {
    // Обновляем список объявлений после действия
    fetchAds();
    // Отображаем уведомление о выполненном действии
    setNotification({
      open: true,
      message: getActionMessage(action),
      severity: "success",
    });
  };

  const getActionMessage = (action) => {
    switch (action) {
      case "delete":
        return "Объявление успешно удалено";
      case "archive":
        return "Объявление перемещено в архив";
      case "restore":
        return "Объявление восстановлено";
      case "extend":
        return "Срок размещения объявления продлен";
      default:
        return "Действие выполнено успешно";
    }
  };

  const handleEditAnnouncement = (ad) => {
    setCurrentAnnouncement(ad);
    setEditModalOpen(true);
  };

  // Обновление объявления через EditAnnouncementModal
  const handleUpdateAnnouncement = (adId, updatedData) => {
    if (updatedData && updatedData.action === "createNew") {
      // Открываем модальное окно создания с предзаполненными данными
      setCreateModalOpen(true);
      // Сохраняем данные для передачи в CreateAnnouncementModal
      setInitialData(updatedData.data);
    } else {
      console.log("Обновление объявления:", adId, updatedData);
      fetchAds(); // Обновляем список объявлений
      setNotification({
        open: true,
        message: "Объявление успешно обновлено",
        severity: "success",
      });
    }
  };

  // Фильтрация объявлений в зависимости от активной вкладки
  const filteredAds = allAds.filter((ad) => {
    if (activeTab === "active") return ad.status === "active";
    if (activeTab === "archive") return ad.status === "archive";
    if (activeTab === "deleted") return ad.status === "deleted";
    return true; // Если неизвестная вкладка, возвращаем все
  });

  // Подсчет количества объявлений для каждого статуса
  const announcementCounts = {
    active: allAds.filter((ad) => ad.status === "active").length,
    archive: allAds.filter((ad) => ad.status === "archive").length,
    deleted: allAds.filter((ad) => ad.status === "deleted").length,
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Мои объявления
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          Создать объявление
        </Button>
      </Box>

      {/* Вкладки для переключения между активными, архивными и удаленными объявлениями */}
      <UserAdsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        announcementCounts={announcementCounts}
        sx={{ mb: 3 }}
      />

      {/* Элементы управления отображением и сортировкой */}
      <ViewAndSortControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, bgcolor: "error.light", borderRadius: 1, my: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : filteredAds.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {activeTab === "active"
              ? "У вас нет активных объявлений"
              : activeTab === "archive"
              ? "У вас нет архивных объявлений"
              : activeTab === "deleted"
              ? "У вас нет удаленных объявлений"
              : "Объявления не найдены"}
          </Typography>
        </Box>
      ) : (
        <AnnouncementList
          ads={filteredAds}
          viewMode={viewMode}
          onClick={handleEditAnnouncement}
          isUserAnnouncementsPage={true}
          onRefreshAnnouncements={() => fetchAds()}
          activeTab={activeTab}
        />
      )}

      {/* Модальное окно создания объявления */}
      <CreateAnnouncementModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setInitialData(null); // Очищаем начальные данные при закрытии
        }}
        onCreated={() => {
          setCreateModalOpen(false);
          setInitialData(null);
          fetchAds();
          setNotification({
            open: true,
            message: "Объявление успешно создано!",
            severity: "success",
          });
        }}
        user={user}
        initialData={initialData}
      />

      {/* Модальное окно редактирования объявления */}
      {currentAnnouncement && (
        <EditAnnouncementModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setCurrentAnnouncement(null);
          }}
          initialAnnouncement={currentAnnouncement}
          onUpdated={handleUpdateAnnouncement}
          onDelete={handleDeleteAnnouncement}
          onArchive={handleArchiveAnnouncement}
          onRestore={handleRestoreAnnouncement}
        />
      )}

      {/* Общие уведомления */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserAnnouncementsPage;
