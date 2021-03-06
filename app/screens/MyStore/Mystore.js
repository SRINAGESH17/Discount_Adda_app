import React, {useCallback, memo, useRef, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {useIsFocused} from '@react-navigation/native';
import TextLessMoreView from '../../components/TextLessMoreView';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  slide: {
    height: windowHeight * 0.4,
    width: windowWidth,
    backgroundColor: '#fff',
  },
  slideImage: {
    width: '100%',
    height: '85%',
  },
  slideTitle: {
    position: 'absolute',
    top: windowHeight * 0.01,
    right: windowWidth * 0.2,
    width: windowWidth * 0.6,
    height: windowHeight * 0.08,
    alignItems: 'center',
  },
  slideSubtitle: {
    position: 'relative',
    left: windowWidth * 0.85,
  },
  back: {
    position: 'absolute',
    right: windowWidth * 0.88,
    top: windowHeight * 0.01,
  },

  pagination: {
    position: 'absolute',
    top: windowHeight * 0.43,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#D02824',
    width: 20,
  },
  paginationDotInactive: {backgroundColor: '#ECA9A7'},

  carousel: {flex: 1},
  container: {
    backgroundColor: '#fff',
    padding: 15,
    flex: 1.6,
  },
  txt: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  txtproducts: {
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    margin: 5,
    padding: 5,
  },
  textCategory: {
    fontSize: 15,
  },
});

const slideList = Array.from({length: 4}).map((_, i) => {
  return {
    id: i,
    image: `https://picsum.photos/1440/2842?random=${i}`,
    title: 'Harish Stores',
  };
});

