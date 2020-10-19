import React, {useState, useContext} from 'react';
import {Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';

const InfoUsuario = ({navigation}) => {
  const {usuario} = useContext(FirebaseContext);

  return (
    <>
      <View style={styles.imgHeader}>
        <Image source={require('../assets/images/logoSmall.png')} />

        <Image
          style={{marginTop: '15%'}}
          source={require('../assets/images/userProfile.png')}
        />
      </View>

      <View>
        <Text style={styles.label}>NOMBRE</Text>
        <Text style={styles.value}>{usuario.nombre}</Text>
        <Text style={styles.label2}>CORREO</Text>
        <Text style={styles.value}>{usuario.email}</Text>
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
  imgHeader: {alignSelf: 'center', marginTop: '10%'},
  buttons: {width: '80%', height: '5%', alignSelf: 'center'},
  label: {
    color: '#000',
    alignSelf: 'center',
    fontFamily: 'myriadpro',
    marginTop: '25%',
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
  viewButtons: {alignSelf: 'center', marginTop: '23%'},
});

export default InfoUsuario;
