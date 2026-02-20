import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MisReservas from "../views/MisReservas";
import { useAuth } from "../context/AuthContext";
import { useReservas } from "../context/ReservasContext";

jest.mock("../context/AuthContext");
jest.mock("../context/ReservasContext");

const mockUsuario = { id: "user-123", nombre: "Test User" };

const mockReservas = [
  {
    id: "res-1",
    usuarioId: "user-123",
    nombreEspacio: "Sala de Juntas",
    dia: "lunes",
    hora: "09:00",
    horaFin: "11:00",
    fecha: "2023-10-01T10:00:00Z",
    precio: 25.0,
  },
  {
    id: "res-2",
    usuarioId: "user-123",
    nombreEspacio: "Escritorio Individual",
    dia: "martes",
    hora: "14:00",
    horaFin: "18:00",
    fecha: "2023-10-05T10:00:00Z",
    precio: 15.0,
  },
  {
    id: "res-3",
    usuarioId: "otro-usuario",
    nombreEspacio: "Espacio Prohibido",
    dia: "viernes",
    hora: "10:00",
    horaFin: "12:00",
    fecha: "2023-10-06T10:00:00Z",
    precio: 50.0,
  },
];

describe("MisReservas Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ usuario: mockUsuario });
  });

  it("muestra mensaje de alerta cuando no hay reservas para el usuario", () => {
    useReservas.mockReturnValue({ reservasLocales: [] });

    render(
      <MemoryRouter>
        <MisReservas />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/No tienes reservas registradas/i)
    ).toBeInTheDocument();
  });

  it("muestra la lista de reservas del usuario correctamente", () => {
    useReservas.mockReturnValue({ reservasLocales: mockReservas });

    render(
      <MemoryRouter>
        <MisReservas />
      </MemoryRouter>
    );

    expect(screen.getByText("Sala de Juntas")).toBeInTheDocument();
    expect(screen.getByText("Escritorio Individual")).toBeInTheDocument();

    expect(screen.queryByText("Espacio Prohibido")).not.toBeInTheDocument();
  });

  it("muestra los detalles de la reserva (día, horario, precio)", () => {
    useReservas.mockReturnValue({ reservasLocales: [mockReservas[0]] });

    render(
      <MemoryRouter>
        <MisReservas />
      </MemoryRouter>
    );

    expect(screen.getByText(/Lunes/i)).toBeInTheDocument();

    expect(screen.getByText(/09:00 - 11:00/i)).toBeInTheDocument();

    expect(screen.getByText(/25,00\s?€/)).toBeInTheDocument();

    expect(screen.getByText(/Confirmada/i)).toBeInTheDocument();
  });

  it("ordena las reservas por fecha descendente (más reciente primero)", () => {
    useReservas.mockReturnValue({ reservasLocales: mockReservas });

    render(
      <MemoryRouter>
        <MisReservas />
      </MemoryRouter>
    );

    const titulos = screen.getAllByText(/Reserva #/);
    expect(titulos[0]).toHaveTextContent("Reserva #res-2");
    expect(titulos[1]).toHaveTextContent("Reserva #res-1");
  });
});
