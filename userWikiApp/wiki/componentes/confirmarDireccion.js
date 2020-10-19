import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight, Image} from 'react-native';
import HeaderLabelInfo from '../componentes/headerLabelInfo';

const ConfirmarDireccion = ({guardarEstadoMenu, direccionDestinoHome}) => {
  return (
    <>
      <HeaderLabelInfo
        direccionDestinoHome={direccionDestinoHome}      
      />
      <View style={styles.buttonsMap}>
        <View style={styles.botonCorregir}>
          <TouchableHighlight
            style={{alignSelf: 'center', marginTop: '-27%'}}
            onPress={() => {
              guardarEstadoMenu('home');
            }}>
            <Text style={styles.textoConfirmar}> CORREGIR</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.botonConfirmar}>
          <TouchableHighlight
            style={{alignSelf: 'center', marginTop: '-27%'}}
            underlayColor="darkgray"
            onPress={() => {
              guardarEstadoMenu('buscarPrecio');
            }}>
            <Text style={styles.textoConfirmar}> CONFIRMAR</Text>
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonsMap: {
    zIndex: 2,
    flexDirection: 'row',
    marginTop: '-10%',
    alignSelf: 'center',
    marginRight: '3.5%',
    height: '25%',
  },
  textoConfirmar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
  },
  botonConfirmar: {
    backgroundColor: '#F15A29',
    borderRadius: 20,
    alignSelf: 'center',
    paddingTop: '15%',
    width: '40%',
    marginLeft: '3%',
  },
  botonCorregir: {
    backgroundColor: '#10112B',
    borderRadius: 20,
    alignSelf: 'center',
    paddingTop: '15%',
    width: '40%',
  },
});

export default ConfirmarDireccion;
