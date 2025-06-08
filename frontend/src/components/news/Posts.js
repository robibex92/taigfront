import React, { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import NewsDialog from './NewsDialog';
import EditPostDialog from './EditPostDialog';

import { API_URL } from "../../config/config"; // Путь к файлу конфигурации

// ! Важно: user должен быть передан в Posts как пропс
// setPosts пробрасывается из News.js
const Posts = ({ posts, user, setPosts }) => {
  // Для диалога
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };
  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditDialogOpen(true);
  };
  const handleDelete = async (post) => {
    if (!window.confirm(`Удалить новость «${post.title}»?`)) return;
    try {
      // 1. Если есть изображение, сначала удаляем файл
      if (post.image_url) {
        try {
          // Получаем токен авторизации из localStorage (или используйте свой способ)
          const accessToken = localStorage.getItem('accessToken');
          const deleteImgResp = await fetch(`${API_URL}/upload/delete-image?path=${encodeURIComponent(post.image_url)}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          if (!deleteImgResp.ok) {
            // Можно уведомить пользователя, но не блокировать удаление поста
            console.warn('Не удалось удалить файл изображения:', post.image_url);
          }
        } catch (imgErr) {
          console.warn('Ошибка при удалении изображения:', imgErr);
        }
      }
      // 2. Удаляем сам пост
      const response = await fetch(`${API_URL}/posts/${post.id}/close`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        handleCloseDialog();
      } else {
        alert('Ошибка при удалении поста');
      }
    } catch (e) {
      alert('Ошибка при удалении поста');
    }
  };


  if (!posts || posts.length === 0) {
    return <Typography variant="body1">Нет доступных постов.</Typography>;
  }

  // Стили для обрезки текста по строкам
  const clampStyle = (lines = 2) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: `${lines * 1.4}em`, // чтобы всегда было две/три строки по высоте
  });

  return (
    <>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ maxWidth: 345, height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardActionArea onClick={() => { setSelectedPost(post); setOpenDialog(true); }} sx={{ height: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                {/* Изображение или серый фон */}
                {post.image_url ? (
                  <CardMedia
                    component="div"
                    sx={{
                      height: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      '& img': {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      },
                    }}
                  >
                    <img src={post.image_url} alt={post.title} />
                  </CardMedia>
                ) : (
                  <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }}>
                    <ImageIcon sx={{ fontSize: 48, color: '#bdbdbd' }} />
                  </Box>
                )}

                {/* Содержание карточки */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={clampStyle(2)}>
                    {post.title || <>&nbsp;</>}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={clampStyle(3)}>
                    {post.content || <>&nbsp;</>}
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
      <NewsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        post={selectedPost}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditPostDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        post={selectedPost}
        onSave={(updatedPost) => {
          setPosts((prev) => prev.map((p) => p.id === updatedPost.id ? updatedPost : p));
          setEditDialogOpen(false);
          setSelectedPost(updatedPost);
        }}
      />
    </>
  );
};

export default Posts;
