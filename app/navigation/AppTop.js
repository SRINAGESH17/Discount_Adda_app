import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FashionCategory from '../screens/MyStore/Category/FashionCategory';
import HomeCategory from '../screens/MyStore/Category/HomeCategory';
import MedicneCategory from '../screens/MyStore/Category/MedicneCategory';
import FootWear from '../screens/MyStore/Category/FootWear';

const Tab = createMaterialTopTabNavigator();

function AppTop(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Fashion" component={FashionCategory} />
      <Tab.Screen name="Home Essentials" component={HomeCategory} />
      <Tab.Screen name="Medicine" component={MedicneCategory} />
      <Tab.Screen name="Foot Wear" component={FootWear} />
    </Tab.Navigator>
  );
}

export default AppTop;
