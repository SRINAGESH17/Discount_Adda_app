import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {windowHeight, windowWidth} from '../../utils/Dimentions';

let status = [];

function Feedback({navigation}) {
  const [design, setdesign] = useState(false);
  const [bug, setbug] = useState(false);
  const [experience, setExperience] = useState(false);

  const [comment, setcomment] = useState('');
  const [Rating, setRating] = useState();

  const designbtn = () => {
    setdesign(!design);
    if (status.includes('DESIGN') === false) {
      status.push('DESIGN');
    }
  };

  const bugbtn = () => {
    setbug(!bug);
    if (status.includes('BUG') === false) {
      status.push('BUG');
    }
  };

  const experiencebtn = () => {
    setExperience(!experience);
    if (status.includes('EXPERIENCE') === false) {
      status.push('EXPERIENCE');
    }
  };

  function ratingCompleted(rating) {
    console.log('Rating is: ' + rating);
    setRating(rating);
  }

  const SubmitFeedback = async () => {
    console.log('design', design);
    if (design === false) {
      if (status.includes('DESIGN') === true) {
        var index = status.indexOf('DESIGN');
        status.splice(index, 1);
      }
    }
    if (bug === false) {
      if (status.includes('BUG') === true) {
        var index = status.indexOf('BUG');
        status.splice(index, 1);
      }
    }
    if (experience === false) {
      if (status.includes('EXPERIENCE') === true) {
        var index = status.indexOf('EXPERIENCE');
        status.splice(index, 1);
      }
    }

    if (Rating === undefined) {
      Alert.alert('Please select the Rating and improve');
    } else {
      const data = {
        comment: comment,
        rating: Rating,
        improve: status,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      };
      firestore()
        .collection('Feedback')
        .doc(auth().currentUser.uid)
        .set(data)
        .then(() => {
          Alert.alert('Feedback submitted successfully');
          navigation.goBack();
        })
        .catch(() => Alert.alert('category   not updated'));
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text
          style={{
            color: '#000',
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Your Opinion Matters to Us!
        </Text>
      </View>
      <AirbnbRating
        count={5}
        reviews={['VERY BAD!', 'BAD!', 'OKAYISH!', 'GOOD!', 'AMAZING!']}
        defaultRating={3}
        size={30}
        reviewSize={20}
        reviewColor={'#ccc'}
        // starImage={icons.unselect}
        onFinishRating={ratingCompleted}
        starContainerStyle={{
          // backgroundColor: 'yellow',
          width: windowWidth * 0.8,
          justifyContent: 'space-between',
          marginTop: 10,
        }}
        ratingContainerStyle={{
          // backgroundColor: 'red',
          marginBottom: 30,
        }}
      />

      <View style={{alignItems: 'center', marginTop: 15, marginBottom: 15}}>
        <Text
          style={{
            color: '#000',
            fontSize: 17,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Could you tell us where we can improve?
        </Text>
        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            // backgroundColor: 'yellow',
            marginBottom: 20,
            width: '90%',
          }}>
          <TouchableOpacity
            onPress={() => designbtn()}
            activeOpacity={0.5}
            style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/Design.png')}
              style={{
                width: 70,
                height: 70,
                tintColor: design ? '#D02824' : '#ccc',
              }}
            />
            <Text
              style={{
                color: design ? '#D02824' : '#000',
                marginTop: 10,
              }}>
              Design
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => bugbtn()}
            activeOpacity={0.5}
            style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/Bugs.png')}
              style={{
                width: 70,
                height: 70,
                tintColor: bug ? '#D02824' : '#ccc',
              }}
            />
            <Text
              style={{
                color: bug ? '#D02824' : '#000',
                marginTop: 10,
              }}>
              Bugs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => experiencebtn()}
            activeOpacity={0.5}
            style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/Experience.png')}
              style={{
                width: 70,
                height: 70,
                tintColor: experience ? '#D02824' : '#ccc',
              }}
            />
            <Text
              style={{
                color: experience ? '#D02824' : '#000',
                marginTop: 10,
              }}>
              Experience
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          color: '#000',
          fontSize: 17,
          fontWeight: 'bold',
          marginBottom: 10,
          marginEnd: 50,
        }}>
        Would you like to tell us more?
      </Text>
      <TextInput
        multiline={true}
        value={comment}
        numberOfLines={5}
        textAlign="left"
        onChangeText={txt => setcomment(txt)}
        textAlignVertical="top"
        placeholder="Tell us something more...."
        placeholderTextColor={'#ccc'}
        style={styles.text}
      />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={SubmitFeedback}
        style={{
          backgroundColor: '#D02824',
          paddingHorizontal: 60,
          padding: 5,
          borderRadius: 10,
          marginTop: 20,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 10,
  },
  text: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: windowWidth * 0.8,
    height: windowHeight * 0.2,
    padding: 10,
    color: '#000',
    borderRadius: 10,
  },
});
export default Feedback;
