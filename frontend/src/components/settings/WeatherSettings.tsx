import React, { useState } from 'react';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

const WeatherSettings: React.FC = () => {
  const [temperatureUnit, setTemperatureUnit] = useState<string>('celsius');
  const [windSpeedUnit, setWindSpeedUnit] = useState<string>('m/s');

  const handleSaveSettings = () => {
    // Save settings to local storage or make a request to save them in the backend
    localStorage.setItem('temperatureUnit', temperatureUnit);
    localStorage.setItem('windSpeedUnit', windSpeedUnit);
    alert('Inställningar sparade!');
  };

  return (
    <Box sx={{ p: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Temperatur Enhet</FormLabel>
        <RadioGroup
          value={temperatureUnit}
          onChange={(e) => setTemperatureUnit(e.target.value)}
        >
          <FormControlLabel value="celsius" control={<Radio />} label="Celsius" />
          <FormControlLabel value="fahrenheit" control={<Radio />} label="Fahrenheit" />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Vindhastighet Enhet</FormLabel>
        <RadioGroup
          value={windSpeedUnit}
          onChange={(e) => setWindSpeedUnit(e.target.value)}
        >
          <FormControlLabel value="m/s" control={<Radio />} label="Meter per sekund (m/s)" />
          <FormControlLabel value="km/h" control={<Radio />} label="Kilometer per timme (km/h)" />
        </RadioGroup>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSaveSettings} sx={{ mt: 3 }}>
        Spara Inställningar
      </Button>
    </Box>
  );
};

export default WeatherSettings;
