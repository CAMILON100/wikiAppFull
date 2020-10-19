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

const NoConductor = ({
  direccionDestinoHome,
  guardarEstadoMenu,
  guardarRegionActual,
}) => {
  const {solicitud, firebase, usuario, asignarSolicitud} = useContext(
    FirebaseContext,
  );
  const [solicitudTemp, guardarsolicitudTemp] = useState(solicitud);

  useEffect(() => {
    AsyncStorage.removeItem('solicitudActiva').then(result => {
      asignarSolicitud({});
    });
  }, []);

  const cancelarSolicitud = () => {
    guardarRegionActual({
      lat: solicitudTemp.GPSUsuario.lat,
      lon: solicitudTemp.GPSUsuario.lon,
    });
    guardarEstadoMenu('home');
  };

  return (
    <>
      <HeaderLabelInfo
        direccionDestinoHome={direccionDestinoHome}
        label={'BUSCANDO EL CONDUCTOR'}
      />

      <View style={styles.viewInfo}>
        <Image
          style={styles.buscandoCond}
          source={require('../assets/images/carWhite2.png')}
        />
        <View>
          <Text style={[styles.textViewInfo, {marginTop: '3%'}]}>
            {' '}
            NO SE ENCONTRÓ UN CONDUCTOR
          </Text>
          <Text style={styles.textViewInfo}>QUE QUIERA HACER EL SERVICIO</Text>
          <Text style={styles.textViewInfo}>POR EL PRECIO PROPUESTO</Text>
          <Text
            style={[
              styles.textViewInfo,
              {marginTop: '2.5%', fontSize: 12, fontFamily: 'myriadprobold'},
            ]}>
            RECOMENDAMOS HACER UNA NUEVA OFERTA
          </Text>
        </View>
      </View>

      <View style={styles.buttonsMap}>
        <View style={[styles.botonValor, {backgroundColor: '#939598'}]}>
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.textoValor}> VALOR ESTIMADO DEL VIAJE</Text>
            <Text style={styles.textoNumero}>
              ${solicitudTemp.valorEstimado}
            </Text>
          </View>
        </View>
        <View style={styles.botonValor2}>
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.textoValor}> PASAJERO PROPONE PAGAR</Text>
            <Text style={styles.textoNumero}> ${solicitudTemp.valor}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonsMapSecond}>
        <View style={[styles.botonProponer]}>
          <TouchableHighlight
            style={{borderRadius: 20}}
            underlayColor="darkgray"
            onPress={() => {
              guardarEstadoMenu('proponerValor');
            }}>
            <Text style={styles.textoProponer}> HACER UNA NUEVA OFERTA</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.botonCancelar}>
          <TouchableHighlight
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              cancelarSolicitud();
            }}>
            <Text style={styles.textoCancelar}> CANCELAR</Text>
          </TouchableHighlight>
        </View>
      </View>
      <View style={{marginTop: '-21%'}} />
    </>
  );
};

const styles = StyleSheet.create({
  textViewInfo: {color: '#FFF', fontFamily: 'myriadpro', alignSelf: 'center'},
  viewInfo: {
    zIndex: 2,
    backgroundColor: '#F15A29',
    borderRadius: 15,
    height: '26%',
    marginTop: '37%',
    width: '81%',
    alignSelf: 'center',
  },
  buscandoCond: {zIndex: 2, alignSelf: 'center', marginTop: '2.5%'},
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
  buttonsMapSecond: {zIndex: 2, marginTop: '-6.5%'},
  botonProponer: {
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    width: '75%',
    height: '21%',
  },
  textoProponer: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
    alignSelf: 'center',
    marginTop: '4%',
  },
  botonCancelar: {
    backgroundColor: '#10112B',
    borderRadius: 15,
    alignSelf: 'center',
    paddingTop: '17%',
    width: '50%',
    marginLeft: '3%',
    marginTop: '1%',
    marginBottom: '5%',
  },
  textoCancelar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 20,
    paddingTop: '4%',
  },
});

export default NoConductor;
