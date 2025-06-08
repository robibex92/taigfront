import React from "react";
import { AppBar, Toolbar, Typography, Container, Grid } from "@mui/material";

const Footer = () => {
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "transparent",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <Grid spacing={2} container alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography>
                  Администрация сайта не занимается продажей товаров и не несет
                  ответственности за содержание объявлений. Если вы обнаружили
                  нарушение, пожалуйста, сообщите нам.
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Footer;
