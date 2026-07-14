import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import SubPages from '../common/SubPages';

const EditProfile = () => {
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
    <SubPages
      title={"Edit Name"}
    >

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

    </SubPages>
  )
}

export default EditProfile;