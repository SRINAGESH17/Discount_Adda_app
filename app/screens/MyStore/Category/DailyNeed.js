import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function HomeCategory({navigation}) {
  const [data, setdata] = useState([]);
  const [ondemand, setOnDemand] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gethome();
  }, []);

  const gethome = () => {
    const menurl = 'https://merchantitemlist.herokuapp.com/daily';
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
    const demand = 'https://merchantitemlist.herokuapp.com/demand';
    fetch(demand)
      .then(res => res.json())
      .then(resJson => {
        setOnDemand(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
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
      contentAlert = contentAlert + item.item + ', ' + '\n';
    });
    // Alert.alert(contentAlert);
    console.log(contentAlert);

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('DailyNeed')
      .doc(auth().currentUser.uid)
      .set({
        DailyNeed: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => alert('category   not updated'));
  };

  const submitDemand = () => {
    const listSelected = ondemand.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.item + ', ' + '\n';
    });
    // Alert.alert(contentAlert);
    console.log(contentAlert);

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('ondemand')
      .doc(auth().currentUser.uid)
      .set({
        Demand: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })

      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
                  renderItem={renderItemDaily}
                  keyExtractor={item => `key-${item.id}`}
                />
              )}
            </View>
          )}
        </List.Accordion>
        {/* <View style={{marginTop: 10}}> */}
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
                <Button color="#D02824" title="submit" onPress={submitDemand} />
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
                  renderItem={renderItemDemand}
                  keyExtractor={item => `key-${item.id}`}
                />
              )}
            </View>
          )}
        </List.Accordion>
        {/* </View> */}
      </List.AccordionGroup>
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
