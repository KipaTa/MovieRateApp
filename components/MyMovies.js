import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MyMovies( ) {
    return (
        <View style={styles.container}>
          <Text>My movies!!</Text>
          <Text>Käytä tähän swipelistiä...</Text>
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