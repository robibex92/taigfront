import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Skeleton } from '@mui/material';
import { Edit as EditIcon, ArrowBackIos as ArrowBackIosIcon, ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';
import EditAnnouncementModal from '../EditAnnouncementModal'; // Import the modal
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../../config/config';

// Navigation buttons component
const NavigationButtons = ({ onPrev, onNext }) => (
  <>
    <IconButton sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', width: '30px', height: '100%', borderRadius: 0, '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' }}} onClick={onPrev}>
      <ArrowBackIosIcon fontSize="small" sx={{ color: 'white' }} />
    </IconButton>
    <IconButton sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', width: '30px', height: '100%', borderRadius: 0, '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' }}} onClick={onNext}>
      <ArrowForwardIosIcon fontSize="small" sx={{ color: 'white' }} />
    </IconButton>
  </>
);

// Slide indicators component
const SlideIndicators = ({ total, current }) => (
  <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 11, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', px: 1, py: 0.5, borderRadius: 2 }}>
    {Array.from({ length: total }).map((_, index) => (
      <Box key={index} sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: index === current ? 'white' : 'rgba(255,255,255,0.5)' }} />
    ))}
  </Box>
);

const AnnouncementImageSlider = ({ announcementId, onRefreshAnnouncements, isUserAnnouncementsPage, onEditAnnouncement, isMobile = false }) => {
  const [images, setImages] = useState([]); // Store images
  const [localImageIndex, setLocalImageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fetch images for the announcement
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/ad-images/${announcementId}`);
        const data = await response.json();
        if (data && data.data) {
          setImages(data.data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setImageError(true);
      }
    };

    fetchImages();
  }, [announcementId]);

  // Sort images based on the 'is_main' property
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_main === b.is_main) return 0;
    return a.is_main ? -1 : 1;
  });

  const handlePrevImage = (event) => {
    event.stopPropagation();
    const imagesCount = sortedImages.length;
    const newIndex = localImageIndex > 0 ? localImageIndex - 1 : imagesCount - 1;
    setLocalImageIndex(newIndex);
    setIsImageLoading(true);
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    const imagesCount = sortedImages.length;
    const newIndex = localImageIndex < imagesCount - 1 ? localImageIndex + 1 : 0;
    setLocalImageIndex(newIndex);
    setIsImageLoading(true);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    if (isUserAnnouncementsPage) {
      setIsEditModalOpen(true); 
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); 
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  return (
    <>
      <Box className="announcement-image-slider" sx={{ position: 'relative', width: '100%', maxWidth: 400, height: isMobile ? 200 : 250, backgroundColor: !sortedImages.length ? 'grey.200' : 'transparent' }}>
        {imageError ? (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 0, 0, 0.5)', zIndex: 13 }}>
            <Typography variant="body2" color="error">Error loading image</Typography>
          </Box>
        ) : (
          <>
            {isImageLoading && (
              <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', top: 0, left: 0 }} />
            )}
            {sortedImages.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.img
                  key={localImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={sortedImages[localImageIndex].image_url}
                  alt={`Image ${localImageIndex + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: isImageLoading ? 'none' : 'block' }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </AnimatePresence>
            )}
          </>
        )}

        {sortedImages.length > 1 && (
          <NavigationButtons onPrev={handlePrevImage} onNext={handleNextImage} />
        )}

        {sortedImages.length > 1 && (
          <SlideIndicators total={sortedImages.length} current={localImageIndex} />
        )}

        {isUserAnnouncementsPage && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s', zIndex: 12 }} onClick={handleEditClick}>
            <IconButton sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' } }}>
              <EditIcon fontSize="large" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Edit modal */}
      {isEditModalOpen && (
        <EditAnnouncementModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialAnnouncement={announcementId}
          onDelete={(id) => { onRefreshAnnouncements && onRefreshAnnouncements(); }}
          onExtend={(id) => { onRefreshAnnouncements && onRefreshAnnouncements(); }}
          onUpdated={(id) => { onRefreshAnnouncements && onRefreshAnnouncements(); }}
          onArchive={(id) => { onRefreshAnnouncements && onRefreshAnnouncements(); }}
        />
      )}
    </>
  );
};

AnnouncementImageSlider.propTypes = {
  announcementId: PropTypes.string.isRequired,
  onRefreshAnnouncements: PropTypes.func,
  isUserAnnouncementsPage: PropTypes.bool,
  onEditAnnouncement: PropTypes.func,
  isMobile: PropTypes.bool
};

export default AnnouncementImageSlider;
