import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

const Posts = ({ posts }) => {
  // Если нет постов, отображаем сообщение
  if (!posts || posts.length === 0) {
    return <Typography variant="body1">Нет доступных постов.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              {/* Изображение поста */}
              {post.image_url && (
                <CardMedia
                  component="div" // Используем div для гибкости
                  sx={{
                    height: 140, // Фиксированная высота
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5", // Цвет фона для свободного пространства
                    "& img": {
                      maxWidth: "100%", // Изображение не превышает ширину контейнера
                      maxHeight: "100%", // Изображение не превышает высоту контейнера
                      objectFit: "contain", // Вписываем изображение, сохраняя пропорции
                    },
                  }}
                >
                  <img src={post.image_url} alt={post.title} />
                </CardMedia>
              )}

              {/* Содержание карточки */}
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.length > 100
                    ? `${post.content.substring(0, 100)}...`
                    : post.content}
                </Typography>
              </CardContent>
            </CardActionArea>

            {/* Действия */}
            <CardActions>
              {post.source && (
                <Button
                  size="small"
                  color="primary"
                  href={post.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Источник
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
