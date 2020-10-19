import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import FirebaseState from './context/firebase/firebaseState';
import Navigator from './routes/registerStack';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


import {decode, encode} from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const App = () => {
  return (
    <>
      <FirebaseState>
        <Navigator />
      </FirebaseState>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
