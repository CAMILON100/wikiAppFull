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

const HeaderLabelInfo = ({direccionDestinoHome}) => {
  const [viaPrincipal, guardarViaPrincipal] = useState('');
  const [guardando, guardarGuardando] = useState(false);

  return (
    <>
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
  containerInputs: {
    flexDirection: 'row',
    marginTop: '4.7%',
    marginLeft: '10%',
    zIndex: 2,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth:1,
    borderColor:'#959595',
    width: '88%',
    borderRadius: 14,
    marginRight: '2%',
    marginTop: '4%',
    fontFamily: 'myriadpro',
    fontSize: 18,
  },
});

export default HeaderLabelInfo;
