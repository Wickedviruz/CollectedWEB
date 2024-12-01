import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeContextProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<ProtectedRoute> 
            <Dashboard />
          </ProtectedRoute>}/>
        </Routes>
      </Router>
      </ThemeContextProvider>
  );
};

export default App;
