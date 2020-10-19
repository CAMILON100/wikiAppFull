import React from "react";
import logo from "./logoWiki.png";

const Gracias = () => {
  document.title = "Wiki App - Gracias";
  return (
    <>
      <div className="h-full w-full bg-fondo absolute flex flex-col">
        <div className="flex justify-center mt-40">
          <img src={logo} alt="Logo" />;
        </div>

        <div className="text-white flex justify-center mt-32">
          GRACIAS POR EL REGISTRO
        </div>

        <div className="text-white flex justify-center mt-2">
          PRONTO ENVIAREMOS UN CORREO DE CONFIRMACIÓN
        </div>
        <div className="text-white flex justify-center mt-64">
          Wiki App 2020
        </div>
      </div>
    </>
  );
};

export default Gracias;
