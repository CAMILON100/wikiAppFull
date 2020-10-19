import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {globalStyles} from '../styles/global';
import FirebaseContext from '../context/firebase/firebaseContext';
import AsyncStorage from '@react-native-community/async-storage';

const Login = ({navigation}) => {
  const [email, guardarEmail] = useState('');
  const [clave, guardarClave] = useState('');

  const [guardando, guardarGuardando] = useState(false);

  const {firebase, asignarUsuario, asignarSolicitud} = useContext(
    FirebaseContext,
  );

  const recuperarPass = () => {
    guardarGuardando(true);

    if (email === '') {
      Alert.alert(
        'Error', //Titulo
        'Escriba el email de su cuenta para enviar el correo de recuperación', //mensaje
        [
          {
            text: 'OK', //Arreglo de botones
          },
        ],
      );
      guardarGuardando(false);
      return;
    }

    let userF = firebase.auth;

    userF
      .sendPasswordResetEmail(email)
      .then(function(user) {
        
        Alert.alert(
          'Información', //Titulo
          'Revisa tu email para cambiar tu contraseña', //mensaje
          [
            {
              text: 'OK', //Arreglo de botones
            },
          ],
        );
        guardarGuardando(false);
        return;

      })
      .catch(function(e) {
        console.log(e);
        Alert.alert(
          'Error', //Titulo
          'El correo ingresado no pertenece a ningún usuario', //mensaje
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

  const iniciarSesion = () => {
    guardarGuardando(true);
    if (email === '' || clave === '') {
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

    firebase.auth
      .signInWithEmailAndPassword(email, clave)
      .then(authUser => {
        console.log('Nice Login');
        console.log(authUser);

        let usuariosRef = firebase.db.collection('usuarios'),
          solicitudActiva = firebase.db.collection('solicitudesActivas');

        usuariosRef
          .where('email', '==', email)
          .where('tipo', '==', 1)
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
              Alert.alert(
                'Error', //Titulo
                'El usuario está registrado como pasajero, ' +
                  'por favor descargue la aplicación del pasajero Wiki', //mensaje
                [
                  {
                    text: 'OK', //Arreglo de botones
                  },
                ],
              );
              guardarGuardando(false);
              return;
            } else {
              console.log('data');
              let userLogin = {
                id: snapshot.docs[0].id,
                ...snapshot.docs[0].data(),
              };

              AsyncStorage.setItem('usuario', JSON.stringify(userLogin))
                .then(result => {
                  asignarUsuario(userLogin);
                  console.log('Login');

                  solicitudActiva
                    .where('idConductor', '==', userLogin.id)
                    .get()
                    .then(snapshot2 => {
                      if (snapshot2.empty) {
                        if (userLogin.primeraVez) {
                          usuariosRef
                            .doc(userLogin.id)
                            .update({primeraVez: false})
                            .then(() => {
                              guardarGuardando(false);
                              navigation.navigate('Welcome');
                              return;
                            });
                        } else {
                          guardarGuardando(false);
                          navigation.navigate('Home');
                          return;
                        }
                      } else {
                        let solicitudLogin = {
                          id: snapshot2.docs[0].id,
                          ...snapshot2.docs[0].data(),
                        };
                        asignarSolicitud(solicitudLogin);
                        guardarGuardando(false);
                        navigation.navigate('Home');
                        return;
                      }
                    })
                    .catch(err => {
                      console.log(err);
                      Alert.alert(
                        'Error', //Titulo
                        'Hubo un error en el inicio de sesión, vuelva a intentarlo', //mensaje
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
            }
          })
          .catch(err => {
            console.log(err);
            Alert.alert(
              'Error', //Titulo
              'Hubo un error en el inicio de sesión, vuelva a intentarlo', //mensaje
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
          'El correo o la contraseña es incorrecta o el conductor está desactivado', //mensaje
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

  return (
    <>
      <Image
        style={globalStyles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />
      <View style={globalStyles.behindBackground} />
      <View style={globalStyles.foreBackground}>
        <ScrollView style={styles.containerForm}>
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

          {guardando ? (
            <ActivityIndicator
              style={{marginTop: '15%'}}
              size="large"
              color="#FFF"
            />
          ) : (
            <>
              <TouchableHighlight
                style={[{marginTop: '15%'}]}
                underlayColor="darkgray"
                onPress={() => recuperarPass()}>
                <Text style={styles.labelInput}>Recuperar contraseña</Text>
              </TouchableHighlight>
            </>
          )}

          {guardando ? (
            <ActivityIndicator
              style={{marginTop: '35%'}}
              size="large"
              color="#FFF"
            />
          ) : (
            <>
              <TouchableHighlight
                style={[{marginTop: '35%'}, styles.buttons]}
                underlayColor="darkgray"
                onPress={() => iniciarSesion()}>
                <Text style={styles.labelInput}>INGRESAR</Text>
              </TouchableHighlight>
            </>
          )}
        </ScrollView>
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
    borderColor: '#10112B',
    width: '70%',
    alignSelf: 'center',
    marginBottom: '1%',
    marginTop: '-2%',
    color: '#FFF',
    textAlignVertical: 'bottom',
  },
  containerForm: {marginTop: '50%'},
});

export default Login;
