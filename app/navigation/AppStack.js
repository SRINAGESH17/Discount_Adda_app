import React from 'react';
import {Image, View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import MerchantHome from '../screens/MerchantHome';
import ScanCard from '../screens/Card/ScanCard';
import QrScan from '../screens/Card/QrScan';
import Bill from '../screens/Card/Bill';
import TranscationRecord from '../screens/TranscationRecord';
import Details from '../screens/Card/Details';
import Register from '../screens/Register/Register';
import Profile from '../screens/Profile/Profile';
import EditProfile from '../screens/Profile/EditProfile';
import VerifyCode from '../screens/Register/VerifyCode';
import Mystore from '../screens/MyStore/Mystore';
import EditStore from '../screens/MyStore/EditStore';
import Success from '../screens/Profile/Success';
import DrawerContent from './DrawerContent';
import Settings from '../screens/Settings/Settings';
import EditDetails from '../screens/MyStore/EditDetails';
import AppTop from './AppTop';
import ViewImage from '../screens/MyStore/ViewImage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = ({navigation}) => (
  <Stack.Navigator mode="card">
    {/* Merchant Home section */}
    <Stack.Screen
      name="Home"
      component={MerchantHome}
      options={{
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginStart: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={require('../assets/menu.png')}
                style={{width: 25, height: 25, marginEnd: 10}}
              />
            </TouchableOpacity>
            <Image
              source={require('../assets/discounticon.png')}
              style={{width: 50, height: 50}}
            />
          </View>
        ),
        headerTitle: ' ',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => console.log('notfy')}
            style={{marginEnd: 10}}>
            <Image
              source={require('../assets/notification.png')}
              style={{width: 30, height: 35}}
            />
          </TouchableOpacity>
        ),
        headerShown: true,
      }}
    />
    {/* Register section */}
    <Stack.Screen
      name="register"
      component={Register}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="verify"
      component={VerifyCode}
      options={{
        headerShown: false,
      }}
    />
    {/* Scan card section */}
    <Stack.Screen name="Scan" component={ScanCard} />
    <Stack.Screen
      name="Qr"
      component={QrScan}
      options={{
        headerShown: true,
        headerTitle: ' ',
      }}
    />
    <Stack.Screen
      name="Bill"
      component={Bill}
      options={{
        headerShown: true,
        headerTitle: ' ',
      }}
    />
    <Stack.Screen
      name="Details"
      component={Details}
      options={{
        headerShown: true,
        headerTitle: ' ',
      }}
    />
    {/* Report section */}
    <Stack.Screen
      name="Report"
      component={TranscationRecord}
      options={{
        headerShown: true,
        headerTitle: ' ',
      }}
    />

    {/* profile section */}
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{
        headerShown: false,
        headerTitle: 'Profile',
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        headerShown: true,
        headerTitle: 'Profile',
      }}
    />
    <Stack.Screen
      name="Success"
      component={Success}
      options={{
        headerShown: false,
        headerTitle: 'Profile',
      }}
    />
    {/* store section */}
    <Stack.Screen
      name="Mystore"
      component={Mystore}
      options={{
        headerShown: false,
        headerTitle: '',
      }}
    />
    <Stack.Screen
      name="EditStore"
      component={EditStore}
      options={{
        headerShown: true,
        headerTitle: 'Add Store Details',
      }}
    />
    <Stack.Screen
      name="EditDetails"
      component={EditDetails}
      options={{
        headerShown: true,
        headerTitle: 'Edit business Details',
      }}
    />
    <Stack.Screen
      name="Category"
      component={AppTop}
      options={{
        headerShown: true,
        headerTitle: 'Categories',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Mystore')}
            style={{marginEnd: 10}}>
            <Image
              source={require('../assets/home.png')}
              style={{width: 30, height: 35}}
            />
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="ViewImage"
      component={ViewImage}
      options={{
        headerShown: true,
        headerTitle: '',
      }}
    />
    {/* Setting section */}
    <Stack.Screen
      name="Settings"
      component={Settings}
      options={{
        headerShown: true,
        headerTitle: 'Settings',
      }}
    />
  </Stack.Navigator>
);
const AppStack = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={MainStack} />
    </Drawer.Navigator>
  );
};

export default AppStack;
