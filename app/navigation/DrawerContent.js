import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Avatar, Title, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from './AuthProvider';

function DrawerContent(props) {
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [img, setImg] = useState(null);

  const {uid} = auth().currentUser;

  const {logout} = useContext(AuthContext);

  useEffect(() => {
    // async function subscriber() {
    //   const userinfo = await firestore().collection('users').doc(uid).get();
    //   const userData = userinfo.data();
    //   // console.log('value of user', userData);

    // }
    const subscriber = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          null;
        }
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists === true) {
          // console.log('User data: ', documentSnapshot.data());
          const userData = documentSnapshot.data();
          setName(userData.fname);
          setLast(userData.lname);

          setImg(userData.userImg);
        }
      });

    // Stop listening for updates when no longer required

    return () => subscriber();
  }, []);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: 'column',
                marginTop: 15,

                alignItems: 'center',
              }}>
              <Avatar.Image
                source={{
                  uri: img,
                }}
                size={100}
              />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>
                  {name}
                  {last}
                </Title>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={() => (
                <Image
                  source={require('../assets/home.png')}
                  style={{width: 15, height: 15}}
                />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={() => (
                <Image
                  source={require('../assets/user.png')}
                  style={{width: 15, height: 15}}
                />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            {/* <DrawerItem
              icon={() => (
                <Image
                  source={require('../assets/settings.png')}
                  style={{width: 15, height: 15}}
                />
              )}
              label="Settings"
              onPress={() => {
                props.navigation.navigate('Settings');
              }}
            /> */}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          onPress={() => logout()}
          icon={() => (
            <Image
              source={require('../assets/logout.png')}
              style={{width: 15, height: 15}}
            />
          )}
          label="Log Out"
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});

export default DrawerContent;
