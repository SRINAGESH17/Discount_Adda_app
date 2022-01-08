import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Button, Headline, Title} from 'react-native-paper';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

function AddStore({navigation}) {
  const [loading, setLoading] = useState(false);

  const [category, setcategory] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go Home page?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => navigation.navigate('Home')},
        ]);
        return true;
      };

      // Add Event Listener for hardwareBackPress
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  //  camera and picker
  const Camera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      // cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const PickImage = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      // cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };
  // upload image
  const uploadImage = async () => {
    const uri = image;

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    console.log('filename', filename);
    // console.log('uploadUri', uploadUri);
    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(
      `post/${auth().currentUser.uid}/${filename}`,
    );
    const tasks = storageRef.putFile(uri);

    const taskProgress = snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    };

    const taskError = snapshot => {
      //to check the error
      console.log(snapshot);
    };

    tasks.on('state_changed', taskProgress, taskError);

    try {
      await tasks;

      const url = storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      Alert.alert(
        'Photo uploaded!',
        'Your photo has been uploaded successfully!',
      );

      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  const SubmitDetails = async db => {
    Keyboard.dismiss();
    if (image === null) {
      Alert.alert('Please select a photo to upload for Submitting the Details');
    } else {
      setLoading(true);
      const imageurl = await uploadImage();
      // console.log('imageurl: ' + imageurl);
      firestore()
        .collection('mystore')
        .doc(auth().currentUser.uid)
        .collection('userPosts')
        .add({
          imageurl,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .catch(() => Alert.alert('profile pics not updated'));

      firestore()
        .collection('StoreName')
        .doc(auth().currentUser.uid)
        .set({
          StoreName: db.storename,
          address: db.address,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .catch(() => Alert.alert('StoreName not updated'));

      firestore()
        .collection('about')
        .doc(auth().currentUser.uid)
        .set({
          About: db.about,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => setcategory(true))
        .then(() => {
          setLoading(false);
          Alert.alert('Store Successfully created');
          navigation.goBack();
        })
        .catch(() => Alert.alert('about  not updated'));
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Headline>Please add the following Details</Headline>

      <View flexDirection="row">
        <TouchableOpacity style={styles.selectButton} onPress={PickImage}>
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectButton} onPress={Camera}>
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {image !== null ? (
          <View>
            <Image source={{uri: image}} style={styles.imageBox} />
            <TouchableOpacity
              style={[
                styles.selectButton,
                {alignSelf: 'center', marginTop: 10},
              ]}
              onPress={() => setImage(null)}>
              <Text style={styles.buttonText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : null}
      </View>

      <View style={{marginTop: 5}}>
        {loading ? (
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 18}}>Details submitted</Text>
            <LottieView
              autoPlay
              loop
              source={require('../../assets/Animations/loading.json')}
              autoSize
            />
          </View>
        ) : (
          <Formik
            initialValues={{
              storename: '',
              address: '',
              about: '',
            }}
            onSubmit={values => SubmitDetails(values)}
            validationSchema={yup.object().shape({
              storename: yup
                .string()
                .min(4)
                .required('Please, provide name of your business!'),
              address: yup
                .string()
                .min(4)
                .required('Please, provide address of your business!'),
              about: yup
                .string()
                .min(10)
                .required('Please, provide details about your business!'),
            })}>
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              <View>
                <Title>Add Name</Title>

                <View>
                  <TextInput
                    placeholder="Name of the business"
                    multiline={true}
                    value={values.storename}
                    onChangeText={handleChange('storename')}
                    onBlur={() => setFieldTouched('storename')}
                    style={styles.txt}
                    placeholderTextColor="#aaa"
                    maxLength={40}
                  />
                  {touched.storename && errors.storename && (
                    <Text style={{fontSize: 12, color: '#FF0D10'}}>
                      {errors.storename}
                    </Text>
                  )}
                  <Title>Add Address of the business</Title>

                  <TextInput
                    placeholder="Address of the business"
                    multiline={true}
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={() => setFieldTouched('address')}
                    style={styles.txt}
                    placeholderTextColor="#aaa"
                  />
                  {touched.address && errors.address && (
                    <Text style={{fontSize: 12, color: '#FF0D10'}}>
                      {errors.address}
                    </Text>
                  )}
                </View>
                <Title>Add details about the business</Title>
                <TextInput
                  placeholder="About the business"
                  numberOfLines={3}
                  multiline={true}
                  value={values.about}
                  onChangeText={handleChange('about')}
                  onBlur={() => setFieldTouched('about')}
                  style={styles.txt}
                  placeholderTextColor="#aaa"
                />
                {touched.about && errors.about && (
                  <Text style={{fontSize: 12, color: '#FF0D10'}}>
                    {errors.about}
                  </Text>
                )}
                <Button
                  disabled={!isValid}
                  onPress={handleSubmit}
                  mode="contained"
                  style={styles.submitButton}>
                  Submit
                </Button>
              </View>
            )}
          </Formik>
        )}
      </View>

      {/* adding photo modal */}

      {category ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('Category')}
          style={styles.categoryButton}>
          <Text style={{color: 'white'}}>Add Subcategory</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  modalcontainer: {
    flex: 0.7,
    backgroundColor: '#E8EAED',
    padding: 20,
  },
  txt: {
    borderColor: '#ccc',
    width: windowWidth * 0.85,
    borderRadius: 7,
    borderWidth: 1,
    textAlignVertical: 'top',
    color: '#000',
    marginEnd: 10,
  },

  selectButton: {
    borderRadius: 15,
    width: 150,
    height: 50,
    backgroundColor: '#D02824',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: windowWidth * 0.89,
    height: windowHeight * 0.4,
  },
  submitButton: {
    backgroundColor: '#D02824',
    marginTop: 20,
    width: 250,
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: '#D02824',
    padding: 15,
    marginTop: 40,
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default AddStore;
