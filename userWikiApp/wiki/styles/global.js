import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  behindBackground: {
    backgroundColor: '#F15A29',
    marginTop: '1.5%',
    height: '19.5%',
    width: '80.5%',
    marginHorizontal: '5%',
    borderRadius: 20,
    flexDirection: 'column',
    alignSelf: 'center',
    marginLeft: '6%',
    transform: [{rotate: '-10deg'}],
  },
  foreBackground: {
    backgroundColor: '#10112B',
    height: '80%',
    marginHorizontal: '5%',
    marginTop: '-32%',
    borderRadius: 20,
  },
  imgHeader: {marginTop: '4%',marginLeft:'7%'},
});
