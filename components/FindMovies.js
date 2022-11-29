import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';

export default function FindMovies( ) {

    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState([]);

    const URL = 'https://image.tmdb.org/t/p/original/';

  const getRepositories = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US&page=1&include_adult=false`)
    .then(response => response.json())
    .then(data => setData(data.results))
    .catch(error => { 
        Alert.alert('Error', error);
    });
}

    return (
        <View style={styles.container}>
             
        <TextInput
        style={{fontSize: 18, width: 200}}
        placeholder='keyword'
            onChangeText={text => setKeyword(text)}
            />

        <Button title="Find Movies" onPress= {getRepositories} />
        <FlatList
        data={data}
        renderItem={({ item }) =>
          <View style={styles.list}>
            <Text>{item.original_title}</Text>
            <Image style={{width: 50, height: 50}} source={{uri: URL + item.poster_path }}/>
          </View>
        }
      />

        </View>
        );
}
    
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: {
      flex: 2,
  
    }
  });