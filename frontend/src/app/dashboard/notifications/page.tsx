'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Send, CheckCheck } from 'lucide-react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const { refreshUnreadCount } = useNotifications();
  
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    sendTo: 'all' as 'all' | 'selected',
    selectedUsers: [] as number[],
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notifications/');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.showError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await apiClient.get('/users/');
      if (response.data.success) {
        setUsers(response.data.data || response.data.results || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color="#10b981" />;
      case 'error':
        return <AlertCircle size={24} color="#ef4444" />;
      case 'warning':
        return <AlertCircle size={24} color="#f59e0b" />;
      case 'info':
      default:
        return <Info size={24} color="#3b82f6" />;
    }
  };

  const getColorByType = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Note: You may need to implement delete endpoint in backend
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.showSuccess('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.showError('Failed to delete notification');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await apiClient.post(`/notifications/${id}/mark-read/`);
      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        refreshUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.showError('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await apiClient.post('/notifications/mark-all-read/');
      if (response.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        refreshUnreadCount();
        toast.showSuccess('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.showError('Failed to mark all as read');
    }
  };

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.showError('Please fill in all fields');
      return;
    }

    if (newNotification.sendTo === 'selected' && newNotification.selectedUsers.length === 0) {
      toast.showError('Please select at least one user');
      return;
    }

    try {
      setSending(true);
      const payload: any = {
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
      };

      if (newNotification.sendTo === 'selected') {
        payload.user_ids = newNotification.selectedUsers;
      }

      const response = await apiClient.post('/notifications/send/', payload);
      if (response.data.success) {
        toast.showSuccess(response.data.message);
        setSendDialogOpen(false);
        setNewNotification({ 
          title: '', 
          message: '', 
          type: 'info',
          sendTo: 'all',
          selectedUsers: [],
        });
        fetchNotifications();
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.showError(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const isAdmin = user?.is_staff || user?.is_superuser;

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Breadcrumbs items={[{ label: 'Notifications' }]} />
      
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h4" fontWeight={600}>Notifications</Typography>
              {unreadCount > 0 && (
                <Chip label={`${unreadCount} unread`} color="primary" size="small" />
              )}
            </Box>
            <Box display="flex" gap={1}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<CheckCheck size={16} />}
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Send size={16} />}
                  onClick={() => setSendDialogOpen(true)}
                >
                  Send Notification
                </Button>
              )}
            </Box>
          </Box>

          {notifications.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Bell size={48} style={{ margin: '0 auto', opacity: 0.3 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                      borderRadius: 2,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        {getIconByType(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="body1" fontWeight={notification.is_read ? 400 : 600}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getColorByType(notification.type) as any}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {formatTime(notification.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={sendDialogOpen} 
        onClose={() => setSendDialogOpen(false)}
        onTransitionEnter={fetchUsers}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              size="small"
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={newNotification.type}
                label="Type"
                onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Send To</InputLabel>
              <Select
                value={newNotification.sendTo}
                label="Send To"
                onChange={(e) => setNewNotification({ ...newNotification, sendTo: e.target.value as any, selectedUsers: [] })}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="selected">Selected Users</MenuItem>
              </Select>
            </FormControl>
            {newNotification.sendTo === 'selected' && (
              <FormControl fullWidth size="small">
                <InputLabel>Select Users</InputLabel>
                <Select
                  multiple
                  value={newNotification.selectedUsers}
                  label="Select Users"
                  onChange={(e) => setNewNotification({ ...newNotification, selectedUsers: e.target.value as number[] })}
                  disabled={loadingUsers}
                  renderValue={(selected) => {
                    const selectedCount = (selected as number[]).length;
                    return `${selectedCount} user${selectedCount !== 1 ? 's' : ''} selected`;
                  }}
                >
                  {loadingUsers ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.email} ({u.first_name} {u.last_name})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
            <Typography variant="caption" color="text.secondary">
              {newNotification.sendTo === 'all' 
                ? 'This notification will be sent to all users'
                : `This notification will be sent to ${newNotification.selectedUsers.length} selected user(s)`
              }
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendNotification}
            disabled={sending}
            startIcon={sending ? <CircularProgress size={16} /> : <Send size={16} />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
