import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View,  FlatList, Image, Button, Modal, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('mymoviedb.db');
const db2 = SQLite.openDatabase('ratedmovie.db');

export default function MyMovies( ) {

  const [mymovies, setMymovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [testiNimi, setTestiNimi] = useState('');
  const [testiPva, setTestiPva] = useState('');
  const [testiUri, setTestiUri] = useState('');

  const [testiId, setTestiId] = useState('');
 

  const [defaultRating, setDefaultRating] = useState(1);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png'
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'

  const URL = 'https://image.tmdb.org/t/p/original/';
  

  useFocusEffect(
    React.useCallback(() => {
        updateList();
        
    }, [])
  );
  
  //Mymovie SQLite
  useEffect(() => {
    db.transaction(tx => {
      //tx.executeSql('DROP TABLE IF EXISTS mymovie', []);
      tx.executeSql('create table if not exists mymovie (id integer primary key not null, original_title text, release_date text, poster_path text, rate text);');
    }, null, updateList);
    }, []);


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

  //RatedMovie SQLite
  useEffect(() => {
    db2.transaction(tx => {
      //tx.executeSql('DROP TABLE IF EXISTS ratedmovie', []);
      tx.executeSql('create table if not exists ratedmovie (id integer primary key not null, original_title text, release_date text, poster_path text, rate text);');
    }, null, updateList2);
    }, []);


  const updateList2 = () => {
    db2.transaction(tx => {
      tx.executeSql('select * from ratedmovie;', [], (_, { rows }) =>
        setRatedMovies(rows._array)
      );
    }, null, null);
  }

  const deleteItem2 = (id) => {
    db2.transaction(
      tx => { tx.executeSql('delete from ratedmovie where id = ?;', [id]);
    }, null, updateList2
    )
  }

  const saveItem2 = () => {
    db2.transaction(tx => {
      tx.executeSql('insert into ratedmovie (original_title, release_date, poster_path, rate) values (?,?,?,?);',
        [testiNimi, testiPva, testiUri, defaultRating]);
    }, null, null)
    updateList2();    
  }


  //Arvionti
  const rateItem = (id) => {
    setTestiId(id);
    setModalOpen(true);
  }

  const showAlert = () =>{
    Alert.alert(
       'Rated! Movie added to Rated Movies list'
    )
  }

  const CustomRatingBar = () => {
    return (
      <View style = {styles.customRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}
              >
                <Image
                  style={styles.starImgStyle} 
                  source={
                    item <= defaultRating
                    ? {uri: starImgFilled}
                    : {uri: starImgCorner}
                  }            
                 />

              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  

    return (
        <View style={styles.container}>

          <View style={styles.myMovies}>
          <Text style={styles.h2}>My Movies</Text>
          <FlatList 
                data={mymovies}
                keyExtractor={item => item.id.toString()} 
                renderItem={({ item }) =>
                  <View style={styles.list}>
                    <Image style={{width: 50, height: 75}} source={{uri: URL + item.poster_path }}/>
                      <View>
                        <Text>Title: {item.original_title}  </Text>
                        <Text>Release date: {item.release_date} </Text>
                        
                      </View>
                    <Text style={{color: 'blue'}} onPress={() => deleteItem(item.id) }>Delete</Text>
                    <Text style={{color: 'orange'}} onPress={() => { rateItem(item.id); setTestiNimi(item.original_title); setTestiPva(item.release_date); setTestiUri(item.poster_path); }}>Rate</Text>
                  </View>
                }
              />

         </View>

         

         <Modal visible={modalOpen} animationType='slide'>
              <View style={styles.modalContent}>
             <Text>Your rate for {testiNimi} </Text> 
              
              <CustomRatingBar/>

              <Text style={styles.textStyle}>
                {defaultRating + ' / ' + maxRating.length}

              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.buttonStyle}
                onPress={() => {
                  showAlert();
                  saveItem2();
                  deleteItem(testiId);
                  setModalOpen(false);
                  }
                  }
                >
                  <Text>Save rating!</Text>
                </TouchableOpacity>
              
              <Ionicons
                name='close'
                size={24}
                onPress={() => setModalOpen(false)}
              />
          </View>
          </Modal>


          <View style={styles.rated}>
          <Text style={styles.h2}>Rated Movies</Text>
          <FlatList 
                data={ratedMovies.sort((a, b) => a.rate < b.rate) }
                
                renderItem={({ item }) =>
                  <View style={styles.list}>
                    <Image style={{width: 50, height: 75}} source={{uri: URL + item.poster_path }}/>
                      <View>
                        <Text>Title: {item.original_title}  </Text>
                        <Text>Release date: {item.release_date} </Text>
                        <Text>Rate: {parseInt(item.rate)} / 5</Text>
                      </View>
                    <Text style={{color: 'blue'}} onPress={() => deleteItem2(item.id)}>Delete</Text>
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
      },
 
      h2: {
        color: 'darkgrey',
        fontSize: 30
      },
      
      myMovies: {
        flex: 1,
        backgroundColor: 'lightyellow',
      },
      
      list: {
        flexDirection: 'row',
        padding: 5,
      },

      rated: {
        flex: 1,
      },
      modalContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginTop: 20
      },

    buttonStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      padding: 15,
      backgroundColor: 'green'
    }

      
    });