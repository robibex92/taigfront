import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

const NewsDialog = ({ open, onClose, post, user, onEdit, onDelete }) => {
  if (!post) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{post.title}</DialogTitle>
      <DialogContent>
        {post.image_url && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <img
              src={post.image_url}
              alt={post.title}
              style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
            />
          </Box>
        )}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          {post.content}
        </Typography>
        {post.source && (
          <Button
            size="small"
            color="primary"
            href={post.source}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mb: 2 }}
          >
            Источник
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
        {user?.isAdmin && (
          <>
            <Button color="warning" onClick={() => onEdit?.(post)}>
              Редактировать
            </Button>
            <Button color="error" onClick={() => onDelete?.(post)}>
              Удалить
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewsDialog;
