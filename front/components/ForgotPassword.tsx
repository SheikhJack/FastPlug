import React, { JSX, useState } from 'react'
import { 
  Text, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  Dimensions 
} from 'react-native'
import Modal from 'react-native-modal'
import TextField from '@/components/ui/Textfield/Textfield'
import Spinner from '@/components/Spinner'
import { FlashMessage } from '@/components/FlashMessage'
import TextDefault from '@/components/TextDefault'
import { colors } from '@/utils/colors'
import { scale } from '@/utils/scaling'
import { fontStyles } from '@/utils/fontStyles'
import { authService } from '@/services/authService'

const { height } = Dimensions.get('window')

interface ForgotPasswordProps {
  modalVisible: boolean
  hideModal: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const validateCredentials = (): boolean => {
    let result = true
    setEmailError(null)
    
    if (!email) {
      setEmailError('Email is required')
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      if (emailRegex.test(email) !== true) {
        setEmailError('Invalid Email')
        result = false
      }
    }
    
    return result
  }

  const handleCompleted = (): void => {
    FlashMessage({
        message: 'Reset password link sent on your email',
        type: undefined,
        position: top
    })
    props.hideModal()
  }

  const handleError = (error: Error): void => {
    FlashMessage({
        message: error.message || 'Failed to send reset password link',
        type: undefined,
        position: top
    })
  }

  const handleForgotPassword = async (): Promise<void> => {
    if (!validateCredentials()) {
      return
    }

    setLoading(true)
    
    try {
      const result = await authService.forgotPassword(email.toLowerCase().trim())
      
      if (result.success) {
        handleCompleted()
      } else {
        handleError(new Error(result.error || 'Failed to send reset password link'))
      }
    } catch (error) {
      handleError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  const renderContinueAction = (): JSX.Element => {
    return (
      <TouchableOpacity
        disabled={loading}
        activeOpacity={0.7}
        style={[styles.btnContainer, styles.brownColor]}
        onPress={handleForgotPassword}>
        {loading ? (
          <Spinner backColor="transparent" spinnerColor={colors.white} loading={true} size={'Medium'} />
        ) : (
          <TextDefault style={styles.sendStyle}>CONTINUE</TextDefault>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      isVisible={props.modalVisible}
      onBackdropPress={props.hideModal}
      onBackButtonPress={props.hideModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>Forgot password</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.subtitleStyle}>
              No worries, let us help you out!
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextField
              error={!!emailError}
              placeholder="Your Email"
              inputStyle={{ textAlign: 'center', backgroundColor: '#F7F7F7' }}
              placeholderTextColor="black"
              onChangeText={(text: string) => setEmail(text.trim())}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
          </View>
          {renderContinueAction()}
        </View>
      </View>
    </Modal>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  modalContainer: {
    height: height * 0.3,
    backgroundColor: colors.whiteColor,
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    height: '80%'
  },
  titleContainer: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleStyle: {
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: scale(16)
  },
  subtitleStyle: {
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: scale(12),
    color: colors.darkGrayText
  },
  inputContainer: {
    width: '100%',
    height: '25%',
    marginTop: '5%',
    borderRadius: scale(3),
    backgroundColor: colors.backgroudGray
  },
  brownColor: {
    backgroundColor: colors.brownColor
  },
  btnContainer: {
    width: '100%',
    height: '25%',
    marginTop: scale(20),
    borderRadius: scale(3),
    backgroundColor: colors.lightGrayColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendStyle: {
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: scale(16),
    color: colors.whiteColor
  },
  errorText: {
    color: colors.errorColor,
    fontSize: scale(12),
    marginTop: scale(5),
    textAlign: 'center'
  }
})