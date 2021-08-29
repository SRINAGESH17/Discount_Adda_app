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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import {useIsFocused} from '@react-navigation/native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  slide: {
    height: windowHeight * 0.4,
    width: windowWidth,
    backgroundColor: '#fff',
  },
  slideImage: {
    width: windowWidth,
    height: windowHeight * 0.4,
  },
  slideTitle: {
    position: 'absolute',
    top: windowHeight * 0.01,
    right: windowWidth * 0.2,
    width: windowWidth * 0.6,
    height: windowHeight * 0.05,
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
    borderRadius: 4,
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

const value = [
  {
    value: '20% off on all the products of the store.',
  },
  {
    value: '30% off on all the products of the store.',
  },
  {
    value: '50% off on all the products of the store.',
  },
  {
    value: '10% off on all the products of the store.',
  },
  {
    value: '40% off on all the products of the store.',
  },
];

export default function Mystore({navigation}) {
  const [index, setIndex] = useState(0);

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const [storetype, setstoretype] = useState('');

  const [userPost, setUserPosts] = useState([]);
  // Category states

  //fashion category
  const [menfashion, setmenfashion] = useState('');
  const [womenfashion, setwomenfashion] = useState('');
  const [kidfashion, setkidfashion] = useState('');
  const [beauty, setbeauty] = useState('');
  // foot wear
  const [menfootwear, setmenfootwear] = useState('');
  const [womenfootwear, setwomenfootwear] = useState('');
  // home category
  const [home, sethome] = useState('');
  // medical category
  const [medicine, setmedicine] = useState('');

  const [loading, setLoading] = useState(false);

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
    const isNoMansLand = 0.4 < distance;

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
  useEffect(() => {
    if (isFocused) {
      firestore()
        .collection('about')
        .doc(uid)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists === false) {
            navigation.replace('EditStore');
          }
          if (documentSnapshot.exists) {
            console.log('User data: ', documentSnapshot.data());
            setAbout(documentSnapshot.data().About);
          }
        })
        .then(() => post());
    }
  }, [isFocused]);

  async function post() {
    firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        const userData = documentSnapshot.data();
        setContact(userData.contact);
        setAddress(userData.address);
      });
    firestore()
      .collection('StoreName')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setName('Add Name');
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setName(documentSnapshot.data().StoreName);
          setstoretype(documentSnapshot.data().storetype);
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
        // console.log('id of the post: ', posts);
        setUserPosts(posts);
      });

    // category section

    // fashion section
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('MenFashion')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setmenfashion(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setmenfashion(documentSnapshot.data().menfashion);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('WomenFashion')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setwomenfashion(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setwomenfashion(documentSnapshot.data().womenfashion);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('MenFashion')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setkidfashion(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setkidfashion(documentSnapshot.data().kids);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('Beauty')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setbeauty(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setbeauty(documentSnapshot.data().beauty);
        }
      });
    // footWear section
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('FootWear')
      .doc(auth().currentUser.uid)
      .collection('MenFootWear')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setmenfootwear(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setmenfootwear(documentSnapshot.data().menfootwear);
        }
      });
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('FootWear')
      .doc(auth().currentUser.uid)
      .collection('WomenFootWear')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setwomenfootwear(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setwomenfootwear(documentSnapshot.data().womenfootwear);
        }
      });
    // home sectionTitle
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('HomeCategory')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          sethome(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          sethome(documentSnapshot.data().home);
        }
      });
    // medical
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Medical')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists === false) {
          setmedicine(null);
        }
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setmedicine(documentSnapshot.data().medical);
        }
      });
  }

  return (
    <>
      <View>
        <TouchableOpacity
          style={styles.slideSubtitle}
          onPress={() => navigation.navigate('EditDetails')}>
          <Image source={require('../../assets/edit.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/back.png')} />
        </TouchableOpacity>
        <View style={styles.slideTitle}>
          <Text style={{fontSize: 19, color: '#000'}}>{name} Stores</Text>
        </View>
        {userPost.length === 0 ? (
          <View>
            <Text>Please upload the images</Text>
          </View>
        ) : null}
      </View>
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
            paddingBottom: windowHeight * 0.1,
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
            <Text>{storetype} Store</Text>
            <View flexDirection="row">
              <Text>Vashi</Text>
              <Text style={{marginStart: 20, color: '#008B3E'}}>Open now</Text>
            </View>
            <View
              flexDirection="row"
              style={{marginTop: 10, alignItems: 'center'}}>
              <Image source={require('../../assets/call.png')} />
              <Text
                style={{
                  borderWidth: 1,
                  padding: 10,
                  marginStart: 10,
                  width: 170,
                  borderColor: '#ccc',
                  borderRadius: 5,
                }}>
                +91 {contact}
              </Text>
            </View>
          </View>
          {/* About the store */}
          <View style={{marginTop: 5}}>
            <Text style={styles.txt}>ABOUT THE STORE</Text>
            <Text
              style={{
                borderWidth: 1,
                padding: 10,
                width: windowWidth * 0.92,
                borderColor: '#ccc',
                borderRadius: 5,
              }}>
              {about}
            </Text>
          </View>
          {/* Discount on products */}

          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              borderWidth: 1,
              padding: 10,
              width: windowWidth * 0.92,
              borderColor: '#ccc',
              borderRadius: 5,
              justifyContent: 'flex-start',
              height: windowHeight * 0.17,
            }}>
            <FlatList
              data={value}
              nestedScrollEnabled
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item: data}) => {
                return (
                  <View
                    flexDirection="row"
                    style={{
                      alignItems: 'center',
                      width: windowWidth,
                      marginBottom: 10,
                    }}>
                    <Image source={require('../../assets/discount.png')} />
                    <Text style={{marginStart: 10}}>{data.value}</Text>
                  </View>
                );
              }}
            />
          </View>
          {/* Types of products */}
          <Text style={styles.txt}>TYPES OF PRODUCTS</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              flexWrap: 'wrap',
              flexDirection: 'row',
              padding: 5,
            }}>
            {menfashion === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{menfashion}</Text>
              </View>
            )}
            {womenfashion === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{womenfashion}</Text>
              </View>
            )}
            {kidfashion === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{kidfashion}</Text>
              </View>
            )}
            {beauty === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{beauty}</Text>
              </View>
            )}
            {menfootwear === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{menfootwear}</Text>
              </View>
            )}
            {womenfootwear === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{womenfootwear}</Text>
              </View>
            )}
            {home === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{home}</Text>
              </View>
            )}
            {medicine === null ? null : (
              <View style={styles.txtproducts}>
                <Text style={styles.textCategory}>{medicine}</Text>
              </View>
            )}
          </View>
          <Text style={styles.txt}>ADDRESS</Text>
          <View
            flexDirection="row"
            style={{marginTop: 10, alignItems: 'center'}}>
            <Image source={require('../../assets/map.png')} />
            <Text
              style={{
                borderWidth: 1,
                padding: 10,
                marginStart: 10,
                width: windowWidth * 0.84,
                borderColor: '#ccc',
                borderRadius: 5,
              }}>
              {address}
            </Text>
          </View>
        </ScrollView>
      </View>
      <Pagination index={index}></Pagination>
    </>
  );
}
