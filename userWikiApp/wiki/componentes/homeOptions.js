import React, {useEffect} from 'react';
import {Text, View, StyleSheet, TouchableHighlight, Image} from 'react-native';
import HomeDestino from '../componentes/homeDestino';

const HomeOptions = ({
  navigation,
  guardarEstadoMenu,
  guardarDireccionDestinoHome,
  guardarGPSDestino,
  Geocoder,
  guardarRegionActual,
  guardarDeltasGPS,
  GPSUser
}) => {
  return (
    <>
      <HomeDestino
        guardarDireccionDestinoHome={guardarDireccionDestinoHome}
        guardarEstadoMenu={guardarEstadoMenu}
        guardarGPSDestino={guardarGPSDestino}
        Geocoder={Geocoder}
        guardarRegionActual={guardarRegionActual}
        guardarDeltasGPS={guardarDeltasGPS}
        GPSUser={GPSUser}
      />
      <View style={styles.buttonsMap}>
        <TouchableHighlight
          style={{marginTop: '-8%', borderRadius: 50}}
          underlayColor="whitesmoke"
          onPress={() => {
            navigation.navigate('Menu');
          }}>
          <Image source={require('../assets/images/menu.png')} />
        </TouchableHighlight>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonsMap: {
    zIndex: 2,
    marginTop: '130%',
    alignSelf: 'flex-end',
    marginRight: '8%',
    position:'absolute'
  },
});

export default HomeOptions;
