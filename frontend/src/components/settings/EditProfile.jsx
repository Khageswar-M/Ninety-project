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

  const handleCancel = () => {
    setEditName(false);
  }

  const handleUpdate = () => {
    setUserName(userName);
  }

  const buttons = [
    {
      title: "Cancel",
      handleFunction: handleCancel,
      bg: '#a41616'
    },
    {
      title: "Update",
      handleFunction: handleUpdate,
      bg: '#16a418'
    },
  ]

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

        <View style={style.noteContainer}>
          <Text style={style.note}>
            <Text style={style.noteTitle}>Note:</Text> After changing your name, you will not able to update it again for next 30 days. Ensure your name is correct before confirming.
          </Text>
        </View>

        {
          editName && (
            <View style={style.cancelUpdateBtnContainer}>
              {
                buttons.map((button) => {
                  return (
                    <TouchableOpacity
                      key={button.title}
                      activeOpacity={0.7}
                      style={[style.cancelUpdateBtn, { backgroundColor: button.bg }]}
                      onPress={() => button.handleFunction()}
                    >
                      <Text style={style.cancelUpdateBtnTitle}>{button.title}</Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          )
        }

      </View>
    </View>
  )
}

export default EditProfile;