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

const EnCamino = ({
  guardarEstadoMenu,
  direccionDestinoHome,
  guardarRegionActual,
}) => {
  const {solicitud, firebase, usuario, asignarSolicitud} = useContext(
    FirebaseContext,
  );
  const [estadoSolicitud, guardarEstadoSolicitud] = useState(solicitud);
  const [cargando, guardarCargando] = useState(false);
  const [flagEstado, guardarflagEstado] = useState(false);
  //  const [cancelaUser, guardarCargando] = useState(false);

  useEffect(() => {
    console.log('UseEffect solicitudesActivas EnCamino');
    var serviceUpdate = firebase.db
      .collection('solicitudesActivas')
      .where('idUsuario', '==', usuario.id)
      .onSnapshot(manejarSnapShot);
    return () => {
      console.log('componente en camino stop');
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

        console.log("flagEstado flagEstado flagEstado")
        console.log(flagEstado)


        if (!flagEstado) {
          AsyncStorage.removeItem('solicitudActiva').then(result => {
            asignarSolicitud({});
            guardarRegionActual({
              lat: estadoSolicitud.GPSUsuario.lat,
              lon: estadoSolicitud.GPSUsuario.lon,
            });
            guardarEstadoMenu('home');
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log('Cambió El estado');
    console.log(estadoSolicitud);
    if (estadoSolicitud.estado == 3) {
      asignarSolicitud(estadoSolicitud);
      guardarEstadoMenu('calificarConductor');
    } else {
      if (estadoSolicitud.estado == 1 || estadoSolicitud.estado == 2) {
        asignarSolicitud(estadoSolicitud);
      } else {
        if (estadoSolicitud.estado == -1) {
          guardarEstadoMenu('noConductor');
          guardarflagEstado(true)
          let solicitudActivaRef = firebase.db.collection('solicitudesActivas');
          solicitudActivaRef
            .doc(estadoSolicitud.id)
            .delete()
            .then(result => {
              let solicitudesRef = firebase.db.collection('solicitudes');

              solicitudesRef
                .doc(estadoSolicitud.id)
                .set(solicitud)
                .then(resultAdd => {});
            })
            .catch(error => {
              console.log('Error en buscandoConductor');
              console.log(error);
            });
        }
      }
    }
  }, [estadoSolicitud]);

  const cancelarSolicitud = () => {
    guardarCargando(true);

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
          guardarEstadoMenu('home');
        });
      });
  };

  return (
    <>
      <HeaderLabelInfo
        direccionDestinoHome={direccionDestinoHome}
        label={'CONDUCTOR SELECCIONADO'}
      />

      <View style={styles.viewInfo}>
        <View style={styles.imgPerfil}>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/carTinyPaint2.png')}
          />
        </View>

        <View style={{alignSelf: 'center', marginLeft: '4%', width: '36%'}}>
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
        </View>
        <View style={styles.imgPerfil2}>
          {cargando ? (
            <ActivityIndicator
              style={{paddingTop: '20%', paddingLeft: '10%'}}
              size="small"
              color="#FFFF"
            />
          ) : (
            <TouchableHighlight
              style={{borderRadius: 15}}
              underlayColor="#10114B"
              onPress={() => {
                cancelarSolicitud();
              }}>
              <Text style={styles.textoCancelar}> X</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
      <View style={{marginTop: '7%'}} />
    </>
  );
};

const styles = StyleSheet.create({
  imgPerfil: {
    backgroundColor: '#FFF',
    width: '23%',
    height: '63%',
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: '4%',
  },
  imgPerfil2: {
    backgroundColor: '#10112B',
    width: '23%',
    height: '63%',
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: '7%',
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
    height: '16%',
    marginTop: '100%',
    width: '81%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buscandoCond: {
    zIndex: 2,
    alignSelf: 'center',
    marginTop: '20%',
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
  buttonsMapSecond: {zIndex: 2, marginTop: '-7.5%'},
  botonProponer: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '13%',
    width: '40%',
    marginTop: '-3.5%',
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
    fontFamily: 'myriadprobold',
    fontSize: 45,
    paddingTop: '5%',
    paddingLeft: '10%',
  },
});

export default EnCamino;
