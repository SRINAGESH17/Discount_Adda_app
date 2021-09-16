import React, {useState, useEffect} from 'react';
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
  ImageBackground,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';

import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Button, Headline, Title} from 'react-native-paper';
// import * as ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {useIsFocused} from '@react-navigation/native';
import {useCallback} from 'react/cjs/react.development';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

function EditDetails({navigation, route}) {
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [userPost, setUserPosts] = useState([]);

  const abc = route.params;
  // console.log('abs', abc);
  const deleteImage = () => {
    setModalVisible(!isModalVisible);
  };

  const picture = () => {
    setVisible(!isVisible);
  };
  const {uid} = auth().currentUser;
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      BusinessPic();
    }
  }, [isFocused]);

  const BusinessPic = () => {
    firestore()
      .collection('mystore')
      .doc(uid)
      .collection('userPosts')
      .orderBy('createdAt', 'asc')
      .get()
      .then(snapshot => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;

          return {id, ...data};
        });

        setUserPosts(posts);
      });
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

  const aboutstorename = db => {
    setLoading(true);
    Keyboard.dismiss();
    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .set({
        StoreName: db.storename,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .catch(() => alert('about  not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  //  image save
  const Camera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const PickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  // upload to firebase

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

      Alert.alert('Photo uploaded!', 'Your photo has been uploaded ');

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

  const deleteOption = postId => {
    //function to make two option alert
    Alert.alert(
      //title
      'Delete Image',
      //body
      'Are you sure you want to delete this image ?',
      [
        {
          text: 'Yes',
          onPress: () => deletepost(postId),
        },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const deletepost = postId => {
    console.log('post id: ', postId);
    firestore()
      .collection('mystore')
      .doc(auth().currentUser.uid)
      .collection('userPosts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const postimg = documentSnapshot.data().imageurl;

          console.log('postimg', postimg);
          const storageRef = storage().refFromURL(postimg);
          const imageRef = storage().ref(storageRef.fullPath);

          console.log(imageRef);

          imageRef
            .delete()
            .then(() => {
              console.log('it has deleted successfully');
              deleteFirestoreData(postId);
            })
            .catch(() => alert('delete  not updated'));
        }
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('mystore')
      .doc(auth().currentUser.uid)
      .collection('userPosts')
      .doc(postId)
      .delete()
      .then(() => alert('Successfully deleted'))
      .then(() => BusinessPic())
      .catch(() => alert('not deleted from firestore'));
  };

  return (
    <View style={styles.container}>
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
            }}
            onSubmit={values => aboutstorename(values)}
            validationSchema={yup.object().shape({
              storename: yup
                .string()
                .min(4)
                .required('Please, provide name of your business!'),
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
                <Title>Edit the Name of your business</Title>
                <TextInput
                  placeholder={abc.NameStore}
                  numberOfLines={1}
                  multiline={true}
                  maxLength={16}
                  value={values.storename}
                  onChangeText={handleChange('storename')}
                  onBlur={() => setFieldTouched('storename')}
                  style={{
                    borderColor: '#ccc',
                    width: windowWidth * 0.9,
                    borderWidth: 1,
                    textAlignVertical: 'top',
                    color: '#000',
                  }}
                  placeholderTextColor="#aaa"
                />
                {touched.storename && errors.storename && (
                  <Text style={{fontSize: 12, color: '#FF0D10'}}>
                    {errors.storename}
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
      <View>
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
                <Title>Edit details about the business</Title>
                <TextInput
                  placeholder={abc.AboutStore}
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
                    color: '#000',
                  }}
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
                <Image source={{uri: image}} style={styles.imageBox} />
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
            <Text style={{color: 'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* deleting modal */}
      <Modal
        isVisible={isModalVisible}
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
          <Title>Press on Image to Delete</Title>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: windowHeight * 0.55,
            }}>
            <ScrollView horizontal={true}>
              {userPost.length > 0 &&
                userPost.map((item, index) => {
                  return (
                    <Pressable
                      onPress={() => deleteOption(item.id)}
                      key={index}
                      style={{
                        marginBottom: 20,
                        borderWidth: 1,
                        width: 300,
                        height: 300,
                        marginHorizontal: 8,
                      }}>
                      <Image
                        style={{width: '100%', height: '100%'}}
                        source={{uri: item.imageurl}}
                      />
                      {/* <Button
                        onPress={() => console.log('delete')}
                        mode="contained"
                        style={{
                          backgroundColor: '#D02824',
                          marginTop: 10,
                          width: 150,
                          marginBottom: 30,
                        }}>
                        Delete
                      </Button> */}
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
          <TouchableOpacity onPress={deleteImage} style={styles.done}>
            <Text style={{color: 'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Picture edit */}
      <Title>Edit picture of business</Title>
      <View style={styles.box}>
        <TouchableOpacity
          onPress={picture}
          style={{
            backgroundColor: '#D02824',
            padding: 15,
            marginTop: 10,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white'}}>Add Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteImage}
          style={{
            backgroundColor: '#D02824',
            padding: 15,
            marginTop: 10,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white'}}>Delete Picture</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Category')}
        style={{
          backgroundColor: '#D02824',
          padding: 15,
          marginTop: 50,
          alignItems: 'center',
          borderRadius: 20,
        }}>
        <Text style={{color: 'white'}}>Add Categories</Text>
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
    justifyContent: 'space-around',
    height: windowHeight * 0.13,
    flexDirection: 'row',
  },
  done: {
    backgroundColor: '#D02824',
    padding: 10,
    marginTop: 30,
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
    backgroundColor: '#D02824',
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
