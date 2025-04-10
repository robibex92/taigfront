const API_URL = process.env.REACT_APP_API_URL;

// Helper function to convert object to query string
const objectToQueryString = (obj) => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  return params.toString();
};

// Create the API object
const announcementApi = {
  // Get all announcements with optional filters
  getAnnouncements: async (filters = {}) => {
    try {
      // Convert filters object to query string
      const queryString = objectToQueryString(filters);
      const url = `${API_URL}/posts${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching posts from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include' // Изменил на include для передачи cookies
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received posts:', data);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', {
        message: error.message,
        stack: error.stack,
        url: `${API_URL}/posts`
      });
      return [];
    }
  },

  // Get a single announcement by ID
  getAnnouncement: async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Create a new announcement
  createAnnouncement: async (announcementData) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update an existing announcement
  updateAnnouncement: async (id, announcementData) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete an announcement
  deleteAnnouncement: async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Increment view count for an announcement
  incrementViews: async (id) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${id}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  // Get user's houses
  getUserHouses: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/houses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user houses:', error);
      throw error;
    }
  },

  // Get telegram messages for a post
  getTelegramMessages: async (postId) => {
    try {
      const response = await fetch(`${API_URL}/telegram/messages/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching telegram messages:', error);
      throw error;
    }
  },

  // Create a new telegram message
  createTelegramMessage: async (messageData) => {
    try {
      const response = await fetch(`${API_URL}/telegram/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating telegram message:', error);
      throw error;
    }
  },

  // Archive an announcement
  archiveAnnouncement: async (id) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${id}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error archiving announcement:', error);
      throw error;
    }
  },

  // Unarchive an announcement
  unarchiveAnnouncement: async (id) => {
    try {
      const response = await fetch(`${API_URL}/announcements/${id}/unarchive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error unarchiving announcement:', error);
      throw error;
    }
  }
};

// Export individual functions
export const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  incrementViews,
  getUserHouses,
  getTelegramMessages,
  createTelegramMessage,
  archiveAnnouncement,
  unarchiveAnnouncement
} = announcementApi;

// Export the API object
export { announcementApi };

// Also export as default
export default announcementApi; 