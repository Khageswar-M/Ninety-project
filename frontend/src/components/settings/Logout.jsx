import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSettingStyles } from '../../hook/useThemeStyles';
import { setLogin } from '../../redux/slices/appSlice.js';
import { storage } from '../../utils/storage.js';
import ConfirmationModal from '../modals/ConfirmationModal.jsx';

const Logout = () => {
    const style = useSettingStyles();
    const dispatch = useDispatch();

    const [openLogoutConfirmationModal, setOpenLogoutConfirmationModal] = useState(false);

    const handleLogout = async () => {
        try {
            await storage.remove("@ninety_user");
            dispatch(setLogin(false));
            console.log("Logout successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            setOpenLogoutConfirmationModal(false);
        }
    }

    return (
        <View>
            <Text style={style.componentTitle}>LOGOUT</Text>

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