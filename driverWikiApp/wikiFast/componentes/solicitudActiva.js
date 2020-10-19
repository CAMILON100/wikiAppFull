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
import {getDistance, getPreciseDistance} from 'geolib';
import axios from 'axios';

const SolicitudActiva = ({
  markerData,
  guardarEstadoMenu,
  guardarEstadoTrabajar,
  estadoSolActiva,
  guardarEstadoSolActiva,
  GPSUser,
}) => {
  const {firebase, usuario, asignarSolicitud, solicitud} = useContext(
    FirebaseContext,
  );

  const [cargando, guardarCargando] = useState(false);
  const [finalizarServicio, guardarFinalizarServicio] = useState(false);
  const [estadoSolicitud, guardarEstadoSolicitud] = useState(solicitud);

  guardarEstadoTrabajar(false);

  useEffect(() => {
    console.log('UseEffect solicitudesActivas');
    var serviceUpdate = firebase.db
      .collection('solicitudesActivas')
      .where('idConductor', '==', usuario.id)
      .onSnapshot(manejarSnapShot);
    return () => {
      console.log('componente solicitudesActivas stop');
      serviceUpdate();
    };
    function manejarSnapShot(snapshot) {
      let solicitudActiva = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      if (solicitudActiva[0] != undefined) {
        guardarEstadoSolicitud(solicitudActiva[0]);
      } else {
        console.log('ERROR AGEGAR VALIDACIóN?');
      }
    }
  }, []);

  useEffect(() => {
    console.log('Cambió El estado');
    console.log(estadoSolicitud);
    if (estadoSolicitud.estado == -1 && finalizarServicio === false) {
      guardarEstadoMenu('pasajeroOcupado');
      guardarEstadoTrabajar(true);
      AsyncStorage.removeItem('solicitudActiva').then(result => {
        asignarSolicitud({});

        let solicitudActiva = firebase.db.collection('solicitudesActivas');
        solicitudActiva
          .doc(estadoSolicitud.id)
          .delete()
          .then(result => {
            let solicitudesRef = firebase.db.collection('solicitudes');

            solicitudesRef
              .doc(estadoSolicitud.id)
              .set(markerData)
              .then(resultAdd => {});
          });
      });
    } else {
      if (estadoSolicitud.estado == 1 || estadoSolicitud.estado == 2) {
        asignarSolicitud(estadoSolicitud);
      }
    }
  }, [estadoSolicitud]);

  useEffect(() => {
    var dis = getDistance(
      {
        latitude: GPSUser.lat,
        longitude: GPSUser.lon,
      },
      {
        latitude: markerData.GPSUsuario.lat,
        longitude: markerData.GPSUsuario.lon,
      },
    );

    if (dis <= 50) {
      axios
        .post(
          'https://us-central1-wikiapplogin.cloudfunctions.net/pushNotification',
          {
            idUsuario: solicitud.idUsuario,
            mensaje: 'Revisa los detalles de tu viaje',
            titulo: '¡El carro que pediste ha llegado!',
          },
        )
        .then(res => {
          console.log('envia push');
          guardarEstadoSolActiva(1);
        });
    }
  }, []);

  const finalizarViaje = () => {
    guardarCargando(true);
    guardarFinalizarServicio(true);
    if (estadoSolActiva === 0 || estadoSolActiva === 1) {
      let solicitudActivaRef = firebase.db.collection('solicitudesActivas');

      solicitudActivaRef
        .doc(solicitud.id)
        .update({
          estado: -1,
        })
        .then(() => {
          AsyncStorage.removeItem('solicitudActiva').then(result => {
            asignarSolicitud({});
            guardarCargando(false);
            guardarEstadoTrabajar(true);
            guardarEstadoMenu('home');
          });
        });
    } else {
      let solicitudActivaRef = firebase.db.collection('solicitudesActivas');

      solicitudActivaRef
        .doc(solicitud.id)
        .update({
          estado: 3,
        })
        .then(() => {
          guardarCargando(false);
          guardarEstadoMenu('calificarPasajero');
        });
    }
  };

  const iniciarCarrera = () => {
    guardarCargando(true);

    let solicitudActivaRef = firebase.db.collection('solicitudesActivas');
    solicitudActivaRef
      .doc(solicitud.id)
      .update({
        estado: 2,
        inicioCarrera: true,
      })
      .then(() => {
        guardarCargando(false);
        guardarEstadoSolActiva(2);
      });
  };

  return (
    <>
      <View style={styles.viewInfo}>
        <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '5%'}}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/mydestiny.png')}
          />

          <Text style={[styles.textViewInfo, {marginLeft: '3%', fontSize: 12}]}>
            {markerData.direccion}
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: '5%', marginLeft: '5%'}}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/userPositionWhite.png')}
          />

          <Text style={[styles.textViewInfo, {marginLeft: '3%', fontSize: 12}]}>
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
              {fontSize: 16, fontFamily: 'myriadprobold', marginBottom: '3.5%'},
            ]}>
            {markerData.nombre}
          </Text>
        </View>
      </View>

      {estadoSolActiva == 1 ? (
        <View style={styles.botonProponer2}>
          {cargando ? (
            <ActivityIndicator
              style={{zIndex: 2, marginTop: '-27%'}}
              size="small"
              color="#FFF"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-27%'}}
              onPress={() => {
                iniciarCarrera();
              }}>
              <Text style={styles.textoProponer2}> INICIAR CARRERA</Text>
            </TouchableHighlight>
          )}
        </View>
      ) : (
        <></>
      )}

      <View
        style={
          estadoSolActiva == 0 || estadoSolActiva == 2
            ? styles.buttonsMap
            : styles.buttonsMapEstado1
        }>
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

        <View
          style={
            estadoSolActiva == 0 || estadoSolActiva == 1
              ? styles.botonProponer
              : styles.botonProponer3
          }>
          {cargando ? (
            <ActivityIndicator
              style={{zIndex: 2, marginTop: '-27%'}}
              size="small"
              color="#FFF"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-27%'}}
              onPress={() => {
                finalizarViaje();
              }}>
              <Text style={styles.textoProponer}> FINALIZAR</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textViewInfo: {color: '#FFF', fontFamily: 'myriadpro', width: '88%'},
  viewInfo: {
    zIndex: 2,
    backgroundColor: '#F15A29',
    borderRadius: 18,
    marginTop: '8%',
    width: '81%',
    alignSelf: 'center',
  },
  buscandoCond: {zIndex: 2},
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '75%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginBottom: '-5%',
  },
  buttonsMapEstado1: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '2%',
    alignSelf: 'center',
    marginRight: '3.5%',
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
  },
  botonProponer: {
    backgroundColor: '#10112B',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '17%',
    width: '42%',
    marginLeft: '4%',
  },
  botonProponer2: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '17%',
    width: '50%',
    marginLeft: '4%',
    marginTop: '62%',
    zIndex: 2,
  },
  botonProponer3: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '17%',
    width: '42%',
    marginLeft: '4%',
  },
  textoProponer: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
  },
  textoProponer2: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
    marginTop: '5%',
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

export default SolicitudActiva;
