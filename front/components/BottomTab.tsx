import React, { useContext } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import UserContext from '@/context/User'
import { scale } from '@/utils/scaling'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import { Dimensions, StyleSheet } from 'react-native'
import { verticalScale } from '@/utils/scaling'
import { fontStyles } from '@/utils/fontStyles'
import { colors } from '@/utils/colors'
import { BottomTabNavigationProp, BottomTabProps } from '@/lib/types/navigation'
import { UserContextType } from '@/lib/types/user'
import { RootStackParamList } from '@/lib/types/navigation' 

const { height, width } = Dimensions.get('window')

type NavigationProp = StackNavigationProp<RootStackParamList>;

  function BottomTab(props: BottomTabProps) {

  const navigation = useNavigation<BottomTabNavigationProp>();
  const { isLoggedIn, cartCount, orders } = useContext(UserContext) as UserContextType
  
  const navigateTo = (screen: keyof RootStackParamList) => {
  navigation.navigate(screen as any);
};
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('MainLanding')}
        style={[
          styles.footerBtnContainer,
          props.screen === 'HOME' && styles.active
        ]}>
        <View style={styles.imgContainer}>
          <SimpleLineIcons
            name="home"
            color={colors.fontSecondColor}
            size={scale(20)}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SearchResult')}
        style={[
          styles.footerBtnContainer,
          props.screen === 'SEARCH' && styles.active
        ]}>
        <View style={styles.imgContainer}>
          <Ionicons
            name="search"
            size={scale(27)}
            color={colors.fontSecondColor}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) navigateTo('MainLanding')
          else navigateTo('SignIn')
        }}
        style={[
          styles.footerBtnContainer,
          props.screen === 'PROFILE' && styles.active
        ]}>
        <View style={styles.profileContainer}>
          <SimpleLineIcons
            name="user"
            size={scale(20)}
            color={colors.fontSecondColor}
          />
          {isLoggedIn &&
            (orders
              ? orders.filter((o: { orderStatus: string }) =>
                ['PENDING', 'DISPATCHED', 'ACCEPTED'].includes(o.orderStatus)
              ).length > 0
              : false) && <View style={styles.profileBadge} />}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ShoppingCart')}
        style={[
          styles.footerBtnContainer,
          props.screen === 'CART' && styles.active
        ]}>
        <View style={styles.shoppingContainer}>
          <Image
            source={require('../assets/images/footer/shopping.png')}
            style={styles.imgResponsive}
            resizeMode="contain"
          />
          <View style={styles.shoppingBadgeContainer}>
            <Text style={styles.shoppingBadgeStyle}>x{cartCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default BottomTab

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.themeBackground
  },
  footerContainer: {
    width,
    height: height * 0.07,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  footerBtnContainer: {
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgResponsive: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  profileContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  profileBadge: {
    width: verticalScale(8),
    height: verticalScale(8),
    position: 'absolute',
    right: '25%',
    top: 0,
    backgroundColor: '#EE9826',
    borderRadius: verticalScale(4)
  },
  shoppingContainer: {
    width: '50%',
    height: '40%',
    position: 'relative'
  },
  shoppingBadgeContainer: {
    width: '40%',
    height: '50%',
    position: 'absolute',
    right: -scale(3),
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shoppingBadgeStyle: {
    fontFamily: fontStyles.PoppinsRegular,
    color: '#6178DE',
    fontSize: verticalScale(8)
  }
})