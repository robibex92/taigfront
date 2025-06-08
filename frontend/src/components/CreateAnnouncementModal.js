import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import CategorySelectionStep from "./steps/CategorySelectionStep";
import AnnouncementCreationStep from "./steps/AnnouncementCreationStep";
import PublicationStep from "./steps/PublicationStep";
import { API_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";

const steps = [
  "Выбор категории",
  "Создание объявления",
  "Публикация в Telegram",
];

const CreateAnnouncementModal = ({
  isOpen,
  onClose,
  onCreated,
  user,
  initialData,
}) => {
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      price: initialData?.price || "",
      isPriceNotSpecified: initialData?.isPriceNotSpecified || false,
      category: initialData?.category || null,
      subcategory: initialData?.subcategory || null,
      images: initialData?.images || [],
    },
  });
  const { formState, reset, setValue, getValues } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState(
    initialData?.subcategory || null
  );
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedChats, setSelectedChats] = useState([]);

  const imageUploadManagerRef = useRef();
  const hasFormBeenResetRef = useRef(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user: authUser, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("CreateAnnouncementModal: Modal open state changed", {
      isOpen,
      initialData,
    });
    if (isOpen) {
      if (!initialData) {
        if (!hasFormBeenResetRef.current) {
          setActiveStep(0);
          const ADS_ALL =
            require("../config/telegramChats").LIST_TELEGRAM_CHATS.ADS_ALL ||
            [];
          const TELEGRAM_CHATS =
            require("../config/telegramChats").TELEGRAM_CHATS;
          setSelectedChats(
            ADS_ALL.map(
              (chatObj) =>
                Object.entries(TELEGRAM_CHATS).find(
                  ([, chat]) =>
                    chat.id === chatObj.id &&
                    (chat.threadId || null) === (chatObj.threadId || null)
                )?.[0]
            ).filter(Boolean)
          );
          reset({
            title: "",
            content: "",
            price: "",
            isPriceNotSpecified: false,
            category: null,
            subcategory: null,
            images: [],
          });
          setSubcategory(null);
          setExpandedCategory(null);
          setMainImageIndex(0);
          hasFormBeenResetRef.current = true;
        }
      } else {
        reset({
          title: initialData.title || "",
          content: initialData.content || "",
          price: initialData.price || "",
          isPriceNotSpecified: initialData.isPriceNotSpecified || false,
          category: initialData.category || null,
          subcategory: initialData.subcategory || null,
          images: initialData.images || [],
        });
        setSubcategory(initialData.subcategory || null);
        setMainImageIndex(0);
        const ADS_ALL =
          require("../config/telegramChats").LIST_TELEGRAM_CHATS.ADS_ALL || [];
        const TELEGRAM_CHATS =
          require("../config/telegramChats").TELEGRAM_CHATS;
        setSelectedChats(
          ADS_ALL.map(
            (chatObj) =>
              Object.entries(TELEGRAM_CHATS).find(
                ([, chat]) =>
                  chat.id === chatObj.id &&
                  (chat.threadId || null) === (chatObj.threadId || null)
              )?.[0]
          ).filter(Boolean)
        );
        hasFormBeenResetRef.current = true;
      }
    } else {
      hasFormBeenResetRef.current = false;
    }
  }, [isOpen, initialData, reset]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      setError(null);

      if (!authUser?.user_id) {
        setSnackbar({
          open: true,
          message: "Пользователь не авторизован",
          severity: "error",
        });
        return;
      }

      console.log("CreateAnnouncementModal: Checking pending images", {
        hasPendingFiles:
          imageUploadManagerRef.current?.hasPendingFiles?.() || false,
      });

      // Загружаем ожидающие изображения, если они есть
      let updatedImages = getValues().images || [];
      if (imageUploadManagerRef.current?.hasPendingFiles()) {
        setSnackbar({
          open: true,
          message: "Загрузка изображений...",
          severity: "info",
        });
        try {
          updatedImages =
            await imageUploadManagerRef.current.uploadPendingFiles();
          console.log("CreateAnnouncementModal: Images uploaded", {
            updatedImages,
          });
          setValue("images", updatedImages, { shouldValidate: true });
        } catch (uploadError) {
          console.error(
            "CreateAnnouncementModal: Error during image upload:",
            uploadError
          );
          setSnackbar({
            open: true,
            message: uploadError.message || "Ошибка при загрузке изображений",
            severity: "error",
          });
          setLoading(false);
          return;
        }
      }

      // Получаем актуальные значения формы после загрузки
      const formValues = getValues();
      console.log("CreateAnnouncementModal: Form values after upload", {
        formValues,
      });

      const allImages = updatedImages.map((img, idx) => ({
        url: img.url || img.image_url,
        is_main: idx === mainImageIndex,
      }));

      const isTelegram = selectedChats && selectedChats.length > 0;
      const isEdit = !!initialData?.id;
      const apiUrl = `${API_URL}/ads${isEdit ? `/${initialData.id}` : ""}`;

      const requestData = {
        user_id: authUser.user_id,
        title: formValues.title,
        content: formValues.content,
        category: formValues.category?.id || formValues.category?._id,
        subcategory: formValues.subcategory?.id || formValues.subcategory?._id,
        price: formValues.isPriceNotSpecified
          ? null
          : formValues.price.replace(/\s/g, ""),
        status: "active",
        images: allImages,
        ...(isTelegram && {
          isTelegram,
          selectedChats,
          ...(isEdit && { telegramUpdateType: "update_text" }),
        }),
      };

      console.log("CreateAnnouncementModal: Sending request", { requestData });

      const response = await fetch(apiUrl, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || responseData.message || isEdit
            ? "Failed to update announcement"
            : "Failed to create announcement"
        );
      }

      onClose();
      if (onCreated) onCreated(responseData.data || responseData);
      setSnackbar({
        open: true,
        message: isEdit ? "Объявление обновлено" : "Объявление создано",
        severity: "success",
      });
    } catch (error) {
      console.error(
        `CreateAnnouncementModal: Error ${
          initialData?.id ? "updating" : "creating"
        } announcement:`,
        error
      );
      setError(error.message);
      setSnackbar({
        open: true,
        message:
          error.message ||
          `Ошибка при ${
            initialData?.id ? "обновлении" : "создании"
          } объявления`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <FormProvider {...methods}>
      <Dialog open={!!isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {initialData?.id ? "Редактировать объявление" : "Создать объявление"}
        </DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ px: 2, pt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <DialogContent>
          {activeStep === 0 && (
            <CategorySelectionStep
              categories={categories}
              setCategories={setCategories}
              expandedCategory={expandedCategory}
              setExpandedCategory={setExpandedCategory}
              subcategory={subcategory}
              setSubcategory={setSubcategory}
            />
          )}
          {activeStep === 1 && (
            <AnnouncementCreationStep
              imageUploadManagerRef={imageUploadManagerRef}
              images={getValues().images || []}
              onImagesChange={(newImages) => {
                console.log("CreateAnnouncementModal: onImagesChange called", {
                  newImages,
                });
                setValue("images", newImages, { shouldValidate: true });
              }}
              mainImageIndex={mainImageIndex}
              onMainImageChange={setMainImageIndex}
              onRemoveImage={(index) => {
                const updatedImages = getValues().images.filter(
                  (_, i) => i !== index
                );
                console.log("CreateAnnouncementModal: Removing image", {
                  index,
                  updatedImages,
                });
                setValue("images", updatedImages, { shouldValidate: true });
                if (mainImageIndex === index) setMainImageIndex(0);
                else if (mainImageIndex > index)
                  setMainImageIndex(mainImageIndex - 1);
              }}
              disableNext={!formState.isValid}
            />
          )}
          {activeStep === 2 && (
            <PublicationStep
              selectedChats={selectedChats}
              setSelectedChats={setSelectedChats}
            />
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={handleBack} startIcon={<ArrowBack />}>
              Назад
            </Button>
          )}
          <Button onClick={onClose}>Отмена</Button>
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              disabled={activeStep === 1 && !formState.isValid}
            >
              Далее
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={methods.handleSubmit(handleSubmit)}
              disabled={loading}
            >
              {initialData?.id ? "Сохранить" : "Опубликовать"}
            </Button>
          )}
        </DialogActions>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Dialog>
    </FormProvider>
  );
};

export default CreateAnnouncementModal;
