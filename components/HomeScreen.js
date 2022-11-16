import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from'expo-sqlite';


export default function HomeScreen( ) {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [movieId, setMovieId] = useState('');

  const [myMovies, setMyMovies] = useState([]);

  const URL = 'https://image.tmdb.org/t/p/original/';

useEffect(() => {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US&page=1`)
  .then(response => response.json())
  .then(data => setData(data.results))
  .catch(error => { 
      Alert.alert('Error', error);
  });
}, [])

const pressHandler = () => {
  setModalOpen(true);
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US`)
    .then(response => response.json())
    .then((json) => setMovieDetails(json))
    .catch(error => { 
        Alert.alert('Error', error);
    });
    
}

    return (
        <View style={styles.container}>
          <View style={styles.banner}>
            <Text style={styles.bannertext}>MovieRate</Text>
          </View>

          <Modal visible={modalOpen} animationType='slide'>
              <View style={styles.modalContent}>
              
              <Text>{movieDetails.original_title}</Text>
              <Image style={{width: 150, height: 240, margin: 8}} source={{uri: URL + movieDetails.poster_path }}/>
              <Text>Overview: {movieDetails.overview}</Text>
              <Text>Release Date: {movieDetails.release_date}</Text>
              
              <Ionicons
                name='close'
                size={24}
                onPress={() => setModalOpen(false)}
              />
          </View>
          </Modal>

          <View style={styles.new}>
            <Text style={styles.h2}>Popular Movies</Text>
                  
              <FlatList
                data={data}
                numColumns={2}
                renderItem={({ item }) =>
                  <View style={styles.list}>
                    
                    <TouchableOpacity onPress={() => {setMovieId(item.id); pressHandler();}}>
                      <Image style={{width: 150, height: 240, margin: 8}} source={{uri: URL + item.poster_path }}/>
                    </TouchableOpacity>
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
        justifyContent: 'center',
        backgroundColor: 'mediumturquoise',
        margin: 20,
        padding: 30,
        
      },
      bannertext: {
        color: 'gold',
        fontFamily: 'Copperplate-Bold',
        fontSize: 50, 
      },
      new: {
        flex: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      h2: {
        color: 'darkgrey',
        fontFamily: 'Copperplate-Bold',
        fontSize: 30
      },
      modalContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }

    });

