import React, {useEffect} from 'react';
// import {Alert, Linking, BackHandler} from 'react-native';

import Providers from './app/navigation';

// const CODE_PUSH_Options = {
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
// };

const App = () => {
  // useEffect(() => {
  //   RNBootSplash.hide({duration: 2000});
  //   codePush.sync(
  //     {installMode: codePush.InstallMode.IMMEDIATE},
  //     syncwithCodePush,
  //     null,
  //   );
  // }, []);

  // const syncwithCodePush = status => {
  //   console.log(status);
  // };

  return <Providers />;
};

// export default codePush(CODE_PUSH_Options)(App);
export default App;
