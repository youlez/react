import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutForm from "../components/CheckoutForm";
import MySwal from "../utils/swal";

jest.mock("../utils/swal", () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

describe("CheckoutForm Component", () => {
  const defaultProps = {
    totalPrecio: 99.99,
    onPagoExitoso: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todos los campos del formulario", () => {
    render(<CheckoutForm {...defaultProps} />);

    expect(screen.getByLabelText(/Titular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
  });

  it("muestra alerta si faltan campos obligatorios", async () => {
    render(<CheckoutForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/i }));

    await waitFor(() => {
      expect(MySwal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "warning",
          title: "Faltan datos",
        })
      );
    });
  });

  it("procesa el pago y muestra alerta de éxito", async () => {
    const onPagoExitoso = jest.fn();
    render(<CheckoutForm {...defaultProps} onPagoExitoso={onPagoExitoso} />);

    fireEvent.change(screen.getByLabelText(/Titular/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText(/Número de tarjeta/i), {
      target: { value: "4111111111111111" },
    });
    fireEvent.change(screen.getByLabelText(/Exp/i), {
      target: { value: "12/25" },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/i }));

    await waitFor(() => {
      expect(MySwal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Pago aprobado",
        })
      );
      expect(onPagoExitoso).toHaveBeenCalled();
    });
  });
});
