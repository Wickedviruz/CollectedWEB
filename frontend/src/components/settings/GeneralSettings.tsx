import React, { useState } from 'react';
import { Box, Container, Typography, FormControlLabel, Switch, Select, MenuItem } from '@mui/material';
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

const GeneralSettings: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('sv');

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Allmänna Inställningar
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="primary"
              />
            }
            label="Mörkt Tema"
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" gutterBottom>
            Språk
          </Typography>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value as string)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="sv">Svenska</MenuItem>
            <MenuItem value="en">Engelska</MenuItem>
          </Select>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default GeneralSettings;
