import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTodo } from '../../services/api';
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
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

const AddTodo: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const navigate = useNavigate();

  const handleAddTodo = async () => {
    if (!title.trim()) return;

    try {
      await addTodo(title, info);
      navigate('/dashboard/todos');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: 'background.paper',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            mt: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" gutterBottom color="text.primary">
              Lägg till ny Todo
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Titel"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'background.default', color: 'text.primary' }}
              />
              <TextField
                label="Beskrivning av uppgiften"
                variant="outlined"
                multiline
                rows={4}
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'background.default', color: 'text.primary' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTodo}
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{ marginRight: 1 }}
                >
                  Spara
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/dashboard/todos')}
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Avbryt
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddTodo;
