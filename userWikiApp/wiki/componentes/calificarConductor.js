import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import HeaderLabelInfo from '../componentes/headerLabelInfo';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const CalificarConductor = ({direccionDestinoHome, guardarEstadoMenu}) => {
  const {
    solicitud,
    firebase,
    usuario,
    asignarUsuario,
    asignarSolicitud,
  } = useContext(FirebaseContext);

  const [calificacion, guardarCalificacion] = useState(0);
  const [stars, guardarStars] = useState([false, false, false, false, false]);
  const [cargando, guardarCargando] = useState(false);

  const calificar = numeroCalificacion => {
    guardarCalificacion(numeroCalificacion);
    let starsTemp = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= numeroCalificacion) starsTemp.push(true);
      else starsTemp.push(false);
    }
    guardarStars(starsTemp);
  };

  const finalizarServicio = () => {
    guardarCargando(true);

    AsyncStorage.removeItem('solicitudActiva').then(result => {
      let solicitudActiva = firebase.db.collection('solicitudesActivas'),
        usuariosRef = firebase.db.collection('usuarios');
      solicitudActiva
        .doc(solicitud.id)
        .delete()
        .then(result => {
          let solicitudesRef = firebase.db.collection('solicitudes');
          solicitud['estado'] = 2;
          solicitudesRef
            .doc(solicitud.id)
            .set(solicitud)
            .then(resultAdd => {
              usuariosRef
                .doc(solicitud.idConductor)
                .update({
                  puntuacionTotal: firebase.createIncrement(calificacion),
                  personas: firebase.createIncrement(1),
                })
                .then(() => {
                  asignarSolicitud({});
                  guardarCargando(false);
                  guardarEstadoMenu('numeroViajes');
                });
            });
        });
    });
  };

  useEffect(() => {
    if (solicitud.valor ==0 && solicitud.estimado==1) {
      usuario.numeroViajes = 0;
      let usuariosRef = firebase.db.collection('usuarios');
      usuariosRef
        .doc(usuario.id)
        .update({
          numeroViajes: 0,
        })
        .then(() => {
          asignarUsuario(usuario);
          AsyncStorage.setItem('usuario', JSON.stringify(usuario)).then(() => {
            console.log('Guardado el número de viajes');
            
          });
        });
    } else {
      console.log('Va aumentar el número de viajes');
      if (usuario.numeroViajes == undefined) {
        usuario.numeroViajes = 1;
      } else {
        if (usuario.numeroViajes == 12) {
          usuario.numeroViajes = 12;
        } else {
          usuario.numeroViajes = usuario.numeroViajes + 1;
        }
      }

      if (usuario.numeroViajes < 12) {
        let usuariosRef = firebase.db.collection('usuarios');
        usuariosRef
          .doc(usuario.id)
          .update({
            numeroViajes: firebase.createIncrement(1),
          })
          .then(() => {
            asignarUsuario(usuario);
            AsyncStorage.setItem('usuario', JSON.stringify(usuario)).then(
              () => {
                console.log('Guardado el número de viajes mejor de 12');
                console.log(usuario.numeroViajes);
              },
            );
          });
      }
    }
  }, []);

  return (
    <>
      <HeaderLabelInfo direccionDestinoHome={direccionDestinoHome} />

      <View style={styles.viewInfo}>
        <View style={styles.imgPerfil} />

        <View style={{alignSelf: 'center', marginTop: '5%', marginLeft: '3%'}}>
          <Text style={[styles.textViewInfo, {fontSize: 10}]}>CONDUCTOR</Text>
          <Text style={[styles.textViewInfo, {fontFamily: 'myriadprobold'}]}>
            {solicitud.nombreConductor}
          </Text>
          <Text style={[styles.textViewInfo, {marginTop: '5%', fontSize: 10}]}>
            PLACAS
          </Text>
          <Text style={[styles.textViewInfo, {fontFamily: 'myriadprobold'}]}>
            {solicitud.placas}
          </Text>
          <Text
            style={[
              styles.textViewInfo,
              {marginTop: '15%', fontSize: 12, fontFamily: 'myriadprobold'},
            ]}>
            Calificar Conductor
          </Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight
              onPress={() => {
                calificar(1);
              }}>
              {stars[0] ? (
                <Image source={require('../assets/images/starBlue.png')} />
              ) : (
                <Image source={require('../assets/images/starWhite.png')} />
              )}
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                calificar(2);
              }}>
              {stars[1] ? (
                <Image source={require('../assets/images/starBlue.png')} />
              ) : (
                <Image source={require('../assets/images/starWhite.png')} />
              )}
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                calificar(3);
              }}>
              {stars[2] ? (
                <Image source={require('../assets/images/starBlue.png')} />
              ) : (
                <Image source={require('../assets/images/starWhite.png')} />
              )}
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                calificar(4);
              }}>
              {stars[3] ? (
                <Image source={require('../assets/images/starBlue.png')} />
              ) : (
                <Image source={require('../assets/images/starWhite.png')} />
              )}
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                calificar(5);
              }}>
              {stars[4] ? (
                <Image source={require('../assets/images/starBlue.png')} />
              ) : (
                <Image source={require('../assets/images/starWhite.png')} />
              )}
            </TouchableHighlight>
          </View>
        </View>
        <Image
          style={styles.buscandoCond}
          source={require('../assets/images/carWhiteSmall.png')}
        />
      </View>

      <View style={styles.buttonsMapSecond}>
        <View style={styles.botonProponer}>
          {cargando ? (
            <ActivityIndicator
              style={{alignSelf: 'center', marginTop: '-16%'}}
              size="small"
              color="#FFF"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-16%'}}
              onPress={() => {
                finalizarServicio();
              }}>
              <Text style={styles.textoProponer}> FINALIZAR SERVICIO</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>

      <View style={{marginTop: '26%'}} />
    </>
  );
};

const styles = StyleSheet.create({
  imgPerfil: {
    backgroundColor: '#FFF',
    width: '35%',
    height: '71%',
    borderRadius: 10,
    alignSelf: 'center',
    marginLeft: '4%',
  },
  textViewInfo: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    alignSelf: 'flex-start',
  },
  viewInfo: {
    zIndex: 2,
    backgroundColor: '#F15A29',
    borderRadius: 15,
    height: '30%',
    marginTop: '40%',
    width: '81%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buscandoCond: {
    zIndex: 2,
    alignSelf: 'flex-start',
    marginLeft: '-11%',
    marginTop: '2.5%',
  },
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '-12%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginBottom: '-5%',
  },
  textoValor: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 8,
    paddingTop: '8%',
  },
  textoNumero: {
    color: '#10112B',
    fontFamily: 'myriadprobold',
    fontSize: 20,
    marginLeft: '10%',
    marginBottom: '5%',
  },
  botonValor2: {
    backgroundColor: '#F15A29',
    borderRadius: 20,
    alignSelf: 'center',
    width: '40%',
    marginLeft: '2.5%',
  },
  botonValor: {
    backgroundColor: '#F15A29',
    borderRadius: 20,
    alignSelf: 'center',
    width: '40%',
    marginLeft: '2.5%',
  },
  buttonsMapSecond: {zIndex: 2, marginTop: '5%'},
  botonProponer: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '13%',
    width: '60%',
    marginTop: '-1.5%',
  },
  textoProponer: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
  },
  botonCancelar: {
    backgroundColor: '#10112B',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '14%',
    width: '40%',
    marginTop: '1%',
    marginBottom: '5%',
  },
  textoCancelar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 18,
    paddingTop: '1.5%',
  },
});

export default CalificarConductor;
