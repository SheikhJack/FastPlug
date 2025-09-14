import React, { useState, JSX } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native'
import * as Notifications from 'expo-notifications'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import TextDefault from '@/components/TextDefault'
import TextField from '@/components/ui/Textfield/Textfield'
import Spinner from '@/components/Spinner'

import { colors, scale, verticalScale } from '@/utils'
import { authService } from '@/services/authService'
import { AuthProvider, useAuth } from '@/context/authContext'
import { User } from '@/lib/authApi'

const { height } = Dimensions.get('window')

const SignUp: React.FC = () => {
  const router = useRouter()
  const [fullname, setFullname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { login } = useAuth()

  const validateCredentials = (): boolean => {
    let result = true

    setEmailError(null)
    setPasswordError(null)
    setPhoneError(null)
    setNameError(null)

    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email.trim())) {
      setEmailError('Provide a valid email address')
      result = false
    }

    if (!password) {
      setPasswordError('Password is required')
      result = false
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const phoneRegex = /^(\+?\d{1,4})?\d{7,15}$/;

    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError('Please enter a valid phone number (10-15 digits)');
      result = false;
    }

    const nameRegex = /([a-zA-Z]{3,30}\s*)+/
    if (!nameRegex.test(fullname)) {
      setNameError('Full name is required')
      result = false
    }

    return result
  }

  const handleCompleted = async (userData: User, token: string): Promise<void> => {
    try {
      await login(userData, token)
      router.replace('/(drawer)/(stack)')
    } catch (error) {
      console.log('Signup completion error:', error)
      Alert.alert('Error', 'Failed to complete signup process')
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error: Error): void => {
    Alert.alert('Error', error.message || 'Signup failed')
    setLoading(false)
  }

  const handleSignUp = async (): Promise<void> => {
    if (!validateCredentials()) {
      return
    }

    setLoading(true)

    try {
      let notificationToken: string | null = null
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      if (existingStatus === 'granted') {
        const tokenData = await Notifications.getExpoPushTokenAsync()
        notificationToken = tokenData.data
      }

      const userData = {
        phone: phone.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        name: fullname.trim(),
        picture: '',
        notificationToken
      }

      const result = await authService.register(userData)

      if (result.success && result.data) {
        await handleCompleted(result.data, result.data.token)
      } else {
        handleError(new Error(result.error || 'Registration failed'))
      }
    } catch (error) {
      handleError(error as Error)
    }
  }

  const navigateToSignIn = () => {
    router.push('/login')
  }

  const navigateToGuest = () => {
    router.push('/(drawer)/(stack)')
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

            {/* Header */}
            <View style={styles.header}>
              <SimpleLineIcons
                name="user-follow"
                size={scale(24)}
                color={colors.blueButton}
              />
              <TextDefault style={styles.headerText} textColor={colors.fontMainColor} H4>
                {'Sign Up'}
              </TextDefault>
            </View>

            {/* Guest Button */}
            <TouchableOpacity onPress={navigateToGuest} style={styles.guestButton}>
              <TextDefault textColor={colors.blueButton} small>
                {'Continue as a Guest'}
              </TextDefault>
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.content}>
              <View style={styles.welcomeSection}>
                <TextDefault textColor={colors.fontMainColor} H3 bold>
                  {'Create Account'}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor}>
                  {'Join us today'}
                </TextDefault>
              </View>

              <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                  <TextField
                    error={!!nameError}
                    placeholder="Full Name"
                    value={fullname}
                    onChangeText={(text: string) => setFullname(text.trim())}
                    autoCapitalize="words"
                  />
                  {!!nameError && (
                    <TextDefault textColor={colors.errorColor} small>
                      {nameError}
                    </TextDefault>
                  )}
                </View>

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
                    error={!!phoneError}
                    placeholder="Mobile"
                    value={phone}
                    onChangeText={(text: string) => setPhone(text.trim())}
                    keyboardType="phone-pad"
                  />
                  {!!phoneError && (
                    <TextDefault textColor={colors.errorColor} small>
                      {phoneError}
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

                <TouchableOpacity
                  style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                  onPress={handleSignUp}
                  disabled={loading}>
                  {loading ? (
                    <Spinner backColor="transparent" spinnerColor={colors.white} loading={true} size={'Large'} />
                  ) : (
                    <TextDefault textColor={colors.white} H5>
                      {'Sign Up'}
                    </TextDefault>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TextDefault textColor={colors.fontSecondColor}>
                  {'Already have an account? '}
                  <TextDefault
                    textColor={colors.blueButton}
                    bold
                    onPress={navigateToSignIn}
                    style={styles.signInText}
                  >
                    {'Sign in'}
                  </TextDefault>
                </TextDefault>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default function SignUpScreen() {
  return (
    <AuthProvider>
      <SignUp />
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
    marginBottom: verticalScale(10)
  },
  headerText: {
    marginLeft: scale(10)
  },
  guestButton: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    padding: scale(10)
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
    borderColor: colors.blueButton,
    borderWidth: 1,

  },
  inputField: {
    borderColor: colors.blueButton,
    borderWidth: 1,
    borderRadius: scale(8),
    padding: scale(12),
  },
  signUpButton: {
    backgroundColor: colors.blueButton,
    padding: scale(15),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(10),
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    marginTop: verticalScale(10)
  },
  signInText: {
    textDecorationLine: 'underline'
  }
})