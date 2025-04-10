import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Tabs, 
  Tab,
  CircularProgress
} from '@mui/material';

import { useAuth } from '../context/AuthContext';

const UserAnnouncementsTabs = ({ 
  activeTab: externalActiveTab,
  onTabChange
}) => {
  const { user: currentAuthUser } = useAuth();
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'active');
  const [announcementCounts, setAnnouncementCounts] = useState({
    active: 0,
    archive: 0,
    draft: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserAnnouncementCounts = useCallback(async () => {
    if (!currentAuthUser) return;

    setLoading(true);
    setError(null);

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('user_id')
        .eq('username', currentAuthUser.username)
        .single();

      if (!userData) {
        throw new Error('Пользователь не найден');
      }

      // Получаем количество объявлений по статусам
      const { data, error } = await supabase
        .from('ads')
        .select('status')
        .eq('user_id', userData.user_id);

      if (error) throw error;

      // Подсчет объявлений по статусам
      const counts = {
        active: data.filter(a => a.status === 'active').length,
        archive: data.filter(a => a.status === 'archived').length,
        draft: data.filter(a => a.status === 'deleted').length
      };

      // Сохраняем количество объявлений
      setAnnouncementCounts(counts);
    } catch (err) {
      console.error('Ошибка загрузки объявлений:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentAuthUser]);

  useEffect(() => {
    fetchUserAnnouncementCounts();
  }, [fetchUserAnnouncementCounts]);

  useEffect(() => {
    if (externalActiveTab !== undefined) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  const a11yProps = (index) => ({
    id: `announcement-tab-${index}`,
    'aria-controls': `announcement-tabpanel-${index}`,
  });

  if (error) {
    return <Box>Ошибка загрузки объявлений: {error.message}</Box>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="announcement tabs"
          variant="fullWidth"
        >
          <Tab 
            value="active"
            label={`Активные (${announcementCounts.active})`} 
            {...a11yProps(0)} 
          />
          <Tab 
            value="archive"
            label={`В архиве (${announcementCounts.archive})`} 
            {...a11yProps(1)} 
          />
          <Tab 
            value="draft"
            label={`Черновики (${announcementCounts.draft})`} 
            {...a11yProps(2)} 
          />
        </Tabs>
      )}
    </Box>
  );
};

export default UserAnnouncementsTabs;
