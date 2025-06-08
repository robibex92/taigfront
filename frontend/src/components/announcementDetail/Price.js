import React from "react";
import { Typography } from "@mui/material";

const Price = ({ formattedPrice }) => (
  <Typography
    variant="h4"
    color="primary"
    sx={{
      fontWeight: "bold",
      p: 2,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      borderRadius: 2,
      textAlign: "center",
    }}
  >
    {formattedPrice ? `Цена: ${formattedPrice}` : "Цена не указана"}
  </Typography>
);

export default Price;
