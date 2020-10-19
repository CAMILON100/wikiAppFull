import React, {useState, useContext} from 'react';
import {Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native';
import {globalStyles} from '../styles/global';

const Default = ({navigation}) => {
  return (
    <>
      <Image
        style={globalStyles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />
      <View style={globalStyles.behindBackground} />
      <View style={globalStyles.foreBackground} />
      <Text
        style={{
          zIndex: 2,
          position: 'absolute',
          marginTop: '40%',
          alignSelf: 'center',
          width:'50%'
        }}>
        Aplicación desactivada. Contacte al administrador
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  buttonsMap: {
    zIndex: 2,
    marginTop: '157%',
    alignSelf: 'flex-end',
    marginRight: '10%',
    position: 'absolute',
  },
  containerLista: {
    position: 'absolute',
    width: '80%',
    height: '60%',
    backgroundColor: '#959595',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: '38%',
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

export default Default;
