import React, { useState } from 'react';
import { Box, Container, Typography, FormControlLabel, Switch, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const SecuritySettings: React.FC = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);

  const handleEnableTwoFactor = () => {
    setTwoFactorAuth(!twoFactorAuth);
    alert(twoFactorAuth ? 'Tvåfaktorsautentisering inaktiverad.' : 'Tvåfaktorsautentisering aktiverad.');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Säkerhetsinställningar
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={twoFactorAuth}
                onChange={handleEnableTwoFactor}
                color="primary"
              />
            }
            label="Tvåfaktorsautentisering (2FA)"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => alert('Hantera sessioner')}
            sx={{ mt: 2 }}
          >
            Hantera Aktiva Sessioner
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SecuritySettings;
