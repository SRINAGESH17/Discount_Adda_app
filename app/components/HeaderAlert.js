import * as React from 'react';
import {Image} from 'react-native';
import {Banner} from 'react-native-paper';

const HeaderAlert = ({value, text, Status}) => {
  const [visible, setVisible] = React.useState({value});

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Add Again',
          onPress: () => {
            setVisible(false);
            Status;
          },
        },
        {
          label: 'Leave it',
          onPress: () => {
            setVisible(false);
            Status;
          },
        },
      ]}>
      {text}
    </Banner>
  );
};

export default HeaderAlert;
