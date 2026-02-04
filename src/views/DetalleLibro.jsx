import { useParams } from "react-router-dom";
import VistaLibro from "../components/VistaLibro";
import MySwal from "../utils/swal";

const DetalleLibro = () => {
  const { id } = useParams();

  const agregarAlCarrito = (libro) => {
    MySwal.fire({
      icon: "success",
      title: "Añadido al carrito",
      text: `${libro.titulo} se ha añadido a tu carrito.`,
    });
  };

  return (
    <VistaLibro
      id={id}
      modoCompleto={true}
      onAgregarCarrito={agregarAlCarrito}
    />
  );
};

export default DetalleLibro;
