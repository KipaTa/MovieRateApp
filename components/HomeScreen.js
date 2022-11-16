import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('mymoviedb.db');



export default function HomeScreen( ) {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [movieId, setMovieId] = useState('');

  const [mymovies, setMymovies] = useState([]);

  const URL = 'https://image.tmdb.org/t/p/original/';

  // SQLite MyMoviesille
  useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists mymovie (id integer primary key not null, original_title text;');
  }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into mymovie (original_title) values (?);',
        [movieDetails.original_title]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from mymovie;', [], (_, { rows }) =>
        setMymovies(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => { tx.executeSql('delete from mymovie where id = ?;', [id]);
    }, null, updateList
    )
  }


// Etusivun elokuvalistaus


useEffect(() => {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US&page=1`)
  .then(response => response.json())
  .then(data => setData(data.results))
  .catch(error => { 
      Alert.alert('Error', error);
  });
}, [])

// Yksittäisen elokuvan tiedot näytettäväksi
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
              <Button onPress={saveItem} title="Save to MyMovies" />
              <Ionicons
                name='close'
                size={24}
                onPress={() => setModalOpen(false)}
              />
          </View>
          </Modal>

          <View style={styles.myMovies}>
            <Text>MyMovies</Text>

              <FlatList
                data={mymovies}
                keyExtractor={item => item.id.toString()} 
                renderItem={({ item }) =>
                  <View style={styles.list}>
                  <Text>{item.original_title}</Text>
                  <Text style={{color: 'blue'}} onPress={() => deleteItem(item.id)}>Delete</Text>
                  </View>
                }
              />

        </View>
         

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
      },
      myMovies: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }

    });

