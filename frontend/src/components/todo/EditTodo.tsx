import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTodos, updateTodo } from '../../services/api';
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

interface Todo {
  id: number;
  title: string;
  info: string;
  completed: boolean;
}

const EditTodo: React.FC = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Ingen giltig token funnen. Skippar API-anrop för todos.');
      return; // Slutar om ingen token finns.
    }
    if (!id) {
      console.error('Id is undefined');
      return;
    }

    const getTodo = async () => {
      try {
        const todos = await fetchTodos();
        const foundTodo = todos.find((t: Todo) => t.id === parseInt(id, 10));
        if (foundTodo) {
          setTodo(foundTodo);
        }
      } catch (error) {
        console.error('Error fetching todo:', error);
      }
    };

    getTodo();
  }, [id]);

  const handleUpdateTodo = async () => {
    if (!todo) return;

    try {
      const updatedTodo = await updateTodo(todo);
      setTodo(updatedTodo);
      navigate('/dashboard/todos');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (!todo) {
    return <Typography variant="h6" color="textSecondary">Laddar...</Typography>;
  }

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
              Redigera Todo
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
                value={todo.title}
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                fullWidth
                sx={{ backgroundColor: 'background.default', color: 'text.primary' }}
              />
              <TextField
                label="Beskrivning av uppgiften"
                variant="outlined"
                multiline
                rows={4}
                value={todo.info}
                onChange={(e) => setTodo({ ...todo, info: e.target.value })}
                fullWidth
                sx={{ backgroundColor: 'background.default', color: 'text.primary' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateTodo}
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

export default EditTodo;
