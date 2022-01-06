import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Platform,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import firestore from '@react-native-firebase/firestore';
import FormButton from '../../components/FormButton';
import FormText from '../../components/FormText';

import {AuthContext} from '../../navigation/AuthProvider';

function Profile({navigation}) {
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [mail, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [img, setImg] = useState(null);

  const {uid} = auth().currentUser;

  const [date, setdate] = useState('');
  const [joindate, setjoindate] = useState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        const userData = documentSnapshot.data();
        setName(userData.fname);
        setLast(userData.lname);
        setEmail(userData.email);
        setAddress(userData.address);
        setContact(userData.contact);
        setImg(userData.userImg);
        setdate(userData.dob);
        setjoindate(
          new Date(userData.createdAt.toDate())
            .toDateString()
            .split(' ')
            .slice(1)
            .join(' '),
        );

        setLoading(false);
      });
  }, [uid]);

  const {signOut, logout} = useContext(AuthContext);

  const DeleteDetails = () => {
    firestore()
      .collection('DeletedUsers')
      .doc(uid)
      .set({
        Name: name + last,
        Email: mail,
        Contact: contact,
        Address: address,
        Joindate: date,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        firestore().collection('users').doc(uid).delete();
        firestore().collection('mystore').doc(uid).delete();
        firestore().collection('StoreName').doc(uid).delete();
        firestore().collection('about').doc(uid).delete();
        const storageRef = storage().ref(`post/${auth().currentUser.uid}`);
        const profileref = storage().ref(`profile/${auth().currentUser.uid}`);
        storageRef.delete();
        profileref.delete();
      })
      .finally(() => signOut());
  };

  const DeleteAccount = () => {
    Alert.alert(
      //title
      'Delete Account',
      //body
      'Are you sure you want to delete the Account ?',
      [
        {
          text: 'Yes',
          onPress: () => ConfirmDeleteAccount(),
        },
        {
          text: 'No',
        },
      ],
      {cancelable: true},
    );
  };
  const ConfirmDeleteAccount = () => {
    Alert.alert(
      //title
      'Confirm Delete Account',
      //body
      'It will delete all ypur exisiting data from account?',
      [
        {
          text: 'Yes',
          onPress: () => DeleteDetails(),
        },
        {
          text: 'No',
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <>
      <View
        style={{
          backgroundColor: '#2C3A4A',
          height: 38,
        }}>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/left-arrow.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{
            padding: 10,
            flexDirection: 'row',
            position: 'absolute',
            right: 10,
          }}>
          <Image source={require('../../assets/editprofile.png')} />
          <Text
            style={{
              color: '#fff',
              marginEnd: 10,
              marginStart: 10,
              fontSize: 16,
            }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={'Loading...'}
            size="large"
            color="#D02824"
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <View>
            <View style={styles.imgcontainer}>
              {img === null ? null : (
                <Image style={styles.image} source={{uri: img}} />
              )}
              <Text style={styles.imgtxt}>USER SINCE {joindate}</Text>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '50%'}}>
                  <FormText
                    title="First Name"
                    value={name}
                    style={{width: '95%'}}
                  />
                </View>
                <View style={{width: '50%'}}>
                  <FormText title="Last Name" value={last} />
                </View>
              </View>

              <FormText value={mail} title="Email" />

              <FormText title="Address" value={address} />
              <FormText title="Date of birth" value={date} />

              <View style={{flexDirection: 'row'}}>
                <View style={{width: '40%'}}>
                  <FormText
                    title="Mobile Number"
                    value={'+ 91             ⬇'}
                    style={{width: '85%'}}
                  />
                </View>
                <View style={{width: '55%'}}>
                  <FormText value={contact} />
                </View>
              </View>
            </View>
          </View>
        )}

        <FormButton buttonTitle="LogOut" onPress={() => logout()} />
        <FormButton
          buttonTitle="Delete Account"
          onPress={() => DeleteAccount()}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2C3A4A',
    alignItems: 'center',
    padding: 15,
  },
  imgcontainer: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  imgtxt: {
    color: '#fff',
    paddingTop: 10,
    fontSize: 16,
  },
  dob: {
    color: '#fff',
    fontSize: 20,
  },
  spinnerTextStyle: {
    color: '#D02824',
  },
});

export default Profile;
