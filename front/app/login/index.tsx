import { EvilIcons, SimpleLineIcons } from '@expo/vector-icons'
import * as AppleAuthentication from 'expo-apple-authentication'
import * as Google from 'expo-auth-session/providers/google'
import * as Notifications from 'expo-notifications'

import TextDefault from '@/components/TextDefault'
import Spinner from '@/components/Spinner'
import TextField from '@/components/ui/Textfield/Textfield'
import ForgotPassword from '@/components/ForgotPassword'

import { alignment, colors, scale, verticalScale } from '@/utils'
import { authService } from '@/services/authService'
import { AuthProvider, useAuth } from '@/context/authContext'
import { LoginParams, User } from '@/lib/authApi'
import { JSX, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'

type LoginButtonType = 'Google' | 'Apple' | 'login' | null;

const { height } = Dimensions.get('window')

const SignIn: React.FC = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const cartAddress = params?.backScreen ?? null // CHANGED: Get params from Expo Router
  
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loginButton, setLoginButton] = useState<LoginButtonType>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [enableApple, setEnableApple] = useState<boolean>(false)

  const navigateTo = (path: string) => {
    router.push(path as any);
  };
  
  const { login } = useAuth()

  useEffect(() => {
    checkIfSupportsAppleAuthentication()
  }, [])

  const showModal = (): void => {
    setModalVisible(true)
  }

  const hideModal = (): void => {
    setModalVisible(false)
  }

  const checkIfSupportsAppleAuthentication = async (): Promise<void> => {
    const isAvailable = await AppleAuthentication.isAvailableAsync()
    setEnableApple(isAvailable)
  }

  const validateCredentials = (): boolean => {
    let result = true
    setEmailError(null)
    setPasswordError(null)
    
    if (!email) {
      setEmailError('Email is required')
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      const phoneRegex = /^[+]\d{6,15}$/
      if (emailRegex.test(email) !== true && phoneRegex.test(email) !== true) {
        setEmailError('Invalid Email/Phone')
        result = false
      }
    }
    
    if (!password) {
      setPasswordError('Password is required')
      result = false
    }
    
    return result
  }

  const handleLoginSuccess = async (userData: User, token: string): Promise<void> => {
    try {
      if (userData.is_Active === false) {
        Alert.alert('Error', "Can't Login! This Account is deleted!")
        setLoading(false)
        return
      }

      await login(userData, token)
      
      if (cartAddress === 'Cart') {
        router.back()
      } else {
        router.replace('/(drawer)/(stack)')
      }
    } catch (error) {
      console.log('Login success error:', error)
      Alert.alert('Error', 'Failed to complete login process')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginError = (error: Error): void => {
    console.log('Login error:', error)
    Alert.alert('Error', error.message || 'Login failed')
    setLoginButton(null)
    setLoading(false)
  }

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID',
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID',
    scopes: ['profile', 'email'],
  })

  const googleSignUp = async (): Promise<void> => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse
      setLoginButton('Google')
      setLoading(true)

      try {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          {
            headers: { Authorization: `Bearer ${authentication?.accessToken}` }
          }
        )
        const googleUser = await userInfoResponse.json()

        let notificationToken: string | null = null
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        if (existingStatus === 'granted') {
          const tokenData = await Notifications.getExpoPushTokenAsync()
          notificationToken = tokenData.data
        }

        const loginParams: LoginParams = {
          email: googleUser.email,
          name: googleUser.name,
          type: 'google',
          notificationToken,
          facebookId: googleUser.id
        }

        const result = await authService.login(loginParams)
        
        if (result.success && result.data) {
          await handleLoginSuccess(result.data, result.data.token)
        } else {
          handleLoginError(new Error(result.error || 'Google login failed'))
        }
      } catch (error) {
        handleLoginError(error as Error)
      }
    }
  }

  useEffect(() => {
    googleSignUp()
  }, [googleResponse])



  const handleEmailLogin = async (): Promise<void> => {
    if (!validateCredentials()) {
      setLoginButton(null)
      return
    }

    setLoginButton('login')
    setLoading(true)

    try {
      let notificationToken: string | null = null
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      if (existingStatus === 'granted') {
        const tokenData = await Notifications.getExpoPushTokenAsync()
        notificationToken = tokenData.data
      }

      const loginParams: LoginParams = {
        email: email.toLowerCase().trim(),
        password: password.trim(),
        type: 'email',
        notificationToken
      }

      const result = await authService.login(loginParams)
      
      if (result.success && result.data) {
        await handleLoginSuccess(result.data, result.data.token)
      } else {
        handleLoginError(new Error(result.error || 'Login failed'))
      }
    } catch (error) {
      handleLoginError(error as Error)
    }
  }



  const handleAppleLogin = async (): Promise<void> => {
    setLoginButton('Apple')
    setLoading(true)

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      })

      if (credential) {
        let notificationToken: string | null = null
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        if (existingStatus === 'granted') {
          const tokenData = await Notifications.getExpoPushTokenAsync()
          notificationToken = tokenData.data
        }

        const loginParams: LoginParams = {
          appleId: credential.user,
          email: credential.email || '',
          name: `${credential.fullName?.givenName || ''} ${credential.fullName?.familyName || ''}`.trim(),
          type: 'apple',
          notificationToken
        }

        const result = await authService.login(loginParams)
        
        if (result.success && result.data) {
          await handleLoginSuccess(result.data, result.data.token)
        } else {
          handleLoginError(new Error(result.error || 'Apple login failed'))
        }
      }
    } catch (error) {
      if ((error as any).code === 'ERR_CANCELED') {
        setLoginButton(null)
        setLoading(false)
      } else {
        handleLoginError(error as Error)
      }
    }
  }

  const renderGoogle = (): JSX.Element => {
    return (
      <View style={styles.socialBtnsView}>
        {loading && loginButton === 'Google' ? (
          <Spinner backColor="rgba(0,0,0,0.1)" spinnerColor={colors.white} loading={true} size={'Large'} />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!googleRequest}
            onPress={() => googlePromptAsync()}
            style={styles.googleButton}>
            <View style={styles.bgCircle}>
              <EvilIcons
                name="sc-google-plus"
                size={scale(20)}
                color={colors.white}
              />
            </View>
            <TextDefault style={styles.googleText} textColor={colors.white} H5>
              {'Sign in with Google'}
            </TextDefault>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const renderApple = (): JSX.Element => {
    if (loading && loginButton === 'Apple') {
      return (
        <View style={styles.appleBtn}>
          <Spinner backColor="rgba(0,0,0,0.1)" spinnerColor={'#FFF'} loading={true} size={'Large'} />
        </View>
      )
    }
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.appleBtn}
        onPress={handleAppleLogin}
      />
    )
  }

  const renderLogin = (): JSX.Element => {
    return (
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleEmailLogin}
        disabled={loading && loginButton === 'login'}>
        {loading && loginButton === 'login' ? (
          <Spinner backColor="transparent" spinnerColor={colors.white} loading={true} size={'Large'} />
        ) : (
          <TextDefault textColor={colors.white} H5>
            {'Sign In'}
          </TextDefault>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <ForgotPassword modalVisible={modalVisible} hideModal={hideModal} />
            
            {/* Header */}
            <View style={styles.header}>
              <SimpleLineIcons
                name="user"
                size={scale(24)}
                color={colors.blueButton}
              />
              <TextDefault style={styles.headerText} textColor={colors.fontMainColor} H4>
                {'Sign In'}
              </TextDefault>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              <View style={styles.welcomeSection}>
                <TextDefault textColor={colors.fontMainColor} H3 bold>
                  {'Welcome Back!'}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor}>
                  {'Sign in to continue'}
                </TextDefault>
              </View>

              <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                  <TextField
                    error={!!emailError}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text: string) => setEmail(text.toLowerCase().trim())}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    
                  />
                  {!!emailError && (
                    <TextDefault textColor={colors.errorColor} small>
                      {emailError}
                    </TextDefault>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <TextField
                    error={!!passwordError}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text: string) => setPassword(text.trim())}
                   
                  />
                  {!!passwordError && (
                    <TextDefault textColor={colors.errorColor} small>
                      {passwordError}
                    </TextDefault>
                  )}
                </View>

                {renderLogin()}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={showModal}
                  style={styles.forgotPassword}>
                  <TextDefault textColor={colors.blueButton} small>
                    {'Forgot password?'}
                  </TextDefault>
                </TouchableOpacity>
              </View>

              <View style={styles.socialSection}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <TextDefault textColor={colors.fontSecondColor} small style={styles.dividerText}>
                    {'Or continue with'}
                  </TextDefault>
                  <View style={styles.dividerLine} />
                </View>

                {renderGoogle()}
                {enableApple && renderApple()}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => navigateTo('SignUp')}
                style={styles.signUpButton}>
                <TextDefault textColor={colors.fontSecondColor}>
                  {"Don't have an account? "}
                  <TextDefault textColor={colors.blueButton} bold>
                    Sign Up
                  </TextDefault>
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default function SignInScreen() {
  return (
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  );
}



const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: verticalScale(20),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(40)
  },
  headerText: {
    marginLeft: scale(10)
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(20),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: verticalScale(30)
  },
  formSection: {
    marginBottom: verticalScale(20)
  },
  inputContainer: {
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: colors.blueButton,
  },
  inputField: {
    borderColor: colors.blueButton,
    borderWidth: 1,
    borderRadius: scale(8),
    
  },
  loginButton: {
    backgroundColor: colors.blueButton,
    padding: scale(15),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(10),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: verticalScale(5)
  },
  socialSection: {
    marginTop: verticalScale(20)
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20)
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.backgroudGray
  },
  dividerText: {
    marginHorizontal: scale(10)
  },
  socialBtnsView: {
    marginBottom: verticalScale(10)
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: colors.google,
    padding: scale(15),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center'
  },
  bgCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(30),
    height: scale(30),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: scale(15),
    marginRight: scale(10)
  },
  googleText: {
    fontWeight: '600'
  },
  appleBtn: {
    width: '100%',
    height: scale(50),
    borderRadius: scale(8)
  },
  footer: {
    marginTop: verticalScale(30),
    alignItems: 'center'
  },
  signUpButton: {
    padding: scale(10)
  }
})