export default function Mystore({navigation}) {
  const [index, setIndex] = useState(0);

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [discount, setdiscount] = useState(0);
  const [discountText, setdiscountText] = useState('');

  const [userPost, setUserPosts] = useState([]);

  // Status
  const [Status, setStatus] = useState('');
  const [StatusValue, setStatusValue] = useState(null);
  // Category states

  // category
  const [resturants, setResturants] = useState('');
  const [clothesfootwear, setClothesFootwear] = useState('');
  const [personal, setPersonalCare] = useState('');
  const [demand, setdemand] = useState('');
  // daily Need
  const [dailyNeed, setDailyNeed] = useState('');
  const [medical, setMedical] = useState('');
  // home category
  const [repair, setRepair] = useState('');
  // medical category
  const [wedding, setWedding] = useState('');
  const [travel, setTravel] = useState('');
  const [fitness, setFitness] = useState('');

  const [shops, setshops] = useState('');

  const [education, seteducation] = useState('');
  const [emergency, setEmergency] = useState('');

  const [loading, setLoading] = useState(null);
  const [isModalVisible, setModalVisible] = useState(true);

  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback(event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = distance > 0.4;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  const Slide = memo(function Slide({data}) {
    return (
      <>
        <Pressable
          onPress={() =>
            navigation.navigate('ViewImage', {
              url: data.imageurl,
            })
          }
          style={styles.slide}>
          <Image source={{uri: data.imageurl}} style={styles.slideImage} />
        </Pressable>
      </>
    );
  });
  function Pagination({index}) {
    return (
      <View style={styles.pagination} pointerEvents="none">
        {userPost.map((_, i) => {
          return (
            <View
              key={i}
              style={[
                styles.paginationDot,
                index === i
                  ? styles.paginationDotActive
                  : styles.paginationDotInactive,
              ]}
            />
          );
        })}
      </View>
    );
  }
  // const flatListOptimizationProps = {
  //   initialNumToRender: 0,
  //   maxToRenderPerBatch: 1,
  //   removeClippedSubviews: true,
  //   scrollEventThrottle: 16,
  //   windowSize: 2,
  //   keyExtractor: useCallback(s => String(s.id), []),
  //   getItemLayout: useCallback(
  //     (_, index) => ({
  //       index,
  //       length: windowWidth,
  //       offset: index * windowWidth,
  //     }),
  //     [],
  //   ),
  // };

  const renderItem = useCallback(function renderItem({item}) {
    return <Slide data={item} />;
  }, []);

  const {uid} = auth().currentUser;
  const isFocused = useIsFocused();

  // let CategoryList = [];

  useEffect(() => {
    if (isFocused) {
      setLoading(true);

      firestore()
        .collection('about')
        .doc(uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists === false) {
            navigation.replace('AddStore');
          }
          if (documentSnapshot.exists === true) {
            setAbout(documentSnapshot.data().About);
            Post();
          }
        })
        .then(() => {
          setModalVisible(false);
          setLoading(false);
        });
    }
  }, [isFocused]);

  const Post = () => {
    firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        const userData = documentSnapshot.data();
        setContact(userData.contact);
        firestore()
          .collection('StoreName')
          .doc(uid)
          .update({
            contactNumber: userData.contact,
          })
          .catch(() => console.log('line 125 Contact not updated'));
      });
    firestore()
      .collection('StoreName')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setName('');
        }
        if (documentSnapshot.exists) {
          setName(documentSnapshot.data().StoreName);
          setAddress(documentSnapshot.data().address);
          setdiscount(documentSnapshot.data().discount);
          setdiscountText(documentSnapshot.data().discountstatus);
          documentSnapshot.data().address === null
            ? Alert.alert('Please add address')
            : null;
        }
      });

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
        firestore()
          .collection('StoreName')
          .doc(auth().currentUser.uid)
          .update({
            shopimage: posts[0].imageurl,
          })
          .catch(() => alert('Store image could not be updated'));
        console.log('shop image', posts[0].imageurl);
        setUserPosts(posts);
      });

    // Status messages
    firestore()
      .collection('mystore')
      .doc(auth().currentUser.uid)
      .collection('status')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setStatus('Close');
          setStatusValue(false);
        }
        if (documentSnapshot.exists) {
          setStatus(documentSnapshot.data().status);
          setStatusValue(documentSnapshot.data().value);
        }
      });
    // category section

    // fashion section
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Resturants')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setResturants(null);
        }
        if (documentSnapshot.exists) {
          setResturants(documentSnapshot.data().restauranttype);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('clothesfootwear')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setClothesFootwear(null);
        }
        if (documentSnapshot.exists) {
          setClothesFootwear(documentSnapshot.data().clothesfootwear);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('PersonalCare')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setPersonalCare(null);
        }
        if (documentSnapshot.exists) {
          setPersonalCare(documentSnapshot.data().beauty);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('ondemand')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setdemand(null);
        }
        if (documentSnapshot.exists) {
          setdemand(documentSnapshot.data().Demand);
        }
      });
    // footWear section
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('DailyNeed')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setDailyNeed(null);
        }
        if (documentSnapshot.exists) {
          setDailyNeed(documentSnapshot.data().DailyNeed);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Medical')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setMedical(null);
        }
        if (documentSnapshot.exists) {
          setMedical(documentSnapshot.data().medical);
        }
      });
    // home sectionTitle
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('repair')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setRepair(null);
        }
        if (documentSnapshot.exists) {
          setRepair(documentSnapshot.data().repair);
        }
      });
    // wedding
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('wedding')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setWedding(null);
        }
        if (documentSnapshot.exists) {
          setWedding(documentSnapshot.data().wedding);
        }
      });

    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('travel')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setTravel(null);
        }
        if (documentSnapshot.exists) {
          setTravel(documentSnapshot.data().travel);
        }
      });

    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('fitness')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setFitness(null);
        }
        if (documentSnapshot.exists) {
          setFitness(documentSnapshot.data().fitness);
        }
      });

    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('shops')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setshops(null);
        }
        if (documentSnapshot.exists) {
          setshops(documentSnapshot.data().shops);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('education')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          seteducation(null);
        }
        if (documentSnapshot.exists) {
          seteducation(documentSnapshot.data().education);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Emergency')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setEmergency(null);
        }
        if (documentSnapshot.exists) {
          setEmergency(documentSnapshot.data().emergency);
        }
      });
  };

  const CategoryData = () => {
    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .update({
        Category: [
          resturants === null ? null : 'resturants',
          clothesfootwear === null ? null : 'shopping',
          personal === null ? null : 'personalcare',
          demand === null ? null : 'demand',
          dailyNeed === null ? null : 'dailyneed',
          medical === null ? null : 'medical',
          repair === null ? null : 'repair',
          wedding === null ? null : 'wedding',
          travel === null ? null : 'travel',
          fitness === null ? null : 'fitness',
          shops === null ? null : 'generalshops',
          education === null ? null : 'education',
          emergency === null ? null : 'emergency',
        ],
      });
  };

  const callNumber = () => {
    let phoneNumber = `tel:${contact}`;

    Linking.openURL(phoneNumber);
  };

  return (
    <>
      <View style={{height: 60}}>
        <TouchableOpacity
          style={styles.slideSubtitle}
          onPress={() =>
            navigation.navigate('EditDetails', {
              AboutStore: about,
              NameStore: name,
              StatusStore: StatusValue,
            })
          }>
          <Image source={require('../../assets/edit.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/back.png')} />
        </TouchableOpacity>
        <View style={styles.slideTitle}>
          <Text style={{fontSize: name.length > 20 ? 15 : 19, color: '#000'}}>
            {name}
          </Text>
        </View>
        {userPost.length === 0 ? (
          <View>
            <Text>Please upload the images</Text>
          </View>
        ) : null}
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1}}>
          <Text>Hello!</Text>
        </View>
      </Modal>
      <FlatList
        data={userPost}
        style={styles.carousel}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: windowHeight * 0.04,
          }}>
          {/* View as customer */}
          <View
            style={{
              position: 'absolute',
              right: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{marginEnd: 10, color: '#707070'}}>
              View as customer
            </Text>
            <TouchableOpacity>
              <Image source={require('../../assets/view.png')} />
            </TouchableOpacity>
          </View>
          {/* Grocery Store */}

          <View style={{marginTop: 10}}>
            <View flexDirection="row">
              <Text>Status</Text>
              <Text style={{marginStart: 20, color: '#008B3E'}}>
                {Status} now
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => callNumber()}
              style={{
                marginTop: 10,
                alignItems: 'center',
                // backgroundColor: 'yellow',
                flexDirection: 'row',
              }}>
              <Image source={require('../../assets/call.png')} />
              <Text
                style={{
                  borderWidth: 1,
                  padding: 10,
                  marginStart: 10,
                  width: 150,
                  borderColor: '#ccc',
                  borderRadius: 5,
                }}>
                +91 {contact}
              </Text>
            </TouchableOpacity>
          </View>
          {/* About the store */}
          <View style={{marginTop: 5}}>
            <Text style={styles.txt}>About The Store</Text>

            <TextLessMoreView text={about} targetLines={2} />
          </View>
          {/* Discount on products */}
          <View style={{marginTop: 5}}>
            <Text style={styles.txt}>Discounts </Text>
            <Text
              style={{
                borderWidth: 1,
                padding: 10,
                width: windowWidth * 0.92,
                borderColor: '#ccc',
                borderRadius: 5,
              }}>
              {discount}% {discountText}
            </Text>
          </View>

          {/* Types of products */}
          <Text style={styles.txt}>Types Of Products</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              flexWrap: 'wrap',
              flexDirection: 'row',
              padding: 5,
            }}>
            {resturants === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{resturants}</Text>
              </View>
            )}
            {clothesfootwear === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{clothesfootwear}</Text>
              </View>
            )}
            {personal === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{personal}</Text>
              </View>
            )}
            {demand === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{demand}</Text>
              </View>
            )}
            {dailyNeed === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{dailyNeed}</Text>
              </View>
            )}
            {medical === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{medical}</Text>
              </View>
            )}
            {repair === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{repair}</Text>
              </View>
            )}
            {wedding === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{wedding}</Text>
              </View>
            )}

            {travel === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{travel}</Text>
              </View>
            )}
            {fitness === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{fitness}</Text>
              </View>
            )}
            {shops === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{shops}</Text>
              </View>
            )}
            {education === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{education}</Text>
              </View>
            )}
            {emergency === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{emergency}</Text>
              </View>
            )}
          </View>
          {CategoryData()}
          <Text style={styles.txt}>ADDRESS</Text>
          <View
            flexDirection="row"
            style={{marginTop: 10, alignItems: 'center'}}>
            <Image source={require('../../assets/map.png')} />
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                borderWidth: 1,
                padding: 10,
                marginStart: 10,
                width: windowWidth * 0.84,
                borderColor: '#ccc',
                borderRadius: 5,
              }}>
              <Text style={{fontWeight: '500'}}>{address}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Pagination index={index} />
    </>
  );
}
