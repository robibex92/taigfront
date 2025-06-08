import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const Content = ({ content }) => {
  // Если нет объявления (content), возвращаем заглушку или сообщение об ошибке
  if (!content) {
    return <Typography>Данные объявления не найдены</Typography>;
  }

  return (
    <Box>
      <Divider textAlign="left" sx={{ my: 2 }}>
        Описание объявления
      </Divider>

      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};

export default Content;
