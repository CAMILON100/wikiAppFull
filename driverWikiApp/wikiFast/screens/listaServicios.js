import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {globalStyles} from '../styles/global';
import FirebaseContext from '../context/firebase/firebaseContext';
import Peticion from '../componentes/peticion';

const ListaServicios = ({navigation}) => {
  const [cargando, guardarCargando] = useState(false);
  const [estadoTrabajar, guardarEstadoTrabajar] = useState(false);
  const {listaSolicitudes} = useContext(FirebaseContext);

  const aceptarPedido = item => {
    guardarCargando(true);

    console.log('Aceptó petición');

    navigation.navigate('Home', {itemSelected: item, change: Math.random()});
    guardarCargando(false);
  };

  return (
    <>
      <View style={styles.containerServicio}>
        <Image
          style={styles.carroBlanco}
          source={require('../assets/images/carWhiteSmall.png')}
        />
        <TouchableHighlight
          onPressIn={() => {
            navigation.navigate('Home');
          }}>
          {estadoTrabajar ? (
            <Text style={styles.textoActivar}>ACTIVAR SERVICIO</Text>
          ) : (
            <Text style={[styles.textoActivar, {marginLeft: '18%'}]}>
              EN SERVICIO
            </Text>
          )}
        </TouchableHighlight>
      </View>
      <Image
        style={globalStyles.imgHeader}
        source={require('../assets/images/logoSmall.png')}
      />
      <View style={globalStyles.behindBackground} />
      <View style={globalStyles.foreBackground} />

      <View style={styles.containerLista}>
        {cargando ? (
          <ActivityIndicator
            style={{marginTop: '25%'}}
            size="large"
            color="#FFF"
          />
        ) : (
          <FlatList
            style={{marginTop: '8%'}}
            data={listaSolicitudes}
            renderItem={({item}) => (
              <Peticion item={item} aceptarPedido={aceptarPedido} />
            )}
            keyExtractor={peticion => peticion.id}
          />
        )}
      </View>
      <View style={styles.buttonsMap}>
        <TouchableHighlight
          style={{marginTop: '-10%', borderRadius: 50}}
          underlayColor="whitesmoke"
          onPress={() => {
            navigation.navigate('Menu');
          }}>
          <Image source={require('../assets/images/menu.png')} />
        </TouchableHighlight>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonsMap: {
    zIndex: 2,
    marginTop: '157%',
    alignSelf: 'flex-end',
    marginRight: '10%',
    position: 'absolute',
  },
  containerLista: {
    position: 'absolute',
    width: '80%',
    height: '60%',
    backgroundColor: '#959595',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: '38%',
  },
  carroBlanco: {marginHorizontal: '5%'},
  textoActivar: {
    color: '#FFF',
    fontFamily: 'myriadpro',
    marginLeft: '3.5%',
    fontSize: 16,
  },
  containerServicio: {
    backgroundColor: '#10112B',
    width: '54%',
    borderRadius: 15,
    position: 'absolute',
    marginTop: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '38%',
    height: '7%',
  },
});

export default ListaServicios;
