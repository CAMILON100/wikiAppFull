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

const PasajeroOcupado = ({
  guardarEstadoMenu,

}) => {
  const {firebase, usuario, asignarSolicitud} = useContext(FirebaseContext);

  const aceptarPasajeroOcupado = () => {
    AsyncStorage.removeItem('solicitudActiva').then(result => {
      asignarSolicitud({});
      guardarEstadoMenu('home');
    });
  };

  return (
    <>

      <View style={styles.viewInfo}>
        <View style={{marginTop: '5%', marginLeft: '5%'}}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/userPositionWhite2.png')}
          />
        </View>

        <View style={{marginTop: '10%'}}>
          <Text
            style={[
              styles.textViewInfo,
              {fontSize: 12, fontFamily: 'myriadprobold', textAlign: 'center'},
            ]}>
            EL PASAJERO YA TIENE CONDUCTOR O CANCELÓ EL SERVICIO
          </Text>
        </View>
      </View>

      <View style={styles.buttonsMapSecond}>
        <View style={styles.botonProponer}>
          <TouchableHighlight
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              aceptarPasajeroOcupado();
            }}>
            <Text style={styles.textoProponer}> ACEPTAR</Text>
          </TouchableHighlight>
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
    height: '29%',
    marginTop: '78%',
    width: '81%',
    alignSelf: 'center',
  },
  buscandoCond: {zIndex: 2, alignSelf: 'center'},
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

export default PasajeroOcupado;
