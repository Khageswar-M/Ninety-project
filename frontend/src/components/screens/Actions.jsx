import { View, Text, ScrollView } from 'react-native'

//COMPONENTS
import Header from '../actions/Header.jsx';

// STYLES
import {useActionStyles} from '../../hook/useThemeStyles.js';

// ICONS


const Actions = () => {
  const style = useActionStyles();
  return (
    <ScrollView 
      style={[style.container]}
      contentContainerStyle={[style.scrollContent]}
    >
      <View style={{padding: 10}}>
        <Header/>
      </View>
    </ScrollView>
  )
}

export default Actions;