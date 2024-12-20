import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeContext();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles styles={{ body: { backgroundColor: currentTheme.palette.background.default, color: currentTheme.palette.text.primary, margin: 0, fontFamily: 'Roboto, sans-serif' } }} />
      <Container maxWidth={false} sx={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 2,
            color: 'text.primary',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Jurvis
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typography variant="h5" component="p" color="textSecondary">
              Your personal everything manager.
            </Typography>
          </motion.div>

          <Box mt={4}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ margin: 1 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleRegister}
                sx={{ margin: 1 }}
              >
                Register
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
