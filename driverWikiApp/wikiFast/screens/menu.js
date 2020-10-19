import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native';

const Menu = ({navigation}) => {
  const [guardando, guardarGuardando] = useState(false);

  return (
    <>
      <Image
        style={styles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />

      {guardando ? (
        <ActivityIndicator
          style={{marginTop: '33%'}}
          size="large"
          color="#FFF"
        />
      ) : (
        <>
          <Image
            style={{alignSelf: 'center', marginTop: '10%'}}
            source={require('../assets/images/userMenu.png')}
          />
          <TouchableHighlight
            style={[{marginTop: '2.5%'}, styles.buttons]}
            underlayColor="gainsboro"
            onPress={() => {
              navigation.navigate('InfoUsuario');
            }}>
            <Text style={styles.labelInput}>INFORMACIÓN DE USUARIO</Text>
          </TouchableHighlight>
          <Image
            style={{alignSelf:'center',marginTop:'1%'}}
            source={require('../assets/images/historialMenu.png')}
          />
          <TouchableHighlight
            style={[{marginTop: '2.5%'}, styles.buttons]}
            underlayColor="gainsboro"
            onPress={() => {
              navigation.navigate('HistorialViajes');
            }}>
            <Text style={styles.labelInput}>HISTORIAL DE VIAJES</Text>
          </TouchableHighlight>
          <Image
            style={{alignSelf:'center',marginTop:'1%'}}
            source={require('../assets/images/politicasMenu.png')}
          />
          <TouchableHighlight
            style={[{marginTop: '2%'}, styles.buttons]}
            underlayColor="gainsboro"
            onPress={() => navigation.navigate('Condiciones')}>
            <Text style={styles.labelInput}>CONDICIONES Y RESTRICCIONES</Text>
          </TouchableHighlight>
        </>
      )}
      <View style={styles.viewButtons}>
        <TouchableHighlight
          style={{borderRadius: 50, width: '10%'}}
          underlayColor="gainsboro"
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{marginLeft: '30%'}}
            source={require('../assets/images/x.png')}
          />
        </TouchableHighlight>
        <Image
          style={{marginTop: '10%'}}
          source={require('../assets/images/mogo.png')}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imgHeader: {alignSelf: 'center', marginTop: '10%'},
  buttons: {width: '80%', height: '5%', alignSelf: 'center'},
  labelInput: {
    color: '#000',
    alignSelf: 'center',
    fontFamily: 'myriadpro',
  },
  viewButtons: {alignSelf: 'center', marginTop: '14%'},
});

export default Menu;
