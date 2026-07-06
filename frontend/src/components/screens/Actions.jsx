import { View, Text, ScrollView } from 'react-native'

//COMPONENTS
import Header from '../actions/Header.jsx';
import ChallengeBoard from '../common/ChallengeBoard.jsx';

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
      <View style={[style.headerParent ]}>
        <Header/>
      </View>

      <View style={[style.headerParent]}>
        <ChallengeBoard/>
      </View>
    </ScrollView>
  )
}

export default Actions;