import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Avatar, Typography, Container, Switch, FormControlLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';

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

const ProfileSettings: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [notifications, setNotifications] = useState<boolean>(false);

  useEffect(() => {
    // Hämta användarens profilinformation när komponenten laddas
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setProfileImage(response.data.profile_image);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImageFile(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (profileImageFile) formData.append('profile_image', profileImageFile);
      formData.append('notifications', JSON.stringify(notifications));

      await axios.post('http://localhost:5000/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profil uppdaterad!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Misslyckades att uppdatera profilen. Försök igen.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              p: 3,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              marginTop: 4,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Profilinställningar
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
              <Avatar
                alt="Profilbild"
                src={profileImage || 'https://via.placeholder.com/150'}
                sx={{ width: 100, height: 100, marginRight: 2 }}
              />
              <Button variant="outlined" component="label">
                Ladda upp ny bild
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </Button>
            </Box>

            <TextField
              label="Namn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Lösenord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              helperText="Lämna tomt om du inte vill ändra lösenordet"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  color="primary"
                />
              }
              label="Tillåt notifikationer"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveProfile}
              sx={{ mt: 2 }}
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Spara Profil
            </Button>
          </Box>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default ProfileSettings;
