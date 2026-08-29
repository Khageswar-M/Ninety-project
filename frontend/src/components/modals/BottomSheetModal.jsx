import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import BottomSheet, {
    BottomSheetView,
} from '@gorhom/bottom-sheet';

const BottomSheetModal = ({
    isVisible,
    onCancel,
    onAction,
    title = 'Delete Item',
    message = 'Are you sure you want to delete this item?',
}) => {

    const sheetRef = useRef(null);

    const snapPoints = useMemo(() => ['50%'], []);

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            onCancel?.();
        }
    }, [onCancel]);

    if (!isVisible) {
        return null;
    }

    return (
        <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            onChange={handleSheetChanges}
          
        >
            <BottomSheetView
                style={{
                    flex: 1,
                    padding: 24,
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: '700',
                    }}
                >
                    {title}
                </Text>

                <Text
                    style={{
                        marginTop: 12,
                        fontSize: 16,
                    }}
                >
                    {message}
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 30,
                        gap: 12,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            sheetRef.current?.close();
                            onCancel?.();
                        }}
                        style={{
                            flex: 1,
                            padding: 15,
                            borderRadius: 10,
                            alignItems: 'center',
                        }}
                    >
                        <Text>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            sheetRef.current?.close();
                            onAction?.();
                        }}
                        style={{
                            flex: 1,
                            padding: 15,
                            borderRadius: 10,
                            alignItems: 'center',
                            backgroundColor: 'red',
                        }}
                    >
                        <Text style={{ color: 'white' }}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>

            </BottomSheetView>
        </BottomSheet>
    );
};

export default BottomSheetModal;