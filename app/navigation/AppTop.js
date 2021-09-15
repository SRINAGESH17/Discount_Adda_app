import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FashionCategory from '../screens/MyStore/Category/FashionCategory';
import HomeCategory from '../screens/MyStore/Category/HomeCategory';
import MedicneCategory from '../screens/MyStore/Category/MedicneCategory';
import FootWear from '../screens/MyStore/Category/FootWear';
import Resturants from '../screens/MyStore/Category/Resturants';

const Tab = createMaterialTopTabNavigator();

function AppTop(props) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        tabStyle: {
          width: 'auto',
        },
        activeTintColor: '#D02824',
        inactiveTintColor: '#000',
      }}>
      <Tab.Screen name="Restaurants " component={Resturants} />
      <Tab.Screen name="Shopping & Personal Care" component={FashionCategory} />
      <Tab.Screen name="Daily Needs" component={HomeCategory} />
      <Tab.Screen name="Medicine" component={MedicneCategory} />
      <Tab.Screen name="Foot Wear" component={FootWear} />
    </Tab.Navigator>
  );
}

export default AppTop;
