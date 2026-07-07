import { View, Text, TouchableOpacity } from 'react-native'
import  Modal  from 'react-native-modal'
import { useThemeStyles } from '../../hook/useThemeStyles'

const DeleteConfirmModal = ({
    isVisible,
    onCancel,
    onDelete
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
                    Delete Item
                </Text>

                <Text style={style.modalMessage}>
                    Are you sure you want to delete this item?
                    This action cannot be undone.
                </Text>

                <View style={style.modalButtonContainer}>
                    <TouchableOpacity
                        style={[style.modalButton, style.modalCancelButton]}
                        onPress={onCancel}
                    >
                        <Text style={style.modalCancelBtnText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[style.modalButton, style.modalDeleteButton]}
                        onPress={onDelete}
                    >
                        <Text style={style.modalDeleteBtnText}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteConfirmModal;
