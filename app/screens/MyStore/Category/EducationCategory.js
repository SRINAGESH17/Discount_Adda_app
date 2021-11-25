import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HeaderAlert from '../../../components/HeaderAlert';
import ListView from '../../../components/ListView';
import {windowHeight} from '../../../utils/Dimentions';
import {API_URL, endPoints} from '../../../Config/Config';

function EducationCategory({navigation}) {
  const [data, setdata] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [education, setEducation] = useState('');
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    geteducation();
  }, []);

  const geteducation = () => {
    const menurl = `${API_URL}/${endPoints.education}`;
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('education')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setEducation(null);
        }
        if (documentSnapshot.exists) {
          setEducation(documentSnapshot.data().education);
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

  // submit  buttons
  const submit = () => {
    const listSelected = data.filter(item => item.selected === true);
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
      .collection('education')
      .doc(auth().currentUser.uid)
      .set({
        education: contentAlert.length === 0 ? null : contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(false);
        geteducation();
      })
      .catch(() => alert('category   not updated'));
  };

  // render items for flatlist

  const renderItemMen = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.item}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValue(item, index)}
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
          title="Education"
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
                  renderItem={renderItemMen}
                  keyExtractor={item => `key-${item.id}`}
                />
              )}
            </View>
          )}
        </List.Accordion>
      </List.AccordionGroup>
      <ListView list={education} styletitle={{marginTop: 200}} />
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

export default EducationCategory;