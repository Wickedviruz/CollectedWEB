import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import TodoList from '../components/todo/TodoList';
import AddTodo from '../components/todo/AddTodo';
import EditTodo from '../components/todo/EditTodo';
import RecipeList from '../components/recipe/RecipeList';
import AddRecipe from '../components/recipe/AddRecipe';
import EditRecipe from '../components/recipe/EditRecipe';
import Weather from '../components/weather/Weather';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Funktion för att toggla menyn
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Funktion för att logga ut
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Meny Drawer */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
            '& .MuiDrawer-paper': {
              width: isDrawerOpen ? 240 : 0,
              backgroundColor: 'background.paper',
              color: 'text.primary',
              transition: 'width 0.3s ease-in-out',
              overflowX: isDrawerOpen ? 'visible' : 'hidden',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{ color: 'text.primary' }} />
            </IconButton>
            <Typography variant="h5" gutterBottom sx={{ pl: 2 }}>
              Dashboard Menu
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Modern Meny */}
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard/profile">
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: 'text.primary' }} />
                  </ListItemIcon>
                  <ListItemText primary="Min Profil" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard/">
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: 'text.primary' }} />
                  </ListItemIcon>
                  <ListItemText primary="Min Dashboard" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard/settings">
                  <ListItemIcon>
                    <SettingsIcon sx={{ color: 'text.primary' }} />
                  </ListItemIcon>
                  <ListItemText primary="Inställningar" />
                </ListItemButton>
              </ListItem>
            </List>

            <Divider sx={{ mt: 'auto' }} />

            <Box sx={{ padding: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{ width: '100%', color: 'text.primary', borderColor: 'text.primary' }}
              >
                Logga ut
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Innehåll */}
        <Box
          sx={{
            flex: 1,
            padding: 2,
            marginLeft: isDrawerOpen ? '240px' : '0',
            transition: 'margin-left 0.3s ease-in-out',
            backgroundColor: 'background.default',
            color: 'text.primary',
          }}
        >
          {!isDrawerOpen && (
            <IconButton
              onClick={toggleDrawer}
              sx={{
                position: 'fixed',
                top: 16,
                left: 16,
                color: 'text.primary',
                zIndex: 1300,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 4,
                    mt: 6,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Att Göra-Lista
                        </Typography>
                        <Typography variant="body1">
                          Hantera dina dagliga uppgifter och mål effektivt.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate('/dashboard/todos')}
                          sx={{ mt: 2 }}
                        >
                          Gå till Att Göra-Lista
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Receptsamling
                        </Typography>
                        <Typography variant="body1">
                          Samla och hantera dina favoritrecept.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate('/dashboard/recipes')}
                          sx={{ mt: 2 }}
                        >
                          Gå till Receptsamling
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Väderinformation
                        </Typography>
                        <Typography variant="body1">
                          Kolla dagens och kommande väder.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate('/dashboard/weather')}
                          sx={{ mt: 2 }}
                        >
                          Gå till Väderinfo
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="todos" element={<TodoList />} />
            <Route path="todos/add" element={<AddTodo />} />
            <Route path="todos/edit/:id" element={<EditTodo />} />
            <Route path="recipes" element={<RecipeList />} />
            <Route path="recipes/add" element={<AddRecipe />} />
            <Route path="recipes/edit/:id" element={<EditRecipe />} />
            <Route path="weather" element={<Weather />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
