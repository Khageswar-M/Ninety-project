import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { useResultStyles } from '../../hook/useThemeStyles'
import Header from '../results/Header'
import Performance from '../results/Performance'
import { useCallback, useState } from 'react'

const Results = () => {
  const style = useResultStyles();
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
    <ScrollView
      style={style.container}
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

      <View style={style.headerContainer}>
        <Performance refreshKey={refreshKey}/>
      </View>
    </ScrollView>
  )
}

export default Results;