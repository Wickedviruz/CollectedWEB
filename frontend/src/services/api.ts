import axios from "axios";

const API_URL = 'http://127.0.0.1:5000';


// Error handling utility
const handleApiError = (error: any, context: string) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error(`${context} API Error:`, error.response.status, error.response.data);
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error(`${context} No response received:`, error.request);
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request
    console.error(`${context} Error:`, error.message);
    throw error;
  }
};

// Add Authorization header helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error ('No token found, user is not authenticated');
  }
  return{
    Authorization: `Bearer ${token}`,
  };
};

// ========================= USERS ==============================

export const registerUser  = async (firstname: string, lastname: string, email: string, password: string): Promise<any> => {
    try {

        const response = await axios.post(`${API_URL}/auth/register`,{
            firstname,
            lastname,
            email,
            password,
        });
    return response.data;
    } catch (error) {
      handleApiError(error, 'Registration');
    }
    return undefined;
};

export const loginUser = async (email: string, password: string): Promise<{ access_token: string,role: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // Här extraherar vi direkt den data vi behöver.
  } catch (error) {
    handleApiError(error, 'Login');
  }
  return undefined as never;
};

// ========================= TODOS ==============================

// Todos
interface Todo {
    id: number;
    title: string;
    info: string;
    completed: boolean;
  }


  export const fetchTodos = async (): Promise<Todo[]> => {
    try {
      const response = await axios.get(`${API_URL}/todo/todos`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Fetch Todos');
    }
    return []; // Returnera en tom array som fallback
  };

export const addTodo = async (title: string, info: string = ''): Promise<Todo> => {
  try {
    const response = await axios.post(`${API_URL}/todo/todos`, { title, info, completed: false },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Add Todo');
  }
  return undefined as never;
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/todo/todos/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    handleApiError(error, 'Delete Todo');
  }
};

export const updateTodo = async (todo: Todo) => {
    try {
        const response = await axios.put(
        `${API_URL}/todo/todos/${todo.id}`, // Kontrollera URL:en här
        { title: todo.title, info: todo.info, completed: todo.completed },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Update todo');
    }
  };


  // ========================= RECIPES ==============================

  // Recipes

  export interface Recipe {
    id: number; // id är obligatoriskt för redan existerande recept
    title: string;
    ingredients: string;
    instructions: string;
    category?: string;
    image_url?: string;
  }
  
  export interface NewRecipe {
    title: string;
    ingredients: string;
    instructions: string;
    category?: string;
    image_url?: string;
  }

export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
      const response = await axios.get(`${API_URL}/recipe/recipes`, 
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;    
    } catch (error) {
      handleApiError(error, 'Fetch Recipe');
    }
    return undefined as never;
};

// Lägg till ett nytt recept
export const addRecipe = async (recipe: NewRecipe): Promise<Recipe> => {
  try {
    const response = await axios.post(`${API_URL}/recipe/recipes`, recipe,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Add Recipe');
  }
  return undefined as never; // Lägg till fallback för TypeScript för korrekt typ.
};
  

export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/recipe/recipes/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    handleApiError(error, 'Delete Recipe');
  }
};

export const updateRecipe = async (recipe: Recipe): Promise<Recipe> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Ingen token hittades. Användaren är inte inloggad.');
    }

    const response = await axios.put(
      `${API_URL}/recipe/recipes/${recipe.id}`,
      {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        category: recipe.category,
        image_url: recipe.image_url,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error, 'Update Recipe');
  }

  return undefined as never; // Lägg till fallback för TypeScript för korrekt typ.
};
