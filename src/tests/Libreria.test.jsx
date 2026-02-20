import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Libreria from "../views/Libreria";
import useFetch from "../hooks/useFetch";
import MySwal from "../utils/swal";

jest.mock("../hooks/useFetch", () => {
  const mockCategorias = [
    { id: "1", nombre: "Ficción" },
    { id: "2", nombre: "No Ficción" },
  ];

  const mockLibros = [
    {
      id: "1",
      titulo: "Libro 1",
      autor: "Autor 1",
      precio: 15.99,
      categoriaId: "1",
    },
    {
      id: "2",
      titulo: "Libro 2",
      autor: "Autor 2",
      precio: 20.5,
      categoriaId: "2",
    },
  ];

  return jest.fn((url) => {
    if (url.includes("/categorias")) {
      return { data: mockCategorias, cargando: false, error: null };
    } else {
      return { data: mockLibros, cargando: false, error: null };
    }
  });
});

jest.mock("../utils/swal", () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

jest.mock("../components/VistaLibro", () => (props) => (
  <div data-testid="mock-vista-libro">
    Mocked VistaLibro
    <button onClick={() => props.onAgregarCarrito({ titulo: "Libro Test" })}>
      Agregar al carrito
    </button>
  </div>
));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Libreria Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra spinner mientras está cargando", () => {
    useFetch.mockReturnValueOnce({ data: null, cargando: true, error: null });

    render(
      <MemoryRouter>
        <Libreria />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra mensaje de error si falla la carga de libros", () => {
    useFetch
      .mockReturnValueOnce({
        data: [
          { id: "1", nombre: "Ficción" },
          { id: "2", nombre: "No Ficción" },
        ],
        cargando: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: null,
        cargando: false,
        error: "Error al cargar libros",
      });

    render(
      <MemoryRouter>
        <Libreria />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error al cargar libros/i)).toBeInTheDocument();
  });

  it("muestra lista de categorías y libros correctamente", () => {
    render(
      <MemoryRouter>
        <Libreria />
      </MemoryRouter>
    );

    expect(screen.getByText(/Todas las categorías/i)).toBeInTheDocument();

    const contenedorCategorias = screen
      .getByText("Categorías")
      .closest("div.col-md-3");
    const botonFiccion = within(contenedorCategorias).getByText("Ficción");
    expect(botonFiccion).toBeInTheDocument();

    expect(screen.getByText(/Libro 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Autor 1/i)).toBeInTheDocument();
  });

  it("permite seleccionar una categoría y es clickeable", () => {
    render(
      <MemoryRouter>
        <Libreria />
      </MemoryRouter>
    );

    const contenedorCategorias = screen
      .getByText("Categorías")
      .closest("div.col-md-3");
    const botonFiccion = within(contenedorCategorias).getByText("Ficción");

    expect(botonFiccion).toBeInTheDocument();
    fireEvent.click(botonFiccion);
  });

  it("abre el modal de compra al hacer clic en el botón Comprar", () => {
    render(
      <MemoryRouter>
        <Libreria />
      </MemoryRouter>
    );

    const botonesComprar = screen.getAllByRole("button", { name: /Comprar/i });
    fireEvent.click(botonesComprar[0]);

    expect(screen.getByTestId("mock-vista-libro")).toBeInTheDocument();
  });

  it("navega a la página de detalle al hacer clic en Ver detalle", () => {
    render(
      <MemoryRouter>
        <Libreria />
      </MemoryRouter>
    );

    const botonesDetalle = screen.getAllByRole("button", {
      name: /Ver detalle/i,
    });
    fireEvent.click(botonesDetalle[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/libro/1");
  });
});
