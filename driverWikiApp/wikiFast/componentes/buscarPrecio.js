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
import axios from 'axios';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';
//import 'firebase/firestore';

const BuscarPrecio = ({
  GPSUser,
  GPSDestino,
  direccionDestinoHome,
  guardarEstadoMenu,
}) => {
  const [cargando, guardarCargando] = useState(true);
  const [cargandoEstimado, guardarCargandoEstimado] = useState(false);
  const [estimado, guardarEstimado] = useState(0);
  const {asignarSolicitud, firebase, usuario, asignarEstimado} = useContext(
    FirebaseContext,
  );

  useEffect(() => {
    axios
      .get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          units: 'metric',
          origins: String(GPSUser.lat) + ',' + String(GPSUser.lon),
          destinations: String(GPSDestino.lat) + ',' + String(GPSDestino.lng),
          key: 'AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY',
        },
      })
      .then(function(response) {
        console.log(response.data.rows[0].elements[0].distance.value);
        console.log(response.data.rows[0].elements[0].duration.value);
        let distance = response.data.rows[0].elements[0].distance.value / 4000;
        if (distance <= 1) {
          guardarEstimado(4500);
          asignarEstimado(4500);
          guardarCargando(false);
        } else {
          let distanceDeep = (distance - 1) / 0.25;
          distanceDeep = Math.floor(distanceDeep + 1) * 1250;
          guardarEstimado(distanceDeep + 4500);
          asignarEstimado(distanceDeep + 4500);
          guardarCargando(false);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  const aceptarEstimado = () => {
    guardarCargandoEstimado(true);

    let geocollection = firebase.dbGeo.collection('solicitudesActivas'),
      nuevaSolicitud = {
        nombre: usuario.nombre,
        idUsuario: usuario.id,
        direccion: direccionDestinoHome,
        // The coordinates field must be a GeoPoint!
        coordinates: firebase.createGeoPoint(GPSUser.lat, GPSUser.lon),
        GPSDestino: GPSDestino,
        valor: estimado,
        valorEstimado: estimado,
        estimado: 1,
        estado: 0,
      };

    geocollection
      .add(nuevaSolicitud)
      .then(estado => {
        AsyncStorage.setItem('solicitudActiva', JSON.stringify(nuevaSolicitud))
          .then(result => {
            asignarSolicitud(nuevaSolicitud);
            console.log('Nueva Solicitud');
            guardarCargandoEstimado(false);
            guardarEstadoMenu('buscandoConductor');
            return;
          })
          .catch(error => {
            console.log('error');
            console.log(error);

            Alert.alert(
              'Error', //Titulo
              'Ha ocurrido un error. Vuelve a iniciar sesión en la aplicación', //mensaje
              [
                {
                  text: 'OK', //Arreglo de botones
                },
              ],
            );
            guardarCargandoEstimado(false);
            return;
          });
      })
      .catch(error => {
        console.log('error');
        console.log(error);

        Alert.alert(
          'Error', //Titulo
          'Ha ocurrido un error. Revisa tu conexión a internet y vuelve a intentarlo', //mensaje
          [
            {
              text: 'OK', //Arreglo de botones
            },
          ],
        );
        guardarGuardando(false);
        return;
      });
  };

  return (
    <>
      <HeaderLabelInfo
        direccionDestinoHome={direccionDestinoHome}
        label={'BUSCANDO EL CONDUCTOR'}
      />
      <Image
        style={styles.buscandoCond}
        source={require('../assets/images/buscandoConductor.png')}
      />
      <View style={styles.buttonsMap}>
        <View style={styles.botonValor}>
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.textoValor}> VALOR ESTIMADO DEL VIAJE</Text>

            {cargando ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textoNumero}> ${estimado}</Text>
            )}
          </View>
        </View>
        <View style={styles.botonAceptar}>
          {cargandoEstimado ? (
            <ActivityIndicator
              style={{alignSelf: 'center', marginTop: '-27%'}}
              size="small"
              color="#10112B"
            />
          ) : (
            <TouchableHighlight
              style={{alignSelf: 'center', marginTop: '-27%'}}
              onPress={() => {
                aceptarEstimado();
              }}>
              <Text style={styles.textoAceptar}> ACEPTAR ESTIMADO</Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
      <View style={styles.buttonsMapSecond}>
        <View style={styles.botonProponer}>
          <TouchableHighlight
            disabled={cargandoEstimado}
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              guardarEstadoMenu('proponerValor');
            }}>
            <Text style={styles.textoProponer}> PROPONER VALOR</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.botonCancelar}>
          <TouchableHighlight
            disabled={cargandoEstimado}
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              guardarEstadoMenu('home');
            }}>
            <Text style={styles.textoCancelar}> CANCELAR</Text>
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buscandoCond: {zIndex: 2, alignSelf: 'center', marginTop: '33%'},
  buttonsMapSecond: {zIndex: 2},
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '-8%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginBottom: '-8%',
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
  textoProponer: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
    paddingTop: '5%',
  },
  textoCancelar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 20,
    paddingTop: '4%',
  },
  textoAceptar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 13,
  },
  botonAceptar: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '15%',
    width: '40%',
    marginLeft: '3%',
  },
  botonValor: {
    backgroundColor: '#939598',
    borderRadius: 20,
    alignSelf: 'center',
    width: '40%',
  },
  botonProponer: {
    backgroundColor: '#939598',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '15%',
    width: '50%',
  },
  botonCancelar: {
    backgroundColor: '#10112B',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '17%',
    width: '50%',
    marginLeft: '3%',
    marginTop: '3%',
    marginBottom: '5%',
  },
});

export default BuscarPrecio;
