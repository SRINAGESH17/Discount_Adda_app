import React, {useState, useEffect} from 'react';
import {
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
  Pressable,
  Switch,
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
  const [isaddress, setmodalAddress] = useState(false);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [userPost, setUserPosts] = useState([]);

  const [discount, setdiscount] = useState('');
  const [discountText, setdiscountText] = useState('');
  const [address, setaddress] = useState('');

  const [isEnabled, setIsEnabled] = useState(null);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    firestore()
      .collection('mystore')
      .doc(uid)
      .collection('status')
      .doc(uid)
      .set({
        status: isEnabled ? 'Close' : 'Open',
        value: isEnabled ? 'false' : 'true',
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .catch(() => alert('about  not updated'));
    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .update({
        status: isEnabled ? 'Close' : 'Open',
      })
      .catch(() => alert('about  not updated'));
  };

  const mystore = route.params;

  const Status = mystore.StatusStore;
  console.log('Value from store', mystore);

  const deleteImage = () => {
    setModalVisible(!isModalVisible);
  };

  const picture = () => {
    setVisible(!isVisible);
  };

  const addAddress = () => {
    setmodalAddress(!isaddress);
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
    firestore()
      .collection('StoreName')
      .doc(uid)
      .update({
        contactNumber: mystore.contact,
      })
      .catch(() => alert('about  not updated'));

    if (Status === 'true') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  };

  const aboutsave = db => {
    setLoading(true);
    Keyboard.dismiss();
    firestore()
      .collection('about')
      .doc(auth().currentUser.uid)
      .update({
        About: db.about,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => setLoading(false))
      .catch(() => alert('about  not updated'));
  };

  const aboutstorename = db => {
    setLoading(true);
    Keyboard.dismiss();

    console.log('discount', db.storename);
    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .update({
        StoreName: db.storename,
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => alert('about  not updated'));
  };

  const AddDiscountdetails = () => {
    setLoading(true);

    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .update({
        discount: discount.length === 0 ? mystore.Discountinfo : discount,
        discountstatus:
          discountText.length === 0 ? mystore.DiscountStatus : discountText,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => alert('about  not updated'));
  };
  const shopaddress = db => {
    Keyboard.dismiss();

    console.log('discount', discount);
    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .update({
        address: address,
      })
      .then(() => {
        Alert.alert('Successfully updated address');
      })
      .catch(() => alert('about  not updated'));
  };
  //  image save
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
      .then(() => BusinessPic())
      .catch(() => alert('profile pics not updated'));
  };

  // Delete the posts with the given options

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
    <ScrollView contentContainerStyle={styles.container}>
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
                  placeholder={mystore.NameStore}
                  numberOfLines={1}
                  multiline={true}
                  maxLength={40}
                  value={values.storename}
                  onChangeText={handleChange('storename')}
                  onBlur={() => setFieldTouched('storename')}
                  style={{
                    borderColor: '#ccc',
                    width: windowWidth * 0.9,
                    borderWidth: 1,
                    textAlignVertical: 'center',
                    borderRadius: 10,
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
                    borderRadius: 20,
                  }}>
                  Submit
                </Button>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    placeholder={'Discount value'}
                    value={discount}
                    keyboardType="number-pad"
                    maxLength={2}
                    onChangeText={txt => setdiscount(txt)}
                    style={{
                      borderColor: '#ccc',
                      width: windowWidth * 0.27,
                      borderWidth: 1,
                      textAlignVertical: 'center',
                      borderRadius: 10,
                      color: '#000',
                    }}
                    placeholderTextColor="#aaa"
                  />
                  <TextInput
                    placeholder={'on all products'}
                    value={discountText}
                    onChangeText={txt => setdiscountText(txt)}
                    style={{
                      borderColor: '#ccc',
                      width: windowWidth * 0.6,
                      borderWidth: 1,
                      textAlignVertical: 'center',
                      borderRadius: 10,
                      marginStart: 7,
                      color: '#000',
                    }}
                    placeholderTextColor="#aaa"
                  />
                </View>

                <Button
                  onPress={() => AddDiscountdetails()}
                  mode="contained"
                  style={{
                    backgroundColor: '#D02824',
                    marginTop: 10,
                    width: 150,
                    marginBottom: 30,
                    borderRadius: 20,
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
                  placeholder={mystore.AboutStore}
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
                    borderRadius: 20,
                  }}>
                  Submit
                </Button>
              </View>
            )}
          </Formik>
        )}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          padding: 8,
          marginBottom: 10,
        }}>
        <Title>Shop Status :</Title>
        <Switch
          trackColor={{false: '#767577', true: '#ECA9A7'}}
          thumbColor={isEnabled ? '#D02824' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          style={{
            transform: [{scaleX: 1.2}, {scaleY: 1.2}],
            marginHorizontal: 10,
          }}
          value={isEnabled}
        />
        <Text style={{fontSize: 15, color: '#000'}}>
          {isEnabled ? (
            <Text style={{fontSize: 15, color: '#FF0D10'}}>Open</Text>
          ) : (
            'Closed'
          )}
        </Text>
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
          <Text style={{color: 'white', fontWeight: '600'}}>Add Picture</Text>
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
      {/* Add address modal */}
      <Modal
        isVisible={isaddress}
        animationOut="fadeOutDown"
        animationIn="fadeInUp">
        <View
          style={{
            width: windowWidth * 0.9,
            height: windowHeight * 0.35,
            alignItems: 'center',
            backgroundColor: '#E8EAED',
            padding: 20,
            borderRadius: 10,
          }}>
          <Text>Edit Address</Text>
          <TextInput
            placeholder={'Add address'}
            value={address}
            onChangeText={txt => setaddress(txt)}
            style={{
              borderColor: '#ccc',
              width: windowWidth * 0.8,
              borderWidth: 1,
              textAlignVertical: 'top',
              color: '#000',
            }}
            placeholderTextColor="#aaa"
          />

          <Button
            onPress={shopaddress}
            mode="contained"
            style={{
              backgroundColor: '#D02824',
              marginTop: 10,
              width: 150,
              marginBottom: 30,
              borderRadius: 20,
            }}>
            Submit
          </Button>
          <TouchableOpacity onPress={addAddress} style={styles.done}>
            <Text style={{color: 'white'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={addAddress}
        style={{
          backgroundColor: '#D02824',
          padding: 15,
          marginTop: 10,
          borderRadius: 10,
          width: windowWidth * 0.3,
          alignItems: 'center',
        }}>
        <Text style={{color: 'white'}}>Edit Address</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Category')}
        style={{
          backgroundColor: '#D02824',
          padding: 10,
          marginTop: 50,
          alignItems: 'center',
          borderRadius: 20,
        }}>
        <Text style={{color: 'white', fontSize: 18}}>Add Categories</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
  modalcontainer: {
    flex: 0.7,
    backgroundColor: '#E8EAED',
    padding: 20,
    borderRadius: 10,
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
    marginTop: 20,
    width: 100,
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
