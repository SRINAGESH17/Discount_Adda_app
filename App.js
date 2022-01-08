import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

import InAppUpdate from './InAppUpdate';
import Providers from './app/navigation';

// const CODE_PUSH_Options = {
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
// };

const App = () => {
  // useEffect(() => {
  //
  //   codePush.sync(
  //     {installMode: codePush.InstallMode.IMMEDIATE},
  //     syncwithCodePush,
  //     null,
  //   );

  // const syncwithCodePush = status => {
  //   console.log(status);
  // };
  // }, []);
  useEffect(() => {
    InAppUpdate.checkUpdate();
  }, []);

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('.........................: ', token);
  };

  //! for android

  useEffect(() => {
    getToken();
    messaging().onMessage(async remoteMessage => {
      console.log(
        '🚀😄 ~ file: App.js ~ line 42 ~ messaging ~ remoteMessage',
        JSON.stringify(remoteMessage),
      );
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        channelId: remoteMessage.notification.android.channelId,
        vibrate: true,
        smallIcon: remoteMessage.notification.android.smallIcon,
        id: remoteMessage.messageId,
      });
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '🚀😄 ~ file: App.js ~ line 55 ~ messaging ~ remoteMessage',
        JSON.stringify(remoteMessage),
      );
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        channelId: remoteMessage.notification.android.channelId,
        vibrate: true,
        smallIcon: remoteMessage.notification.android.smallIcon,
      });
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '🚀😄 ~ file: App.js ~ line 70 ~ messaging ~ remoteMessage',
            JSON.stringify(remoteMessage),
          );
          PushNotification.localNotification({
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
            bigPictureUrl: remoteMessage.notification.android.imageUrl,
            channelId: remoteMessage.notification.android.channelId,
            vibrate: true,
            smallIcon: remoteMessage.notification.android.smallIcon,
          });
        }
      });
  }, []);

  return (
    <>
      <Providers />
    </>
  );
};

// export default codePush(CODE_PUSH_Options)(App);
export default App;
