import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function FashionCategory({navigation}) {
  const [women, setWomen] = useState([]);
  const [kids, setkids] = useState([]);
  const [beauty, setBeauty] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [data, setdata] = useState([]);

  useEffect(() => {
    getfashion();
    // list();
  }, []);

  const list = () => {
    const menurl = 'https://merchantitemlist.herokuapp.com/list';
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        console.log(`value from list`, resJson.list);
        setBeauty(resJson.list);
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  };

  const getfashion = () => {
    const menurl = 'https://merchantitemlist.herokuapp.com/shopping';
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    const womenurl = 'https://nodetestrestapi.herokuapp.com/womenfashion';
    fetch(womenurl)
      .then(res => res.json())
      .then(resJson => {
        setWomen(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    const kidsurl = 'https://nodetestrestapi.herokuapp.com/kidfashion';
    fetch(kidsurl)
      .then(res => res.json())
      .then(resJson => {
        setkids(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    const beautysurl = 'https://merchantitemlist.herokuapp.com/beauty';
    fetch(beautysurl)
      .then(res => res.json())
      .then(resJson => {
        setBeauty(resJson);
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

  const onChangeValuekids = (itemSelected, index) => {
    const newData = kids.map(item => {
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
    setkids(newData);
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
      contentAlert = contentAlert + item.value + ', ' + '\n';
    });
    // Alert.alert(contentAlert);
    console.log(contentAlert);

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('MenFashion')
      .doc(auth().currentUser.uid)
      .set({
        menfashion: contentAlert,
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
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('WomenFashion')
      .doc(auth().currentUser.uid)
      .set({
        womenfashion: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })

      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const submitkids = () => {
    const listSelected = kids.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.value + '\n';
    });

    console.log(contentAlert);
    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('Kids')
      .doc(auth().currentUser.uid)
      .set({
        kids: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })

      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const submitBeauty = () => {
    const listSelected = beauty.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.value + '\n';
    });

    console.log(contentAlert);
    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Fashion')
      .doc(auth().currentUser.uid)
      .collection('Beauty')
      .doc(auth().currentUser.uid)
      .set({
        beauty: contentAlert,
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
  const renderItemKids = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.value}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValuekids(item, index)}
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
      <List.AccordionGroup>
        <List.Accordion
          title="Clothes"
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
        {/* <View style={styles.Accordion}>
          <List.Accordion
            title="Women Clothes"
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
                  <ActivityIndicator
                    animating={true}
                    color="#D02824"
                    size="large"
                  />
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
        </View> */}

        {/* <View style={styles.Accordion}>
          <List.Accordion
            title="Kids Clothes"
            id="3"
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
                    data={kids}
                    renderItem={renderItemKids}
                    keyExtractor={item => `key-${item.id}`}
                  />
                )}

                <Button color="#D02824" title="submit" onPress={submitkids} />
              </View>
            )}
          </List.Accordion>
        </View> */}
        <View style={styles.Accordion}>
          <List.Accordion
            title="Beauty & Personal Care"
            id="4"
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

export default FashionCategory;
