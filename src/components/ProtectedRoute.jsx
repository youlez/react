// src/components/ProtectedRoute.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from 'react-bootstrap';
import Login from '../components/Login';

const ProtectedRoute = ({ children }) => {
  const { usuario } = useAuth();
  const [showLogin, setShowLogin] = useState(!usuario);

  if (!usuario) {
    return (
      <>
        <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Iniciar Sesión</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Login closeModal={() => setShowLogin(false)} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
  else{
    return (
      <>Hola</>
    )
  }

  return children;
};

export default ProtectedRoute;