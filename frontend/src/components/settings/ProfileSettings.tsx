// ProfileSettings.tsx

import React, { useState, useEffect } from 'react';
import { updateUserProfile, fetchUserProfile } from '../../services/api';
import { Box, TextField, Button, Avatar, Typography, Container, Switch, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ProfileSettings: React.FC = () => {
  const [firstname, setFirstName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { currentTheme } = useThemeContext();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setFirstName(profile.firstname);
        setLastName(profile.lastname);
        setEmail(profile.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(firstname, lastname, email, password);
      alert('Profil uppdaterad!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Misslyckades att uppdatera profilen. Försök igen.');
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
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
                  onChange={() => {}}
                />
              </Button>
            </Box>

            <TextField
              label="Förnamn"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Efternamn"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
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
