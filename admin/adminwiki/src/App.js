import React from "react";
import { Routes, Route } from "react-router";

import firebase, { FirebaseContext } from "./firebase";

import Inicio from "./components/paginas/Inicio";

import RegistroConductor from "./components/paginas/registroConductor";

import Gracias from "./components/paginas/gracias";

import PanelPrincipal from "./components/paginas/panelPrincipal";

import Conductor from "./components/paginas/conductor";

import ConductorListaViajes from "./components/paginas/conductorListaViajes";

function App() {
  return (
    <FirebaseContext.Provider value={{ firebase }}>
      <div>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registroConductor" element={<RegistroConductor />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/panelPrincipal" element={<PanelPrincipal />} />
          <Route path="/conductor/:idConductor" element={<Conductor />} />
          <Route
            path="/conductorListaViajes/:idConductor"
            element={<ConductorListaViajes />}
          />
        </Routes>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
