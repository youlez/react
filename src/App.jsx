import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { ComprasProvider } from "./context/ComprasContext";
import { ReservasProvider } from "./context/ReservasContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

import Menu from "./components/Menu";
import Landing from "./views/Landing";
import MisCompras from "./views/MisCompras";
import { Container } from "react-bootstrap";
import DetalleLibro from "./views/DetalleLibro";
import Footer from "./components/Footer";
import Carrito from "./views/Carrito";
import Libreria from "./views/Libreria";
import Coworking from "./views/Coworking";
import CoworkingDetalle from "./views/CoworkingDetalle.jsx";
import MisReservas from "./views/MisReservas.jsx";

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <ComprasProvider>
          <ReservasProvider>
            <Router>
              <header className="fixed-top">
                <Menu />
              </header>
              <Container className="mt-5 pt-5 app__cuerpo">
                <Routes>
                  {/* RUTAS PÚBLICAS */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/libro/:id" element={<DetalleLibro />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/libreria" element={<Libreria />} />
                  <Route path="/coworking" element={<Coworking />} />
                  <Route path="/coworking/:id" element={<CoworkingDetalle />} />

                  {/* RUTAS PROTEGIDAS */}
                  <Route
                    path="/mis-compras"
                    element={
                      <ProtectedRoute>
                        <MisCompras />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/mis-reservas"
                    element={
                      <ProtectedRoute>
                        <MisReservas />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Container>
              <Footer />
            </Router>
          </ReservasProvider>
        </ComprasProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
