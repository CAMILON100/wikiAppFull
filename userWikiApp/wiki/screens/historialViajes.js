import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {
  Table,
  TableWrapper,
  Cell,
  Col,
  Row,
  Cols,
} from 'react-native-table-component';
import FirebaseContext from '../context/firebase/firebaseContext';
import moment from 'moment';
import 'moment/locale/es';

const HistorialViajes = ({navigation}) => {
  const {firebase, usuario} = useContext(FirebaseContext);

  const [cargando, guardarCargando] = useState(true);
  const [tableData, guardarTableData] = useState([]);

  const spaceRow = 37;


  useEffect(() => {
    let col1 = [],
      col2 = [],
      col3 = [];
    firebase.db
      .collection('solicitudes')
      .where('idUsuario', '==', usuario.id)
      .where('estado', '==', 2)
      .orderBy('creado','desc')
      .limit(5)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          let rowElement = doc.data();

          col1.push(
            moment(rowElement.creado.toDate())
              .local()
              .format('DD/MM/YY'),
          );
          col2.push(rowElement.direccion.split(',')[0]);
          col3.push('$' + String(rowElement.valor));
        });
        guardarTableData([col1, col2, col3]);
        guardarCargando(false);
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  }, []);

  /*const tableData = [
    ['08/04/20', '08/04/20', '08/04/20', '08/04/20', '08/04/20'],
    [
      'CALLE 11 #21 - 07',
      'CALLE 11 #21 - 07',
      'CALLE 11 #21 - 07',
      'CALLE 11 #21 - 07',
      'CALLE 11 #21 - 07',
    ],
    ['$7200', '$7200', '$7200', '$7200', '$7200'],
  ];*/

  return (
    <>
      <View style={styles.imgHeader}>
        <Image source={require('../assets/images/logoSmall.png')} />

        <Image
          style={{marginTop: '7%', marginLeft: '3%'}}
          source={require('../assets/images/carTinyPaint2.png')}
        />
      </View>
      <View>
        <Text style={styles.value}>HISTORIAL VIAJES</Text>
        <Text style={styles.label}>
          PUEDES VER LOS ÚLTIMOS 5 VIAJES REALIZADOS
        </Text>
      </View>

      <View style={styles.container}>
        <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 0}}>
          {/* Right Wrapper */}

          <TableWrapper>
            <TableWrapper
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderEndWidth: 1,
              }}>
              <Cell
                data="FECHA"
                textStyle={styles.text}
                style={{marginLeft: '2%'}}
              />
              <Cell
                data="DESTINO"
                textStyle={styles.text}
                style={{marginLeft: '25%'}}
              />
              <Cell
                data="VALOR"
                textStyle={styles.text}
                style={{marginLeft: '17%'}}
              />
            </TableWrapper>

            {cargando ? (
              <ActivityIndicator
                style={{marginTop: '25%'}}
                size="large"
                color="#10112B"
              />
            ) : (
              <Cols
                data={tableData}
                widthArr={[70, 140, 80]}
                heightArr={[spaceRow,spaceRow,spaceRow,spaceRow,spaceRow]}
                textStyle={styles.text}
                style={{borderEndWidth: 1, height: '180%'}}
              />
            )}
          </TableWrapper>
        </Table>
      </View>

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
    </>
  );
};

const styles = StyleSheet.create({
  imgHeader: {alignSelf: 'center', marginTop: '10%'},
  label: {
    color: '#000',
    alignSelf: 'center',
    fontFamily: 'myriadpro',
  },
  value: {
    color: '#10112B',
    alignSelf: 'center',
    fontFamily: 'myriadprobold',
    marginTop: '1%',
    fontSize: 20,
  },
  container: {flex: 1, alignSelf: 'center', paddingTop: 40},
  text: {textAlign: 'center', color: '#10112B',fontSize:12},
  viewButtons: {alignSelf: 'center', marginTop: '15%'},
});

export default HistorialViajes;
