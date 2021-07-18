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
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Button, Headline, Title} from 'react-native-paper';
import Task from '../../components/Task';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

function EditDetails({navigation}) {
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const picture = () => {
    setVisible(!isVisible);
  };

  const aboutsave = db => {
    setLoading(true);
    Keyboard.dismiss();
    firestore()
      .collection('about')
      .doc(auth().currentUser.uid)
      .set({
        About: db.about,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .catch(() => alert('about  not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const category = async () => {
    setLoading(true);
    firestore()
      .collection('mystore')
      .doc(auth().currentUser.uid)
      .collection('mycategory')
      .add({
        task,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const PickImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        // const source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log('source', source);
        setImage(source);
      }
    });
  };
  const Camera = () => {
    const options = {
      title: 'Select Profile Pic',
      maxWidth: 1000,
      maxHeight: 1000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        // const source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log('source', source);
        setImage(source);
      }
    });
  };
  const uploadImage = async () => {
    const {uri} = image;

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    console.log('filename', filename);
    console.log('uploadUri', uploadUri);
    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(
      `post/${auth().currentUser.uid}/${filename}`,
    );
    const tasks = storageRef.putFile(uploadUri);

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
        'Your photo has been uploaded to Firebase Cloud Storage!',
      );

      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const submitpost = async () => {
    const imageurl = await uploadImage();
    console.log('imageurl: ' + imageurl);
    firestore()
      .collection('mystore')
      .doc(auth().currentUser.uid)
      .collection('userPosts')
      .add({
        imageurl,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .catch(() => alert('profile pics not updated'));
  };

  return (
    <View style={styles.container}>
      <Headline>Please all the following details</Headline>
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
              about: '',
            }}
            onSubmit={values => aboutsave(values)}
            validationSchema={yup.object().shape({
              about: yup
                .string()
                .min(10)
                .required('Please, provide details about your shop!'),
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
                <Title>Add about the Shop</Title>

                <TextInput
                  placeholder="About the store"
                  numberOfLines={3}
                  multiline={true}
                  value={values.about}
                  onChangeText={handleChange('about')}
                  onBlur={() => setFieldTouched('about')}
                  style={{
                    borderColor: '#ccc',
                    width: windowWidth * 0.9,
                    borderWidth: 1,
                    textAlignVertical: 'top',
                  }}
                  placeholderTextColor="#000000"
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
                  style={{
                    backgroundColor: '#D02824',
                    marginTop: 10,
                    width: 150,
                    marginBottom: 30,
                  }}>
                  Submit
                </Button>
              </View>
            )}
          </Formik>
        )}
      </View>

      {/* adding photo modal */}
      <Modal
        isVisible={isVisible}
        animationOut="fadeOutDown"
        animationIn="fadeInUp">
        <View
          style={[
            styles.modalcontainer,
            {
              flex: 0.8,
              width: windowWidth * 0.9,
            },
          ]}>
          <View>
            <View flexDirection="row">
              <TouchableOpacity style={styles.selectButton} onPress={PickImage}>
                <Text style={styles.buttonText}>Pick an image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectButton} onPress={Camera}>
                <Text style={styles.buttonText}>Open Camera</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              {image !== null ? (
                <Image source={{uri: image.uri}} style={styles.imageBox} />
              ) : null}
              {uploading ? (
                <View style={styles.progressBarContainer}>
                  <Progress.Bar progress={transferred} width={300} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={submitpost}>
                  <Text style={styles.buttonText}>Upload image</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={picture} style={styles.done}>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Title>Add picture of Shop</Title>
      <View style={styles.box}>
        <TouchableOpacity
          onPress={picture}
          style={{backgroundColor: '#D02824', padding: 15, marginTop: 10}}>
          <Text style={{color: 'white'}}>Click here </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Category')}
        style={{
          backgroundColor: '#D02824',
          padding: 15,
          marginTop: 100,
          alignItems: 'center',
          borderRadius: 20,
        }}>
        <Text style={{color: 'white'}}>Add Subcategory</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  modalcontainer: {
    flex: 0.7,
    backgroundColor: '#E8EAED',
    padding: 20,
  },
  txt: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  tasksWrapper: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginStart: 15,
    marginVertical: 5,
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 30,
  },
  spinnerTextStyle: {
    color: '#D02824',
  },
  box: {
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    width: windowWidth * 0.92,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'flex-start',
    height: windowHeight * 0.13,
  },
  done: {
    backgroundColor: '#D02824',
    padding: 10,
    marginTop: 10,
    width: 80,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'center',
  },
  piccontainer: {
    flexGrow: 1,
    backgroundColor: '#2C3A4A',
    padding: 20,
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#D02824',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
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
});

export default EditDetails;
