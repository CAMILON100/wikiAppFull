import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import {globalStyles} from '../styles/global';
import myPosition from '../assets/images/myPosition.png';
import userPosition from '../assets/images/userPosition.png';
import destinoImagen from '../assets/images/mydestiny.png';
import RNLocation from 'react-native-location';
import HomeOptions from '../componentes/homeOptions';
import Geocoder from 'react-native-geocoding';
import CalloutUbicacion from '../componentes/CalloutUbicacion';
import FirebaseContext from '../context/firebase/firebaseContext';
import MarcadorSeleccionado from '../componentes/marcadorSeleccionado';
import PasajeroOcupado from '../componentes/pasajeroOcupado';
import SolicitudActiva from '../componentes/solicitudActiva';
import CalificarPasajero from '../componentes/calificarPasajero';
import MapViewDirections from 'react-native-maps-directions';
import {getDistance, getPreciseDistance} from 'geolib';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

Geocoder.init('AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY');

const Home = ({navigation, route}) => {
  const [GPSUser, guardarGPSUser] = useState({});
  const [markerData, guardarMarkerData] = useState({});
  const [GPSDestino, guardarGPSDestino] = useState({});
  const [guardando, guardarGuardando] = useState(true);
  const [guardandoStorage, guardarguardandoStorage] = useState(true);
  const [estadoMenu, guardarEstadoMenu] = useState('home');
  const [regionActual, guardarRegionActual] = useState({});
  const [markersPasajeros, guardarMarkersPasajeros] = useState([]);
  const [estadoTrabajar, guardarEstadoTrabajar] = useState(true);
  const [estadoSolActiva, guardarEstadoSolActiva] = useState(0);
  const {
    asignarSolicitud,
    solicitud,
    firebase,
    asignarListaSolicitudes,
    usuario,
  } = useContext(FirebaseContext);

  useEffect(() => {
    let solicitudActiva = firebase.db.collection('solicitudesActivas');

    solicitudActiva
      .where('idConductor', '==', usuario.id)
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

          console.log('solicitudActiva');
          asignarSolicitud(solicitudStorage);

          console.log('solicitudStorage');
          console.log(solicitudStorage);
          guardarGPSDestino(solicitudStorage.GPSDestino);

          AsyncStorage.setItem(
            'solicitudActiva',
            JSON.stringify(solicitudStorage),
          ).then(result => {
            guardarguardandoStorage(false);
            guardarEstadoMenu('solicitudActiva');
          });
        }
      })
      .catch(err => {
        console.log(err);
        console.log('err en iniciar app from background o login');
      });

    /* AsyncStorage.getItem('solicitudActiva')
      .then(result => {
        console.log(result);
        try {
          let solicitudJson = JSON.parse(result);
          asignarSolicitud(solicitudJson);
          guardarRegionActual({
            lat: solicitudJson.GPSDestino.lan,
            lon: solicitudJson.GPSDestino.lng,
          });
          guardarGPSUser(solicitudJson.GPSConductor);

          let usuariosRef = firebase.dbGeo.collection('usuarios');
          usuariosRef.doc(usuario.id).update({
            coordinates: firebase.createGeoPoint(
              solicitudJson.GPSConductor.lat,
              solicitudJson.GPSConductor.lon,
            ),
          });
          guardarGPSDestino(solicitudJson.GPSDestino);
          guardarDireccionDestinoHome(solicitudJson.direccion);
          guardarEstadoMenu('solicitudActiva');
          guardarguardandoStorage(false);
        } catch (error) {
          console.log('soliciud sin storage');
          console.log(solicitud);
          try {
            let test = solicitud.GPSDestino.lan;
            AsyncStorage.setItem(
              'solicitudActiva',
              JSON.stringify(solicitud),
            ).then(result => {
              guardarRegionActual({
                lat: solicitud.GPSDestino.lan,
                lon: solicitud.GPSDestino.lng,
              });
              guardarGPSUser(solicitud.GPSConductor);
              let usuariosRef = firebase.dbGeo.collection('usuarios');
              usuariosRef.doc(usuario.id).update({
                coordinates: firebase.createGeoPoint(
                  solicitud.GPSConductor.lat,
                  solicitud.GPSConductor.lon,
                ),
              });
              guardarGPSDestino(solicitud.GPSDestino);
              guardarDireccionDestinoHome(solicitud.direccion);
              guardarEstadoMenu('solicitudActiva');
              guardarguardandoStorage(false);
            });
          } catch (error) {
            console.log('final');
            guardarguardandoStorage(false);
          }
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        Alert.alert(
          'Error', //Titulo
          'Error en acceder al local storage. Vuelve a inicar sesión', //mensaje
          [
            {
              text: 'OK', //Arreglo de botones
            },
          ],
        );
        AsyncStorage.clear();
      });*/
  }, []);

  //AsyncStorage.clear()
  RNLocation.configure({
    distanceFilter: 5, // Meters
    desiredAccuracy: {
      ios: 'best',
      android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'playServices',
    interval: 1000, // Milliseconds
    fastestInterval: 6000, // Milliseconds
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
            'Usamos la información de ubicación para mostrarle al pasajero tu ubicación',
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

              let usuariosRef = firebase.dbGeo.collection('usuarios');
              usuariosRef
                .doc(usuario.id)
                .update({
                  coordinates: firebase.createGeoPoint(
                    locations[0].latitude,
                    locations[0].longitude,
                  ),
                })
                .then(() => {
                  guardarRegionActual({
                    lat: locations[0].latitude,
                    lon: locations[0].longitude,
                  });
                  console.log('locations locations locations locations');
                  console.log(locations[0].latitude);
                  console.log(locations[0].longitude);
                  console.log(regionActual);
                  guardarGuardando(false);
                })
                .catch(err => {
                  console.log(err);
                  console.log('error guardando gps conductor');
                });
            },
          );
        }
      })
      .catch(error => {
        console.log(error);
        console.log('error');
      });
  }, []);

  useEffect(() => {
    if (route.params?.itemSelected) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
      guardarEstadoTrabajar(false);
      guardarMarkerData(route.params?.itemSelected);
      guardarEstadoMenu('marcadorSeleccionado');
    }
  }, [route.params?.change]);

  useEffect(() => {
    console.log('estadoMenu');
    console.log(estadoMenu);
    if (estadoMenu == 'home' && Object.keys(GPSUser).length != 0) {
      let geocollection = firebase.dbGeo.collection('solicitudesActivas');

      console.log('GPSUser markers');
      console.log(GPSUser);

      try {
        const query = geocollection.where('estado', '==', 0).near({
          center: firebase.createGeoPoint(GPSUser.lat, GPSUser.lon),
          radius: 1000,
        });

        query.onSnapshot(
          function(snapshot) {
            let markersSolicitudes = snapshot.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            });
            console.log('markersSolicitudes');
            console.log(markersSolicitudes);
            asignarListaSolicitudes(markersSolicitudes);
            guardarMarkersPasajeros(markersSolicitudes);
          },
          function(errorM) {
            console.log('ERROR MARKERS');
            console.log(errorM);
          },
        );
      } catch (error) {
        console.log('error Cargando markers');
        console.log(error);
        console.log('markersSolicitudes');
        guardarMarkersPasajeros([]);
      }
    } else guardarMarkersPasajeros([]);
    if (estadoMenu == 'solicitudActiva') {
      let solicitudActivaRef = firebase.db.collection('solicitudesActivas');

      var dis = getDistance(
        {
          latitude: GPSUser.lat,
          longitude: GPSUser.lon,
        },
        {
          latitude: solicitud.GPSUsuario.lat,
          longitude: solicitud.GPSUsuario.lon,
        },
      );

      if (dis <= 50 && estadoSolActiva == 0) {
        guardarEstadoSolActiva(1);
      }

      solicitudActivaRef
        .doc(solicitud.id)
        .update({
          GPSConductor: {
            lat: GPSUser.lat,
            lon: GPSUser.lon,
          },
        })
        .then(() => {
          console.log('actualizó bd gps de conductor');
        });
    }
  }, [GPSUser]);

  async function saveTokenToDatabase(token) {
    let usuariosRef = firebase.db.collection('usuarios');

    console.log('USUARIOOOOOO');
    console.log(usuario);

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
            <HomeOptions navigation={navigation} />
          </>
        );

      case 'marcadorSeleccionado':
        return (
          <>
            <MarcadorSeleccionado
              markerData={markerData}
              guardarEstadoMenu={guardarEstadoMenu}
              GPSUser={GPSUser}
              guardarEstadoTrabajar={guardarEstadoTrabajar}
              guardarEstadoSolActiva={guardarEstadoSolActiva}
              navigation={navigation}
            />
          </>
        );

      case 'pasajeroOcupado':
        return (
          <>
            <PasajeroOcupado guardarEstadoMenu={guardarEstadoMenu} />
          </>
        );

      case 'solicitudActiva':
        return (
          <>
            <SolicitudActiva
              guardarEstadoMenu={guardarEstadoMenu}
              markerData={solicitud}
              guardarEstadoTrabajar={guardarEstadoTrabajar}
              estadoSolActiva={estadoSolActiva}
              guardarEstadoSolActiva={guardarEstadoSolActiva}
              GPSUser={GPSUser}
            />
          </>
        );

      case 'calificarPasajero':
        return (
          <>
            <CalificarPasajero
              guardarEstadoMenu={guardarEstadoMenu}
              guardarEstadoTrabajar={guardarEstadoTrabajar}
            />
          </>
        );

      default:
        break;
    }
  };

  const solActivaDyn = () => {
    switch (estadoSolActiva) {
      case 0:
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
            <Marker
              coordinate={{
                latitude: solicitud.GPSUsuario.lat,
                longitude: solicitud.GPSUsuario.lon,
              }}
              image={userPosition}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>UBICACION USUARIO</Text>
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
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>DESTINO USUARIO</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
            <MapViewDirections
              apikey="AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY"
              origin={{latitude: GPSUser.lat, longitude: GPSUser.lon}}
              destination={solicitud.direccionOrigen
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

      case 1:
      case 2:
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
            <Marker
              coordinate={{
                latitude: solicitud.GPSDestino.lat,
                longitude: solicitud.GPSDestino.lng,
              }}
              image={destinoImagen}>
              <Callout tooltip>
                <CalloutUbicacion>
                  <Text style={styles.textCallout}>DESTINO USUARIO</Text>
                </CalloutUbicacion>
              </Callout>
            </Marker>
            <MapViewDirections
              apikey="AIzaSyAfHYgJ6eZRbnc1MI3LMQ8P8LeEdG4sadY"
              origin={{latitude: GPSUser.lat, longitude: GPSUser.lon}}
              destination={solicitud.direccion
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

      default:
        break;
    }
  };

  const markerDyn = () => {
    
    axios
    .get(
      'http://165.227.30.177/admin/testValue'
    )
    .then(res => {      
      
      if (res.data.estado==0) {
        navigation.navigate('Default');
      }
      
     
    }).catch(err=>{
      console.log(err);
      console.log('err');


    })





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

      case 'solicitudActiva':
        return <>{solActivaDyn()}</>;

      default:
        return <></>;
        break;
    }
  };

  const mostrarPasajero = (markerSeleccionado, markerDataFun) => {
    guardarMarkerData(markerDataFun);
    guardarEstadoMenu('marcadorSeleccionado');
  };

  return (
    <>
      <View style={styles.containerServicio}>
        <Image
          style={styles.carroBlanco}
          source={require('../assets/images/carWhiteSmall.png')}
        />
        <TouchableHighlight
          onPressIn={() => {
            if (estadoTrabajar) {
              navigation.navigate('ListaServicios');
            }
          }}>
          {estadoTrabajar ? (
            <Text style={styles.textoActivar}>ACTIVAR SERVICIO</Text>
          ) : (
            <Text style={[styles.textoActivar, {marginLeft: '18%'}]}>
              EN SERVICIO
            </Text>
          )}
        </TouchableHighlight>
      </View>
      <Image
        style={globalStyles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />
      <View style={globalStyles.behindBackground} />
      <View style={globalStyles.foreBackground}>
        {menuOptionsDyn()}

        <View style={styles.container}>
          {guardando || guardandoStorage ? (
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
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {markerDyn()}
              {markersPasajeros.map(marker => (
                <Marker
                  onPress={e => mostrarPasajero(e.nativeEvent, marker)}
                  identifier={marker.id}
                  coordinate={{
                    latitude: marker.GPSUsuario.lat,
                    longitude: marker.GPSUsuario.lon,
                  }}
                  image={userPosition}
                />
              ))}
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
  carroBlanco: {marginHorizontal: '5%'},
  textoActivar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    marginLeft: '3.5%',
    fontSize: 16,
  },
  containerServicio: {
    backgroundColor: '#10112B',
    width: '54%',
    borderRadius: 15,
    position: 'absolute',
    marginTop: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '38%',
    height: '7%',
  },
});

export default Home;
