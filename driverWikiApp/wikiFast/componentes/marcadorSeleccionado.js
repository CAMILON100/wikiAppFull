import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';

const MarcadorSeleccionado = ({
  markerData,
  guardarEstadoMenu,
  GPSUser,
  guardarEstadoTrabajar,
  guardarEstadoSolActiva,
  navigation,
}) => {
  const {firebase, usuario, asignarSolicitud} = useContext(FirebaseContext);

  const [cargando, guardarCargando] = useState(false);

  guardarEstadoSolActiva(0);

  const cancelarSolicitud = () => {
    guardarEstadoTrabajar(true);
    guardarEstadoMenu('home');
  };

  const aceptarSolicitudConductor = () => {
    guardarCargando(true);

    let userF = firebase.auth.currentUser;

    if (userF == null) {
      console.log('errUser');
      AsyncStorage.clear();
      Alert.alert(
        'Error', //Titulo
        'Su cuenta ha sido deshabilitada, contacte al administrador', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      navigation.navigate('Login');
      return;
    }

    userF
      .reload()
      .then(userResp => {
        let solicitudActivaRef = firebase.db.collection('solicitudesActivas');

        solicitudActivaRef
          .where('idUsuario', '==', markerData.idUsuario)
          .where('estado', '==', 0)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              guardarCargando(false);
              guardarEstadoMenu('pasajeroOcupado');
            } else {
              solicitudActivaRef
                .doc(snapshot.docs[0].id)
                .update({
                  estado: 1,
                  idConductor: usuario.id,
                  nombreConductor: usuario.nombre,
                  placas: usuario.placas,
                  GPSConductor: GPSUser,
                })
                .then(() => {
                  markerData['estado'] = 1;
                  asignarSolicitud(markerData);

                  AsyncStorage.setItem(
                    'solicitudActiva',
                    JSON.stringify(markerData),
                  ).then(result => {
                    guardarCargando(false);
                    guardarEstadoMenu('solicitudActiva');
                  });
                });
            }
          })
          .catch(error => {
            guardarCargando(false);
            guardarEstadoMenu('pasajeroOcupado');
          });
      })
      .catch(errUser => {
        console.log('errUser');
        console.log(errUser);
        AsyncStorage.clear();
        Alert.alert(
          'Error', //Titulo
          'Su cuenta ha sido deshabilitada, contacte al administrador', //mensaje
          [
            {
              text: 'OK', //Arreglo de botones
            },
          ],
        );
        navigation.navigate('Login');
      });
  };

  return (
    <>
      <View style={styles.viewInfo}>
        <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '5%'}}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/userPositionWhite.png')}
          />

          <Text
            style={[
              styles.textViewInfo,
              {marginLeft: '3%', fontSize: 15, width: '80%'},
            ]}>
            {markerData.direccionOrigen} ({markerData.dirAdicional})
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
            {markerData.nombre}
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '5%'}}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/mydestiny.png')}
          />

          <Text
            style={[
              styles.textViewInfo,
              {marginLeft: '3%', fontSize: 15, width: '80%'},
            ]}>
            {markerData.direccion}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsMap}>
        <View style={[styles.botonValor, {backgroundColor: '#939598'}]}>
          <View style={{alignSelf: 'center'}}>
            {markerData.estimado ? (
              <Text style={styles.textoValor}>
                PASAJERO ACEPTA TARIFA SUGERIDA
              </Text>
            ) : (
              <Text style={styles.textoValor}> PASAJERO PROPONE PAGAR</Text>
            )}

            <Text style={styles.textoNumero}>${markerData.valor}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonsMapSecond}>
        <View style={styles.botonCancelar}>
          <TouchableHighlight
            style={{alignSelf: 'center', marginTop: '-27%'}}
            disabled={cargando}
            onPress={() => {
              cancelarSolicitud();
            }}>
            <Text style={styles.textoCancelar}> CANCELAR</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.botonProponer}>
          {cargando ? (
            <ActivityIndicator
              style={{zIndex: 2, marginTop: '-27%'}}
              size="small"
              color="#FFF"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-27%'}}
              underlayColor="darkgrey"
              onPress={() => {
                aceptarSolicitudConductor();
              }}>
              <Text style={styles.textoProponer}> ACEPTAR</Text>
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
    marginTop: '65%',
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
    marginTop: '-4%',
    marginRight: '4%',
    flexDirection: 'row',
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
    paddingTop: '15%',
    width: '42%',
    marginLeft: '8%',

    marginBottom: '1%',
  },
  textoCancelar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
  },
});

export default MarcadorSeleccionado;
