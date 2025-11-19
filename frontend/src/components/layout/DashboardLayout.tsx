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

const drawerWidth = 280;

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
    // Main section
    { text: 'Dashboard', icon: <Home size={20} />, path: '/dashboard', adminOnly: false, section: 'main' },
    { text: 'Users', icon: <Users size={20} />, path: '/dashboard/users', adminOnly: false, section: 'main' },
    { text: 'Database', icon: <Database size={20} />, path: '/dashboard/database', adminOnly: false, section: 'main' },
    { text: 'Reports', icon: <FileText size={20} />, path: '/dashboard/reports', adminOnly: false, section: 'main' },
    { text: 'Notifications', icon: <Bell size={20} />, path: '/dashboard/notifications', adminOnly: false, section: 'main' },
    
    // Phone Registry section (Admin only)
    { text: 'Phone Check', icon: <Search size={20} />, path: '/dashboard/phone-check', adminOnly: true, section: 'phone' },
    { text: 'Phone Register', icon: <UserPlus size={20} />, path: '/dashboard/phone-register', adminOnly: true, section: 'phone' },
    { text: 'Phone Bulk', icon: <Users size={20} />, path: '/dashboard/phone-bulk', adminOnly: true, section: 'phone' },
    { text: 'Phone List', icon: <ListIcon size={20} />, path: '/dashboard/phone-list', adminOnly: true, section: 'phone' },
    { text: 'Phone Analytics', icon: <BarChart size={20} />, path: '/dashboard/phone-analytics', adminOnly: true, section: 'phone' },
    { text: 'Spam Analyzer', icon: <AlertTriangle size={20} />, path: '/dashboard/spam-analyzer', adminOnly: true, section: 'phone' },
    
    // System section
    { text: 'Security', icon: <Shield size={20} />, path: '/dashboard/security', adminOnly: false, section: 'system' },
    { text: 'Monitoring', icon: <Activity size={20} />, path: '/dashboard/monitoring', adminOnly: false, section: 'system' },
    { text: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings', adminOnly: false, section: 'system' },
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
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', px: 3, minHeight: '64px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #0D5C47 0%, #10875F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.125rem',
              boxShadow: '0 2px 8px rgba(13, 92, 71, 0.3)',
            }}
          >
            A
          </Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            Admin
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {filteredMenuItems.map((item, index) => {
          const isActive = pathname === item.path;
          const prevItem = index > 0 ? filteredMenuItems[index - 1] : null;
          const showDivider = prevItem && prevItem.section !== item.section;
          
          return (
            <React.Fragment key={item.text}>
              {showDivider && (
                <Box sx={{ my: 2 }}>
                  <Divider sx={{ opacity: 0.3 }} />
                  {item.section === 'phone' && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        px: 2, 
                        py: 1, 
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        mt: 1.5
                      }}
                    >
                      Phone Registry
                    </Typography>
                  )}
                  {item.section === 'system' && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        px: 2, 
                        py: 1, 
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        mt: 1.5
                      }}
                    >
                      System
                    </Typography>
                  )}
                </Box>
              )}
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    router.push(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    minHeight: 44,
                    borderRadius: 1.5,
                    px: 2,
                    py: 1.25,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 600,
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 400,
                    }} 
                  />
                  {isActive && (
                    <ChevronRight size={18} color={muiTheme.palette.primary.main} />
                  )}
                </ListItemButton>
              </ListItem>
            </React.Fragment>
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
            p: 2,
            borderRadius: 2,
            bgcolor: 'action.hover',
            cursor: 'pointer',
            transition: 'all 200ms ease-in-out',
            '&:hover': {
              bgcolor: 'action.selected',
              transform: 'scale(1.02)',
            },
          }}
          onClick={handleMenuOpen}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9375rem' }}>
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
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
          <IconButton 
            color="inherit" 
            onClick={() => router.push('/dashboard/notifications')}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9375rem' }}>
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
          p: { xs: 2, sm: 3, md: 4 },
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
