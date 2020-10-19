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
import axios from 'axios';

const NumeroViajes = ({direccionDestinoHome, guardarEstadoMenu}) => {
  const {firebase, usuario} = useContext(FirebaseContext);

  return (
    <>
      <HeaderLabelInfo direccionDestinoHome={direccionDestinoHome} />

      <View style={styles.viewInfo2}>
        <View
          style={{alignSelf: 'center', marginLeft: '7.5%', marginTop: '13%'}}>
          <Text
            style={[
              styles.textViewInfo,
              {marginLeft: '25%', marginBottom: '5%', marginTop: '-15%'},
            ]}>
            ES TU VIAJE #:{' '}
            <Text style={[styles.textViewInfo, {fontFamily: 'myriadprobold'}]}>
              {usuario.numeroViajes}
            </Text>
          </Text>
          <Text style={[styles.textViewInfo, {fontSize: 10}]}>
            RECUERDA QUE CADA 12 VIAJES TIENES UNO GRATIS.
          </Text>
          <Text style={[styles.textViewInfo, {fontSize: 10}]}>
            APLICA PARA UN VIAJE CON LA MÍNIMA EN $4.800
          </Text>
        </View>
      </View>

      <View style={styles.viewInfo}>
        <View style={{alignSelf: 'center', marginLeft: '10%'}}>
          <Text style={styles.textViewInfo}>
            GRACIAS POR VIAJAR CON WIKIAPP,
          </Text>
          <Text style={styles.textViewInfo}>CON ESTO AYUDAS A CIENTOS DE</Text>
          <Text style={styles.textViewInfo}>FAMILIAS EN SANTANDER.</Text>
          <Text style={styles.textViewInfo}>JUNTOS HAREMOS EL CAMBIO.</Text>
        </View>
      </View>

      <View style={styles.botonProponer}>
        <TouchableHighlight
          underlayColor="#1F15A290114B"
          onPress={() => {
            guardarEstadoMenu('home');
          }}>
          <Text style={styles.textoProponer}> Inicio</Text>
        </TouchableHighlight>
      </View>

      <View style={{marginTop: '26%'}} />
    </>
  );
};

const styles = StyleSheet.create({
  textViewInfo: {
    color: '#FFF',
    fontFamily: 'myriadpro',
  },
  viewInfo: {
    zIndex: 2,
    backgroundColor: '#F15A29',
    borderRadius: 15,
    height: '25%',
    marginTop: '3%',
    width: '81%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  viewInfo2: {
    zIndex: 2,
    backgroundColor: '#10112B',
    borderRadius: 15,
    height: '14%',
    marginTop: '40%',
    width: '81%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '-12%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
    marginBottom: '-5%',
  },
  botonProponer: {
    zIndex: 2,
    backgroundColor: '#F15A29',
    borderRadius: 15,
    alignSelf: 'center',
    width: '30%',
    height: '10%',
    marginTop: '2.5%',
  },
  textoProponer: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
    textAlign: 'center',
    marginTop: '18%',
  },
});

export default NumeroViajes;
