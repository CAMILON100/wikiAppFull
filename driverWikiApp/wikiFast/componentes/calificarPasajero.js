import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';

const CalificarPasajero = ({guardarEstadoMenu, guardarEstadoTrabajar}) => {
  const {firebase, usuario, solicitud, asignarSolicitud} = useContext(
    FirebaseContext,
  );

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

  const calificarPasajero = () => {
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
                .doc(solicitud.idUsuario)
                .update({
                  puntuacionTotal: firebase.createIncrement(calificacion),
                  personas: firebase.createIncrement(1),
                })
                .then(() => {
                  asignarSolicitud({});
                  guardarCargando(false);
                  guardarEstadoTrabajar(true)
                  guardarEstadoMenu('home');
                });
            });
        });
    });
  };

  return (
    <>
      <View style={styles.viewInfo}>
        <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '5%'}}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/userPosition.png')}
          />

          <Text style={[styles.textViewInfo, {marginLeft: '3%', fontSize: 18}]}>
            {solicitud.direccion}
          </Text>
        </View>

        <View style={{marginLeft: '15%'}}>
          <Text style={[styles.textViewInfo, {marginTop: '3%', fontSize: 10}]}>
            PASAJERO
          </Text>
          <Text
            style={[
              styles.textViewInfo,
              {fontSize: 16, fontFamily: 'myriadprobold'},
            ]}>
            {solicitud.nombre}
          </Text>
        </View>
        <Text
          style={[
            styles.textViewInfo,
            {
              marginTop: '8%',
              fontSize: 12,
              fontFamily: 'myriadprobold',
              marginLeft: '15%',
            },
          ]}>
          Calificar Pasajero
        </Text>
        <View style={{flexDirection: 'row', marginLeft: '15%'}}>
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

      <View style={styles.buttonsMapSecond}>
        <View style={styles.botonProponer}>
          {cargando ? (
            <ActivityIndicator
              style={{alignSelf: 'center', marginTop: '-27%'}}
              size="small"
              color="#FFF"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-27%'}}
              underlayColor="darkgrey"
              onPress={() => {
                calificarPasajero();
              }}>
              <Text style={styles.textoProponer}> CALIFICAR</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textViewInfo: {color: '#FFF', fontFamily: 'myriadpro'},
  viewInfo: {
    zIndex: 2,
    backgroundColor: '#F15A29',
    borderRadius: 18,
    height: '30%',
    marginTop: '52%',
    width: '81%',
    alignSelf: 'center',
  },
  buscandoCond: {zIndex: 2},
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '-10%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginBottom: '-5%',
  },
  textoValor: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 8,
    paddingTop: '6%',
  },
  textoNumero: {
    color: '#10112B',
    fontFamily: 'myriadprobold',
    fontSize: 20,
    marginLeft: '25%',
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
    marginLeft: '2.5%',
  },
  buttonsMapSecond: {
    zIndex: 2,
    marginTop: '10%',
    marginRight: '4%',
    marginBottom: '5.5%',
  },
  botonProponer: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '15%',
    width: '42%',
    marginLeft: '4%',
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
    paddingTop: '17%',
    width: '42%',
    marginLeft: '3%',
    marginTop: '1%',
    marginBottom: '1%',
  },
  textoCancelar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 20,
  },
});

export default CalificarPasajero;
