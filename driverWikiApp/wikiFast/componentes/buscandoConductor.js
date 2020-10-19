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

const BuscandoConductor = ({direccionDestinoHome, guardarEstadoMenu}) => {
  const {solicitud, firebase, usuario} = useContext(FirebaseContext);
  const [estadoSolicitud, guardarEstadoSolicitud] = useState(solicitud);

  useEffect(() => {
    console.log('UseEffect solicitudesActivas');
    firebase.db
      .collection('solicitudesActivas')
      .where('idUsuario', '==', usuario.id)
      .onSnapshot(manejarSnapShot);
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
        guardarEstadoMenu('home');
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
              guardarEstadoMenu('noConductor');
            });
        })
        .catch(error => {
          console.log('Error en buscandoConductor');
          console.log(error);
        });
    } else {
    }
  }, [estadoSolicitud]);

  return (
    <>
      <HeaderLabelInfo
        direccionDestinoHome={direccionDestinoHome}
        label={'BUSCANDO EL CONDUCTOR'}
      />

      {solicitud.estimado != 1 ? (
        <>
          <Image
            style={styles.buscandoCond}
            source={require('../assets/images/buscandoConductor.png')}
          />
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
  buscandoCond: {zIndex: 2, alignSelf: 'center', marginTop: '47%'},
  buscandoCond2: {zIndex: 2, alignSelf: 'center', marginTop: '58%'},
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '15%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginBottom: '-5%',
  },
  buttonsMap2: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '4%',
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
});

export default BuscandoConductor;
