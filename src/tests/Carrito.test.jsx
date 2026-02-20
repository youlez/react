import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Carrito from "../views/Carrito";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useCompras } from "../context/ComprasContext";
import MySwal from "../utils/swal";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../context/CarritoContext", () => ({
  useCarrito: jest.fn(),
}));

jest.mock("../context/ComprasContext", () => ({
  useCompras: jest.fn(),
}));

jest.mock("../utils/swal", () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Carrito Component", () => {
  const mockUsuario = { id: "123", nombre: "Juan" };
  const mockItems = [
    {
      id: "1",
      titulo: "Libro 1",
      autor: "Autor 1",
      precio: 10,
      portada: "imagen1.jpg",
      cantidad: 2,
    },
  ];

  const mockCarrito = {
    itemsCarrito: mockItems,
    totalPrecio: 20,
    eliminarDelCarrito: jest.fn(),
    actualizarCantidad: jest.fn(),
    vaciarCarrito: jest.fn(),
  };

  const mockCompras = {
    agregarCompra: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ usuario: null });
    useCarrito.mockReturnValue(mockCarrito);
    useCompras.mockReturnValue(mockCompras);
  });

  it("muestra mensaje si el carrito está vacío", () => {
    useCarrito.mockReturnValue({
      ...mockCarrito,
      itemsCarrito: [],
    });

    renderWithRouter(<Carrito />);

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ir a la tienda/i })
    ).toBeInTheDocument();
  });

  it("muestra lista de productos si hay items", () => {
    renderWithRouter(<Carrito />);

    expect(screen.getByText(/Libro 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Autor 1/i)).toBeInTheDocument();

    const precios = screen.getAllByText(/20,00\s?€/);
    expect(precios.length).toBeGreaterThanOrEqual(1);
    expect(precios[0]).toBeInTheDocument();
  });

  it("abre modal de login si usuario no está autenticado al proceder al pago", async () => {
    renderWithRouter(<Carrito />);

    fireEvent.click(screen.getByRole("button", { name: /Proceder al Pago/i }));

    await waitFor(() => {
      expect(MySwal.fire).toHaveBeenCalled();
    });

    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
  });

  it("abre modal de checkout si usuario está autenticado", async () => {
    useAuth.mockReturnValue({ usuario: mockUsuario });

    renderWithRouter(<Carrito />);

    fireEvent.click(screen.getByRole("button", { name: /Proceder al Pago/i }));

    await waitFor(() => {
      expect(screen.getByText(/Finalizar Compra/i)).toBeInTheDocument();
    });
  });

  it("permite aumentar/disminuir cantidad de un producto", () => {
    renderWithRouter(<Carrito />);

    const botonMas = screen.getAllByText("+")[0];
    const botonMenos = screen.getAllByText("-")[0];

    fireEvent.click(botonMas);
    expect(mockCarrito.actualizarCantidad).toHaveBeenCalledWith("1", 3);

    fireEvent.click(botonMenos);
    expect(mockCarrito.actualizarCantidad).toHaveBeenCalledWith("1", 1);
  });

  it("permite eliminar un producto del carrito", () => {
    renderWithRouter(<Carrito />);

    const botonEliminar = screen.getAllByRole("button", { name: "" })[0]; // Ícono de basura
    fireEvent.click(botonEliminar);

    expect(mockCarrito.eliminarDelCarrito).toHaveBeenCalledWith("1");
  });

  it("permite vaciar todo el carrito", () => {
    renderWithRouter(<Carrito />);

    fireEvent.click(screen.getByText(/Vaciar Carrito/i));

    expect(mockCarrito.vaciarCarrito).toHaveBeenCalled();
  });
});
