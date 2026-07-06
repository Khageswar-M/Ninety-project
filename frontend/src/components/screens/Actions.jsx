import { View, Text, ScrollView } from 'react-native'

//COMPONENTS
import Header from '../actions/Header.jsx';
import ChallengeBoard from '../common/ChallengeBoard.jsx';

// STYLES
import {useActionStyles} from '../../hook/useThemeStyles.js';
import AddGoals from '../actions/AddGoals.jsx';

// ICONS


const Actions = () => {
  const style = useActionStyles();
  return (
    <ScrollView 
      style={[style.container]}
      contentContainerStyle={[style.scrollContent]}
    >
      {/* HEADER */}
      <View style={[style.headerParent ]}>
        <Header/>
      </View>

      {/* BOARD */}
      <View style={[style.headerParent]}>
        <ChallengeBoard/>
      </View>

      {/* GOALS */}
      <View style={[style.headerParent]}>
        <AddGoals/>
      </View>
    </ScrollView>
  )
}

export default Actions;