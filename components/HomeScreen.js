import React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Linking, FlatList, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles/Styles';

import { Input, Button } from'react-native-elements';



import * as SQLite from'expo-sqlite';


const db = SQLite.openDatabase('mymoviedb.db');

export default function HomeScreen( ) {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);

  const URL = 'https://image.tmdb.org/t/p/original/';

  // Tallenna elokuva MyMoviesille
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into mymovie (original_title, release_date, poster_path, rate) values (?,?,?,?);',
        [movieDetails.original_title, movieDetails.release_date, movieDetails.poster_path]);
    }, null, null)
    showAlert();
  }
  
  // Suositut elokuvalistaus
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US&page=1`)
    .then(response => response.json())
    .then(data => setData(data.results))
    .catch(error => { 
        Alert.alert('Error', error);
    });
  }, [])

// Yksittäisen elokuvan tiedot näytettäväksi Modalissa
  const pressHandler = (id) => {
  
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=2946b724eb284b32f9e52e2422dcb453&language=en-US`)
  .then(response => response.json())
  .then((json) => setMovieDetails(json))
  .catch(error => { 
      Alert.alert('Error', error);
  });
  setModalOpen(true);
  }



//Lähetä vinkkimaili
const sendMail = () => {
  //console.log(movieDetails)
  Linking.openURL(`mailto:?subject=Check this movie!&body=Hi!
  I found this cool movie! 
  Check the details 
  Title: ${movieDetails.original_title}
  Homepage: ${movieDetails.homepage} 
  
  with love, `)
 };

 //Alertti elokuvan lisäämisestä MyMoviesiin
 const showAlert = () =>{
  Alert.alert(
     'Saved succesfully to MyMovies!'
  )
  }

    return (
        <View style={styles.container}>
          

          <ScrollView>
          <View style={styles.banner}>
              <Text style={styles.bannertext}>MovieRate</Text>
          </View>  
          

          <Modal visible={modalOpen} animationType='slide'>
              <View style={styles.modalContent}>
              
              <Text style={styles.h2}>{movieDetails.original_title}</Text>
              <Image style={{width: 150, height: 240, margin: 10}} source={{uri: URL + movieDetails.poster_path }}/>
              <Text>Overview: {movieDetails.overview}</Text>
              <Text>Release Date: {movieDetails.release_date}</Text>
              <Text>Original language: {movieDetails.original_language}</Text>
              <Button onPress={saveItem} title="Save to MyMovies" />
              <Button onPress={sendMail} title="Tip a Friend!" />
              
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
                horizontal={true} 
                renderItem={({ item }) =>
                  <View style={styles.list}>
                    
                    <TouchableOpacity onPress={() => { pressHandler(item.id) }}>
                      <Image style={{width: 150, height: 240, margin: 8}} source={{uri: URL + item.poster_path }}/>
                    </TouchableOpacity>
                  </View>
                  }   
              />
          </View>

          </ScrollView>

        </View>
      );
    }

 

