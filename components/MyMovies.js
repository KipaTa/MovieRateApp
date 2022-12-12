import React from 'react';
import { useState, useEffect } from 'react';
import { Text, View,  FlatList, Image, Modal, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Button } from'react-native-elements';
import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('mymoviedb.db');
const db2 = SQLite.openDatabase('ratedmovie.db');

export default function MyMovies( ) {

  const [mymovies, setMymovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [ratedName, setRatedName] = useState('');
  const [ratedDate, setRatedDate] = useState('');
  const [ratedUri, setRatedUri] = useState('');
  const [ratedId, setRatedId] = useState('');
 

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
        [ratedName, ratedDate, ratedUri, defaultRating]);
    }, null, null)
    updateList2();    
  }


  //Arvionti
  const rateItem = (id) => {
    setRatedId(id);
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

          <View style={styles.banner}>
              <Text style={styles.bannertext}>MovieRate</Text>
          </View>  

          <View style={styles.myMovies}>
            <Text style={styles.h2}>My Movies</Text>
            
            <FlatList 
                  data={mymovies}
                  keyExtractor={item => item.id.toString()} 
                  renderItem={({ item }) =>
                    <View style={styles.list}>
                      <Image style={{width: 50, height: 75}} source={{uri: URL + item.poster_path }}/>
                        
                        <View style={styles.teksti}>
                          <Text style={styles.text}>Title: {item.original_title}  </Text>
                          <Text style={styles.text}>Release date: {item.release_date} </Text> 
                        </View>

                      <Button buttonStyle={{ backgroundColor: "gold" }} style={{paddingRight: 5}} onPress={() => { rateItem(item.id); setRatedName(item.original_title); setRatedDate(item.release_date); setRatedUri(item.poster_path); }} title="Rate"></Button>
                      <Button onPress={() => deleteItem(item.id) } title="Delete"></Button>
                      
                    </View>
                  }
              />
         </View>

         <Modal visible={modalOpen} animationType='slide'>
            <View style={styles.modalContent}>
             <Text style={styles.h2}>Your rate for </Text>
             <Text style={styles.h2}> {ratedName} </Text> 
             <Image style={{width: 150, height: 240}} source={{uri: URL + ratedUri }}/>
              
              <CustomRatingBar/>

              <Text style={styles.textStyle}>
                {defaultRating + ' / ' + maxRating.length}
              </Text>

              <Button
                title='Save Rating'
                style={styles.buttonStyle}
                onPress={() => {
                  showAlert();
                  saveItem2();
                  deleteItem(ratedId);
                  setModalOpen(false);
                  }
                  }
                />
                
              
              <Ionicons
                name='close'
                size={24}
                color='white'
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
                        <View style={styles.teksti}>
                          <Text style={styles.text}>Title: {item.original_title}  </Text>
                          <Text style={styles.text}>Release date: {item.release_date} </Text>
                        </View>
                        <Text style={{color: 'gold', fontSize: 20}}>{parseInt(item.rate)} / 5</Text>
                      <Button style={{paddingLeft: 18}} onPress={() => deleteItem2(item.id)} title="Delete"></Button>
                    </View>
                  }
                />
         </View>  

        </View>
      );
    }

    