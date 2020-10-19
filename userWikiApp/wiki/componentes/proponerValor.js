import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import HeaderLabelInfo from '../componentes/headerLabelInfo';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const ProponerValor = ({
  GPSUser,
  GPSDestino,
  direccionDestinoHome,
  dirAdicional,
  guardarEstadoMenu,
  direccionOrigenHome,
}) => {
  const [valorPropuesta, guardarValorPropuesta] = useState('');
  const [cargando, guardarCargando] = useState(false);
  const {asignarSolicitud, firebase, usuario, estimado} = useContext(
    FirebaseContext,
  );

  const nuevaSolicitud = () => {
    guardarCargando(true);
    if (!/^\d+$/.test(valorPropuesta)) {
      Alert.alert(
        'Error', //Titulo
        'Asegúrate que sólo sean números', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      guardarCargando(false);
      return;
    }

    if (valorPropuesta == 0) {
      Alert.alert(
        'Error', //Titulo
        'El valor debe ser mayor a 0', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      guardarCargando(false);
      return;
    }

    let geocollection = firebase.dbGeo.collection('solicitudesActivas'),
      nuevaSolicitud = {
        nombre: usuario.nombre,
        idUsuario: usuario.id,
        direccionOrigen: direccionOrigenHome,
        dirAdicional: dirAdicional,
        direccion: direccionDestinoHome,
        // The coordinates field must be a GeoPoint!
        coordinates: firebase.createGeoPoint(GPSUser.lat, GPSUser.lon),
        GPSDestino: GPSDestino,
        GPSUsuario: GPSUser,
        valor: valorPropuesta,
        valorEstimado: estimado,
        estimado: 0,
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
            guardarCargando(false);
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
            guardarCargando(false);
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
      <KeyboardAvoidingView style={{zIndex: 2}} behavior="margin">
        <View style={{}}>
          <HeaderLabelInfo direccionDestinoHome={direccionDestinoHome} />
        </View>

        <View style={{zIndex: 2, marginTop: '75%'}}>
          <View style={styles.buttonsMapSecond}>
            <View style={styles.inputView}>
              <Text style={styles.textoInputView}>$</Text>
              <TextInput
                keyboardType={'number-pad'}
                style={styles.input}
                onChangeText={texto => {
                  guardarValorPropuesta(texto.toLocaleLowerCase());
                }}
              />
            </View>

            {cargando ? (
              <ActivityIndicator
                style={{zIndex: 2, marginTop: '15%'}}
                size="large"
                color="#10112B"
              />
            ) : (
              <>
                <View style={styles.botonProponer}>
                  <TouchableHighlight
                    style={{alignSelf: 'center', marginTop: '-27%'}}
                    underlayColor="darkgray"
                    onPress={() => nuevaSolicitud()}>
                    <Text style={styles.textoProponer}> PROPONER VALOR</Text>
                  </TouchableHighlight>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={{height: 60}} />
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  buscandoCond: {
    zIndex: 2,
    alignSelf: 'center',
    marginTop: '28%',
    marginBottom: '5%',
  },
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
  textoInputView: {
    color: '#10112B',
    fontFamily: 'myriadpro',
    fontSize: 17,
    marginTop: '-2%',
    paddingLeft: '10%',
  },
  textoProponer: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 18,
    paddingTop: '4%',
  },
  inputView: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '5%',
    width: '50%',
  },
  botonProponer: {
    backgroundColor: '#939598',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '17%',
    width: '50%',
    marginLeft: '3%',
    marginTop: '3%',
    marginBottom: '15%',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#10112B',
    width: '70%',
    alignSelf: 'center',
    marginBottom: '15%',
    marginTop: '-15%',
    color: '#10112B',
    textAlignVertical: 'bottom',
  },
});

export default ProponerValor;
