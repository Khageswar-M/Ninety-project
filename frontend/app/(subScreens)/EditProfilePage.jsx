import { View, Text } from 'react-native'
import { useSettingStyles } from '../../src/hook/useThemeStyles';
import EditProfile from '../../src/components/settings/EditProfile';
import { useEffect } from 'react';

const EditProfilePage = () => {
  const style = useSettingStyles();

  return (
    <View style={[style.editProfileContainer]}>
      <EditProfile/>
    </View>
  )
}

export default EditProfilePage;