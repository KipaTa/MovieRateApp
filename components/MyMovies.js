import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';


export default function MyMovies( {route} ) {
  

    return (
        <View style={styles.container}>
          <Text>My movies!!</Text>
          <Text>Käytä tähän swipelistiä...</Text>

          <FlatList
                data={route.params}
                keyExtractor={item => item.id.toString()} 
                renderItem={({ item }) =>
                  <View style={styles.list}>
                  <Text>{item.original_title}</Text>
                  <Text style={{color: 'blue'}} onPress={() => deleteItem(item.id)}>Delete</Text>
                  </View>
                }
              />

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