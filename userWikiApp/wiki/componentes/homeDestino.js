import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {globalStyles} from '../styles/global';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const HomeDestino = ({
  guardarDireccionDestinoHome,
  guardarEstadoMenu,
  guardarGPSDestino,
  Geocoder,
  guardarRegionActual,
  guardarDeltasGPS,
  GPSUser,
}) => {
  const [viaPrincipal, guardarViaPrincipal] = useState('');

  const computeDelta = points => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    (point => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map(point => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 1.9999;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX) * 3;
    const deltaY = (maxY - minY) * 3;

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  };

  const irDireccionHome = () => {
    if (viaPrincipal == '') {
      Alert.alert(
        'Error', //Titulo
        'No es una dirección válida o debe escoger una dirección de la lista.', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      return;
    }

    Geocoder.from(viaPrincipal)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log('location destino GPS');
        console.log(location);
        guardarGPSDestino(location);

        let regDelta = computeDelta([
          {latitude: location.lat, longitude: location.lng},
          {latitude: GPSUser.lat, longitude: GPSUser.lon},
        ]);
        console.log('regDelta');
        console.log(regDelta);
        guardarRegionActual({
          lat: regDelta.latitude,
          lon: regDelta.longitude,
        });
        guardarDeltasGPS({
          latitude: regDelta.latitudeDelta,
          longitude: regDelta.longitudeDelta,
        });
        guardarDireccionDestinoHome(viaPrincipal);
        guardarEstadoMenu('confirmarDireccion');
      })
      .catch(error => {
        console.log(error);
        console.log('Error consulta de dirección a gps');
      });
  };

  return (
    <>
      <View />
      <GooglePlacesAutocomplete
        placeholder="¿A dónde quieres ir?"
        disableScroll={false}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          guardarViaPrincipal(data.description);
        }}
        query={{
          key: 'AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY',
          language: 'es',
          components: 'country:co',
        }}
        styles={{
          container: {marginTop: '7%', marginLeft: '-5%'},
          listView: {
            backgroundColor: 'white',
            marginTop: '17%',
            marginLeft: '12%',
            borderRadius: 20,
            position: 'absolute',
            zIndex: 2,
            width: '80%',
          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            marginLeft: '10%',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            zIndex: 2,
            width: '63%',
          },
          textInput: {
            backgroundColor: '#FFF',
            borderRadius: 20,
            marginRight: '2%',
            fontFamily: 'myriadpro',
            borderColor: '#959595',
            borderWidth: 1,
            fontSize: 12,
            textAlign: 'center',
            height: '100%',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />

      <View style={styles.containerInputs}>
        {/*  <TextInput
            style={[{marginLeft: '-2.5%'}, styles.input]}
            onChangeText={texto => {
              guardarViaPrincipal(texto.toLocaleLowerCase());
            }}
            placeholder="¿A dónde quieres ir?"
            editable={editable}
          />*/}

        <TouchableHighlight
          style={{width: '20%'}}
          onPress={() => irDireccionHome()}
          underlayColor="whitesmoke">
          <Image
            style={globalStyles.imgHeader}
            source={require('../assets/images/irHome.png')}
          />
        </TouchableHighlight>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerInputs: {
    zIndex: 2,
    alignSelf: 'flex-end',
    marginBottom: '140%',
    marginRight: '10%',
  },
});

export default HomeDestino;
