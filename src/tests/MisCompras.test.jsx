import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MisCompras from "../views/MisCompras";
import { useAuth } from "../context/AuthContext";
import { useCompras } from "../context/ComprasContext";
import useFetch from "../hooks/useFetch";

jest.mock("../context/AuthContext");
jest.mock("../context/ComprasContext");
jest.mock("../hooks/useFetch");

const mockUsuario = { id: "123", nombre: "Juan Pérez" };
const mockComprasLocales = [
  {
    id: "local-1",
    fecha: "2023-01-01T10:00:00Z",
    precioTotal: 29.99,
    items: [
      {
        titulo: "Libro Local",
        autor: "Autor Local",
        precio: 14.99,
        cantidad: 2,
        portada: "http://example.com/portada-local.jpg",
      },
    ],
  },
];

describe("MisCompras Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ usuario: mockUsuario });
    useCompras.mockReturnValue({ comprasLocales: [] });
    useFetch.mockReturnValue({ data: null, cargando: false, error: null });
  });

  it("muestra spinner mientras está cargando", () => {
    useFetch.mockReturnValue({ data: null, cargando: true, error: null });

    const { container } = render(
      <MemoryRouter>
        <MisCompras />
      </MemoryRouter>
    );

    const spinner = container.querySelector(".spinner-border");
    expect(spinner).toBeInTheDocument();
  });

  it("muestra mensaje de error si falla la carga", () => {
    useFetch.mockReturnValue({
      data: null,
      cargando: false,
      error: "Error de red",
    });

    render(
      <MemoryRouter>
        <MisCompras />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Error al cargar el historial de compras./i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje si no hay compras", () => {
    useCompras.mockReturnValue({ comprasLocales: [] });
    useFetch.mockReturnValue({ data: [], cargando: false, error: null });

    render(
      <MemoryRouter>
        <MisCompras />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/No tienes compras registradas/i)
    ).toBeInTheDocument();
  });

  it("muestra detalles de los items de una compra", () => {
    useCompras.mockReturnValue({ comprasLocales: mockComprasLocales });
    useFetch.mockReturnValue({ data: [], cargando: false, error: null });

    render(
      <MemoryRouter>
        <MisCompras />
      </MemoryRouter>
    );

    expect(screen.getByText(/Libro Local/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad:/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/14,99\s?€/)).toBeInTheDocument();
    expect(screen.getByText(/29,99\s?€/)).toBeInTheDocument();
  });
});
