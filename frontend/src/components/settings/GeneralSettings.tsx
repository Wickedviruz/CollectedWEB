import React from 'react';
import { Box, Container, Typography, FormControlLabel, Switch, Select, MenuItem } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';

const GeneralSettings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [language, setLanguage] = React.useState<string>('sv');

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Allmänna Inställningar
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
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
  );
};

export default GeneralSettings;
