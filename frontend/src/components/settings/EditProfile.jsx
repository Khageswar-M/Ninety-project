import { View, Text, Pressable } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const EditProfile = () => {
  const inset = useSafeAreaInsets();
  const style = useSettingStyles();
  return (
    <View style={[style.editProfilePage, { paddingTop: inset.top }]}>

      <View style={{
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 20,
        position: 'relative',
        justifyContent: 'center',
        paddingVertical: 20,
        alignItems: 'center'
      }}>
        <Pressable style={{
          position: 'absolute',
          left: 20
        }}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' style={{
            fontSize: 20,
            color: '#fff'
          }}/>
        </Pressable>
        <Text style={{
          alignSelf: 'center',
          position: 'relative',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#fff'
        }}>EditProfile</Text>
      </View>
    </View>
  )
}

export default EditProfile;