import {USUARIO, SOLICITUD, ESTIMADO} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case USUARIO:
      return {...state, usuario: action.payload};

    case SOLICITUD:
      return {...state, solicitud: action.payload};

    case ESTIMADO:
      return {...state, estimado: action.payload};

    default:
      return state;
  }
};
