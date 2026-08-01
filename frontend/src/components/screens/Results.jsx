import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { useCallback, useState } from 'react'
import { useResultStyles } from '../../hook/useThemeStyles'
import Header from '../results/Header'
import Performance from '../results/Performance'
import Streak from '../results/Streak'
import ResultsMap from '../results/ResultsMap'
import AICoach from '../results/AICoach'

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
      <View>
        <Header />
      </View>

      <View style={style.headerContainer}>
        <Performance refreshKey={refreshKey} />
      </View>

      <View style={style.headerContainer}>
        <Streak refreshKey={refreshKey} />
      </View>

      <View style={style.headerContainer}>
        <ResultsMap />
      </View>

      <View style={style.headerContainer}>
        <AICoach refreshKey={refreshKey}/>
      </View>

    </ScrollView>
  )
}

export default Results;