import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../components/Login";
import { useAuth } from "../context/AuthContext";
import useLogin from "../hooks/useLogin";

const mockLoginContext = jest.fn();
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: mockLoginContext }),
}));

const mockUseLogin = jest.fn();
jest.mock("../hooks/useLogin");

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.mockReset();
    useLogin.mockReturnValue({
      login: mockUseLogin,
      cargando: false,
      error: null,
    });
  });

  it("renderiza inputs y botón correctamente", () => {
    render(
      <MemoryRouter>
        <Login closeModal={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("al enviar el formulario con éxito llama a loginContext y closeModal", async () => {
    const fakeUser = { name: "Usuario Test" };
    mockUseLogin.mockResolvedValueOnce(fakeUser);
    const closeModal = jest.fn();

    render(
      <MemoryRouter>
        <Login closeModal={closeModal} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockUseLogin).toHaveBeenCalledWith("test@example.com", "123456");
      expect(mockLoginContext).toHaveBeenCalledWith(fakeUser);
      expect(closeModal).toHaveBeenCalled();
    });
  });

  it("muestra mensaje de error cuando el login falla", async () => {
    const errorMsg = "Credenciales inválidas";
    useLogin.mockReturnValue({
      login: mockUseLogin,
      cargando: false,
      error: errorMsg,
    });

    render(
      <MemoryRouter>
        <Login closeModal={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("muestra spinner mientras está cargando", () => {
    useLogin.mockReturnValue({
      login: mockUseLogin,
      cargando: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <Login closeModal={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
});
