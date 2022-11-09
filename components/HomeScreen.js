import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen( ) {

  const [data, setData] = useState([]);

  const URL = 'https://image.tmdb.org/t/p/original/';

useEffect(() => {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US&page=1`)
  .then(response => response.json())
  .then(data => setData(data.results))
  .catch(error => { 
      Alert.alert('Error', error);
  });
}, [])

const pressHandler = (id) => {
  console.log(id);
}


    return (
        <View style={styles.container}>
          <View style={styles.banner}>
            <Text style={styles.bannertext}>MovieRate</Text>
          </View>
          <View style={styles.new}>
            <Text>Popular Movies</Text>
            <Text>https://reactnative-examples.com/numcolumns-in-react-native-flatlist/</Text>
              
              <FlatList
                data={data}
                numColumns={2}
                renderItem={({ item }) =>
                  <View style={styles.list}>
                    
                    <TouchableOpacity onPress={()=>pressHandler(item.id)}><Image style={{width: 70, height: 100}} source={{uri: URL + item.poster_path }}/></TouchableOpacity>
                  </View>
              }
              />
              
          </View>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      banner: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'mediumturquoise',
      },
      bannertext: {
        color: 'gold',
        fontFamily: 'Copperplate-Bold',
        fontSize: 50, 
      },
      new: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }

    });

