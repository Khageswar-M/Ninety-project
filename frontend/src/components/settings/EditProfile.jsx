import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

const EditProfile = () => {
  const inset = useSafeAreaInsets();
  const style = useSettingStyles();

  const [editName, setEditName] = useState(false);
  const [userName, setUserName] = useState("Khageswar Maharana");
  const [userEmail, setUserEmail] = useState("khageswarmaharana462@gmail.com");

  return (
    <View style={[style.editProfilePage, { paddingTop: inset.top }]}>

      <View style={style.editNameHeaderContainer}>

        <Pressable
          style={style.editNameBackBtn}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' style={style.editNameBackBtnIcon} />
        </Pressable>

        <Text style={style.editNamePageTitle}>Edit Your Name</Text>

      </View>

      <View style={style.editNameContainer}>
        <View style={style.editNameBox}>
          <View style={style.editInputContainer}>

            <TextInput
              editable={editName}
              value={userName}
              onChangeText={(text) => setUserName(text)}
              style={editName ? style.editNameInputActive : style.editNameInputInactive}
            />

            {
              !editName && (
                <TouchableOpacity style={style.editNameIconContainer}
                  onPress={() => setEditName(true)}
                >
                  <Feather name='edit' style={style.editBtnIcon} />
                </TouchableOpacity>
              )
            }

          </View>

          <View style={style.userEmailContainer}>
            <Text style={style.userEmailText}>
              {userEmail}
            </Text>
          </View>

        </View>



      </View>
    </View>
  )
}

export default EditProfile;