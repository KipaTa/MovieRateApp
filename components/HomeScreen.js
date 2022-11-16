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

  const URL = 'https://image.tmdb.org/t/p/original/';

  const [mymovies, setMymovies] = useState([]);

  // SQLite MyMoviesille
  useEffect(() => {
    db.transaction(tx => {
      //tx.executeSql('DROP TABLE IF EXISTS mymovie', []);
      tx.executeSql('create table if not exists mymovie (id integer primary key not null, original_title text, release_date text, poster_path text);');
    }, null, updateList);
    }, []);
  
    const saveItem = () => {
      db.transaction(tx => {
        tx.executeSql('insert into mymovie (original_title, release_date, poster_path) values (?,?,?);',
          [movieDetails.original_title, movieDetails.release_date, movieDetails.poster_path]);
      }, null, updateList)
     
      //console.log(mymovies)
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
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US`)
    .then(response => response.json())
    .then((json) => setMovieDetails(json))
    .catch(error => { 
        Alert.alert('Error', error);
    });
    setModalOpen(true);
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
              <Text>Original language: {movieDetails.original_language}</Text>
              <Button onPress={saveItem} title="Save to MyMovies" />
              <Ionicons
                name='close'
                size={24}
                onPress={() => setModalOpen(false)}
              />
          </View>
          </Modal>

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
      },
      

    });

