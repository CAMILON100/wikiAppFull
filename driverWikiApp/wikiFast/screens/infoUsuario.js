import React, {useState, useContext} from 'react';
import {Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';

const InfoUsuario = ({navigation}) => {
  const {usuario} = useContext(FirebaseContext);

  return (
    <>
      <View style={styles.imgHeader}>
        <Image source={require('../assets/images/logoSmall.png')} />

        {/*<Image
          style={{marginTop: '7%'}}
          source={require('../assets/images/carSmall.png')}
        />*/}
      </View>
      <View style={styles.imgPerfil} />
      <View>
        <Text style={styles.label}>NOMBRE</Text>
        <Text style={styles.value}>{usuario.nombre}</Text>
        <Text style={styles.label}>PLACAS</Text>
        <Text style={styles.value}>{usuario.placas}</Text>
        <Text style={styles.label2}>CORREO</Text>
        <Text style={styles.value}>{usuario.email}</Text>
        <Text style={styles.label2}>CÓDIGO</Text>
        <Text style={styles.value}>{usuario.codigo}</Text>
      </View>

      <View style={styles.viewButtons}>
        <TouchableHighlight
          style={{borderRadius: 50}}
          underlayColor="gainsboro"
          onPress={() => {
            navigation.navigate('Menu');
          }}>
          <Image
            style={{marginLeft: '5%'}}
            source={require('../assets/images/x.png')}
          />
        </TouchableHighlight>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imgHeader: {alignSelf: 'center', marginTop: '5%'},
  imgPerfil: {
    backgroundColor: '#FFF',
    width: '30%',
    height: '20%',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '10%',
  },
  label: {
    color: '#000',
    alignSelf: 'center',
    fontFamily: 'myriadpro',
    marginTop: '5%',
  },
  label2: {
    color: '#000',
    alignSelf: 'center',
    fontFamily: 'myriadpro',
    marginTop: '5%',
  },
  value: {
    color: '#10112B',
    alignSelf: 'center',
    fontFamily: 'myriadprobold',
    marginTop: '1%',
    fontSize: 20,
  },
  viewButtons: {alignSelf: 'center', marginTop: '3%'},
});

export default InfoUsuario;
