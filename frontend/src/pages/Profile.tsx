import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';
import {
  Box,
  Container,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';


const MyProfile: React.FC = () => {
  const [firstname, setFirstName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [profileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { currentTheme } = useThemeContext();

  useEffect(() => {
    // Hämta användarens profilinformation vid laddning av sidan
    const getUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        if (profileData) {
          setFirstName(profileData.firstname);
          setLastName(profileData.lastname);
          setEmail(profileData.email);
          setRole(profileData.role);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          <Avatar
            alt="Profilbild"
            src={profileImage || 'https://via.placeholder.com/150'}
            sx={{ width: 120, height: 120, margin: '0 auto', marginBottom: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {firstname} {lastname}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>E-post:</strong> {email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Roll:</strong> {role}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => navigate('/dashboard/settings/profile')}
          >
            Redigera Profil
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default MyProfile;
