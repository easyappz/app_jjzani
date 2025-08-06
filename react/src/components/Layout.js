import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, useTheme, useMediaQuery, Container } from '@mui/material';
import { Home, Person, PhotoCamera, Star, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';

// Drawer width
const drawerWidth = 240;

const menuItems = [
  { text: 'Главная', icon: <Home />, path: '/' },
  { text: 'Профиль', icon: <Person />, path: '/profile' },
  { text: 'Загрузка фото', icon: <PhotoCamera />, path: '/upload' },
  { text: 'Оценка фото', icon: <Star />, path: '/rating' },
];

const Layout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    queryClient.invalidateQueries(['profile']);
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('token');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          ФотоОценка
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon>
              <Logout color="error" />
            </ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItem>
        )}
      </List>
    </div>
  );

  if (isAuthPage) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ФотоОценка
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default }}>
          <Container maxWidth="sm">
            {children}
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ФотоОценка
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
