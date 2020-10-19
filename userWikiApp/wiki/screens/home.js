import React, {useState, useEffect, useContext} from 'react';
import {Text, View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import {globalStyles} from '../styles/global';
import myPosition from '../assets/images/myPosition.png';
import conductorPosition from '../assets/images/conductorPosition.png';
import destinoImagen from '../assets/images/mydestiny.png';
import RNLocation from 'react-native-location';
import HomeOptions from '../componentes/homeOptions';
import ConfirmarDireccion from '../componentes/confirmarDireccion';
import Geocoder from 'react-native-geocoding';
import CalloutUbicacion from '../componentes/CalloutUbicacion';
import CalloutDestino from '../componentes/CalloutDestino';
import BuscarPrecio from '../componentes/buscarPrecio';
import ProponerValor from '../componentes/proponerValor';
import BuscandoConductor from '../componentes/buscandoConductor';
import FirebaseContext from '../context/firebase/firebaseContext';
import NoConductor from '../componentes/noConductor';
import ConfirmarConductor from '../componentes/confirmarConductor';
import EnCamino from '../componentes/enCamino';
import CalificarConductor from '../componentes/calificarConductor';
import NumeroViajes from '../componentes/numeroViajes';
import MapViewDirections from 'react-native-maps-directions';
import messaging from '@react-native-firebase/messaging';

Geocoder.init('AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY');

const Home = ({navigation}) => {
  const [GPSUser, guardarGPSUser] = useState({});
  const [GPSDestino, guardarGPSDestino] = useState({});
  const [guardandoStorage, guardarguardandoStorage] = useState(true);
  const [guardandoGPSR, guardarGuardandoGPSR] = useState(true);
  const [estadoMenu, guardarEstadoMenu] = useState('home');
  const [direccionDestinoHome, guardarDireccionDestinoHome] = useState('');
  const [direccionOrigenHome, guardarDireccionOrigenHome] = useState('');
  const [regionActual, guardarRegionActual] = useState({});
  const [dirAdicional, guardarDirAdicional] = useState('');
  const [deltasGPS, guardarDeltasGPS] = useState({
    latitude: 0.015,
    longitude: 0.0121,
  });
  const {
    asignarSolicitud,
    solicitud,
    firebase,
    usuario,
    asignarUsuario,
  } = useContext(FirebaseContext);

  useEffect(() => {
    let solicitudActiva = firebase.db.collection('solicitudesActivas');

    solicitudActiva
      .where('idUsuario', '==', usuario.id)
      .get()
      .then(snapshot2 => {
        if (snapshot2.empty) {
          AsyncStorage.removeItem('solicitudActiva').then(result => {
            asignarSolicitud({});
            guardarguardandoStorage(false);
            guardarEstadoMenu('home');
          });
        } else {
          let solicitudStorage = snapshot2.docs[0].data();

          guardarRegionActual({
            lat: solicitudStorage.GPSDestino.lan,
            lon: solicitudStorage.GPSDestino.lng,
          });
          guardarGPSDestino(solicitudStorage.GPSDestino);
          guardarDireccionDestinoHome(solicitudStorage.direccion);
          switch (solicitudStorage.estado) {
            case 0:
              console.log('buscando conductor ');
              guardarEstadoMenu('buscandoConductor');

              break;

            case 1:
            case 2:
              console.log('en camino ');
              guardarEstadoMenu('enCamino');

              break;

            default:
              console.log('Home Default ');
              AsyncStorage.removeItem('solicitudActiva').then(result => {
                asignarSolicitud({});
                guardarguardandoStorage(false);
                guardarEstadoMenu('home');
              });
              break;
          }

          AsyncStorage.setItem(
            'solicitudActiva',
            JSON.stringify(solicitudStorage),
          ).then(result => {
            asignarSolicitud(solicitudStorage);
            guardarguardandoStorage(false);
          });
        }
      })
      .catch(err => {
        console.log(err);
        console.log('err en iniciar app from background o login');
      });
  }, []);

  // AsyncStorage.clear()

  RNLocation.configure({
    distanceFilter: 20, // Meters
    desiredAccuracy: {
      ios: 'best',
      android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'playServices',
    interval: 5000, // Milliseconds
    fastestInterval: 10000, // Milliseconds
    maxWaitTime: 5000, // Milliseconds
    // iOS Only
    activityType: 'other',
    allowsBackgroundLocationUpdates: false,
    headingFilter: 1, // Degrees
    headingOrientation: 'portrait',
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: false,
  });

  useEffect(() => {
    RNLocation.requestPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'fine', // or 'fine'
        rationale: {
          title: 'Necesitamos el acceso a tu ubicación',
          message:
            'Usamos la información de ubicación para mostrarle al conductor tu ubicación',
          buttonPositive: 'OK',
          buttonNegative: 'Cancelar',
        },
      },
    })
      .then(permisoGPS => {
        console.log(permisoGPS);
        if (permisoGPS) {
          console.log(permisoGPS);
          console.log('permisoGPS');

          const unsubscribe = RNLocation.subscribeToLocationUpdates(
            locations => {
              console.log('locations');
              console.log(locations);

              Geocoder.from(locations[0].latitude, locations[0].longitude)
                .then(json => {
                  guardarDireccionOrigenHome(json.results[0].formatted_address);
                })
                .catch(error => console.warn(error));

              if (locations.length > 1) {
                locations.sort(function(a, b) {
                  return (
                    parseFloat(b['timestamp']) - parseFloat(a['timestamp'])
                  );
                });
              }
              guardarGPSUser({
                lat: locations[0].latitude,
                lon: locations[0].longitude,
              });
              guardarRegionActual({
                lat: locations[0].latitude,
                lon: locations[0].longitude,
              });
              guardarGuardandoGPSR(false);
            },
          );
        }
      })
      .catch(error => {
        console.log(error);
        console.log('error');
      });
  }, []);

  async function saveTokenToDatabase(token) {
    let usuariosRef = firebase.db.collection('usuarios');

    await usuariosRef.doc(usuario.id).update({
      tokens: firebase.createUnionArray(token),
    });

    // Assume user is already signed in
    /*    const userId = auth().currentUser.uid;
  
    // Add the token to the users datastore
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });*/
  }

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);

  const menuOptionsDyn = () => {
    switch (estadoMenu) {
      case 'home':
        return (
          <>
            <HomeOptions
              navigation={navigation}
              guardarEstadoMenu={guardarEstadoMenu}
              guardarDireccionDestinoHome={guardarDireccionDestinoHome}
              guardarGPSDestino={guardarGPSDestino}
              Geocoder={Geocoder}
              guardarRegionActual={guardarRegionActual}
              guardarDeltasGPS={guardarDeltasGPS}
              GPSUser={GPSUser}
            />
          </>
        );

      case 'confirmarDireccion':
        return (
          <>
            <ConfirmarDireccion
              direccionDestinoHome={direccionDestinoHome}
              guardarEstadoMenu={guardarEstadoMenu}
            />
          </>
        );

      case 'buscarPrecio':
        return (
          <>
            <BuscarPrecio
              GPSUser={GPSUser}
              GPSDestino={GPSDestino}
              direccionDestinoHome={direccionDestinoHome}
              guardarEstadoMenu={guardarEstadoMenu}
              guardarDirAdicional={guardarDirAdicional}
              direccionOrigenHome={direccionOrigenHome}
            />
          </>
        );

      case 'proponerValor':
        return (
          <>
            <ProponerValor
              GPSUser={GPSUser}
              GPSDestino={GPSDestino}
              direccionDestinoHome={direccionDestinoHome}
              dirAdicional={dirAdicional}
              guardarEstadoMenu={guardarEstadoMenu}
              direccionOrigenHome={direccionOrigenHome}
            />
          </>
        );

      case 'buscandoConductor':
        return (
          <>
            <BuscandoConductor
              direccionDestinoHome={direccionDestinoHome}
              guardarEstadoMenu={guardarEstadoMenu}
              guardarRegionActual={guardarRegionActual}
              estadoMenu={estadoMenu}
            />
          </>
        );

      case 'noConductor':
        return (
          <>
            <NoConductor
              direccionDestinoHome={direccionDestinoHome}
              guardarEstadoMenu={guardarEstadoMenu}
              guardarRegionActual={guardarRegionActual}
            />
          </>
        );

      case 'confirmarConductor':
        return (
          <>
            <ConfirmarConductor
              direccionDestinoHome={direccionDestinoHome}
              guardarEstadoMenu={guardarEstadoMenu}
            />
          </>
        );

      case 'enCamino':
        return (
          <>
            <EnCamino
              guardarEstadoMenu={guardarEstadoMenu}
              direccionDestinoHome={direccionDestinoHome}
              guardarRegionActual={guardarRegionActual}
            />
          </>
        );

      case 'calificarConductor':
        return (
          <>
            <CalificarConductor
              guardarEstadoMenu={guardarEstadoMenu}
              direccionDestinoHome={direccionDestinoHome}
            />
          </>
        );

      case 'numeroViajes':
        return (
          <>
            <NumeroViajes
              guardarEstadoMenu={guardarEstadoMenu}
              direccionDestinoHome={direccionDestinoHome}
            />
          </>
        );

      default:
        break;
    }
  };

  const markerDestino = () => {
    console.log('markerDestino');

    if (GPSDestino.lat != undefined) {
      return (
        <>
          <Marker
            coordinate={{
              latitude: GPSDestino.lat,
              longitude: GPSDestino.lng,
            }}
            image={destinoImagen}>
            <Callout tooltip>
              <CalloutDestino>
                <Text style={styles.textCallout}>DESTINO</Text>
              </CalloutDestino>
            </Callout>
          </Marker>
        </>
      );
    } else return <></>;
  };

  const markerUsuarioEstadoSolicitud = () => {
    if (solicitud.estado == 1) {
      return (
        <>
          <Marker
            coordinate={{
              latitude: GPSUser.lat,
              longitude: GPSUser.lon,
            }}
            image={myPosition}>
            <Callout tooltip>
              <CalloutUbicacion>
                <Text style={styles.textCallout}>UBICACIÓN ACTUAL</Text>
              </CalloutUbicacion>
            </Callout>
          </Marker>
        </>
      );
    } else {
      return <></>;
    }
  };

  const markerDyn = () => {
    switch (estadoMenu) {
      case 'home':
        return (
          <>
            <Marker
              coordinate={{
                latitude: GPSUser.lat,
                longitude: GPSUser.lon,
              }}
              image={myPosition}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>UBICACIÓN ACTUAL</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
          </>
        );

      case 'confirmarDireccion':
        return (
          <>
            {markerDestino()}
            <Marker
              coordinate={{
                latitude: GPSUser.lat,
                longitude: GPSUser.lon,
              }}
              image={myPosition}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>UBICACIÓN ACTUAL</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
            <MapViewDirections
              apikey="AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY"
              origin={{latitude: GPSUser.lat, longitude: GPSUser.lon}}
              destination={direccionDestinoHome
                .replace(/,/g, '')
                .replace('#', '')}
              language="es"
              optimizeWaypoints={true}
              splitWaypoints={true}
              resetOnChange={false}
              precision="high"
              strokeWidth={4}
              strokeColor="#10112B"
            />
          </>
        );

      case 'buscarPrecio':
        return <>{markerDestino()}</>;

      case 'proponerValor':
        return (
          <>
            {markerDestino()}
            <Marker
              coordinate={{
                latitude: GPSUser.lat,
                longitude: GPSUser.lon,
              }}
              image={myPosition}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>UBICACIÓN ACTUAL</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
            <MapViewDirections
              apikey="AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY"
              origin={{latitude: GPSUser.lat, longitude: GPSUser.lon}}
              destination={direccionDestinoHome
                .replace(/,/g, '')
                .replace('#', '')}
              language="es"
              optimizeWaypoints={true}
              splitWaypoints={true}
              resetOnChange={false}
              precision="high"
              strokeWidth={4}
              strokeColor="#10112B"
            />
          </>
        );

      case 'buscandoConductor':
        return (
          <>
            {markerDestino()}
            <Marker
              coordinate={{
                latitude: GPSUser.lat,
                longitude: GPSUser.lon,
              }}
              image={myPosition}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>UBICACIÓN ACTUAL</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
            <MapViewDirections
              apikey="AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY"
              origin={{latitude: GPSUser.lat, longitude: GPSUser.lon}}
              destination={direccionDestinoHome
                .replace(/,/g, '')
                .replace('#', '')}
              language="es"
              optimizeWaypoints={true}
              splitWaypoints={true}
              resetOnChange={false}
              precision="high"
              strokeWidth={4}
              strokeColor="#10112B"
            />
          </>
        );

      case 'enCamino':
        return (
          <>
            {markerUsuarioEstadoSolicitud()}
            <Marker
              coordinate={{
                latitude: solicitud.GPSConductor.lat,
                longitude: solicitud.GPSConductor.lon,
              }}
              image={conductorPosition}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>CONDUCTOR</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
            <Marker
              coordinate={{
                latitude: solicitud.GPSDestino.lat,
                longitude: solicitud.GPSDestino.lng,
              }}
              image={destinoImagen}>
              <Callout tooltip>
                <CalloutDestino>
                  <Text style={styles.textCallout}>DESTINO</Text>
                </CalloutDestino>
              </Callout>
            </Marker>
          </>
        );

      default:
        return <></>;
        break;
    }
  };

  return (
    <>
      <Image
        style={globalStyles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />
      <View style={globalStyles.behindBackground} />
      <View style={globalStyles.foreBackground}>
        {menuOptionsDyn()}

        <View style={styles.container}>
          {guardandoStorage || guardandoGPSR ? (
            <ActivityIndicator
              style={{marginTop: '50%'}}
              size="large"
              color="#FFF"
            />
          ) : (
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: regionActual.lat,
                longitude: regionActual.lon,
                latitudeDelta: deltasGPS.latitude,
                longitudeDelta: deltasGPS.longitude,
              }}>
              {markerDyn()}
            </MapView>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textCallout: {color: '#FFF', fontFamily: 'myriadpro', fontSize: 10},
  container: {
    zIndex: 1,
    overflow: 'hidden',
    height: '93%',
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
    position: 'absolute',
    borderRadius: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myPosition: {
    backgroundColor: '#10112B',
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
});

export default Home;
