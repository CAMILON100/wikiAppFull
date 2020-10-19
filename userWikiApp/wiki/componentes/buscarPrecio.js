import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
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
  guardarDirAdicional,
  direccionOrigenHome,
}) => {
  const [cargando, guardarCargando] = useState(true);
  const [cargandoEstimado, guardarCargandoEstimado] = useState(false);
  const [estimado, guardarEstimado] = useState(0);
  const [dirAdicionalTemp, guardardirAdicionalTemp] = useState('');
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
          if (usuario.numeroViajes == 12) {
            //12
            guardarEstimado(0);
            asignarEstimado(0);
          } else {
            guardarEstimado(4800);
            asignarEstimado(4800);
          }

          guardarCargando(false);
        } else {
          let distanceDeep = (distance - 1) / 0.25;
          distanceDeep = Math.floor(distanceDeep + 1) * 1000;
          guardarEstimado(distanceDeep + 4800);
          asignarEstimado(distanceDeep + 4800);
          guardarCargando(false);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  const aceptarEstimado = () => {
    guardarCargandoEstimado(true);

    if (dirAdicionalTemp === '') {
      Alert.alert(
        'Error', //Titulo
        'Debe agregar información adicional de la dirección para una mejor ubicación', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      guardarCargandoEstimado(false);
      return;
    }

    let geocollection = firebase.dbGeo.collection('solicitudesActivas'),
      nuevaSolicitud = {
        nombre: usuario.nombre,
        idUsuario: usuario.id,
        direccionOrigen: direccionOrigenHome,
        dirAdicional: dirAdicionalTemp,
        direccion: direccionDestinoHome,
        // The coordinates field must be a GeoPoint!
        coordinates: firebase.createGeoPoint(GPSUser.lat, GPSUser.lon),
        GPSDestino: GPSDestino,
        GPSUsuario: GPSUser,
        valor: estimado,
        valorEstimado: estimado,
        estimado: 1,
        estado: 0,
        creado: firebase.createNowDate(),
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

            axios
              .post(
                'https://us-central1-wikiapplogin.cloudfunctions.net/pushNotificationConductor',
                {
                  lat: GPSUser.lat,
                  lon: GPSUser.lon,
                  mensaje: 'Revisa los detalles del viaje',
                  titulo: 'Hay un usuario cercano que requiere un servicio',
                },
              )
              .then(res => {
                console.log('envia push');
              });
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
      <HeaderLabelInfo direccionDestinoHome={direccionDestinoHome} />
      <Image
        style={styles.buscandoCond}
        source={require('../assets/images/buscandoConductor.png')}
      />
      <View style={{flexDirection: 'row', zIndex: 3}}>
        <View
          style={{
            zIndex: 3,
            marginLeft: '13%',
            position: 'absolute',
            marginTop: '7.5%',
          }}>
          <Image
            style={{
              resizeMode: 'contain',
            }}
            source={require('../assets/images/userIcon.png')}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="DIRECCIÓN DONDE SE RECOGE"
          onChangeText={text => {
            guardardirAdicionalTemp(text);
          }}
        />
      </View>
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
              underlayColor="darkgray"
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
            underlayColor="darkgray"
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              if (dirAdicionalTemp === '') {
                Alert.alert(
                  'Error', //Titulo
                  'Debe agregar información adicional de la dirección para una mejor ubicación', //mensaje
                  [
                    {
                      text: 'OK', //Arreglo de botones
                    },
                  ],
                );
                return;
              }
              guardarDirAdicional(dirAdicionalTemp);
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
  buscandoCond: {
    zIndex: 2,
    alignSelf: 'center',
    marginTop: '15%',
    marginBottom: '-2%',
  },
  buttonsMapSecond: {zIndex: 2, marginTop: '-11%'},
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginTop: '-10%',
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
  input: {
    zIndex: 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    fontFamily: 'myriadpro',
    borderColor: '#959595',
    borderWidth: 1,
    fontSize: 12,
    textAlign: 'center',
    width: '80%',
    marginLeft: '10%',
    marginTop: '5%',
  },
});

export default BuscarPrecio;
