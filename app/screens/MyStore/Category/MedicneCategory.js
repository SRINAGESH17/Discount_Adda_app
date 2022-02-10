import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Image, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';
import ListView from '../../../components/ListView';
import {windowHeight} from '../../../utils/Dimentions';
import {API_URL, endPoints} from '../../../Config/Config';

function MedicneCategory({navigation}) {
  const [data, setdata] = useState([]);
  const [hospital, setHospital] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [sub, setsub] = useState(false);
  const [subtext, setsubtext] = useState('');

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [medical, setMedical] = useState('');

  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getmedical();
  }, []);

  const getmedical = () => {
    const menurl = `${API_URL}/${endPoints.Medical.medicallist}`;
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    const hospitaldetails = `${API_URL}/${endPoints.Medical.hospital}`;
    fetch(hospitaldetails)
      .then(res => res.json())
      .then(resJson => {
        setHospital(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
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
      .collection('Medical')
      .doc(auth().currentUser.uid)
      .set({
        medical: contentAlert.length === 0 ? null : contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setLoading(false);
        setsub(true);
        getmedical();
      })
      .catch(() => alert('category   not updated'));
  };

  const Submitcategory = () => {
    onMultiChange();
    let content = '';
    selectedTeams.forEach(item => {
      content = content + item.item + ',';
    });
    console.log('value from subcategory', content);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Medical')
      .doc(auth().currentUser.uid)
      .update({
        hospitalcategory: content.length === 0 ? null : content,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        setsub(false);
        getmedical();
        setsubtext(
          'Details Submitted for subcategory\nSelect category again to select subcategory',
        );
      })
      .catch(() => alert('category   not updated'));
  };

  // render items for flatlist

  const rendeItemMedical = ({item, index}) => {
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

  function onMultiChange() {
    return item => setSelectedTeams(xorBy(selectedTeams, [item], 'id'));
  }

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Accordion
          title="Medical"
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
                  renderItem={rendeItemMedical}
                  keyExtractor={item => `key-${item.id}`}
                />
              )}
            </View>
          )}
        </List.Accordion>
      </List.Section>
      {sub ? (
        <View>
          <View style={{height: 40}} />
          <Text style={{fontSize: 20, paddingBottom: 10}}>
            Add subcategory for Hospital
          </Text>
          {isLoading ? (
            <ActivityIndicator animating={true} color="#D02824" size="large" />
          ) : (
            <SelectBox
              label="Select Hospital types"
              options={hospital}
              selectedValues={selectedTeams}
              onMultiSelect={onMultiChange()}
              onTapClose={onMultiChange()}
              isMulti
              inputPlaceholder="Type Here to search"
              toggleIconColor="#D02824"
              searchIconColor="#D02824"
              arrowIconColor="#D02824"
            />
          )}
          <View style={{marginTop: 10, width: 120}}>
            <Button color="#D02824" title="submit" onPress={Submitcategory} />
          </View>
        </View>
      ) : (
        <Text>{subtext}</Text>
      )}
      <ListView list={medical} styletitle={{marginTop: 200}} />
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

export default MedicneCategory;
