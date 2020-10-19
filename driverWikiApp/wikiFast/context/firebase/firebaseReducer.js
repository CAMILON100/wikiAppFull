import {USUARIO, SOLICITUD, LISTASOLICITUDES} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case USUARIO:
      return {...state, usuario: action.payload};

    case SOLICITUD:
      return {...state, solicitud: action.payload};

    case LISTASOLICITUDES:
      return {...state, listaSolicitudes: action.payload};

    default:
      return state;
  }
};
