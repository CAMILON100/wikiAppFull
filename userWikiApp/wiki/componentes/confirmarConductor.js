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

const ConfirmarConductor = ({direccionDestinoHome, guardarEstadoMenu}) => {
  const {solicitud, firebase, usuario, asignarSolicitud} = useContext(
    FirebaseContext,
  );

  const [cargandoTiempo, guardarCargandoTiempo] = useState(true);
  const [tiempo, guardarTiempo] = useState('');
  const [cargando, guardarCargando] = useState(false);

  const [estadoSolicitud, guardarEstadoSolicitud] = useState(solicitud);

  useEffect(() => {
    console.log('UseEffect solicitudesActivas confirmarConductor');
    var serviceUpdate = firebase.db
      .collection('solicitudesActivas')
      .where('idUsuario', '==', usuario.id)
      .onSnapshot(manejarSnapShot);
    return () => {
      console.log('componente confirmar conductor stop');
      serviceUpdate();
    };
    function manejarSnapShot(snapshot) {
      let solicitudActiva = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log('solicitudActiva firebase confirmarConductor');
      if (solicitudActiva[0] == undefined) {
        guardarEstadoMenu('noConductor');
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          units: 'metric',
          origins:
            String(solicitud.GPSConductor.lat) +
            ',' +
            String(solicitud.GPSConductor.lon),
          destinations:
            String(solicitud.GPSUsuario.lat) +
            ',' +
            String(solicitud.GPSUsuario.lon),
          key: 'AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY',
        },
      })
      .then(function(response) {
        console.log(response.data.rows[0].elements[0].duration.text);
        guardarTiempo(response.data.rows[0].elements[0].duration.text);
        guardarCargandoTiempo(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

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
      <HeaderLabelInfo direccionDestinoHome={direccionDestinoHome} />

      <View style={styles.viewInfo}>
        <View style={styles.imgPerfil} />

        <View style={{alignSelf: 'flex-end', marginLeft: '3%'}}>
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
          <Text style={[styles.textViewInfo, {marginTop: '5%', fontSize: 10}]}>
            TIEMPO ESTIMADO DE LLEGADA
          </Text>

          {cargandoTiempo ? (
            <ActivityIndicator
              style={{alignSelf: 'flex-start'}}
              size="small"
              color="#10112B"
            />
          ) : (
            <Text
              style={[
                styles.textViewInfo,
                {marginBottom: '12.5%', fontFamily: 'myriadprobold'},
              ]}>
              {tiempo}
            </Text>
          )}
        </View>
        <Image
          style={styles.buscandoCond}
          source={require('../assets/images/carWhiteSmall2.png')}
        />
      </View>

      <View style={styles.buttonsMap}>
        {solicitud.estimado == 1 ? (
          <>
            <View style={[styles.botonValor, {backgroundColor: '#939598'}]}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textoValor}> VALOR ESTIMADO DEL VIAJE</Text>
                <Text style={styles.textoNumero}>
                  ${solicitud.valorEstimado}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.botonValor, {backgroundColor: '#939598'}]}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.textoValor}> VALOR ESTIMADO DEL VIAJE</Text>
                <Text style={styles.textoNumero}>
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
          </>
        )}
      </View>
      <View style={styles.buttonsMapSecond}>
        <View style={styles.botonCancelar}>
          {cargando ? (
            <ActivityIndicator
              style={{alignSelf: 'center', marginTop: '-27%'}}
              size="small"
              color="#FFF"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-27%'}}
              onPress={() => {
                cancelarSolicitud();
              }}>
              <Text style={styles.textoCancelar}> CANCELAR</Text>
            </TouchableHighlight>
          )}
        </View>
        <View style={styles.botonProponer}>
          <TouchableHighlight
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              guardarEstadoMenu('enCamino');
            }}>
            <Text style={styles.textoProponer}> ACEPTAR</Text>
          </TouchableHighlight>
        </View>
      </View>

      <View style={{marginTop: '6%'}} />
    </>
  );
};

const styles = StyleSheet.create({
  imgPerfil: {
    backgroundColor: '#FFF',
    width: '35%',
    height: '75%',
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
    height: '26%',
    marginTop: '40%',
    width: '81%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buscandoCond: {
    zIndex: 2,
    alignSelf: 'flex-start',
    marginLeft: '-10%',
    marginTop: '1.5%',
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
    fontFamily: 'myriadpro',
    fontSize: 18,
    paddingTop: '1.5%',
  },
});

export default ConfirmarConductor;
