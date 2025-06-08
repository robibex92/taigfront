import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import ImageUploadManager from "../common/ImageUploadManager";
import PriceInput from "../common/PriceInput";

const AnnouncementCreationStep = ({
  images,
  onImagesChange,
  imageUploadManagerRef,
  mainImageIndex,
  onMainImageChange,
  onRemoveImage,
  disableNext,
}) => {
  const { control, watch, setValue } = useFormContext();
  const isPriceNotSpecified = watch("isPriceNotSpecified");
  const price = watch("price");

  return (
    <Box>
      <Controller
        name="title"
        control={control}
        rules={{ required: "Введите заголовок" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Заголовок*"
            fullWidth
            margin="normal"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="content"
        control={control}
        rules={{ required: "Введите описание" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Описание*"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 2 },
          mt: 2,
        }}
      >
        {!isPriceNotSpecified && (
          <Controller
            name="price"
            control={control}
            rules={{
              validate: (value) => {
                if (isPriceNotSpecified) return true;
                const cleanValue = value?.replace(/\s/g, "") || "";
                if (!cleanValue) return "Введите цену";
                if (!/^\d+$/.test(cleanValue)) return "Только цифры";
                if (parseInt(cleanValue, 10) < 1)
                  return "Цена должна быть больше 0";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <PriceInput
                price={field.value}
                onPriceChange={(val) =>
                  setValue("price", val, { shouldValidate: true })
                }
                isPriceNotSpecified={isPriceNotSpecified}
                onPriceNotSpecifiedChange={(val) => {
                  setValue("isPriceNotSpecified", val, {
                    shouldValidate: true,
                  });
                  setValue("price", val ? "" : "0", { shouldValidate: true });
                }}
                onBlur={field.onBlur}
                error={!isPriceNotSpecified && !!fieldState.error}
                helperText={
                  !isPriceNotSpecified ? fieldState.error?.message : ""
                }
              />
            )}
          />
        )}

        <Controller
          name="isPriceNotSpecified"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.checked) setValue("price", "");
                  }}
                />
              }
              label="Цена не указана"
              labelPlacement="end"
              sx={{ whiteSpace: "nowrap" }}
            />
          )}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Вы можете добавить до 5 изображений, выбрать главное (звезда) или
          удалить ненужные.
        </Typography>
        <ImageUploadManager
          ref={imageUploadManagerRef}
          images={images}
          onImagesChange={onImagesChange}
          mainImageIndex={mainImageIndex}
          onMainImageChange={onMainImageChange}
          onRemoveImage={onRemoveImage}
          maxImages={5}
        />
      </Box>
    </Box>
  );
};

export default AnnouncementCreationStep;
