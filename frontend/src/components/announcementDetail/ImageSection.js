import React from "react";
import { Grid, Paper } from "@mui/material";
import AnnouncementImageSlider from "../announcements/AnnouncementImageSlider";

const ImageSection = ({ announcement, ...props }) => {
  if (!announcement || (!announcement.id && !announcement._id)) {
    return <div>Ошибка: данных не получено</div>;
  }

  return (
    <Grid sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          p: 2,
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Передаем только ID объявления */}
        <AnnouncementImageSlider
          announcementId={announcement.id || announcement._id}
          {...props}
        />
      </Paper>
    </Grid>
  );
};

export default ImageSection;
