import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const AnnouncementActions = ({
  announcement,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  showMenu = false
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    switch (action) {
      case 'edit':
        onEdit(announcement);
        break;
      case 'delete':
        onDelete(announcement);
        break;
      case 'archive':
        onArchive(announcement);
        break;
      case 'unarchive':
        onUnarchive(announcement);
        break;
      default:
        break;
    }
  };

  if (!showMenu) {
    return (
      <Box>
        <Tooltip title="Редактировать">
          <IconButton
            size="small"
            onClick={() => handleAction('edit')}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить">
          <IconButton
            size="small"
            onClick={() => handleAction('delete')}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        {announcement.status === 'active' ? (
          <MenuItem onClick={() => handleAction('archive')}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>В архив</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('unarchive')}>
            <ListItemIcon>
              <UnarchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Из архива</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>
            Удалить
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AnnouncementActions; 