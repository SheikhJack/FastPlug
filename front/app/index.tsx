import { useState, useEffect } from 'react'
import { 
  View, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions 
} from 'react-native'
import { Redirect, router } from 'expo-router'
import TextDefault from '@/components/TextDefault'
import { colors, scale } from '@/utils'
import { AuthProvider } from '@/context/authContext'
import SignIn from './login'

export default function EntryScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) 

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleSignUp = () => {
    router.push('/register')
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/fastplug.jpg')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color={colors.blueButton} style={styles.spinner} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Logo with 50% radius */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/fastplug.jpg')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <TextDefault textColor={colors.white} H5>
          Login
        </TextDefault>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <TextDefault textColor={colors.blueButton} H5>
          Create Account
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}



const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: scale(20),
  },

  imageContainer: {
    width: width * 0.8,
    height: width * 0.9,
    // borderRadius: scale(120), 
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(50),
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  spinner: {
    marginTop: scale(20),
  },

  loginButton: {
    backgroundColor: colors.blueButton,
    paddingHorizontal: scale(45),
    paddingVertical: scale(13),
    borderRadius: scale(25),
    marginBottom: scale(15),
    minWidth: width * 0.8,
    alignItems: 'center',
  },

  signUpButton: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(45),
    paddingVertical: scale(13),
    borderRadius: scale(25),
    borderWidth: 1,
    borderColor: colors.blueButton,
    minWidth: width * 0.8,
    alignItems: 'center',
  },
})