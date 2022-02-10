import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FashionCategory from '../screens/MyStore/Category/ShoppingPersonalCare';
import HomeCategory from '../screens/MyStore/Category/DailyNeed';
import MedicneCategory from '../screens/MyStore/Category/MedicneCategory';
import Repair from '../screens/MyStore/Category/Repair';
import Resturants from '../screens/MyStore/Category/Resturants';
import Wedding from '../screens/MyStore/Category/Wedding';
import Travel from '../screens/MyStore/Category/Travel';
import Fitness from '../screens/MyStore/Category/Fitness';
import GeneralCategory from '../screens/MyStore/Category/GeneralCategory';
import EducationCategory from '../screens/MyStore/Category/EducationCategory';

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
      <Tab.Screen name="Food" component={Resturants} />
      <Tab.Screen name="Shops" component={GeneralCategory} />
      <Tab.Screen name="Shopping & Personal Care" component={FashionCategory} />
      <Tab.Screen name="Education" component={EducationCategory} />
      <Tab.Screen name="Daily Needs" component={HomeCategory} />
      <Tab.Screen name="Medical" component={MedicneCategory} />
      <Tab.Screen name="Repair" component={Repair} />
      <Tab.Screen name="Wedding" component={Wedding} />
      <Tab.Screen name="Travel" component={Travel} />
      <Tab.Screen name="Fitness" component={Fitness} />
    </Tab.Navigator>
  );
}

export default AppTop;
