import React, {useEffect} from 'react';
import {Text, View, StyleSheet, TouchableHighlight, Image} from 'react-native';

const HomeOptions = ({navigation}) => {
  return (
    <>
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
    marginTop: '139%',
    alignSelf: 'flex-end',
    marginRight: '6%',
    marginBottom: '8%',
  },
});

export default HomeOptions;
