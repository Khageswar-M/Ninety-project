import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { useThemeStyles } from '../../hook/useThemeStyles'

const ConfirmationModal = ({
    isVisible,
    onCancel,
    onAction,
    title,
    message,
    cancelBtnTitle,
    actionBtnTitle
}) => {

    const style = useThemeStyles();
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onCancel}
            onBackButtonPress={onCancel}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.5}
        >
            <View style={style.modalContainer}>
                <Text style={style.modalTitle}>
                    {title || "Delete Item"}
                </Text>

                <Text style={style.modalMessage}>
                    {message || "Are you sure ?"}
                </Text>

                <View style={style.modalButtonContainer}>
                    <TouchableOpacity
                        style={[style.modalButton, style.modalCancelButton]}
                        onPress={onCancel}
                    >
                        <Text style={style.modalCancelBtnText}>
                            {cancelBtnTitle || "Cancel"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[style.modalButton, style.modalDeleteButton]}
                        onPress={onAction}
                    >
                        <Text style={style.modalDeleteBtnText}>
                            {actionBtnTitle || "Delete"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmationModal;
