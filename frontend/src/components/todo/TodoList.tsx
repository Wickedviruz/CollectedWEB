import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTodos, deleteTodo, updateTodo } from '../../services/api';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';

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

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await fetchTodos();
        setTodos(todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    getTodos();
  }, []);

  // Funktion för att ta bort en Todo
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Funktion för att markera en Todo som klar
  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await updateTodo(updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ padding: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h3" component="h2" gutterBottom color="text.primary">
          Att Göra-Lista
        </Typography>

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard/todos/add"
          >
            Lägg till ny Todo
          </Button>
        </Box>

        {todos.length === 0 ? (
          <Typography variant="h6" color="text.secondary">
            Inga uppgifter ännu.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 3,
            }}
          >
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {todo.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {todo.info}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title={todo.completed ? 'Återställ' : 'Markera som klar'}>
                      <IconButton
                        onClick={() => handleToggleComplete(todo)}
                        color={todo.completed ? 'secondary' : 'primary'}
                      >
                        {todo.completed ? <UndoIcon /> : <CheckIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Redigera">
                      <IconButton
                        component={Link}
                        to={`/dashboard/todos/edit/${todo.id}`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ta bort">
                      <IconButton
                        onClick={() => handleDeleteTodo(todo.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default TodoList;
