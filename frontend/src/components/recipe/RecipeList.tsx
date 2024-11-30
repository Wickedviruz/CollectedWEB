import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecipes, deleteRecipe } from '../../services/api';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Grid,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';

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

interface Recipe {
  id: number; // id är obligatoriskt
  title: string;
  ingredients: string;
  instructions: string;
  category?: string;
  image_url?: string;
}

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const fetchedRecipes = await fetchRecipes();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    getRecipes();
  }, []);

  const handleDeleteRecipe = async (id: number) => {
    try {
      await deleteRecipe(id);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" component="h1" color="text.primary">
              Receptsamling
            </Typography>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: darkTheme.palette.primary.main }}
              component={Link}
              to="/dashboard/recipes/add"
            >
              Lägg till nytt recept
            </Button>
          </motion.div>
        </Box>

        {recipes.length === 0 ? (
          <Typography color="textSecondary">Inga recept ännu.</Typography>
        ) : (
          <Grid container spacing={4}>
            {recipes.map((recipe) => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.03 }}
                  sx={{
                    backgroundColor: 'background.paper',
                    minHeight: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {recipe.image_url && (
                    <CardMedia
                      component="img"
                      alt={recipe.title}
                      height="140"
                      image={recipe.image_url}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Kategori:</strong> {recipe.category ? recipe.category : 'Ingen kategori'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Ingredienser:</strong> {recipe.ingredients}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Instruktioner:</strong> {recipe.instructions}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/dashboard/recipes/edit/${recipe.id}`}
                    >
                      Redigera
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      Ta bort
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default RecipeList;
