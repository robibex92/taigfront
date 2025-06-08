import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography } from "@mui/material";
import Posts from "../components/news/Posts";
import AddPostDialog from "../components/news/AddPostDialog";
import { API_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, accessToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Получение статуса пользователя
  const fetchUserStatus = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${API_URL}/users/me/status`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user status");
      }
      const data = await response.json();
      // Предполагаем, что статус приходит в data.status
      setIsAdmin(data.status === "admin");
    } catch (err) {
      setIsAdmin(false);
    }
  }, [accessToken]);

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
      fetchUserStatus();
      setIsLoaded(true);
    }
  }, [isLoaded, loadPosts, fetchUserStatus]);

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

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      const res = await fetch(`${API_URL}/users/me/status`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      setIsAdmin(data.status === 'admin');
    };
    fetchStatus();
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Новостная лента
      </Typography>

      {user && isAdmin && (
        <AddPostDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleAddPost}
        />
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Ошибка: {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : (
        <Posts posts={posts} user={user ? { ...user, isAdmin } : null} setPosts={setPosts} />
      )}
    </Container>
  );
};

export default News;
