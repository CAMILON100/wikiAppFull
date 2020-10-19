import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import HomeDestino from '../componentes/homeDestino';
import {globalStyles} from '../styles/global';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';

const Direccion = ({
  guardarEstadoMenu,
  guardarDireccionDestinoHome,
  guardarGuardandoHome,
}) => {
  const [viaPrincipal, guardarViaPrincipal] = useState('');
  const [viaSegundaria, guardarViaSegundaria] = useState('');
  const [numero, guardarNumero] = useState('');
  const [guardando, guardarGuardando] = useState(false);
  const [marginButtonDyn, guardarMarginButtonDyn] = useState('17%');
  const [direccionUndefined, guardarDireccionUndefined] = useState(true);

  const {asignarUsuario, usuario, firebase} = useContext(FirebaseContext);

  const guardarDireccionIr = () => {
    guardarGuardando(true);

    if (direccionUndefined) {
      if (viaPrincipal == '' || viaSegundaria == '' || numero == '') {
        Alert.alert(
          'Error', //Titulo
          'Todos los campos son obligatorios', //mensaje
          [
            {
              text: 'OK', //Arreglo de botones
            },
          ],
        );
        guardarGuardando(false);
        return;
      }
      let usuariosRef = firebase.db.collection('usuarios'),
        direccionNew = viaPrincipal + ' ' + viaSegundaria + ' -' + numero;
      usuariosRef
        .doc(usuario.id)
        .update({direccion: direccionNew})
        .then(() => {
          usuario['direccion'] = direccionNew;

          AsyncStorage.setItem('usuario', JSON.stringify(usuario))
            .then(result => {})
            .catch(error => {
              console.log('error');
              console.log(error);

              Alert.alert(
                'Error', //Titulo
                'Ha ocurrido un error guardando la dirección. Revisa tu conexión a internet', //mensaje
                [
                  {
                    text: 'OK', //Arreglo de botones
                  },
                ],
              );
              guardarGuardando(false);
              return;
            });

          asignarUsuario(usuario);
          guardarGuardando(false);
          guardarGuardandoHome(true);
          guardarDireccionDestinoHome(direccionNew);
          guardarEstadoMenu('confirmarDireccion');
        })
        .catch(error => {
          Alert.alert(
            'Error', //Titulo
            'Revise su conexión a internet y vuelva a intentarlo', //mensaje
            [
              {
                text: 'OK', //Arreglo de botones
              },
            ],
          );
          guardarGuardando(false);
          return;
        });
    } else {
      guardarGuardando(false);
      guardarGuardandoHome(true);
      guardarDireccionDestinoHome(usuario.direccion);
      guardarEstadoMenu('confirmarDireccion');
    }
  };

  useEffect(() => {
    if (usuario.direccion != undefined) {
      guardarDireccionUndefined(false);
      guardarMarginButtonDyn('-1.5%');
    }
  }, []);

  return (
    <>
      <HomeDestino editable={false} />
      <View style={styles.container}>
        <Image
          style={styles.imgHome}
          source={require('../assets/images/homeDireccion.png')}
        />

        <ScrollView style={{zIndex: 2, height: '100%'}}>
          <View style={{marginTop: '3%', marginLeft: '9%'}}>
            <Text style={styles.label}>DIRECCIÓN CON MÁS PREFERENCIA</Text>
          </View>

          {direccionUndefined ? (
            <View style={styles.containerInputs}>
              <TextInput
                style={[{marginLeft: '-2.5%'}, styles.input]}
                onChangeText={texto => {
                  guardarViaPrincipal(texto.toLocaleLowerCase());
                }}
                placeholder="VIA PRINCIPAL"
              />
              <TextInput
                style={[styles.input, {width: '42%'}]}
                onChangeText={texto => {
                  guardarViaSegundaria(texto.toLocaleLowerCase());
                }}
                placeholder="# VIA SEGUNDARIA"
              />
              <View style={styles.lineHorizontal} />
              <TextInput
                style={[styles.input, {width: '17%', marginLeft: '1%'}]}
                onChangeText={texto => {
                  guardarNumero(texto.toLocaleLowerCase());
                }}
                keyboardType="number-pad"
                placeholder="NÚMERO"
              />
            </View>
          ) : (
            <>
              <View style={styles.containerInputs}>
                <TextInput
                  style={[styles.input, {width: '96%', fontSize: 20}]}
                  editable={false}
                  placeholder={usuario.direccion}
                />
              </View>
              <View style={styles.botonCambiar}>
                <TouchableHighlight
                  style={{alignSelf: 'center', marginTop: '17%'}}
                  onPress={() => {
                    guardarDireccionUndefined(true);
                  }}>
                  <Text style={styles.textoCambiar}> CAMBIAR</Text>
                </TouchableHighlight>
              </View>
            </>
          )}

          {guardando ? (
            <ActivityIndicator
              style={{marginTop: '22%'}}
              size="large"
              color="#FFF"
            />
          ) : (
            <>
              <TouchableHighlight
                style={{alignSelf: 'center', marginTop: marginButtonDyn}}
                onPress={() => guardarDireccionIr()}>
                <Image
                  style={globalStyles.imgHeader}
                  source={require('../assets/images/irDireccion.png')}
                />
              </TouchableHighlight>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textoCambiar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    fontSize: 17,
    marginTop: '-3.5%',
  },
  botonCambiar: {
    marginTop: '-5%',
    backgroundColor: '#10112B',
    height: '17%',
    width: '45%',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: '5%',
  },
  container: {
    zIndex: 2,
    backgroundColor: '#939598',
    height: '57%',
    width: '81%',
    marginTop: '33%',
    alignSelf: 'center',
    borderRadius: 23,
    marginBottom: '7%',
  },
  imgHome: {alignSelf: 'center', marginTop: '3%'},
  label: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    marginTop: '15%',
    marginBottom: '3%',
  },
  containerInputs: {flexDirection: 'row', marginTop: '4.7%', marginLeft: '5%'},
  input: {
    backgroundColor: '#FFF',
    width: '35%',
    borderRadius: 12,
    marginRight: '2%',
    fontFamily: 'myriadpro',
    fontSize: 12,
  },
  lineHorizontal: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: '1.5%',
    alignSelf: 'center',
  },
});

export default Direccion;
