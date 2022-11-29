import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import {mymovies} from './HomeScreen';


export default function MyMovies( ) {
  
  

    return (
        <View style={styles.container}>
          <Text>My movies!!</Text>
          <View style={styles.myMovies}>
          <Text>My Movies</Text>
          <FlatList 
                data={mymovies}
                keyExtractor={item => item.id.toString()} 
                renderItem={({ item }) =>
                  <View style={styles.list}>
                  <Text>Nimi: {item.original_title}, {item.release_date} </Text>
                  <Image style={{width: 50, height: 50}} source={{uri: URL + item.poster_path }}/>
                  <Text style={{color: 'blue'}} onPress={() => deleteItem(item.id)}>Delete</Text>
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
    });