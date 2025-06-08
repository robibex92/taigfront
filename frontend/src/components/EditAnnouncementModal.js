import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Snackbar,
  Alert,
  Typography,
  Tooltip,
  IconButton,
  Dialog as MuiDialog,
  DialogContentText,
  CircularProgress,
  Paper,
  Collapse,
} from "@mui/material";
import {
  Edit as EditIcon,
  Event as EventIcon,
  Telegram as TelegramIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import AnnouncementForm from "./common/AnnouncementForm";
import ChatCheckboxList from "./common/ChatCheckboxList";
import { API_URL } from "../config/config";
import { categoryApi } from "../services/categoryApi";
import ImageUploadManager from "./common/ImageUploadManager";
import { useAuth } from "../context/AuthContext";
import CreateAnnouncementModal from "./CreateAnnouncementModal";
import { TELEGRAM_CHATS } from "../config/telegramChats";

const EditAnnouncementModal = ({
  isOpen,
  onClose,
  initialAnnouncement,
  onUpdated,
  onDelete,
  onArchive,
  onRestore,
  customHandleSubmit,
  isCreating = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [isPriceNotSpecified, setIsPriceNotSpecified] = useState(false);
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(7);
  const [extendLoading, setExtendLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateNewModal, setShowCreateNewModal] = useState(false);
  const [displayCategoryName, setDisplayCategoryName] = useState("");
  const [displaySubcategoryName, setDisplaySubcategoryName] = useState("");
  const [isTelegramExpanded, setIsTelegramExpanded] = useState(false);
  const [telegramMessages, setTelegramMessages] = useState([]);
  const [loadingTelegramInfo, setLoadingTelegramInfo] = useState(false);

  const { user, accessToken, refreshToken, login, logout } = useAuth();
  const adId = initialAnnouncement?.id;
  const adStatus = initialAnnouncement?.status || "active";

  const fetchWithRefresh = async (fetchUrl, options) => {
    let response = await fetch(fetchUrl, options);
    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        login(user, refreshData.accessToken, refreshData.refreshToken);
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${refreshData.accessToken}`,
          },
        };
        response = await fetch(fetchUrl, newOptions);
      } else {
        console.error("Failed to refresh token");
        logout();
        throw new Error("Authentication failed");
      }
    }
    if (!response.ok) {
      let errorText = "Network error occurred";
      try {
        const errorData = await response.json();
        errorText = errorData.error || JSON.stringify(errorData);
      } catch {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorText);
    }
    return response;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCats = await categoryApi.getAll();
        setCategories(allCats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialAnnouncement) {
      setTitle(initialAnnouncement?.title || "");
      setContent(initialAnnouncement?.content || "");
      setPrice(initialAnnouncement?.price || "");
      setIsPriceNotSpecified(initialAnnouncement?.price === null);
      const initialImages =
        initialAnnouncement?.images?.map((img, idx) => ({
          ...img,
          url: img.url || img.image_url,
          is_main: idx === 0,
        })) || [];
      setImages(initialImages);
      setMainImageIndex(0);

      const loadCategoryData = async () => {
        setLoading(true);
        try {
          const catObj = initialAnnouncement?.category;
          const subcatObj = initialAnnouncement?.subcategory;
          const allCats = await categoryApi.getAll();
          let foundCat = null;
          if (catObj && typeof catObj === "object" && catObj.name) {
            foundCat = catObj;
          } else if (catObj) {
            foundCat = allCats.find((c) => c.id == catObj || c._id == catObj);
          }
          setCategory(foundCat || null);
          setDisplayCategoryName(foundCat ? foundCat.name : "");
          if (foundCat && subcatObj) {
            const subcatsResp = await categoryApi.getSubcategories(
              foundCat.id || foundCat._id
            );
            let foundSubcat = null;
            if (typeof subcatObj === "object" && subcatObj.name) {
              foundSubcat = subcatObj;
            } else {
              foundSubcat = subcatsResp.subcategories.find(
                (s) => s.id == subcatObj || s._id == subcatObj
              );
            }
            setSubcategory(foundSubcat || null);
            setDisplaySubcategoryName(foundSubcat ? foundSubcat.name : "");
          }
        } catch (error) {
          console.error("Error loading category data:", error);
        } finally {
          setLoading(false);
        }
      };
      loadCategoryData();

      if (adId) {
        setLoading(true);
        fetchWithRefresh(`${API_URL}/ad-images?ad_id=${adId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((r) => r.json())
          .then((data) => {
            console.log("Fetched images from /api/ad-images:", data);
            if (data.images && data.images.length > 0) {
              const fetchedImages = data.images.map((img, idx) => ({
                ...img,
                url: img.url || img.image_url,
                is_main: idx === 0,
              }));
              setImages(fetchedImages);
            }
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
            if (initialImages.length > 0) {
              setImages(initialImages);
            }
          })
          .finally(() => setLoading(false));
      }
    }
  }, [isOpen, initialAnnouncement, adId, accessToken]);

  useEffect(() => {
    const fetchTelegramMessages = async () => {
      if (!adId) return;

      setLoadingTelegramInfo(true);
      try {
        const response = await fetchWithRefresh(
          `${API_URL}/ads/${adId}/telegram-messages`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await response.json();
        if (data.messages) {
          setTelegramMessages(data.messages);
          const chatKeys = data.messages
            .map((msg) => {
              const chat = Object.entries(TELEGRAM_CHATS).find(
                ([_, chat]) =>
                  chat.id === msg.chat_id &&
                  (chat.threadId || null) === (msg.thread_id || null)
              )?.[0];
              return chat;
            })
            .filter(Boolean);
          setSelectedChats(chatKeys);
        }
      } catch (error) {
        console.error("Error fetching Telegram messages:", error);
      } finally {
        setLoadingTelegramInfo(false);
      }
    };

    if (isOpen && adId) {
      fetchTelegramMessages();
    }
  }, [isOpen, adId, accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const formData = prepareFormData();
      const isTelegram = selectedChats.length > 0;
      const response = await fetchWithRefresh(
        `${API_URL}/ads/${initialAnnouncement.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            ...(isTelegram && {
              isTelegram: true,
              selectedChats,
              telegramUpdateType: "update_text",
            }),
          }),
        }
      );
      const updatedAnnouncement = await response.json();
      if (!response.ok) {
        throw new Error(
          updatedAnnouncement.error || "Failed to update announcement"
        );
      }
      onUpdated(updatedAnnouncement.data);
      onClose();
      setSnackbarMessage("Объявление успешно обновлено");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating announcement:", error);
      setError(error.message);
      setSnackbarMessage(error.message || "Ошибка при обновлении объявления");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    setSubmitting(true);
    try {
      const response = await fetchWithRefresh(
        `${API_URL}/ads/${initialAnnouncement.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete announcement");
      }
      if (onDelete) {
        onDelete(initialAnnouncement.id);
      }
      onClose();
      setSnackbarMessage("Объявление успешно удалено");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting ad:", error);
      setSnackbarMessage(error.message || "Ошибка при удалении объявления");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    setConfirmArchive(false);
    setSubmitting(true);
    try {
      const response = await fetchWithRefresh(
        `${API_URL}/ads/${initialAnnouncement.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "archive" }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to archive announcement");
      }
      if (onArchive) {
        onArchive(initialAnnouncement.id);
      }
      onClose();
      setSnackbarMessage("Объявление успешно архивировано");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error archiving ad:", error);
      setSnackbarMessage(
        error.message || "Ошибка при архивировании объявления"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestore = async () => {
    setConfirmRestore(false);
    setSubmitting(true);
    try {
      const response = await fetchWithRefresh(
        `${API_URL}/ads/${initialAnnouncement.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "active" }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to restore announcement");
      }
      if (onRestore) {
        onRestore(initialAnnouncement.id);
      }
      onUpdated();
      onClose();
      setSnackbarMessage("Объявление успешно восстановлено");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error restoring ad:", error);
      setSnackbarMessage(
        error.message || "Ошибка при восстановлении объявления"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setSnackbarOpen(false);
    try {
      const user_id = user?.user_id;
      if (!user_id) {
        throw new Error("Пользователь не авторизован");
      }
      const data = {
        user_id,
        title,
        content,
        price: isPriceNotSpecified ? null : price.replace(/\s/g, ""),
        category: category?.id || category?._id,
        subcategory: subcategory?.id || subcategory?._id,
        images: images.map((img, idx) => ({
          url: img.url || img.image_url,
          is_main: idx === mainImageIndex,
        })),
        status: "active",
        isTelegram: selectedChats.length > 0,
        selectedChats,
      };
      const response = await fetchWithRefresh(`${API_URL}/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create announcement");
      }
      onUpdated();
      onClose();
      setSnackbarMessage("Объявление создано!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err.message || "Ошибка создания объявления");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async () => {
    setExtendLoading(true);
    try {
      const response = await fetchWithRefresh(
        `${API_URL}/ads/${initialAnnouncement.id}`,
        {
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
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при продлении");
      }
      setSnackbarMessage("Объявление продлено!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      if (onUpdated) onUpdated();
      setExtendDialogOpen(false);
    } catch (err) {
      setSnackbarMessage(err.message || "Ошибка при продлении");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setExtendLoading(false);
    }
  };

  const prepareFormData = () => ({
    title,
    content,
    price: isPriceNotSpecified ? null : price.replace(/\s/g, ""),
    category: category?.id || category?._id,
    subcategory: subcategory?.id || subcategory?._id,
    images: images.map((img, idx) => ({
      url: img.url || img.image_url,
      is_main: idx === mainImageIndex,
    })),
    status: initialAnnouncement?.status,
  });

  return (
    <Dialog open={!!isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isCreating
          ? "Создать объявление"
          : adStatus === "active"
          ? "Редактировать объявление"
          : adStatus === "archive"
          ? "Редактировать архивное объявление"
          : "Редактировать удаленное объявление"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
            Категория: {category?.name || ""}
            {subcategory?.name && ` → ${subcategory.name}`}
          </Typography>
          <Tooltip title="Изменить категорию (soon)">
            <span>
              <IconButton size="small" disabled>
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <AnnouncementForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          price={price}
          setPrice={setPrice}
          isPriceNotSpecified={isPriceNotSpecified}
          setIsPriceNotSpecified={setIsPriceNotSpecified}
          isLoading={loading}
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
          onSnackbarClose={() => setSnackbarOpen(false)}
          isEdit={!isCreating}
          adId={adId}
          showSnackbar={(msg, sev = "success") => {
            setSnackbarMessage(msg);
            setSnackbarSeverity(sev);
            setSnackbarOpen(true);
          }}
        />
        {adId && (
          <>
            <Box sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Вы можете добавить до 5 изображений, выбрать главное (звезда)
                или удалить ненужные.
              </Typography>
              <ImageUploadManager
                id={adId}
                type="ad"
                maxImages={5}
                onImagesChange={setImages}
                images={images}
              />
            </Box>
          </>
        )}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              overflow: "hidden",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box
              onClick={() => setIsTelegramExpanded(!isTelegramExpanded)}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TelegramIcon color="primary" />
                Публикация в Telegram
                {telegramMessages.length > 0 && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({telegramMessages.length} сообщений)
                  </Typography>
                )}
              </Typography>
              {isTelegramExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={isTelegramExpanded}>
              <Box sx={{ p: 2, pt: 0 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  {telegramMessages.length > 0
                    ? "Выберите чаты, в которых нужно обновить сообщение объявления. Чаты с существующими сообщениями выбраны автоматически."
                    : "Выберите чаты для публикации объявления. Если чат не выбран, сообщение в нем не будет опубликовано."}
                </Alert>
                {loadingTelegramInfo ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      backgroundColor: "background.default",
                      borderRadius: 1,
                      "& .MuiFormControlLabel-root": {
                        width: "100%",
                        margin: 0,
                        padding: "8px 16px",
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      },
                    }}
                  >
                    <ChatCheckboxList
                      selectedChats={selectedChats}
                      setSelectedChats={setSelectedChats}
                      chatGroupKey="ADS_ALL"
                      label="Выберите чаты для публикации"
                      defaultSelected={false}
                    />
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        {!isCreating && (
          <>
            {adStatus === "active" && (
              <>
                <Button color="error" onClick={() => setConfirmDelete(true)}>
                  Удалить
                </Button>
                <Button
                  onClick={() => setConfirmArchive(true)}
                  disabled={loading}
                >
                  Архивировать
                </Button>
                <Tooltip title="Продлить срок публикации">
                  <span>
                    <Button
                      onClick={() => setExtendDialogOpen(true)}
                      startIcon={<EventIcon />}
                      disabled={loading}
                    >
                      Продлить
                    </Button>
                  </span>
                </Tooltip>
              </>
            )}
            {adStatus === "archive" && (
              <>
                <Button color="error" onClick={() => setConfirmDelete(true)}>
                  Удалить
                </Button>
                <Button
                  color="primary"
                  onClick={() => setConfirmRestore(true)}
                  disabled={loading}
                >
                  Выложить
                </Button>
              </>
            )}
            {adStatus === "deleted" && (
              <Button
                color="primary"
                onClick={() => setConfirmRestore(true)}
                disabled={loading}
              >
                Выложить
              </Button>
            )}
          </>
        )}
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        {(adStatus === "active" || isCreating) && (
          <Button
            color="primary"
            variant="contained"
            onClick={
              customHandleSubmit || (isCreating ? handleCreate : handleSubmit)
            }
            disabled={loading || submitting}
          >
            {isCreating ? "Создать" : "Сохранить"}
          </Button>
        )}
      </DialogActions>
      <MuiDialog
        open={extendDialogOpen}
        onClose={() => setExtendDialogOpen(false)}
      >
        <DialogTitle>Продлить объявление</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            На сколько дней продлить публикацию?
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant={extendDays === 7 ? "contained" : "outlined"}
              onClick={() => setExtendDays(7)}
              disabled={extendLoading}
            >
              7 дней
            </Button>
            <Button
              variant={extendDays === 14 ? "contained" : "outlined"}
              onClick={() => setExtendDays(14)}
              disabled={extendLoading}
            >
              14 дней
            </Button>
            <Button
              variant={extendDays === 30 ? "contained" : "outlined"}
              onClick={() => setExtendDays(30)}
              disabled={extendLoading}
            >
              30 дней
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setExtendDialogOpen(false)}
            disabled={extendLoading}
          >
            Отмена
          </Button>
          <Button
            onClick={handleExtend}
            color="primary"
            variant="contained"
            disabled={extendLoading}
          >
            Продлить
          </Button>
        </DialogActions>
      </MuiDialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <MuiDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Подтвердить удаление</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить это объявление?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </MuiDialog>
      <MuiDialog open={confirmArchive} onClose={() => setConfirmArchive(false)}>
        <DialogTitle>Подтвердить архивацию</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите архивировать это объявление?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmArchive(false)}>Отмена</Button>
          <Button onClick={handleArchive} color="primary" autoFocus>
            Архивировать
          </Button>
        </DialogActions>
      </MuiDialog>
      <MuiDialog open={confirmRestore} onClose={() => setConfirmRestore(false)}>
        <DialogTitle>Подтвердить восстановление</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите восстановить это объявление?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2 }}>
            Обратите внимание: при восстановлении объявление не будет отправлено
            в Telegram. Если вам нужно опубликовать в Telegram, создайте новое
            объявление.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmRestore(false);
              setShowCreateNewModal(true);
            }}
            color="secondary"
          >
            Создать новое
          </Button>
          <Button onClick={() => setConfirmRestore(false)}>Отмена</Button>
          <Button onClick={handleRestore} color="primary" autoFocus>
            Восстановить
          </Button>
        </DialogActions>
      </MuiDialog>
      <CreateAnnouncementModal
        isOpen={showCreateNewModal}
        onClose={() => setShowCreateNewModal(false)}
        onCreated={() => {
          setShowCreateNewModal(false);
          if (onUpdated) onUpdated();
        }}
        user={user}
        initialData={{
          title,
          content,
          price,
          isPriceNotSpecified,
          category,
          subcategory,
          images,
        }}
      />
    </Dialog>
  );
};

export default EditAnnouncementModal;
