import React, {useReducer} from 'react';

import firebase from '../../firebase/index';
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';
import {USUARIO, SOLICITUD, ESTIMADO} from '../../types';

const FirebaseState = props => {
  const initialState = {
    usuario: {},
    solicitud: {},
    estimado: 0,
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

  const asignarEstimado = valorEstimado => {
    dispatch({
      type: ESTIMADO,
      payload: valorEstimado,
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        solicitud: state.solicitud,
        usuario: state.usuario,
        estimado: state.estimado,
        asignarUsuario,
        asignarSolicitud,
        asignarEstimado,
      }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;
