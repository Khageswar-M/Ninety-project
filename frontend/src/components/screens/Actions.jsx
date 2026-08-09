import { View, Text, ScrollView, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//COMPONENTS
import Header from '../actions/Header.jsx';
import ChallengeBoard from '../actions/ChallengeBoard.jsx';
// STYLES
import { useActionStyles } from '../../hook/useThemeStyles.js';
import AddGoals from '../actions/AddGoals.jsx';
import { useCallback, useState } from 'react';

// ICONS


const Actions = () => {
  const style = useActionStyles();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback( async () => {
    setRefreshing(true);

    try {
      console.log("refreshing...");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <KeyboardAwareScrollView
      style={style.container}
      contentContainerStyle={style.scrollContent}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >

      {/* HEADER */}
      <View >
        <Header />
      </View>

      {/* BOARD */}
      <View style={[style.headerParent]}>
        <ChallengeBoard />
      </View>

      {/* GOALS */}
      <View style={[style.headerParent]}>
        <AddGoals />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default Actions;