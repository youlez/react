import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CoworkingDetalle from "../views/CoworkingDetalle";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { useReservas } from "../context/ReservasContext";
import MySwal from "../utils/swal";

jest.mock("../hooks/useFetch");
jest.mock("../context/AuthContext");
jest.mock("../context/ReservasContext");
jest.mock("../utils/swal", () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));
jest.mock("../components/CheckoutForm", () => {
  return function MockCheckoutForm(props) {
    const { useEffect } = require("react");

    useEffect(() => {
      if (props.onPagoExitoso) {
        props.onPagoExitoso();
      }
    }, [props.onPagoExitoso]);

    return <div data-testid="mock-checkout-form">Mocked CheckoutForm</div>;
  };
});

global.fetch = jest.fn();

const renderWithRouter = (ui, { route = "/coworking/1" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/coworking/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("CoworkingDetalle Component", () => {
  const espacioMock = [
    {
      id: 1,
      nombre: "Sala de Reuniones 1",
      zona: "Zona A",
      capacidad: 5,
      equipamiento: ["Proyector", "Pizarra"],
      precio: 20,
      tipo: "grupal",
      horario: {
        lunes: {
          "8:00 a.m.": { estado: false, cupos: 2 },
          "9:00 a.m.": { estado: true, cupos: 0 },
        },
      },
    },
  ];

  const reservasMock = [];

  beforeEach(() => {
    jest.clearAllMocks();
    useFetch.mockReturnValue({
      data: espacioMock,
      cargando: false,
      error: null,
    });
    useAuth.mockReturnValue({ usuario: null });
    useReservas.mockReturnValue({
      agregarReserva: jest.fn(),
      reservasLocales: reservasMock,
    });
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it("muestra spinner mientras carga", () => {
    useFetch.mockReturnValueOnce({
      data: null,
      cargando: true,
      error: null,
    });

    renderWithRouter(<CoworkingDetalle />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra mensaje de error si hay error", () => {
    useFetch.mockReturnValueOnce({
      data: null,
      cargando: false,
      error: "Error al cargar",
    });

    renderWithRouter(<CoworkingDetalle />);

    expect(screen.getByText(/Error al cargar/i)).toBeInTheDocument();
  });

  it("muestra mensaje si no hay espacio", () => {
    useFetch.mockReturnValueOnce({
      data: [],
      cargando: false,
      error: null,
    });

    renderWithRouter(<CoworkingDetalle />);

    expect(
      screen.getByText(/No se encontró el espacio solicitado/i)
    ).toBeInTheDocument();
  });

  it("muestra detalles del espacio y permite reservar", async () => {
    useAuth.mockReturnValue({ usuario: { id: "123", nombre: "Juan" } });
    const agregarReservaMock = jest.fn();
    useReservas.mockReturnValue({
      agregarReserva: agregarReservaMock,
      reservasLocales: [],
    });

    renderWithRouter(<CoworkingDetalle />);

    expect(screen.getByText(/Sala de Reuniones 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Zona A/i)).toBeInTheDocument();
    expect(screen.getByText(/Capacidad: 5 personas/i)).toBeInTheDocument();
    expect(screen.getByText(/Proyector · Pizarra/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio: 20,00 €/i)).toBeInTheDocument();

    const reservarBtn = screen.getAllByRole("button", { name: /Reservar/i })[0];
    fireEvent.click(reservarBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    const onPagoExitoso = screen.getByText(/Finalizar Reserva/i).closest("div");

    expect(fetch).toHaveBeenCalled();

    expect(agregarReservaMock).toHaveBeenCalled();
  });
});
