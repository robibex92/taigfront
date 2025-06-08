import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import { API_URL } from "../../config/config";
import heic2any from "heic2any";
import { useAuth } from "../../context/AuthContext";

const DropZone = styled(Box)(({ theme, isdragactive }) => ({
  border: "2px dashed #aaa",
  borderRadius: 8,
  width: 120,
  height: 120,
  minHeight: "unset",
  minWidth: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: "transparent",
  transition: "background 0.2s",
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ImageThumb = styled(Box)(({ theme, selected }) => ({
  position: "relative",
  borderRadius: 8,
  overflow: "hidden",
  border: selected
    ? "2px solid " + theme.palette.primary.main
    : "1px solid #ddd",
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: 120,
  height: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
}));

const ThumbImg = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const ImageUploadManager = forwardRef(function ImageUploadManager(
  {
    id = null,
    type = "ad",
    maxImages = 1,
    onImagesChange = () => {},
    images: propImages = [],
  },
  ref
) {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [localImages, setLocalImages] = useState(propImages);
  const inputRef = useRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { accessToken, refreshToken, login } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [activeUploads, setActiveUploads] = useState(0);
  const MAX_CONCURRENT_UPLOADS = 3;
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      localImages.forEach((img) => {
        if (img.url && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
      pendingFiles.forEach((file) => {
        if (
          file.preview &&
          file.preview.url &&
          file.preview.url.startsWith("blob:")
        ) {
          URL.revokeObjectURL(file.preview.url);
        }
      });
      // Не сбрасываем images в родительskom компоненте
      setPendingFiles([]);
      setUploadQueue([]);
      setActiveUploads(0);
      setLocalImages([]);
    };
  }, []);

  useEffect(() => {
    if (!id || !isMounted.current) return;
    setInitialLoadComplete(false);
    setLoading(true);
    setLocalImages([]);
    onImagesChange([]);

    fetch(`${API_URL}/ad-images?${type}_id=${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted.current) {
          return;
        }
        if (data.images && data.images.length > 0) {
          const fixedImages = data.images.map((img, idx) => ({
            ...img,
            url: img.url || img.image_url,
            is_main: idx === 0,
            file: null, // Ensure file is null for fetched images
          }));
          setLocalImages(fixedImages);
          onImagesChange(fixedImages);
        } else {
          setLocalImages([]);
          onImagesChange([]);
        }
      })
      .catch((error) => {
        if (!isMounted.current) return;
        console.error("ImageUploadManager: Error fetching images:", error);
        if (propImages.length > 0) {
          setLocalImages(propImages);
          onImagesChange(propImages);
        }
      })
      .finally(() => {
        if (!isMounted.current) return;
        setLoading(false);
        setInitialLoadComplete(true);
      });
  }, [id, type, accessToken]);

  const memoizedPropImages = useMemo(() => propImages, [propImages]);

  useEffect(() => {
    if (!id && memoizedPropImages.length > 0) {
      if (JSON.stringify(localImages) !== JSON.stringify(memoizedPropImages)) {
        setLocalImages(memoizedPropImages);
        onImagesChange(memoizedPropImages);
      }
    }
  }, [memoizedPropImages, id]);

  useImperativeHandle(ref, () => ({
    uploadPendingFiles,
    hasPendingFiles: () => {
      return pendingFiles.length > 0;
    },
  }));

  const processUploadQueue = async () => {
    if (
      !isMounted.current ||
      activeUploads >= MAX_CONCURRENT_UPLOADS ||
      uploadQueue.length === 0
    ) {
      return;
    }

    const nextFile = uploadQueue[0];
    setUploadQueue((prev) => prev.slice(1));
    setActiveUploads((prev) => prev + 1);

    const uploadWithToken = async (token) => {
      const formData = new FormData();
      formData.append("photos", nextFile.file, nextFile.file.name);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!isMounted.current) return;

        if (res.status === 401) {
          throw new Error("TOKEN_EXPIRED");
        }

        if (!res.ok) {
          console.error("ImageUploadManager: Upload failed", {
            status: res.status,
          });
          throw new Error("Failed to upload image");
        }

        let responseData, uploadedUrl;
        try {
          responseData = await res.json();
          uploadedUrl = responseData.fileUrls?.[0];
        } catch (e) {
          console.error(
            "ImageUploadManager: Failed to parse upload response",
            e
          );
          throw new Error("Invalid server response");
        }

        if (!uploadedUrl) {
          throw new Error("No URL returned from server");
        }

        if (!isMounted.current) return;

        setLocalImages((prev) => {
          const newImages = prev.map((img) =>
            img.file === nextFile.file
              ? {
                  ...img,
                  url: uploadedUrl,
                  image_url: uploadedUrl,
                  file: null,
                }
              : img
          );
          onImagesChange(newImages);
          return newImages;
        });

        setPendingFiles((prev) => prev.filter((f) => f !== nextFile.file));
      } catch (error) {
        if (!isMounted.current) return;

        if (error.message === "TOKEN_EXPIRED" && refreshToken) {
          try {
            // Try to refresh the token
            const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
              method: "POST",
              headers: { Authorization: `Bearer ${refreshToken}` },
            });

            if (!refreshRes.ok) {
              throw new Error("REFRESH_FAILED");
            }

            let newAccessToken, newRefreshToken;
            try {
              const refreshData = await refreshRes.json();
              newAccessToken = refreshData.accessToken;
              newRefreshToken = refreshData.refreshToken;
            } catch (e) {
              console.error(
                "ImageUploadManager: Failed to parse refresh response",
                e
              );
              throw new Error("Invalid refresh response");
            }

            // Update auth context with new tokens
            await login(newAccessToken, newRefreshToken);

            // Retry upload with new token
            return uploadWithToken(newAccessToken);
          } catch (refreshError) {
            console.error(
              "ImageUploadManager: Token refresh failed",
              refreshError
            );
            setSnackbar({
              open: true,
              message: "Сессия истекла. Пожалуйста, перезайдите в систему.",
              severity: "error",
            });
            throw refreshError;
          }
        }

        console.error("ImageUploadManager: Error uploading file", {
          error,
          file: nextFile.file.name,
        });
        setSnackbar({
          open: true,
          message: `Ошибка загрузки ${nextFile.file.name}`,
          severity: "error",
        });
      }
    };

    try {
      await uploadWithToken(accessToken);
    } finally {
      if (isMounted.current) {
        setActiveUploads((prev) => prev - 1);
      }
    }
  };

  useEffect(() => {
    if (uploadQueue.length > 0 && activeUploads < MAX_CONCURRENT_UPLOADS) {
      processUploadQueue();
    }
  }, [uploadQueue, activeUploads]);

  const handleFiles = async (files) => {
    if (localImages.length + pendingFiles.length + files.length > maxImages) {
      setSnackbar({
        open: true,
        message: `Можно загрузить максимум ${maxImages} изображений`,
        severity: "warning",
      });
      return;
    }

    const fileArr = Array.from(files);
    const validFiles = await Promise.all(
      fileArr.map(async (file) => {
        const isHeic =
          file.name?.toLowerCase().endsWith(".heic") ||
          file.name?.toLowerCase().endsWith(".heif") ||
          file.type === "image/heic" ||
          file.type === "image/heif";
        const isJfif =
          file.name?.toLowerCase().endsWith(".jfif") ||
          (file.type === "image/jpeg" &&
            !file.name.toLowerCase().endsWith(".jpg")); // Дополнительная проверка

        if (isHeic || isJfif) {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.92,
            });
            const convertedFile = new File(
              [convertedBlob],
              file.name.replace(/\.(heic|heif|jfif)$/i, ".jpg"),
              { type: "image/jpeg" }
            );
            return convertedFile;
          } catch (e) {
            console.error("ImageUploadManager: Conversion failed", {
              file: file.name,
              error: e,
            });
            setSnackbar({
              open: true,
              message: `Не удалось конвертировать ${file.name}. Попробуйте другой файл.`,
              severity: "error",
            });
            return null;
          }
        }
        return file;
      })
    ).then((files) => files.filter(Boolean));

    if (!validFiles.length) {
      return;
    }

    const newImagesToAdd = [];
    validFiles.forEach((file) => {
      if (
        pendingFiles.some((f) => f.name === file.name && f.size === file.size)
      ) {
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      const preview = {
        url: blobUrl,
        is_main: localImages.length === 0 && newImagesToAdd.length === 0,
        id: null,
        file: file,
        blobUrl: blobUrl,
      };

      newImagesToAdd.push(preview);
    });

    setLocalImages((prev) => [...prev, ...newImagesToAdd]);
    setPendingFiles((prev) => [...prev, ...validFiles]);
    setUploadQueue((prev) => [
      ...prev,
      ...newImagesToAdd.map((img) => ({ file: img.file, preview: img })),
    ]);

    if (newImagesToAdd.length > 0) {
      onImagesChange([...localImages, ...newImagesToAdd]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleDelete = async (index) => {
    const imageToDelete = localImages[index];
    setLoading(true);
    try {
      if (imageToDelete?.url && imageToDelete.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToDelete.url);
      }

      // If it's a pending image (has a file reference and no ID yet)
      if (imageToDelete?.file !== null && !imageToDelete.id) {
        setPendingFiles((prev) =>
          prev.filter((file) => file !== imageToDelete.file)
        );
        setUploadQueue((prev) =>
          prev.filter((item) => item.file !== imageToDelete.file)
        );
        const updatedImages = localImages.filter((_, i) => i !== index);
        setLocalImages(updatedImages);
        onImagesChange(updatedImages);

        return;
      }

      // If it's an uploaded image (has an ID)
      if (imageToDelete?.id && id) {
        const response = await fetch(`${API_URL}/ads/delete-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: imageToDelete.id, ad_id: id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("ImageUploadManager: Delete failed", { errorData });
          throw new Error(
            errorData.error || "Failed to delete image from server"
          );
        }
      }

      const updatedImages = localImages.filter((_, i) => i !== index);
      setLocalImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error("ImageUploadManager: Error deleting image", { error });
      setSnackbar({
        open: true,
        message: error.message || "Ошибка при удалении изображения",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetMain = (index) => {
    const updatedImages = localImages.map((img, idx) => ({
      ...img,
      is_main: idx === index,
    }));
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const uploadPendingFiles = async () => {
    if (pendingFiles.length === 0) {
      return localImages.filter((img) => img.file === null); // Return only uploaded images
    }

    while (uploadQueue.length > 0 || activeUploads > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return localImages.filter((img) => img.file === null); // Return only uploaded images
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const renderImage = useCallback(
    (img, idx) => {
      // An image is pending if its `file` property is not null.
      const isCurrentlyPending = img.file !== null;

      return (
        <ImageThumb
          key={img.id || img.url} // Use a more stable key, prefer id for uploaded, then url for pending
          selected={img.is_main}
        >
          <ThumbImg src={img.url} alt={`Объявление ${idx + 1}`} />
          {isCurrentlyPending && ( // Show loader based on derived state
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
                color: "primary.main",
                zIndex: 3,
              }}
            />
          )}
          {localImages.length > 1 && (
            <IconButton
              sx={{
                position: "absolute",
                top: 4,
                left: 4,
                color: img.is_main ? "gold" : "grey.400",
                zIndex: 2,
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: 1,
                p: "2px",
              }}
              onClick={() => handleSetMain(idx)}
              size="small"
            >
              {img.is_main ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          )}
          <IconButton
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              color: "grey.500",
              zIndex: 2,
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: 1,
              p: "2px",
              "&:hover": { color: "error.main", backgroundColor: "white" },
            }}
            onClick={() => handleDelete(idx)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ImageThumb>
      );
    },
    [localImages, pendingFiles, uploadQueue] // Dependencies for useCallback
  );

  return (
    <Box width="100%" sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
        {localImages.length < maxImages && ( // Only show if not maxed out
          <DropZone
            isdragactive={dragActive ? 1 : 0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              type="file"
              ref={inputRef}
              onChange={handleInputChange}
              style={{ display: "none" }}
              multiple={maxImages > 1}
              accept="image/*"
            />
            <Box textAlign="center">
              <AddIcon sx={{ fontSize: 48, color: "#aaa" }} />
              <Typography variant="body2" color="textSecondary">
                Добавить изображение
              </Typography>
            </Box>
          </DropZone>
        )}
        {localImages.map(renderImage)}
      </Box>
      {loading && <CircularProgress sx={{ mt: 2 }} />}{" "}
      {/* This `loading` is for overall component loading (e.g. initial fetch), not per-image upload */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default ImageUploadManager;
