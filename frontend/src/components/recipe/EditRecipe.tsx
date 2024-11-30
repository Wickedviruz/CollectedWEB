import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRecipes, updateRecipe } from '../../services/api';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  category?: string;
  image_url?: string;
}

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

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Ingen giltig token funnen. Skippar API-anrop för todos.');
      return; // Slutar om ingen token finns.
    }
    const getRecipe = async () => {
      try {
        const recipes = await fetchRecipes();
        const foundRecipe = recipes.find((r) => r.id === parseInt(id, 10));
        if (foundRecipe) {
          setRecipe(foundRecipe);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    getRecipe();
  }, [id]);

  const handleUpdateRecipe = async () => {
    if (!recipe) return;

    try {
      const updatedRecipe: Recipe = {
        ...recipe,
        id: recipe.id,
      };
      await updateRecipe(updatedRecipe);
      navigate('/dashboard/recipes');
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  if (!recipe) {
    return <p>Laddar...</p>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            backgroundColor: 'background.paper',
            p: 4,
            mt: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom color="text.primary">
            Redigera Recept
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Titel"
              variant="outlined"
              fullWidth
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Ingredienser"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={recipe.ingredients}
              onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Instruktioner"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={recipe.instructions}
              onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Kategori"
              variant="outlined"
              fullWidth
              value={recipe.category || ''}
              onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Bild-URL"
              variant="outlined"
              fullWidth
              value={recipe.image_url || ''}
              onChange={(e) => setRecipe({ ...recipe, image_url: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateRecipe}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Spara
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/dashboard/recipes')}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Avbryt
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EditRecipe;
