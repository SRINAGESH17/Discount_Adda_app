import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import codePush from 'react-native-code-push';
import Providers from './app/navigation';
import Mystore from './app/screens/MyStore/Mystore';

// const CODE_PUSH_Options = {
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
// };

const App = () => {
  useEffect(() => {
    RNBootSplash.hide({duration: 2000});
    // codePush.sync(
    //   {installMode: codePush.InstallMode.IMMEDIATE},
    //   syncwithCodePush,
    //   null,
    // );
  }, []);

  // const syncwithCodePush = status => {
  //   console.log(status);
  // };

  return <Providers />;
};

export default App;
