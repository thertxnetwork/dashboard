'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await apiClient.get('/notifications/');
      if (response.data.success) {
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
