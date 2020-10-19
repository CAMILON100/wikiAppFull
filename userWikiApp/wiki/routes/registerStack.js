import React, {useState, useContext, useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';

import Register from '../screens/register';

import Welcome from '../screens/welcome';

import Home from '../screens/home';

import Login from '../screens/login';

import Menu from '../screens/menu';

import InfoUsuario from '../screens/infoUsuario';

import HistorialViajes from '../screens/historialViajes';

import Condiciones from '../screens/condiciones';

import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import FirebaseContext from '../context/firebase/firebaseContext';

const Stack = createStackNavigator();

export default function Navigator() {
  const [stackInicial, guardarStackInicial] = useState('Register');

  const {asignarUsuario, firebase} = useContext(FirebaseContext);

  useEffect(() => {
    AsyncStorage.getItem('usuario')
      .then(result => {
        console.log(result);
        if (result != null) {
          asignarUsuario(JSON.parse(result));
          guardarStackInicial('Home');
        }
        setTimeout(() => {
          SplashScreen.hide();
        }, 4000);
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        setTimeout(() => {
          SplashScreen.hide();
        }, 4000);
      });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {stackInicial == 'Register' ? (
          <>
            <Stack.Screen name="Register" component={Register} />

            <Stack.Screen name="Welcome" component={Welcome} />

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="InfoUsuario" component={InfoUsuario} />
            <Stack.Screen name="HistorialViajes" component={HistorialViajes} />
            <Stack.Screen name="Condiciones" component={Condiciones} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="InfoUsuario" component={InfoUsuario} />
            <Stack.Screen name="HistorialViajes" component={HistorialViajes} />
            <Stack.Screen name="Condiciones" component={Condiciones} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
