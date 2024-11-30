import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  WiDaySunny,
  WiNightClear,
  WiRain,
  WiSnow,
  WiFog,
  WiDayThunderstorm,
  WiNightAltRainMix,
  WiWindy,
  WiHail,
  WiCloudy,
} from 'react-icons/wi';

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

interface Forecast {
  date: string;
  temperature: number;
  weather: string;
  wind_speed: number;
  wind_direction: string;
  humidity: number;
  hourly: Array<{
    time: string;
    temperature: number;
    weather: string;
    wind_speed: number;
    humidity: number;
  }>;
}

const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
        fetchForecastByCoords(lat, lon);
      });
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/weather/current`, {
        params: { lat, lon },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentWeather(response.data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/weather/forecast`, {
        params: { lat, lon },
        headers: { Authorization: `Bearer ${token}` },
      });

      const groupedForecast = groupForecastByDate(response.data);
      setForecast(groupedForecast);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const responseCurrent = await axios.get(`http://localhost:5000/weather/current`, {
        params: { city },
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseForecast = await axios.get(`http://localhost:5000/weather/forecast`, {
        params: { city },
        headers: { Authorization: `Bearer ${token}` },
      });

      const groupedForecast = groupForecastByDate(responseForecast.data);
      setCurrentWeather(responseCurrent.data);
      setForecast(groupedForecast);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const groupForecastByDate = (data: any[]): Forecast[] => {
    const grouped: { [key: string]: Forecast } = {};

    data.forEach((entry) => {
      const [date, time] = entry.date.split(' ');

      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          temperature: entry.temperature,
          weather: entry.weather,
          wind_speed: entry.wind_speed,
          wind_direction: entry.wind_direction,
          humidity: entry.humidity,
          hourly: [],
        };
      }

      grouped[date].hourly.push({
        time: time.slice(0, 2), // Extracting hour (e.g., "09", "15")
        temperature: entry.temperature,
        weather: entry.weather,
        wind_speed: Math.round(entry.wind_speed),
        humidity: entry.humidity,
      });
    });

    return Object.values(grouped);
  };

  const getWeatherIcon = (weather: string) => {
    if (weather.includes("sun")) {
      return <WiDaySunny size={50} />;
    } else if (weather.includes("clear") && weather.includes("night")) {
      return <WiNightClear size={50} />;
    } else if (weather.includes("cloud")) {
      return <WiCloudy size={50} />;
    } else if (weather.includes("rain")) {
      return <WiRain size={50} />;
    } else if (weather.includes("snow")) {
      return <WiSnow size={50} />;
    } else if (weather.includes("fog")) {
      return <WiFog size={50} />;
    } else if (weather.includes("thunder")) {
      return <WiDayThunderstorm size={50} />;
    } else if (weather.includes("hail")) {
      return <WiHail size={50} />;
    } else if (weather.includes("wind")) {
      return <WiWindy size={50} />;
    } else {
      return <WiCloudy size={50} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg">
        <Box sx={{ marginTop: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h1" gutterBottom color="text.primary">
              Väderinformation
            </Typography>
          </motion.div>

          <Box sx={{ marginBottom: 4, display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              label="Sök efter stad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              sx={{ flex: 1, backgroundColor: 'background.paper' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={fetchWeatherByCity}
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sök Väder
            </Button>
          </Box>

          {loading && <Typography color="textSecondary">Hämtar väderdata...</Typography>}

          {currentWeather && (
            <Card sx={{ marginBottom: 4, backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Nuvarande Väder i {currentWeather.location}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getWeatherIcon(currentWeather.weather)}
                  <Typography variant="h6">{currentWeather.weather}</Typography>
                </Box>
                <Typography>Temperatur: {currentWeather.temperature} °C</Typography>
                <Typography>Fuktighet: {currentWeather.humidity}%</Typography>
                <Typography>Vindhastighet: {Math.round(currentWeather.wind_speed)} m/s</Typography>
              </CardContent>
            </Card>
          )}

          {forecast.length > 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                5-dagars Prognos
              </Typography>
              {forecast.map((day, index) => (
                <Accordion key={index} sx={{ backgroundColor: 'background.paper' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getWeatherIcon(day.weather)}
                      <Typography variant="h6">{day.date}</Typography>
                      <Typography sx={{ marginLeft: 2 }}>Temperatur: {day.temperature} °C</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} sx={{ backgroundColor: 'background.default' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tid</TableCell>
                            <TableCell>Väder</TableCell>
                            <TableCell>Temp (°C)</TableCell>
                            <TableCell>Vind (m/s)</TableCell>
                            <TableCell>Fuktighet (%)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {day.hourly.map((hour, hourIndex) => (
                            <TableRow key={hourIndex}>
                              <TableCell>
                                <Typography>{hour.time}</Typography>
                              </TableCell>
                              <TableCell>{getWeatherIcon(hour.weather)}</TableCell>
                              <TableCell>{hour.temperature} °C</TableCell>
                              <TableCell>{hour.wind_speed} m/s</TableCell>
                              <TableCell>{hour.humidity}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Weather;
