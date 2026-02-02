import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const Landing = () => {
  // Usamos el custom hook para obtener los 10 más vendidos
  const {
    data: libros,
    cargando,
    error,
  } = useFetch(
    "https://mock.apidog.com/m1/1188124-1182752-default/api/libros/mas-vendidos"
  );

  const [showModal, setShowModal] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const navigate = useNavigate();

  const abrirModalCompra = (libro) => {
    setLibroSeleccionado(libro);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setLibroSeleccionado(null);
  };

  const confirmarCompra = () => {
    // Aquí iría la lógica para llamar al endpoint de compra si fuera necesario
    alert(`¡Gracias por tu compra! Has adquirido: ${libroSeleccionado.titulo}`);
    cerrarModal();
  };

  const verDetalle = (id) => {
    navigate(`/libro/${id}`);
  };

  return (
    <>
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Top 10 libros más vendidos</h2>

        {cargando && (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {!cargando && !error && libros && (
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {libros.map((libro) => (
              <Col key={libro.id}>
                <Card className="h-100 shadow-sm">
                  {libro.portada && (
                    <Card.Img
                      variant="top"
                      src={libro.portada}
                      alt={libro.titulo}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => verDetalle(libro.id)}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      className="fs-6 text-truncate"
                      title={libro.titulo}
                    >
                      {libro.titulo}
                    </Card.Title>
                    {libro.autor && (
                      <Card.Subtitle className="mb-2 text-muted small">
                        {libro.autor}
                      </Card.Subtitle>
                    )}

                    <div className="mt-auto">
                      {libro.precio && (
                        <p className="fw-bold mb-2 text-primary">
                          {Number(libro.precio).toLocaleString("es-ES", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </p>
                      )}
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => verDetalle(libro.id)}
                        >
                          Ver detalle
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => abrirModalCompra(libro)}
                        >
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal de Compra */}
      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {libroSeleccionado && (
            <div className="text-center">
              <img
                src={libroSeleccionado.portada}
                alt={libroSeleccionado.titulo}
                style={{ width: "100px", marginBottom: "15px" }}
              />
              <h5>{libroSeleccionado.titulo}</h5>
              <p className="text-muted">{libroSeleccionado.autor}</p>
              <hr />
              <p className="fs-5">
                Total a pagar:{" "}
                <strong>
                  {Number(libroSeleccionado.precio).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </strong>
              </p>
              <p className="small text-secondary">
                ¿Deseas proceder con la compra?
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmarCompra}>
            Confirmar y Pagar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Landing;
