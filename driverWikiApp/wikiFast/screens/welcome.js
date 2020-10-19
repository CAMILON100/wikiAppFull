import React,{useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {globalStyles} from '../styles/global';

const Welcome = ({navigation}) => {
  const [guardando, guardarGuardando] = useState(false);


  const irHome = () => {
    if (!guardando) {
      guardarGuardando(true);
      console.log('Go home');
      navigation.navigate('Home');
      guardarGuardando(false);
    }
  };


  return (
    <>
      <Image
        style={globalStyles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />
      <View style={globalStyles.behindBackground} />
      <View style={globalStyles.foreBackground}>
        <View style={styles.par1}>
          <Text style={styles.labelInput}>GRACIAS POR REGISTRARSE</Text>
          <Text style={styles.labelInput}>CON NOSOTROS HAGAMOS NUESTRO</Text>
          <Text style={styles.labelInput}>PRIMER VIAJE</Text>
        </View>
        <View style={styles.par2}>
          <Text style={styles.labelInput}>EL BENEFICIO DE LOS COLOMBIANOS</Text>
          <Text style={styles.labelInput}>NO ES SÓLO IMPORTANTE</Text>
          <Text style={styles.labelInput}>ES LO ÚNICO QUE NOS IMPORTA</Text>
        </View>

        {guardando ? (
          <ActivityIndicator
            style={{marginTop: '18%'}}
            size="large"
            color="#FFF"
          />
        ) : (
          <TouchableHighlight style={styles.button} onPress={() => irHome()}>
            <Image source={require('../assets/images/ir.png')} />
          </TouchableHighlight>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  par1: {marginTop: '70%', alignSelf: 'center'},
  par2: {marginTop: '15%', alignSelf: 'center'},
  labelInput: {
    color: '#FFF',
    fontFamily: 'myriadpro',
  },
  button: {alignSelf: 'center', marginTop: '18%'},
});

export default Welcome;
