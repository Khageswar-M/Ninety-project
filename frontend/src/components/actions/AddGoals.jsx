import { View, Text, TouchableOpacity, TextInput } from 'react-native'
// STATES
import { useState } from 'react';


// HOOKS
import { useActionStyles } from '../../hook/useThemeStyles'

// ICONS
import { Feather } from '@expo/vector-icons';

const AddGoals = () => {
    const style = useActionStyles();
    const [focus, setFocus] = useState(false);
    return (
        <View>
            {/* TITLE */}
            <Text style={style.boardTitle}>ADD YOUR GOALS</Text>

            {/* ADD INPUT */}
            <View style={style.goalsAddInputContainer}>
                <TextInput
                    style={[style.goalsAddInput, focus && style.goalsAddInputFocused]}
                    placeholder='Enter your goal'
                    placeholderTextColor={'#535353'}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
                <TouchableOpacity style={style.addBtn}>
                    <Feather name='plus' style={style.addBtnTitle} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddGoals