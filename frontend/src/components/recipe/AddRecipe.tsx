import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../../services/api';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
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

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleAddRecipe = async () => {
    if (!title.trim() || !ingredients.trim() || !instructions.trim()) return;

    try {
      await addRecipe({ title, ingredients, instructions, category, image_url: imageUrl });
      navigate('/dashboard/recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

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
            Lägg till nytt recept
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Titel"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Ingredienser"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Instruktioner"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Kategori"
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Bild-URL"
              variant="outlined"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRecipe}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Lägg till
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

export default AddRecipe;
