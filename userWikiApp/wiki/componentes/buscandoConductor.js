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

const BuscandoConductor = ({
  direccionDestinoHome,
  guardarEstadoMenu,
  guardarRegionActual,
  estadoMenu,
}) => {
  const {solicitud, firebase, usuario, asignarSolicitud} = useContext(
    FirebaseContext,
  );
  const [estadoSolicitud, guardarEstadoSolicitud] = useState(solicitud);
  const [cargando, guardarCargando] = useState(false);

  useEffect(() => {
    console.log('UseEffect solicitudesActivas');
    var serviceUpdate = firebase.db
      .collection('solicitudesActivas')
      .where('idUsuario', '==', usuario.id)
      .onSnapshot(manejarSnapShot);
    return () => {
      console.log('componente buscando conductor stop');
      serviceUpdate();
    };
    function manejarSnapShot(snapshot) {
      let solicitudActiva = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log('solicitudActiva firebase');
      if (solicitudActiva[0] != undefined) {
        guardarEstadoSolicitud(solicitudActiva[0]);
      } else {
        console.log('estado de estadoSolicitud es');
        console.log(solicitud);
        AsyncStorage.removeItem('solicitudActiva').then(result => {
          asignarSolicitud({});
          guardarEstadoMenu('home');
        });
      }
    }
  }, []);

  useEffect(() => {
    console.log('Cambió El estado');
    console.log(estadoSolicitud);
    if (estadoSolicitud.estado == -1) {
      console.log('se acabó el tiempo de búsqueda de conductor');
      let solicitudActiva = firebase.db.collection('solicitudesActivas');
      solicitudActiva
        .doc(estadoSolicitud.id)
        .delete()
        .then(result => {
          let solicitudesRef = firebase.db.collection('solicitudes');

          solicitudesRef
            .doc(estadoSolicitud.id)
            .set(solicitud)
            .then(resultAdd => {
              asignarSolicitud(estadoSolicitud);
              guardarEstadoMenu('noConductor');
            });
        })
        .catch(error => {
          console.log('Error en buscandoConductor');
          console.log(error);
        });
    } else {
      if (estadoSolicitud.estado == 1) {
        AsyncStorage.setItem(
          'solicitudActiva',
          JSON.stringify(estadoSolicitud),
        ).then(result => {
          asignarSolicitud(estadoSolicitud);
          guardarEstadoMenu('confirmarConductor');
        });
      }
    }
  }, [estadoSolicitud]);

  const cancelarSolicitud = () => {
    guardarCargando(true);
    let solicitudActiva = firebase.db.collection('solicitudesActivas');
    solicitudActiva
      .doc(estadoSolicitud.id)
      .delete()
      .then(result => {
        let solicitudesRef = firebase.db.collection('solicitudes');

        solicitudesRef
          .doc(estadoSolicitud.id)
          .set(solicitud)
          .then(resultAdd => {
            AsyncStorage.removeItem('solicitudActiva').then(result => {
              asignarSolicitud({});
              guardarRegionActual({
                lat: estadoSolicitud.GPSUsuario.lat,
                lon: estadoSolicitud.GPSUsuario.lon,
              });
              guardarCargando(false);
              guardarEstadoMenu('home');
            });
          });
      })
      .catch(error => {
        console.log('Error en buscandoConductor');
        console.log(error);
      });
  };

  return (
    <>
      <HeaderLabelInfo direccionDestinoHome={direccionDestinoHome} />

      {solicitud.estimado != 1 ? (
        <>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/buscandoConductor.png')}
          />
          <View style={styles.botonCancelar}>
            {cargando ? (
              <ActivityIndicator
                style={{alignSelf: 'center', marginTop: '10%'}}
                size="small"
                color="white"
              />
            ) : (
              <TouchableHighlight
                style={{
                  zIndex: 3,
                }}
                onPress={() => {
                  cancelarSolicitud();
                }}>
                <Text style={styles.textoCancelar}> CANCELAR</Text>
              </TouchableHighlight>
            )}
          </View>
          <View style={styles.buttonsMap}>
            <View style={[styles.botonValor, {backgroundColor: '#939598'}]}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textoValor}> VALOR ESTIMADO DEL VIAJE</Text>
                <Text style={styles.textoNumero}>
                  {' '}
                  ${solicitud.valorEstimado}
                </Text>
              </View>
            </View>
            <View style={styles.botonValor2}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textoValor}> PASAJERO PROPONE PAGAR</Text>
                <Text style={styles.textoNumero}> ${solicitud.valor}</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <Image
            style={styles.buscandoCond2}
            source={require('../assets/images/buscandoConductor.png')}
          />
          <View style={styles.botonCancelar}>
            {cargando ? (
              <ActivityIndicator
                style={{alignSelf: 'center', marginTop: '10%'}}
                size="small"
                color="white"
              />
            ) : (
              <TouchableHighlight
                style={{
                  zIndex: 3,
                }}
                onPress={() => {
                  cancelarSolicitud();
                }}>
                <Text style={styles.textoCancelar}> CANCELAR</Text>
              </TouchableHighlight>
            )}
          </View>
          <View style={styles.buttonsMap2}>
            <View style={styles.botonValor}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textoValor}> VALOR ESTIMADO DEL VIAJE</Text>

                <Text style={styles.textoNumero}> ${solicitud.valor}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  textoCancelar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: '8%',
  },
  botonCancelar: {
    backgroundColor: '#10112B',
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: '3%',
    marginTop: '3%',
    width: '42%',
    height: '8%',
    zIndex: 2,
  },
  buscandoCond: {zIndex: 2, alignSelf: 'center', marginTop: '52%'},
  buscandoCond2: {zIndex: 2, alignSelf: 'center', marginTop: '52%'},
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '5%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '10%',
    marginBottom: '-5%',    
  },
  buttonsMap2: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '5%',
    alignSelf: 'center',
    marginRight: '0%',
    height: '10%',
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
});

export default BuscandoConductor;
