import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function FootWear({navigation}) {
  const [women, setWomen] = useState([]);
  const [data, setdata] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getfootwear();
  }, []);

  const getfootwear = () => {
    const menurl = 'https://nodetestrestapi.herokuapp.com/menfoot';
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    const womenurl = 'https://nodetestrestapi.herokuapp.com/womenfoot';
    fetch(womenurl)
      .then(res => res.json())
      .then(resJson => {
        setWomen(resJson);
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
  const onChangeValueWomen = (itemSelected, index) => {
    const newData = women.map(item => {
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
    setWomen(newData);
  };

  // submit  buttons
  const submit = () => {
    const listSelected = data.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.value + ', ' + '\n';
    });
    // Alert.alert(contentAlert);
    console.log(contentAlert);

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('FootWear')
      .doc(auth().currentUser.uid)
      .collection('MenFootWear')
      .doc(auth().currentUser.uid)
      .set({
        menfootwear: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })

      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const submitWomen = () => {
    const listSelected = women.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.value + '\n';
    });

    console.log(contentAlert);
    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('FootWear')
      .doc(auth().currentUser.uid)
      .collection('WomenFootWear')
      .doc(auth().currentUser.uid)
      .set({
        womenfootwear: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })

      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
          style={{}}
        />
      </View>
    );
  };
  const renderItemWomen = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.value}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValueWomen(item, index)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <List.AccordionGroup>
        <List.Accordion
          title="Men FootWear"
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
              {isLoading ? (
                <ActivityIndicator
                  animating={true}
                  color="#D02824"
                  size="large"
                />
              ) : (
                <FlatList
                  data={data}
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
            title="Women FootWear"
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
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <FlatList
                    data={women}
                    renderItem={renderItemWomen}
                    keyExtractor={item => `key-${item.id}`}
                  />
                )}

                <Button color="#D02824" title="submit" onPress={submitWomen} />
              </View>
            )}
          </List.Accordion>
        </View>
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

export default FootWear;
