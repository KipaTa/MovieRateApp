import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './components/HomeScreen';
import MyMovies from './components/MyMovies';
import FindMovies from './components/FindMovies';



const screenOptions = ({ route }) => ({
  tabBarStyle:{
    backgroundColor:'black',
  },
  headerStyle: {
    backgroundColor: 'black',
  },
  headerTitleStyle: {
    color: 'white'
  },
  tabBarIcon: ({ color, size }) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'md-home';
    } else if (route.name === 'Find Movies') {
      iconName = 'search';
    } else if (route.name === 'My Movies') {
      iconName = 'checkbox-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
});

const Tab = createBottomTabNavigator();


export default function App() {
  return (
   
      <NavigationContainer>
        
          <Tab.Navigator screenOptions={screenOptions} >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Find Movies" component={FindMovies} />
            <Tab.Screen name="My Movies" component={MyMovies} />
          </Tab.Navigator>

      </NavigationContainer>
 
  );
}
