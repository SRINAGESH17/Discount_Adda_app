import * as React from 'react';
import {Image} from 'react-native';
import {Banner} from 'react-native-paper';

const HeaderAlert = ({value, text}) => {
  const [visible, setVisible] = React.useState({value});

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Add Again',
          onPress: () => setVisible(false),
        },
        {
          label: 'Leave it',
          onPress: () => setVisible(false),
        },
      ]}>
      {text}
    </Banner>
  );
};

export default HeaderAlert;
