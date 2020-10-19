import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import * as geofirestore from 'geofirestore';
import firebase2 from '@react-native-firebase/app';

import firebaseConfig from './config';

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
      app.firestore().settings({experimentalForceLongPolling: true});
    } else {
      app.firestore().settings({experimentalForceLongPolling: true});
    }

    if (!firebase2.apps.length) {
      firebase2.initializeApp(firebaseConfig);
    }

    this.db = app.firestore();
    this.auth = app.auth();
    this.dbGeo = geofirestore.initializeApp(this.db);
  }
  createGeoPoint(lat, lon) {
    return new app.firestore.GeoPoint(lat, lon);
  }

  createIncrement(num) {
    return app.firestore.FieldValue.increment(num);
  }

  createUnionArray(token) {
    return app.firestore.FieldValue.arrayUnion(token);
  }

  createNowDate() {
    return app.firestore.Timestamp.now();
  }
}

const firebase = new Firebase();

export default firebase;
