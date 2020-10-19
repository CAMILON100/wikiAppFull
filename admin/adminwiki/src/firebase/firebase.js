import app from "firebase/app";
import firebaseConfig from "./config";
import "firebase/firestore";
import "firebase/auth";
import 'firebase/storage';

class Firebase {
  constructor() {
    if (!app.apps.length) app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage=app.storage();
    
  }

  createIncrement(num) {
    return app.firestore.FieldValue.increment(num);
  }
}

const firebase = new Firebase();
export default firebase;
