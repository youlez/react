import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Image, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import logo from "../assets/logo.png";

const Menu = () => {
  const { usuario, logout } = useAuth();
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const cerrarSesion = () => {
    logout();
  };

  return (
    <>
      <Navbar bg="info-subtle" variant="info-subtle" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <Image
              src={logo}
              alt="Nexus"
              height="40"
              style={{ cursor: "pointer" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="link-primary" as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link className="link-primary" as={Link} to="/libreria">
                Librería
              </Nav.Link>
              <Nav.Link className="link-primary" as={Link} to="/coworking">
                Coworking
              </Nav.Link>
              {usuario && (
                <Nav.Link className="link-primary" as={Link} to="/mis-compras">
                  Mis Compras
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              {usuario ? (
                <>
                  <Navbar.Text className="me-3">Hola, {usuario.nombre} {usuario.apellidos}</Navbar.Text>
                  <Nav.Link className="link-primary" onClick={cerrarSesion}>
                    Cerrar Sesión
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="link-primary"
                  onClick={() => setMostrarLogin(true)}
                >
                  Iniciar Sesión
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={mostrarLogin} onHide={() => setMostrarLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login closeModal={() => setMostrarLogin(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Menu;
