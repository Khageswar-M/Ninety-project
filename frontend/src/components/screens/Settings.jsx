import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { useCallback, useState } from 'react'
import { useSettingStyles } from '../../hook/useThemeStyles'
import Header from '../settings/Header'
import Profile from '../settings/Profile'
import Challenge from '../settings/Challenge'

const Settings = () => {
  const style = useSettingStyles();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      console.log('refreshing...');
      setRefreshKey((prev) => prev + 1);
    } finally {
      setRefreshing(false);
    }
  }, [])
  return (
    <View style={style.container}>
      <ScrollView
        contentContainerStyle={style.containerContentStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}
        <View style={style.headerContainer}>
          <Header />
        </View>

        <View style={style.headerContainerPadding}>
          <Profile />
        </View>

        <View style={style.headerContainerPadding}>
          <Challenge />
        </View>
      </ScrollView>
    </View>
  )
}

export default Settings;