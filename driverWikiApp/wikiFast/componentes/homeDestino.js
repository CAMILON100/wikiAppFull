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
} from 'react-native';
import {globalStyles} from '../styles/global';

const HomeDestino = ({guardarEstadoTrabajar, estadoTrabajar, soloCarro}) => {
  const enServicioCarro = () => {
    if (estadoTrabajar) {
      return (
        <>
          <View style={styles.containerServicio}>
            <Image
              style={styles.carroBlanco}
              source={require('../assets/images/carWhite2.png')}
            />
            <TouchableHighlight
              onPress={() => {
                console.log("lol")
                guardarEstadoTrabajar(!estadoTrabajar);
              }}>
              <Text style={styles.textoActivar}>ACTIVAR SERVICIO</Text>
            </TouchableHighlight>
          </View>
        </>
      );
    } else {
      if (soloCarro) {
        return (
          <TouchableHighlight style={[styles.containerServicio2]}>
            <>
              <Image
                style={{marginTop: '20%'}}
                source={require('../assets/images/carWhite.png')}
              />
            </>
          </TouchableHighlight>
        );
      } else {
        return (
          <TouchableHighlight
            style={styles.containerServicio2}
            onPress={() => guardarEstadoTrabajar(!estadoTrabajar)}>
            <>
              <Image
                style={styles.carroBlanco}
                source={require('../assets/images/carWhite.png')}
              />

              <Text style={styles.textoActivar2}>EN SERVICIO</Text>
            </>
          </TouchableHighlight>
        );
      }
    }
  };

  return <>{/*{enServicioCarro()}*/}</>;
};

const styles = StyleSheet.create({
  carroBlanco: {marginHorizontal: '5%'},
  textoActivar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    marginLeft: '3.5%',
    fontSize: 16,
  },
  textoActivar2: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    marginLeft: '3.5%',
    fontSize: 16,
  },
  label: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    alignSelf: 'flex-end',
    marginRight: '10%',
  },
  containerServicio: {
    backgroundColor: '#10112B',
    height: '10%',
    width: '64%',
    borderRadius: 15,
    marginTop: '-28%',
    zIndex:1,
    alignSelf: 'flex-end',
    marginRight: '4%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerServicio2: {
    zIndex: 2,
    backgroundColor: '#10112B',
    height: '10%',
    width: '50%',
    borderRadius: 15,
    marginTop: '-28%',
    alignSelf: 'flex-end',
    marginRight: '4%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeDestino;
