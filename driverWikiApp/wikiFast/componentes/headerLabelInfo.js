import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  Image,
} from 'react-native';
import {globalStyles} from '../styles/global';

const HeaderLabelInfo = ({label, direccionDestinoHome}) => {
  const [viaPrincipal, guardarViaPrincipal] = useState('');
  const [guardando, guardarGuardando] = useState(false);

  return (
    <>
      <View style={{marginTop: '5.5%', marginLeft: '9%'}}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.containerInputs}>
        <TextInput
          style={styles.input}
          onChangeText={texto => {
            guardarViaPrincipal(texto.toLocaleLowerCase());
          }}
          placeholder={direccionDestinoHome}
          editable={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#FFF',
    fontFamily: 'myriadpro',
  },
  containerInputs: {flexDirection: 'row', marginTop: '4.7%', marginLeft: '7%'},
  input: {
    backgroundColor: '#FFF',
    width: '93%',
    borderRadius: 12,
    marginRight: '2%',    
    marginTop:"-3%",
    fontFamily: 'myriadpro',
    fontSize: 18,
  },
  lineHorizontal: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: '1.5%',
    alignSelf: 'center',
  },
});

export default HeaderLabelInfo;
