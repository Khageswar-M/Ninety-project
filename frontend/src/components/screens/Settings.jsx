import { View, ScrollView } from 'react-native'
import { useSettingStyles } from '../../hook/useThemeStyles'
import Header from '../settings/Header'
import Profile from '../settings/Profile'
import Challenge from '../settings/Challenge'
import Notifications from '../settings/Notifications'
import Appearance from '../settings/Appearance'
import About from '../settings/About'
import Logout from '../settings/Logout'

const Settings = () => {
  const style = useSettingStyles();

  
  return (
    <View style={style.container}>
      <ScrollView
        contentContainerStyle={style.containerContentStyle}
        showsVerticalScrollIndicator={false}
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

        <View style={style.headerContainerPadding}>
          <Notifications />
        </View>

        <View style={style.headerContainerPadding}>
          <Appearance />
        </View>

        <View style={style.headerContainerPadding}>
          <About />
        </View>

        <View style={style.headerContainerPadding}>
          <Logout />
        </View>
      </ScrollView>
      
    </View>
  )
}

export default Settings;