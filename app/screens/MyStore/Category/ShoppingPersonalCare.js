import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Image, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ListView from '../../../components/ListView';
import HeaderAlert from '../../../components/HeaderAlert';
import {windowHeight} from '../../../utils/Dimentions';
import {API_URL, endPoints} from '../../../Config/Config';

function FashionCategory({navigation}) {
  const [beauty, setBeauty] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [data, setdata] = useState([]);

  const [clothesfootwear, setClothesFootwear] = useState('');
  const [personal, setPersonalCare] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => {
    setExpanded(!expanded);
  };
  const [expanded2, setExpanded2] = React.useState(false);

  const handlePress2 = () => {
    setExpanded2(!expanded2);
  };

  useEffect(() => {
    getfashion();
    // list();
  }, []);

  const getfashion = () => {
    const menurl = `${API_URL}/${endPoints.shopping.shoppinglist}`;
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    const beautysurl = `${API_URL}/${endPoints.shopping.beauty}`;
    fetch(beautysurl)
      .then(res => res.json())
      .then(resJson => {
        setBeauty(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('clothesfootwear')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setClothesFootwear('Empty list for FootWear & Clothes');
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
          setPersonalCare('Empty List for PersonalCare');
        }
        if (documentSnapshot.exists) {
          setPersonalCare(documentSnapshot.data().beauty);
        }
      });
  };

  // on change value

  const onChangeValue = (itemSelected, index) => {
    const newData = data.map(item => {
      if (item.id === itemSelected.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {
        ...item,
        selected: item.selected,
      };
    });
    setdata(newData);
  };

  const onChangeValueBeauty = (itemSelected, index) => {
    const newData = beauty.map(item => {
      if (item.id === itemSelected.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {
        ...item,
        selected: item.selected,
      };
    });
    setBeauty(newData);
  };

  // submit  buttons
  const submit = () => {
    const listSelected = data.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.value + ', ';
    });
    // Alert.alert(contentAlert);
    console.log(contentAlert);
    if (contentAlert.length === 0) {
      setVisible(true);
    }

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('clothesfootwear')
      .doc(auth().currentUser.uid)
      .set({
        clothesfootwear: contentAlert.length === 0 ? null : contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        getfashion();
        setLoading(false);
      })
      .catch(() => alert('category   not updated'));
  };

  const submitBeauty = () => {
    const listSelected = beauty.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.value + ', ';
    });

    console.log('vlue', contentAlert.length);
    if (contentAlert.length === 0) {
      setVisible(true);
    }
    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('PersonalCare')
      .doc(auth().currentUser.uid)
      .set({
        beauty: contentAlert.length === 0 ? null : contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        getfashion();
        setLoading(false);
      })
      .catch(() => alert('category   not updated'));
  };

  // render items for flatlist

  const renderItemMen = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.value}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValue(item, index)}
        />
      </View>
    );
  };

  const renderItemBeauty = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.value}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValueBeauty(item, index)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {visible && (
        <HeaderAlert text="Selected categories are empty" value={true} />
      )}
      <List.Section>
        <List.Accordion
          title="Clothes & FootWear"
          id="1"
          expanded={expanded}
          onPress={handlePress}
          right={props =>
            expanded ? (
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/withdraw.png')}
                {...props}
              />
            ) : (
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/up-arrow.png')}
                {...props}
              />
            )
          }>
          {loading ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18}}>Details submitted</Text>
              <ActivityIndicator
                animating={true}
                color="#D02824"
                size="large"
              />
            </View>
          ) : (
            <View>
              {isLoading ? (
                <ActivityIndicator
                  animating={true}
                  color="#D02824"
                  size="large"
                />
              ) : (
                <FlatList
                  data={data}
                  style={{height: windowHeight * 0.4}}
                  renderItem={renderItemMen}
                  keyExtractor={item => `key-${item.id}`}
                />
              )}
              <Button color="#D02824" title="submit" onPress={submit} />
            </View>
          )}
        </List.Accordion>

        <View style={styles.Accordion}>
          <List.Accordion
            title="Beauty & Personal Care"
            id="4"
            expanded={expanded2}
            onPress={handlePress2}
            right={props =>
              expanded ? (
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../../assets/withdraw.png')}
                  {...props}
                />
              ) : (
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../../assets/up-arrow.png')}
                  {...props}
                />
              )
            }>
            {loading ? (
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>Details submitted</Text>
                <ActivityIndicator
                  animating={true}
                  color="#D02824"
                  size="large"
                />
              </View>
            ) : (
              <View>
                {isLoading ? (
                  <ActivityIndicator
                    animating={true}
                    color="#D02824"
                    size="large"
                  />
                ) : (
                  <FlatList
                    data={beauty}
                    renderItem={renderItemBeauty}
                    keyExtractor={item => `key-${item.id}`}
                  />
                )}

                <Button color="#D02824" title="submit" onPress={submitBeauty} />
              </View>
            )}
          </List.Accordion>
        </View>
      </List.Section>
      <ListView
        list={clothesfootwear}
        sublist={personal}
        styletitle={{marginTop: 200}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Accordion: {
    marginTop: 10,
  },
  // box: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingStart: 20,
  //   paddingEnd: 20,
  //   paddingVertical: 5,
  // },
  // check: {
  //   width: 20,
  //   height: 20,
  // },
});

export default FashionCategory;
