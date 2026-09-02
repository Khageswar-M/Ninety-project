import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useSettingStyles } from '../../hook/useThemeStyles';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import SubPages from '../common/SubPages';
import { storage } from '../../utils/storage';
import { updateUserName } from '../../API/settings/settingsApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserName } from '../../redux/slices/appSlice';

const EditProfile = () => {
  const style = useSettingStyles();
  const dispatch = useDispatch();

  const [editName, setEditName] = useState(false);
  const userName = useSelector((state) => state.app.userName);
  const userEmail = useSelector((state) => state.app.userEmail)

  const [newUserName, setNewUserName] = useState(userName);
  const [loading, setLoading] = useState(false);


  const handleUpdate = async () => {

    if(loading) return;

    setLoading(true);

    try{
      const response = await updateUserName(newUserName);

      if(response?.data?.success){

        const responseData = response.data.data;
        const updatedName = responseData.value;
        console.log("updatedName", updatedName);
        dispatch(setUserName(updatedName));

        const cachedUser = await storage.get("@ninety_user");
        cachedUser.fullName = userName;

        await storage.set("@ninety_user", cachedUser);
      }
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setEditName(false);
  }

  const buttons = [
    {
      title: "Cancel",
      handleFunction: handleCancel,
      bg: '#a41616'
    },
    {
      title: loading ? "Updating..." : "Update",
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
              value={newUserName}
              onChangeText={(text) => setNewUserName(text)}
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