import axios from "axios";

const API_URL = 'http://127.0.0.1:5000';


// ========================= USERS ==============================

export const registerUser  = async (firstname: string, lastname: string, email: string, password: string) => {
    try {

        const response = await axios.post(`${API_URL}/auth/register`,{
            firstname,
            lastname,
            email,
            password,
        });
    return response;
    } catch (error: any) {
        if (error.response) {
            console.error('Error during registration API call: ${error.response.status} - ${error.response.data.message}');
            throw error;
        } else {
            console.error('Unexptected error during registration API call', error);
            throw error;
        }
    }
};

export const loginUser = async (email: string, password: string) => {
    return axios.post(`${API_URL}/auth/login`, {
        email,
        password,
    });
};

// ========================= TODOS ==============================

// Todos
interface Todo {
    id: number;
    title: string;
    info: string;
    completed: boolean;
  }


export const fetchTodos = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/todo/todos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;    
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const addTodo = async (title: string, info: string = '') => {
     try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/todo/todos`,
            {title, info, completed: false },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
     } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
     }
};

export const deleteTodo = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/todo/todos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
    });
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

export const updateTodo = async (todo: Todo) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Ingen token hittades. Användaren är inte inloggad.');
      }
  
      const response = await axios.put(
        `${API_URL}/todo/todos/${todo.id}`, // Kontrollera URL:en här
        { title: todo.title, info: todo.info, completed: todo.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Server response:", response.data); // Lägg till en logg för att se svaret från servern
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
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
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/recipe/recipes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;    
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

// Lägg till ett nytt recept
export const addRecipe = async (recipe: NewRecipe) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/recipe/recipes`,
        recipe,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  };
  

export const deleteRecipe = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/recipe/recipes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
    });
    } catch (error) {
        console.error('Error deleting recipes:', error);
        throw error;
    }
};

export const updateRecipe = async (recipe: Recipe) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Ingen token hittades. Användaren är inte inloggad.');
      }
  
      const response = await axios.put(
        `${API_URL}/recipe/recipes/${recipe.id}`, // Kontrollera URL:en här
        {   title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            category: recipe.category,
            image_url: recipe.image_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Server response:", response.data); // Lägg till en logg för att se svaret från servern
      return response.data;
    } catch (error) {
      console.error('Error updating recipes:', error);
      throw error;
    }
  };