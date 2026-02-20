import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "../views/Landing";
import useFetch from "../hooks/useFetch";
import MySwal from "../utils/swal";

jest.mock("../hooks/useFetch");
jest.mock("../utils/swal", () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

jest.mock("../components/VistaLibro", () => (props) => {
  return (
    <div data-testid="mock-vista-libro">
      Mocked VistaLibro
      <button onClick={() => props.onAgregarCarrito({ titulo: "Libro Test" })}>
        Agregar al carrito
      </button>
    </div>
  );
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Landing Component", () => {
  const librosMock = [
    {
      id: "1",
      titulo: "Libro 1",
      autor: "Autor 1",
      precio: 15.99,
      portada: "imagen1.jpg",
    },
    {
      id: "2",
      titulo: "Libro 2",
      autor: "Autor 2",
      precio: 20.5,
      portada: "imagen2.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useFetch.mockReturnValue({
      data: librosMock,
      cargando: false,
      error: null,
    });
  });

  it("muestra spinner mientras está cargando", () => {
    useFetch.mockReturnValueOnce({
      data: null,
      cargando: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra mensaje de error si hay error", () => {
    useFetch.mockReturnValueOnce({
      data: null,
      cargando: false,
      error: "Error al cargar libros",
    });

    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error al cargar libros/i)).toBeInTheDocument();
  });

  it("muestra lista de libros cuando hay datos", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.getByText(/Libro 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Libro 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Autor 1/i)).toBeInTheDocument();
    expect(screen.getByText(/15,99\s?€/)).toBeInTheDocument();
  });

  it("abre modal al hacer clic en Comprar", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    const botonComprar = screen.getAllByText(/Comprar/i)[0];
    fireEvent.click(botonComprar);

    expect(screen.getByText(/Mocked VistaLibro/i)).toBeInTheDocument();
  });

  it("navega al detalle al hacer clic en Ver detalle", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    const botonVerDetalle = screen.getAllByText(/Ver detalle/i)[0];
    fireEvent.click(botonVerDetalle);

    expect(mockNavigate).toHaveBeenCalledWith("/libro/1");
  });

  it("agrega libro al carrito desde el modal", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    const botonComprar = screen.getAllByText(/Comprar/i)[0];
    fireEvent.click(botonComprar);

    const botonAgregar = screen.getByText(/Agregar al carrito/i);
    fireEvent.click(botonAgregar);

    expect(MySwal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Añadido al carrito",
      })
    );
  });
});
