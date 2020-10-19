import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';
import Pdf from 'react-native-pdf';

const Condiciones = ({navigation}) => {
  const {firebase} = useContext(FirebaseContext);

  const [cargando, guardarCargando] = useState(true);
  const [politica, guardarPolitica] = useState({});

  useEffect(() => {
    firebase.db
      .collection('datosGenerales')
      .where('id', '==', 'datosGenerales')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          let urlCondiciones = doc.data().urlCondiciones;

          guardarPolitica({
            uri: urlCondiciones,
            cache: true,
          });
          guardarCargando(false);
        });
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  }, []);

  return (
    <>
      {cargando ? (
        <ActivityIndicator
          style={{marginTop: '25%'}}
          size="large"
          color="#10112B"
        />
      ) : (
        <>
          <View style={styles.container}>
            <Pdf
              source={politica}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link presse: ${uri}`);
              }}
              style={styles.pdf}
            />
          </View>
        </>
      )}

      {!cargando ? (
        <View style={styles.viewButtons}>
          <TouchableHighlight
            style={{borderRadius: 50}}
            underlayColor="gainsboro"
            onPress={() => {
              navigation.navigate('Menu');
            }}>
            <Image
              style={{marginLeft: '5%'}}
              source={require('../assets/images/x.png')}
            />
          </TouchableHighlight>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  viewButtons: {alignSelf: 'center', marginTop: '0%'},
});

export default Condiciones;
