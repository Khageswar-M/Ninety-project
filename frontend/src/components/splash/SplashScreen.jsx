import { View, Text } from 'react-native';
import React from 'react';
import { useThemeStyles } from '../../hook/useThemeStyles';
import AppLogo from '../common/AppLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SplashScreen = () => {

  const style = useThemeStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[style.container, { marginTop: insets.top }]}>
      <View>
        <AppLogo />
        <Text style={style.logoTitle}>Ninety</Text>
        <View style={style.titleUnderline} />
        <Text style={style.moto}>90 Days</Text>
        <Text style={style.moto}>Be focused to carrier</Text>
      </View>

      <View>
        <View style={style.loading} />
        <Text style={style.loadingTitleUnderline}>Almost there......</Text>
      </View>

      <Text style={style.versionTitle}>V1.0.0</Text>
    </View>
  )
}

export default SplashScreen