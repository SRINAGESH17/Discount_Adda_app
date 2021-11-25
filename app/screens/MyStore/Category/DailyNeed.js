import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ListView from '../../../components/ListView';
import HeaderAlert from '../../../components/HeaderAlert';
import {windowHeight} from '../../../utils/Dimentions';
import {API_URL, endPoints} from '../../../Config/Config';

function HomeCategory({navigation}) {
  const [data, setdata] = useState([]);
  const [ondemand, setOnDemand] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [demand, setdemand] = useState('');
  // daily Need
  const [dailyNeed, setDailyNeed] = useState('');

  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    gethome();
  }, []);

  const gethome = () => {
    const menurl = `${API_URL}/${endPoints.DailyNeed.dailyNeed}`;
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
    const demandValue = `${API_URL}/${endPoints.DailyNeed.demand}`;
    fetch(demandValue)
      .then(res => res.json())
      .then(resJson => {
        setOnDemand(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
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

  const onChangeValueDemand = (itemSelected, index) => {
    const newData = ondemand.map(item => {
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
    setOnDemand(newData);
  };

  // submit  buttons
  const submit = () => {
    const listSelected = data.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.item + ', ';
    });
    // Alert.alert(contentAlert);
    // console.log(contentAlert);
    if (contentAlert.length === 0) {
      setVisible(true);
    }

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('DailyNeed')
      .doc(auth().currentUser.uid)
      .set({
        DailyNeed: contentAlert.length === 0 ? null : contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(false);
        gethome();
      })
      .catch(() => alert('category   not updated'));
  };

  const submitDemand = () => {
    const listSelected = ondemand.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.item + ', ';
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
      .collection('ondemand')
      .doc(auth().currentUser.uid)
      .set({
        Demand: contentAlert.length === 0 ? null : contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(false);
        gethome();
      })
      .catch(() => alert('category   not updated'));
  };

  // render items for flatlist

  const renderItemDaily = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.item}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValue(item, index)}
          style={{}}
        />
      </View>
    );
  };

  const renderItemDemand = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.item}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValueDemand(item, index)}
          style={{}}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {visible && (
        <HeaderAlert text="Selected categories are empty" value={true} />
      )}
      <List.AccordionGroup>
        <List.Accordion
          title="Home Essentials"
          id="1"
          right={props => <Text {...props}>+</Text>}>
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
              <View style={{marginBottom: 10}}>
                <Button color="#D02824" title="submit" onPress={submit} />
              </View>
              {isLoading ? (
                <ActivityIndicator
                  animating={true}
                  color="#D02824"
                  size="large"
                />
              ) : (
                <FlatList
                  data={data}
                  style={{height: windowHeight * 0.5}}
                  renderItem={renderItemDaily}
                  keyExtractor={item => `key-${item.id}`}
                />
              )}
            </View>
          )}
        </List.Accordion>
        <View style={{marginTop: 10, flex: 0.8}}>
          <List.Accordion
            title="On Demand Service"
            id="2"
            right={props => <Text {...props}>+</Text>}>
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
                <View style={{marginBottom: 10}}>
                  <Button
                    color="#D02824"
                    title="submit"
                    onPress={submitDemand}
                  />
                </View>
                {isLoading ? (
                  <ActivityIndicator
                    animating={true}
                    color="#D02824"
                    size="large"
                  />
                ) : (
                  <FlatList
                    data={ondemand}
                    style={{height: windowHeight * 0.5}}
                    renderItem={renderItemDemand}
                    keyExtractor={item => `key-${item.id}`}
                  />
                )}
              </View>
            )}
          </List.Accordion>
        </View>
      </List.AccordionGroup>
      <ListView list={dailyNeed} sublist={demand} />
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

export default HomeCategory;
