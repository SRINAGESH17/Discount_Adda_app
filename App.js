import React, {useEffect} from 'react';
import {Alert, Linking, BackHandler} from 'react-native';
import VersionCheck from 'react-native-version-check';

import RNBootSplash from 'react-native-bootsplash';
import Providers from './app/navigation';

// const CODE_PUSH_Options = {
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
// };

const App = () => {
  useEffect(() => {
    RNBootSplash.hide({duration: 2000});
  }, []);
  // useEffect(() => {
  //   RNBootSplash.hide({duration: 2000});
  //   codePush.sync(
  //     {installMode: codePush.InstallMode.IMMEDIATE},
  //     syncwithCodePush,
  //     null,
  //   );
  // }, []);
  useEffect(() => {
    checkUpdateNeeded();
  }, []);

  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate();
    console.log(
      '🚀😄 ~ file: App.js ~ line 30 ~ checkUpdateNeeded ~ updateNeeded',
      updateNeeded,
    );

    const currentVersion = VersionCheck.getCurrentVersion();
    console.log(
      '🚀😄 ~ file: App.js ~ line 31 ~ checkUpdateNeeded ~ currentVersion',
      currentVersion,
    );
    if (updateNeeded === undefined) {
      // Alert.alert('Latest Version');
      console.log('latest');
    } else if (updateNeeded && updateNeeded.isNeeded) {
      Alert.alert(
        'Update is required',
        'You will need to update the latest version',
        [
          {
            text: 'Update',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(updateNeeded.storeUrl);
            },
          },
        ],
      );
    }
  };

  // const syncwithCodePush = status => {
  //   console.log(status);
  // };

  return <Providers />;
};

// export default codePush(CODE_PUSH_Options)(App);
export default App;
