import React, {useEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';

import InAppUpdate from './InAppUpdate';
import Providers from './app/navigation';

function App() {
  useEffect(() => {
    RNBootSplash.hide({fade: true}); // fade
    InAppUpdate.checkUpdate();
  }, []);

  return <Providers />;
}

export default App;
