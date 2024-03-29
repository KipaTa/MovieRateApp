import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
    },

    banner: {
      flex: 1,
      padding: 10,
    },

    bannertext: {
      color: 'gold',
      fontSize: 50, 
    },

    new: {
      flex: 2,      
    },

    text: {
      color: 'white'
    },
    
    h2: {
      color: 'darkgrey',
      fontSize: 30,
      padding: 5
    },

    buttonSearch: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    modalContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: 40,
      backgroundColor: 'black',
    },
    
    myMovies: {
      flex: 5,
      borderBottomWidth: 1,
      borderColor: 'white'
    },

    findMovies:{
      flex: 1,
    },

    list: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,      
    },

    teksti: {
      width: 200,
      paddingLeft: 10
    },

    rated: {
        flex: 5,
    },

    customRatingBarStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30
    },

    starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
    },

    textStyle: {
    marginTop: 20,
    color: 'white'
    },

    buttonStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      padding: 15,
    }

  });