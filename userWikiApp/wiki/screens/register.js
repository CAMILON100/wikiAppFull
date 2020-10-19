import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import {globalStyles} from '../styles/global';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';

const Register = ({navigation}) => {
  const [nombre, guardarNombre] = useState('');
  const [email, guardarEmail] = useState('');
  const [clave, guardarClave] = useState('');
  const [confirmarClave, guardarConfirmarClave] = useState('');
  const [guardando, guardarGuardando] = useState(false);
  const [checkBoxValue, guardarCheckBoxValue] = useState(false);

  const {firebase, asignarUsuario} = useContext(FirebaseContext);

  const [cargandoLink, guardarCargandoLink] = useState(true);
  const [link, guardarLink] = useState('http://wikiapp.com.co/');

  useEffect(() => {
    firebase.db
      .collection('datosGenerales')
      .where('id', '==', 'datosGenerales')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          let rowElement = doc.data();
          guardarLink(rowElement.urlAquiRegistro);
          guardarCargandoLink(false);
        });
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  }, []);

  const registrarse = () => {
    guardarGuardando(true);
    if (
      nombre === '' ||
      email === '' ||
      clave === '' ||
      confirmarClave === '' ||
      checkBoxValue === false
    ) {
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

    if (clave.length < 6) {
      Alert.alert(
        'Error', //Titulo
        'La contraseña debe ser de al menos 6 caracteres', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      guardarGuardando(false);
      return;
    }

    if (confirmarClave != clave) {
      Alert.alert(
        'Error', //Titulo
        'Las contraseñas no coinciden', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      guardarGuardando(false);
      return;
    }

    firebase.auth
      .createUserWithEmailAndPassword(email, clave)
      .then(authUser => {
        let userNewData = {
          id: authUser.user.uid,
          email: email,
          nombre: nombre,
          tipo: 0,
        };
        console.log('Nice');
        console.log(authUser);

        AsyncStorage.setItem('usuario', JSON.stringify(userNewData))
          .then(result => {
            let usuariosRef = firebase.db.collection('usuarios');

            usuariosRef
              .doc(authUser.user.uid)
              .set(userNewData)
              .then(resultAdd => {
                asignarUsuario(userNewData);
                navigation.navigate('Welcome');
                guardarGuardando(false);
                return;
              });
          })
          .catch(error => {
            console.log('error');
            console.log(error);

            Alert.alert(
              'Error', //Titulo
              'Ha ocurrido un error. Revisa tu conexión a internet y vuelve a intentarlo', //mensaje
              [
                {
                  text: 'OK', //Arreglo de botones
                },
              ],
            );
            guardarGuardando(false);
            return;
          });
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        Alert.alert(
          'Error', //Titulo
          'El usuario con email ' + email + ' ya existe. Intento con uno nuevo', //mensaje
          [
            {
              text: 'OK', //Arreglo de botones
            },
          ],
        );
        guardarGuardando(false);
        return;
      });
  };

  const yaRegistrado = () => {
    if (!guardando) {
      guardarGuardando(true);
      console.log('ya Registrado');
      navigation.navigate('Login');
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
        <KeyboardAvoidingView style={styles.containerForm}>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={texto => {
                guardarNombre(texto.toLocaleLowerCase());
              }}
            />
            <Text style={styles.labelInput}>NOMBRE</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={texto => {
                guardarEmail(texto.toLocaleLowerCase());
              }}
              keyboardType="email-address"
            />
            <Text style={styles.labelInput}>MAIL</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={texto => {
                guardarClave(texto.toLocaleLowerCase());
              }}
              secureTextEntry={true}
            />
            <Text style={styles.labelInput}>CLAVE</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={texto => {
                guardarConfirmarClave(texto.toLocaleLowerCase());
              }}
              secureTextEntry={true}
            />
            <Text style={styles.labelInput}>CONFIRMAR CLAVE</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: '13%',
              marginLeft: '10%',
              width: '70%',
            }}>
            <CheckBox
              style={{alignSelf: 'center'}}
              disabled={false}
              tintColors={{true: '#F15927', false: 'gainsboro'}}
              value={checkBoxValue}
              onValueChange={newValue => guardarCheckBoxValue(newValue)}
            />
            <Text style={[styles.labelInput, {fontSize: 11}]}>
              ACEPTO LOS TÉRMINOS Y CONDICIONES CONSIGNADOS{' '}
              <Text
                style={[styles.labelInput, {textDecorationLine: 'underline'}]}
                onPress={() => Linking.openURL(link)}>
                AQUÍ
              </Text>
            </Text>
          </View>

          {guardando ? (
            <ActivityIndicator
              style={{marginTop: '33%'}}
              size="large"
              color="#FFF"
            />
          ) : (
            <>
              <TouchableHighlight
                style={[{marginTop: '8%'}, styles.buttons]}
                onPress={() => registrarse()}>
                <Text style={styles.labelInput}>REGISTRAR</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[{marginTop: '6%'}, styles.buttons]}
                onPress={() => yaRegistrado()}>
                <Text style={styles.labelInput}>YA TENGO CUENTA</Text>
              </TouchableHighlight>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttons: {width: '40%', height: '5%', alignSelf: 'center'},
  labelInput: {
    color: '#FFF',
    alignSelf: 'center',
    fontFamily: 'myriadpro',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#939598',
    width: '70%',
    alignSelf: 'center',
    marginBottom: '1%',
    marginTop: '-2%',
    color: '#FFF',
    textAlignVertical: 'bottom',
  },
  containerForm: {marginTop: '10%'},
});

export default Register;
