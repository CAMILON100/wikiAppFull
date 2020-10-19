import React from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import {Player} from '@react-native-community/audio-toolkit';

const Peticion = ({item, aceptarPedido}) => {
  new Player('noti.mp3').play().on('ended', () => {
    // Enable button again after playback finishes
    console.log('sono');
  });

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.texto}>
          Recogida:{' '}
          <Text style={{fontFamily: 'myriadprobold'}}>
            {item.direccionOrigen} ({item.dirAdicional})
          </Text>{' '}
        </Text>
        <Text style={styles.texto}>
          Destino:{' '}
          <Text style={{fontFamily: 'myriadprobold'}}>{item.direccion} </Text>{' '}
        </Text>
        <Text style={styles.texto}>
          Valor Estimado:{' '}
          <Text style={{fontFamily: 'myriadprobold'}}>
            ${item.valorEstimado}{' '}
          </Text>{' '}
        </Text>

        <View style={{flexDirection: 'row-reverse'}}>
          <View style={styles.containerServicio}>
            <TouchableHighlight
              underlayColor="#10112B"
              style={{borderRadius: 20}}
              onPress={() => aceptarPedido(item)}>
              <Text style={[styles.textoActivar, {marginLeft: '18%'}]}>
                Aceptar
              </Text>
            </TouchableHighlight>
          </View>
          <Text style={[styles.texto, {marginRight: '47%'}]}>
            Valor Sugerido:{' '}
            <Text style={{fontFamily: 'myriadprobold'}}>${item.valor}</Text>
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  texto: {color: '#10112B', marginLeft: '3%', paddingVertical: '1%'},
  textoActivar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    marginLeft: '3.5%',
    fontSize: 16,
    marginTop: '5%',
  },
  container: {
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: '2%',
    marginTop:'3%',
    marginHorizontal:'2%'
  },
  containerServicio: {
    backgroundColor: '#10112B',
    width: '30%',
    borderRadius: 15,
    marginRight: '3%',
    position: 'absolute',
    marginTop: '-7%',
    height: '175%',
  },
});

export default Peticion;
