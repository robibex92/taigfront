import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography } from "@mui/material";
import Posts from "../components/news/Posts";
import AddPostDialog from "../components/news/AddPostDialog";

const News = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка постов
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts?status=active`);
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка постов при монтировании компонента
  useEffect(() => {
    if (!isLoaded) {
      loadPosts();
      setIsLoaded(true);
    }
  }, [isLoaded, loadPosts]);

  // Состояние для управления диалогом добавления поста
  const [openDialog, setOpenDialog] = useState(false);

  // Обработка отправки нового поста
  const handleAddPost = async (newPostData) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPostData,
          status: "active",
          source: "web",
          marker: "default",
        }),
      });
      const newPost = await response.json();
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Новостная лента
      </Typography>

      <AddPostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleAddPost}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Ошибка: {error}
        </Typography>
      )}

      {loading ? <Typography>Загрузка...</Typography> : <Posts posts={posts} />}
    </Container>
  );
};

export default News;
