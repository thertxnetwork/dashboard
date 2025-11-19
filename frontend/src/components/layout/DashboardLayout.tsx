'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Users,
  Database,
  FileText,
  Bell,
  Shield,
  Activity,
  Settings,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Phone,
  Search,
  UserPlus,
  List as ListIcon,
  BarChart,
  AlertTriangle,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Dashboard', icon: <Home size={18} />, path: '/dashboard', adminOnly: false },
    { text: 'Users', icon: <Users size={18} />, path: '/dashboard/users', adminOnly: false },
    { text: 'Database', icon: <Database size={18} />, path: '/dashboard/database', adminOnly: false },
    { text: 'Reports', icon: <FileText size={18} />, path: '/dashboard/reports', adminOnly: false },
    { text: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/notifications', adminOnly: false },
    { text: 'Security', icon: <Shield size={18} />, path: '/dashboard/security', adminOnly: false },
    { text: 'Monitoring', icon: <Activity size={18} />, path: '/dashboard/monitoring', adminOnly: false },
    { text: 'Settings', icon: <Settings size={18} />, path: '/dashboard/settings', adminOnly: false },
    // Phone Registry menu items (Admin only)
    { text: 'Phone Check', icon: <Search size={18} />, path: '/dashboard/phone-check', adminOnly: true },
    { text: 'Phone Register', icon: <UserPlus size={18} />, path: '/dashboard/phone-register', adminOnly: true },
    { text: 'Phone Bulk', icon: <Users size={18} />, path: '/dashboard/phone-bulk', adminOnly: true },
    { text: 'Phone List', icon: <ListIcon size={18} />, path: '/dashboard/phone-list', adminOnly: true },
    { text: 'Phone Analytics', icon: <BarChart size={18} />, path: '/dashboard/phone-analytics', adminOnly: true },
    { text: 'Spam Analyzer', icon: <AlertTriangle size={18} />, path: '/dashboard/spam-analyzer', adminOnly: true },
  ];

  // Filter menu items based on user role
  const isAdmin = user?.is_staff || user?.is_superuser;
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  // Debug logging for admin status
  useEffect(() => {
    if (user) {
      console.log('User object:', user);
      console.log('Is Admin:', isAdmin);
      console.log('is_staff:', user.is_staff);
      console.log('is_superuser:', user.is_superuser);
      console.log('Filtered menu items count:', filteredMenuItems.length);
    }
  }, [user, isAdmin]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            A
          </Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            Admin
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  minHeight: 36,
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  }} 
                />
                {isActive && (
                  <ChevronRight size={16} color={muiTheme.palette.primary.main} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.selected',
            },
          }}
          onClick={handleMenuOpen}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
            {user?.first_name?.[0] || user?.email?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.first_name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon size={20} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>
          <IconButton 
            color="inherit" 
            onClick={() => router.push('/dashboard/notifications')}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Bell size={18} />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
              {user?.first_name?.[0] || user?.email?.[0] || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem 
          onClick={() => { 
            handleMenuClose(); 
            router.push('/dashboard/profile'); 
          }}
        >
          <UserIcon size={16} style={{ marginRight: 12 }} /> Profile
        </MenuItem>
        <MenuItem 
          onClick={() => { 
            handleMenuClose(); 
            router.push('/dashboard/settings'); 
          }}
        >
          <Settings size={16} style={{ marginRight: 12 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 12 }} /> Logout
        </MenuItem>
      </Menu>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          overflowX: 'hidden',
          maxWidth: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
