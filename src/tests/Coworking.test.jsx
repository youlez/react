import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Coworking from "../views/Coworking";
import useFetch from "../hooks/useFetch";

jest.mock("../hooks/useFetch");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Coworking Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra spinner mientras está cargando", () => {
    useFetch.mockReturnValue({
      data: null,
      cargando: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <Coworking />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner tiene role="status"
  });

  it("muestra mensaje de error si hay error", () => {
    useFetch.mockReturnValue({
      data: null,
      cargando: false,
      error: "Error al cargar",
    });

    render(
      <MemoryRouter>
        <Coworking />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error al cargar/i)).toBeInTheDocument();
  });

  it("muestra lista de espacios cuando hay datos", () => {
    const espaciosMock = [
      { id: "1", nombre: "Sala de Reuniones 1", zona: "Zona A", capacidad: 5 },
      { id: "2", nombre: "Recepción", zona: "Entrada", capacidad: 0 },
    ];

    useFetch.mockReturnValue({
      data: espaciosMock,
      cargando: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Coworking />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sala de Reuniones 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Recepción/i)).toBeInTheDocument();
    expect(screen.getByText(/Zona A/i)).toBeInTheDocument();
  });

  it("navega al detalle al hacer click en espacio que no es Recepción", () => {
    const espaciosMock = [
      { id: "1", nombre: "Sala de Reuniones 1", zona: "Zona A", capacidad: 5 },
      { id: "2", nombre: "Recepción", zona: "Entrada", capacidad: 0 },
    ];

    useFetch.mockReturnValue({
      data: espaciosMock,
      cargando: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Coworking />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Sala de Reuniones 1/i));
    expect(mockNavigate).toHaveBeenCalledWith("/coworking/1");

    fireEvent.click(screen.getByText(/Recepción/i));
    expect(mockNavigate).toHaveBeenCalledTimes(1); // No incrementa
  });
});
