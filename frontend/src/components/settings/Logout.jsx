import { View, Text, TouchableOpacity } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmationModal from '../modals/ConfirmationModal.jsx';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../redux/slices/appSlice.js';

const Logout = () => {
    const style = useSettingStyles();
    const dispatch = useDispatch();

    const [openLogoutConfirmationModal, setOpenLogoutConfirmationModal] = useState(false);

    const handleLogout = () => {
        try {
            dispatch(setLogin(false));
            console.log("Logout successfully!");
        }catch(error){
            console.error(error);
        } finally {
            setOpenLogoutConfirmationModal(false);
        }
    }

    return (
        <View>
            <Text style={style.componentTitle}>Logout</Text>

            <TouchableOpacity
                style={style.notificationContainer}
                activeOpacity={0.5}
                onPress={() => setOpenLogoutConfirmationModal(true)}
            >
                <View style={style.logoutBtnContainer}>
                    <View style={style.logoutBtnBox}>
                        <MaterialIcons name='logout' style={style.logoutIcon} />
                        <Text style={style.logoutTitle}>Logout</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <ConfirmationModal
                isVisible={openLogoutConfirmationModal}
                onCancel={() => setOpenLogoutConfirmationModal(false)}
                onAction={handleLogout}
                cancelBtnTitle={"No"}
                actionBtnTitle={"Yes"}
                title={"Logout"}
                message={"Are you sure ?"}
            />
        </View>
    )
}

export default Logout