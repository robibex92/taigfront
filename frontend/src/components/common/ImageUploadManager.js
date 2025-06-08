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
  const { accessToken } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [activeUploads, setActiveUploads] = useState(0);
  const MAX_CONCURRENT_UPLOADS = 3;
  const isMounted = useRef(true);

  useEffect(() => {
    console.log("ImageUploadManager: Mounted");
    isMounted.current = true;
    return () => {
      console.log("ImageUploadManager: Unmounting");
      isMounted.current = false;
      localImages.forEach((img) => {
        if (img.url && img.url.startsWith("blob:")) {
          console.log("Revoking blob URL:", img.url);
          URL.revokeObjectURL(img.url);
        }
      });
      pendingFiles.forEach((file) => {
        if (
          file.preview &&
          file.preview.url &&
          file.preview.url.startsWith("blob:")
        ) {
          console.log("Revoking pending file blob URL:", file.preview.url);
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
    console.log("ImageUploadManager: Initial load effect", { id, type });
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
          console.log("ImageUploadManager: Component unmounted during fetch");
          return;
        }
        console.log("ImageUploadManager: Fetch images success", data);
        if (data.images && data.images.length > 0) {
          const fixedImages = data.images.map((img, idx) => ({
            ...img,
            url: img.url || img.image_url,
            is_main: idx === 0,
            is_pending: false,
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
        console.log("ImageUploadManager: Initial load complete");
        setLoading(false);
        setInitialLoadComplete(true);
      });
  }, [id, type, accessToken]);

  const memoizedPropImages = useMemo(() => propImages, [propImages]);

  useEffect(() => {
    console.log("ImageUploadManager: Prop images effect", {
      propImages: memoizedPropImages,
      id,
    });
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
      console.log("ImageUploadManager: hasPendingFiles", {
        pendingFilesLength: pendingFiles.length,
      });
      return pendingFiles.length > 0;
    },
  }));

  const processUploadQueue = async () => {
    console.log("ImageUploadManager: Processing queue", {
      uploadQueueLength: uploadQueue.length,
      activeUploads,
      isMounted: isMounted.current,
    });
    if (
      !isMounted.current ||
      activeUploads >= MAX_CONCURRENT_UPLOADS ||
      uploadQueue.length === 0
    ) {
      console.log("ImageUploadManager: Queue processing stopped", {
        isMounted: isMounted.current,
        activeUploads,
        queueLength: uploadQueue.length,
      });
      return;
    }

    const nextFile = uploadQueue[0];
    setUploadQueue((prev) => {
      console.log("ImageUploadManager: Removing file from queue", {
        file: nextFile.file.name,
      });
      return prev.slice(1);
    });
    setActiveUploads((prev) => {
      console.log("ImageUploadManager: Incrementing active uploads", {
        newActiveUploads: prev + 1,
      });
      return prev + 1;
    });

    try {
      console.log("ImageUploadManager: Uploading file", {
        file: nextFile.file.name,
      });
      const formData = new FormData();
      formData.append("photos", nextFile.file, nextFile.file.name);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("ImageUploadManager: Upload timeout", {
          file: nextFile.file.name,
        });
        controller.abort();
      }, 10000);
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!isMounted.current) {
        console.log("ImageUploadManager: Component unmounted during upload");
        return;
      }

      if (!res.ok) {
        console.error("ImageUploadManager: Upload failed", {
          status: res.status,
        });
        throw new Error("Failed to upload image");
      }

      const responseData = await res.json();
      const uploadedUrl = responseData.fileUrls?.[0];
      console.log("ImageUploadManager: Upload response", { uploadedUrl });

      if (!uploadedUrl) {
        console.error("ImageUploadManager: No URL returned from server");
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
                is_pending: false,
                file: null,
              }
            : img
        );
        console.log("ImageUploadManager: Updated localImages", { newImages });
        onImagesChange(newImages.filter((img) => !img.is_pending));
        return newImages;
      });

      setPendingFiles((prev) => {
        const newPending = prev.filter((f) => f !== nextFile.file);
        console.log("ImageUploadManager: Updated pendingFiles", {
          newPendingLength: newPending.length,
        });
        return newPending;
      });
    } catch (error) {
      if (!isMounted.current) return;
      console.error("ImageUploadManager: Error uploading file", {
        error,
        file: nextFile.file.name,
      });
      setSnackbar({
        open: true,
        message: `Ошибка загрузки ${nextFile.file.name}`,
        severity: "error",
      });
    } finally {
      if (isMounted.current) {
        setActiveUploads((prev) => {
          console.log("ImageUploadManager: Decrementing active uploads", {
            newActiveUploads: prev - 1,
          });
          return prev - 1;
        });
      }
    }
  };

  useEffect(() => {
    console.log("ImageUploadManager: Queue processing effect", {
      uploadQueueLength: uploadQueue.length,
      activeUploads,
    });
    if (uploadQueue.length > 0 && activeUploads < MAX_CONCURRENT_UPLOADS) {
      processUploadQueue();
    }
  }, [uploadQueue, activeUploads]);

  const handleFiles = async (files) => {
    console.log("ImageUploadManager: Handling files", {
      fileCount: files.length,
    });
    if (
      !files.length ||
      localImages.length + pendingFiles.length + files.length > maxImages
    ) {
      console.log("ImageUploadManager: Max images limit reached", {
        maxImages,
      });
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
        if (isHeic) {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.92,
            });
            const convertedFile = new File(
              [convertedBlob],
              file.name.replace(/\.(heic|heif)$/i, ".jpg"),
              { type: "image/jpeg" }
            );
            console.log("ImageUploadManager: Converted HEIC file", {
              file: convertedFile.name,
            });
            return convertedFile;
          } catch (e) {
            console.error("ImageUploadManager: HEIC conversion failed", {
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
      console.log("ImageUploadManager: No valid files to process");
      return;
    }

    const newImages = [];
    validFiles.forEach((file) => {
      if (
        pendingFiles.some((f) => f.name === file.name && f.size === file.size)
      ) {
        console.log("ImageUploadManager: Skipping duplicate file", {
          file: file.name,
        });
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      const preview = {
        url: blobUrl,
        is_main: localImages.length === 0,
        id: null,
        is_pending: true,
        file: file,
        blobUrl: blobUrl,
      };
      console.log("ImageUploadManager: Adding file to queue", {
        file: file.name,
        blobUrl,
      });
      setLocalImages((prev) => [...prev, preview]);
      setPendingFiles((prev) => [...prev, file]);
      setUploadQueue((prev) => [...prev, { file, preview }]);
      newImages.push({
        url: blobUrl,
        is_main: localImages.length === 0,
        id: null,
        is_pending: true,
        file: file,
      });
    });

    if (newImages.length > 0) {
      onImagesChange([...localImages, ...newImages]);
    }
  };

  const handleInputChange = (e) => {
    console.log("ImageUploadManager: Input change detected");
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleDelete = async (index) => {
    console.log("ImageUploadManager: Deleting image", { index });
    const imageToDelete = localImages[index];
    setLoading(true);
    try {
      if (imageToDelete?.url && imageToDelete.url.startsWith("blob:")) {
        console.log("ImageUploadManager: Revoking blob URL for deletion", {
          url: imageToDelete.url,
        });
        URL.revokeObjectURL(imageToDelete.url);
      }

      if (imageToDelete?.is_pending && imageToDelete.url.startsWith("blob:")) {
        setPendingFiles((prev) =>
          prev.filter((file) => file !== imageToDelete.file)
        );
        setUploadQueue((prev) =>
          prev.filter((item) => item.file !== imageToDelete.file)
        );
        const updatedImages = localImages.filter((_, i) => i !== index);
        setLocalImages(updatedImages);
        onImagesChange(updatedImages);
        console.log("ImageUploadManager: Deleted pending image", {
          updatedImagesLength: updatedImages.length,
        });
        return;
      }

      if (imageToDelete?.id && id) {
        console.log("ImageUploadManager: Sending delete request to server", {
          imageId: imageToDelete.id,
          adId: id,
        });
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
      console.log("ImageUploadManager: Image deleted", {
        updatedImagesLength: updatedImages.length,
      });
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
    console.log("ImageUploadManager: Setting main image", { index });
    const updatedImages = localImages.map((img, idx) => ({
      ...img,
      is_main: idx === index,
    }));
    setLocalImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const uploadPendingFiles = async () => {
    console.log("ImageUploadManager: uploadPendingFiles called", {
      pendingFilesLength: pendingFiles.length,
    });
    if (pendingFiles.length === 0) {
      console.log("ImageUploadManager: No pending files to upload");
      return localImages.filter((img) => !img.is_pending);
    }

    while (uploadQueue.length > 0 || activeUploads > 0) {
      console.log("ImageUploadManager: Waiting for queue to complete", {
        uploadQueueLength: uploadQueue.length,
        activeUploads,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("ImageUploadManager: Uploads completed", { localImages });
    return localImages.filter((img) => !img.is_pending);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    console.log("ImageUploadManager: Drag over");
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    console.log("ImageUploadManager: Drag leave");
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log("ImageUploadManager: Drop files");
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const renderImage = useCallback(
    (img, idx) => {
      console.log("ImageUploadManager: Rendering image", {
        index: idx,
        url: img.url,
        isPending: img.is_pending,
      });
      return (
        <ImageThumb
          key={`${img.id || "pending"}-${img.url}-${idx}`}
          selected={img.is_main}
        >
          <ThumbImg src={img.url} alt={`Объявление ${idx + 1}`} />
          {img.is_pending && (
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
    [localImages.length]
  );

  return (
    <Box width="100%" sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
        {localImages.length + pendingFiles.length < maxImages && (
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
      {loading && <CircularProgress sx={{ mt: 2 }} />}
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
