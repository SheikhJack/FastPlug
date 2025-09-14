import { 
  TextInput, 
  View, 
  StyleProp, 
  ViewStyle, 
  TextInputProps,
  TextStyle
} from 'react-native'
import { colors, alignment, fontStyles, scale } from '@/utils'
import { StyleSheet } from 'react-native'

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: boolean;
  errorBorderColor?: string;
  normalBorderColor?: string;
}

const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    containerStyle,
    inputStyle,
    error = false,
    errorBorderColor = colors.errorColor,
    normalBorderColor = colors.backgroudGray,
    placeholderTextColor = colors.fontPlaceholder,
    secureTextEntry = false,
    ...textInputProps
  } = props;

  const borderColor = error ? errorBorderColor : normalBorderColor;

  return (
    <View
      style={[
        styles.input_view,
        { borderColor }, // Dynamic border color
        containerStyle,
      ]}>
      <TextInput
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        style={[styles.input, inputStyle]}
        {...textInputProps}
      />
    </View>
  )
}

export default TextField

const styles = StyleSheet.create({
  input_view: {
    backgroundColor: colors.white,
    borderRadius: 3,
    height: scale(40),
    justifyContent: 'center',
    borderWidth: 1,
  },
  input: {
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: scale(13),
    ...alignment.PLsmall,
    color: colors.fontMainColor,
    paddingVertical: 0,
    includeFontPadding: false, // Better text alignment on Android
    textAlignVertical: 'center', // Better text alignment on Android
  }
})