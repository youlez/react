// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Menu from './components/Menu';
import MisCompras from './pages/MisCompras';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Menu />
        <Container className="mt-4">
        <Routes>
          {/* RUTAS PÚBLICAS */}          
          <Route path="/"/>

          {/* RUTAS PROTEGIDAS */}
          <Route
            path="/mis-compras"
            element={
              <ProtectedRoute>
                <MisCompras />
              </ProtectedRoute>
            }
          />
          
        </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;