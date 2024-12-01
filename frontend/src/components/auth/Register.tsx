import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';


const Register: React.FC = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentTheme } = useThemeContext();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await registerUser(firstname, lastname, email, password);
      if (response.status === 201) {
        alert('Registration successful');
        navigate('/login');
      } else {
        console.error(`failed to register: ${response.data.message}`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error('Error registering:', error);
        alert('Failed to register, Please try again.');
      }
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Register
            </Typography>

            <Box
              component={motion.form}
              onSubmit={handleRegister}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              sx={{ width: '100%', mt: 3 }}
            >
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                sx={{ mb: 2, backgroundColor: currentTheme.palette.background.paper }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                sx={{ mb: 2, backgroundColor: currentTheme.palette.background.paper }}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2, backgroundColor: currentTheme.palette.background.paper }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2, backgroundColor: currentTheme.palette.background.paper }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Register
                </Button>
              </motion.div>
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Redan medlem? Logga in <Link to="/login" style={{ color: '#90caf9', textDecoration: 'none' }}>här</Link>
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={() => navigate('/')}
                  color="secondary"
                  sx={{ mt: 4 }}
                >
                  Back to Home
                </Button>
              </motion.div>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
