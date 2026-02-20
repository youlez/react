import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VistaLibro from "../components/VistaLibro";
import { useCarrito } from "../context/CarritoContext";
import useFetch from "../hooks/useFetch";
import MySwal from "../utils/swal";

jest.mock("../context/CarritoContext");
jest.mock("../hooks/useFetch");
jest.mock("../utils/swal", () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

const mockLibro = [
  {
    id: "1",
    titulo: "El Quijote",
    autor: "Miguel de Cervantes",
    precio: 25.5,
    categoriaId: "cat1",
    descripcion: "Una obra maestra.",
    editorial: "Castalia",
    year: 1605,
    stock: 10,
    tipo: "Físico",
    portada: "quijote.jpg",
  },
];

const mockCategorias = [{ id: "cat1", nombre: "Clásicos" }];

describe("VistaLibro Component", () => {
  const mockAgregarAlCarrito = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCarrito.mockReturnValue({ agregarAlCarrito: mockAgregarAlCarrito });
  });

  it("muestra spinner mientras carga datos", () => {
    useFetch.mockReturnValue({ data: null, cargando: true, error: null });

    const { container } = render(<VistaLibro id="1" />);

    const spinner = container.querySelector(".spinner-border");
    expect(spinner).toBeInTheDocument();
  });

  it("muestra mensaje de error si falla la carga", () => {
    useFetch.mockReturnValue({
      data: null,
      cargando: false,
      error: "Error 404",
    });

    render(<VistaLibro id="1" />);
    expect(screen.getByText(/Error 404/i)).toBeInTheDocument();
  });

  it("renderiza la información básica del libro", () => {
    useFetch
      .mockReturnValueOnce({ data: mockLibro, cargando: false, error: null })
      .mockReturnValueOnce({
        data: mockCategorias,
        cargando: false,
        error: null,
      });

    render(<VistaLibro id="1" />);

    expect(screen.getByText("El Quijote")).toBeInTheDocument();
    expect(screen.getByText("Miguel de Cervantes")).toBeInTheDocument();
    expect(screen.getByText(/25,50\s?€/)).toBeInTheDocument();
  });

  it("muestra detalles adicionales en modo completo", () => {
    useFetch
      .mockReturnValueOnce({ data: mockLibro, cargando: false, error: null })
      .mockReturnValueOnce({
        data: mockCategorias,
        cargando: false,
        error: null,
      });

    render(<VistaLibro id="1" modoCompleto={true} />);

    const categoriaParrafo = screen.getByText(/Categoría:/i).closest("p");
    expect(categoriaParrafo).toHaveTextContent(/Clásicos/i);

    const editorialParrafo = screen.getByText(/Editorial:/i).closest("p");
    expect(editorialParrafo).toHaveTextContent(/Castalia/i);

    const anioParrafo = screen.getByText(/Año:/i).closest("p");
    expect(anioParrafo).toHaveTextContent(/1605/i);

    const stockParrafo = screen.getByText(/Stock disponible:/i).closest("p");
    expect(stockParrafo).toHaveTextContent(/10 unidades/i);
  });

  it("llama a agregarAlCarrito y muestra SweetAlert al hacer clic", () => {
    useFetch
      .mockReturnValueOnce({ data: mockLibro, cargando: false, error: null })
      .mockReturnValueOnce({
        data: mockCategorias,
        cargando: false,
        error: null,
      });

    render(<VistaLibro id="1" />);

    const boton = screen.getByRole("button", { name: /Añadir al carrito/i });
    fireEvent.click(boton);

    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(mockLibro[0]);
    expect(MySwal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Añadido al carrito",
      })
    );
  });
});
