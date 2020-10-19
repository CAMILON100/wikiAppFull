import React, {useReducer,useContext} from 'react';

import firebase from '../../firebase/index';
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';
import {USUARIO, SOLICITUD, LISTASOLICITUDES} from '../../types';

const FirebaseState = props => {
  const initialState = {
    usuario: {},
    solicitud: {},
    listaSolicitudes: {},
  };

  const [state, dispatch] = useReducer(FirebaseReducer, initialState);

  const asignarUsuario = usuarioDoc => {
    dispatch({
      type: USUARIO,
      payload: usuarioDoc,
    });
  };

  const asignarSolicitud = solicitudDoc => {
    dispatch({
      type: SOLICITUD,
      payload: solicitudDoc,
    });
  };

  const asignarListaSolicitudes = listaSolicitudes => {
    dispatch({
      type: LISTASOLICITUDES,
      payload: listaSolicitudes,
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        solicitud: state.solicitud,
        usuario: state.usuario,
        listaSolicitudes:state.listaSolicitudes,
        asignarListaSolicitudes,
        asignarUsuario,
        asignarSolicitud,
      }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;
